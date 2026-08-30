import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GlobeDestination } from "~/data/worldContent";

type GlobeSceneProps = {
  mode?: "hero" | "journey";
  /** The currently visible editorial destination. */
  activeIndex?: number;
  /** A normalized 0–1 value through the service journey. */
  scrollProgress?: number;
  /** Prefer this for animation: ScrollTrigger can update it without React renders. */
  progressRef?: { current: number };
  /** Selecting a pin lets the page scroll its matching service into view. */
  onSelectIndex?: (index: number) => void;
  /** Every editorial chapter is a real destination on the globe. */
  destinations: GlobeDestination[];
};

type Coordinate = readonly [longitude: number, latitude: number];

const locations = [
  { lat: 41.01, lon: 28.97, color: "#fffdf6" },
  { lat: 12.64, lon: -8.0, color: "#d9d1bc" },
  { lat: 9.51, lon: -13.71, color: "#d9d1bc" },
  { lat: 5.36, lon: -4.0, color: "#d9d1bc" },
  { lat: 14.72, lon: -17.47, color: "#d9d1bc" },
] as const;

/*
 * Hand-shaped, deliberately simplified continent silhouettes. Keeping the map
 * in code makes the hero independent from third-party texture CDNs, while the
 * irregular coastlines give the globe a recognisable, editorial character.
 */
const continents: Coordinate[][] = [
  // North America
  [
    [-168, 69], [-150, 72], [-134, 58], [-126, 52], [-123, 39], [-113, 31],
    [-105, 23], [-96, 18], [-89, 20], [-83, 26], [-80, 31], [-75, 38],
    [-66, 45], [-58, 52], [-64, 61], [-82, 67], [-102, 72], [-125, 72],
    [-145, 63], [-168, 69],
  ],
  // Greenland
  [
    [-72, 59], [-48, 60], [-22, 72], [-28, 82], [-52, 85], [-68, 77],
    [-72, 59],
  ],
  // South America
  [
    [-81, 12], [-69, 10], [-59, 6], [-50, 0], [-35, -7], [-39, -20],
    [-49, -29], [-55, -42], [-66, -56], [-73, -50], [-72, -34], [-78, -18],
    [-81, -4], [-81, 12],
  ],
  // Europe and Asia
  [
    [-10, 36], [-9, 49], [-2, 58], [12, 63], [25, 70], [45, 73], [64, 70],
    [82, 74], [110, 70], [138, 59], [162, 61], [177, 51], [162, 44],
    [148, 38], [141, 25], [125, 18], [113, 4], [100, 2], [91, 9], [80, 8],
    [73, 20], [62, 24], [56, 31], [45, 30], [36, 40], [28, 41], [20, 35],
    [12, 39], [3, 43], [-10, 36],
  ],
  // Africa
  [
    [-17, 36], [-5, 37], [10, 36], [23, 32], [34, 30], [43, 13], [51, 11],
    [43, -2], [40, -16], [32, -27], [18, -35], [10, -30], [4, -19],
    [-6, -5], [-12, 5], [-17, 18], [-17, 36],
  ],
  // Madagascar
  [[47, -13], [51, -17], [49, -27], [44, -24], [47, -13]],
  // Australia
  [
    [112, -11], [129, -12], [143, -10], [153, -25], [147, -39], [132, -43],
    [116, -35], [112, -22], [112, -11],
  ],
  // Japan
  [[130, 33], [136, 36], [142, 44], [146, 43], [141, 34], [130, 33]],
];

const AFRICA_INDEX = 4;

const countryHighlights = [
  {
    name: "TR",
    color: "#d8c58d",
    polygon: [
      [26.0, 40.7], [29.2, 41.3], [32.2, 41.1], [35.0, 42.0],
      [38.2, 41.1], [41.2, 41.2], [44.6, 39.8], [44.0, 37.3],
      [40.2, 37.0], [36.8, 36.7], [33.4, 36.0], [30.6, 36.6],
      [28.2, 37.5], [26.0, 40.7],
    ] as Coordinate[],
  },
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function getStage(
  progress: number,
  stageRotations: Array<{ x: number; y: number; z: number; lift: number }>,
) {
  if (stageRotations.length === 0) return { x: 0, y: 0, z: 0, lift: 0 };
  const position = clamp01(progress) * (stageRotations.length - 1);
  const from = Math.floor(position);
  const to = Math.min(stageRotations.length - 1, from + 1);
  const mix = smoothstep(position - from);
  return {
    x: THREE.MathUtils.lerp(stageRotations[from].x, stageRotations[to].x, mix),
    y: THREE.MathUtils.lerp(stageRotations[from].y, stageRotations[to].y, mix),
    z: THREE.MathUtils.lerp(stageRotations[from].z, stageRotations[to].z, mix),
    lift: THREE.MathUtils.lerp(stageRotations[from].lift, stageRotations[to].lift, mix),
  };
}

function pointOnSphere(lat: number, lon: number, radius = 1.57) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function drawPolygon(
  context: CanvasRenderingContext2D,
  polygon: Coordinate[],
  width: number,
  height: number,
) {
  context.beginPath();
  polygon.forEach(([longitude, latitude], index) => {
    const x = ((longitude + 180) / 360) * width;
    const y = ((90 - latitude) / 180) * height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
}

function createEarthTexture(lowPower: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = lowPower ? 1024 : 2048;
  canvas.height = lowPower ? 512 : 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const { width, height } = canvas;
  const ocean = context.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#03261d");
  ocean.addColorStop(0.5, "#064b37");
  ocean.addColorStop(1, "#021d17");
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  // Navigation-grid lines are printed into the texture rather than floating
  // above it; this keeps the globe crisp on lower-powered phones.
  context.strokeStyle = "rgba(203, 222, 211, 0.11)";
  context.lineWidth = Math.max(1, width / 1500);
  for (let lon = -150; lon <= 150; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  continents.forEach((continent, index) => {
    drawPolygon(context, continent, width, height);
    const land = context.createLinearGradient(0, 0, width, height);
    if (index === AFRICA_INDEX) {
      land.addColorStop(0, "#8bd0aa");
      land.addColorStop(1, "#287957");
    } else {
      land.addColorStop(0, "#e6e9e3");
      land.addColorStop(1, "#8ca99a");
    }
    context.fillStyle = land;
    context.fill();
    context.strokeStyle = index === AFRICA_INDEX ? "#f5eee0" : "rgba(255,255,255,.55)";
    context.lineWidth = Math.max(1.2, width / 1200);
    context.stroke();
  });

  // Türkiye is painted as a country—not a generic map pin—while Africa is
  // already treated as the globe's contrasting green anchor landmass.
  countryHighlights.forEach(({ name, color, polygon }) => {
    context.save();
    drawPolygon(context, polygon, width, height);
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = width / 175;
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255,253,246,.96)";
    context.lineWidth = Math.max(2, width / 720);
    context.stroke();

    const center = polygon.reduce(
      (sum, [longitude, latitude]) => ({
        x: sum.x + ((longitude + 180) / 360) * width,
        y: sum.y + ((90 - latitude) / 180) * height,
      }),
      { x: 0, y: 0 },
    );
    center.x /= polygon.length;
    center.y /= polygon.length;
    context.fillStyle = "#06251d";
    context.font = `800 ${Math.max(12, width / 110)}px Manrope, Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(name, center.x, center.y);
    context.restore();
  });

  const africaLabelX = ((16 + 180) / 360) * width;
  const africaLabelY = ((90 - 4) / 180) * height;
  context.save();
  context.fillStyle = "rgba(255,253,246,.92)";
  context.shadowColor = "rgba(2,26,19,.8)";
  context.shadowBlur = width / 350;
  context.font = `800 ${Math.max(15, width / 82)}px Manrope, Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("AFRICA", africaLabelX, africaLabelY);
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = lowPower ? 2 : 6;
  texture.needsUpdate = true;
  return texture;
}

function Connection({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const points = useMemo(() => {
    const midpoint = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(2.14);
    return new THREE.QuadraticBezierCurve3(from, midpoint, to).getPoints(48);
  }, [from, to]);

  return <Line points={points} color="#d9d1bc" lineWidth={0.72} transparent opacity={0.42} />;
}

function Atmosphere({ lowPower }: { lowPower: boolean }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { glowColor: { value: new THREE.Color("#8de0b1") } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float rim = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 3.0);
            gl_FragColor = vec4(glowColor, rim * 0.42);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh scale={1.095} material={material}>
      <sphereGeometry args={[1.52, lowPower ? 32 : 56, lowPower ? 32 : 56]} />
    </mesh>
  );
}

function OrbitingBeacons({ reduceMotion }: { reduceMotion: boolean }) {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!orbit.current || reduceMotion) return;
    orbit.current.rotation.z += delta * 0.09;
    orbit.current.rotation.y -= delta * 0.045;
  });

  return (
    <group ref={orbit} rotation={[0.62, 0.15, 0.1]}>
      {[0.35, 2.45, 4.55].map((angle, index) => (
        <mesh key={angle} position={[Math.cos(angle) * 1.88, Math.sin(angle) * 1.88, 0]}>
          <sphereGeometry args={[index === 1 ? 0.032 : 0.024, 12, 12]} />
          <meshBasicMaterial color={index === 1 ? "#d8c58d" : "#f6f1e7"} />
        </mesh>
      ))}
    </group>
  );
}

function ServiceHotspots({
  destinations,
  activeIndex,
  onSelectIndex,
  lowPower,
}: {
  destinations: GlobeDestination[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  lowPower: boolean;
}) {
  const positions = useMemo(
    () => destinations.map((destination, index) => pointOnSphere(destination.location.lat, destination.location.lon, 1.65 + (index % 3) * 0.018)),
    [destinations],
  );

  return (
    <>
      {positions.map((position, index) => {
        const destination = destinations[index];
        const active = index === activeIndex;
        const next = index === Math.min(activeIndex + 1, destinations.length - 1);
        const showLabel = active || next;
        return (
          <group key={`${destination.location.city}-${destination.id}`} position={position}>
            <mesh
              scale={active ? 1.35 : 1}
              onClick={(event) => {
                event.stopPropagation();
                onSelectIndex(index);
              }}
            >
              <sphereGeometry args={[active ? 0.046 : 0.024, 16, 16]} />
              <meshBasicMaterial color={active ? "#d8c58d" : "#fffdf6"} />
            </mesh>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                onSelectIndex(index);
              }}
            >
              <sphereGeometry args={[lowPower ? 0.09 : 0.065, 10, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {showLabel && (
              <Html
                center
                occlude
                zIndexRange={[30, 0]}
                style={{ pointerEvents: "auto", userSelect: "none" }}
              >
                <button
                  type="button"
                  title={`${destination.label} — ${destination.location.city}`}
                  aria-label={`${destination.number}, ${destination.label}, ${destination.location.city}`}
                  aria-pressed={active}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectIndex(index);
                  }}
                  style={{
                    alignItems: "center",
                    background: active ? "#d8c58d" : "rgba(3, 38, 29, 0.9)",
                    border: active ? "1px solid rgba(255,255,255,.85)" : "1px solid rgba(255,255,255,.4)",
                    borderRadius: 999,
                    boxShadow: active
                      ? "0 10px 28px rgba(0,0,0,.32), 0 0 0 5px rgba(216,197,141,.14)"
                      : "0 6px 18px rgba(0,0,0,.22)",
                    color: active ? "#08281f" : "#fffdf6",
                    cursor: "pointer",
                    display: "inline-flex",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: lowPower ? 9 : 8,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    justifyContent: "center",
                    minHeight: active ? (lowPower ? 38 : 30) : lowPower ? 32 : 22,
                    minWidth: active ? (lowPower ? 38 : 30) : lowPower ? 32 : 22,
                    opacity: active ? 1 : 0.84,
                    padding: 0,
                    transform: `translateY(-${active ? 17 : 11}px)`,
                    transition: "background .3s ease, opacity .3s ease, transform .3s ease, box-shadow .3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span aria-hidden="true">{destination.number}</span>
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function Globe({
  reduceMotion,
  lowPower,
  activeIndex,
  scrollProgress,
  progressRef,
  onSelectIndex,
  destinations,
  mode = "hero",
}: Required<Pick<GlobeSceneProps, "activeIndex">> &
  Omit<GlobeSceneProps, "activeIndex"> & { reduceMotion: boolean; lowPower: boolean }) {
  const stageGroup = useRef<THREE.Group>(null);
  const globeGroup = useRef<THREE.Group>(null);
  const manualRotation = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { gl, invalidate } = useThree();
  const points = useMemo(() => locations.map((location) => pointOnSphere(location.lat, location.lon)), []);
  const earthTexture = useMemo(() => createEarthTexture(lowPower), [lowPower]);
  const stageRotations = useMemo(
    () => destinations.map((destination, index) => ({
      x: THREE.MathUtils.degToRad(destination.location.lat),
      y: -Math.PI / 2 - THREE.MathUtils.degToRad(destination.location.lon),
      z: index % 2 === 0 ? -0.035 : 0.035,
      lift: ((index % 5) - 2) * 0.045,
    })),
    [destinations],
  );

  useEffect(() => () => earthTexture?.dispose(), [earthTexture]);
  useEffect(() => invalidate(), [activeIndex, scrollProgress, invalidate]);
  useEffect(() => {
    manualRotation.current.targetX = 0;
    manualRotation.current.targetY = 0;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = gl.domElement;
    let pointerId: number | undefined;
    let lastX = 0;
    let lastY = 0;
    let direction: "pending" | "horizontal" | "vertical" = "pending";

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      direction = "pending";
      canvas.classList.add("is-grabbing");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      if (direction === "pending" && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 5) {
        direction = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      }
      if (direction !== "horizontal") return;
      event.preventDefault();
      manualRotation.current.targetY += deltaX * 0.0065;
      manualRotation.current.targetX = THREE.MathUtils.clamp(
        manualRotation.current.targetX + deltaY * 0.003,
        -0.34,
        0.34,
      );
      lastX = event.clientX;
      lastY = event.clientY;
      invalidate();
    };
    const endPointer = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = undefined;
      canvas.classList.remove("is-grabbing");
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endPointer);
      canvas.removeEventListener("pointercancel", endPointer);
    };
  }, [gl, invalidate]);

  useFrame((state, delta) => {
    if (!stageGroup.current || !globeGroup.current) return;
    const fallback = activeIndex / Math.max(1, stageRotations.length - 1);
    const progress = clamp01(progressRef?.current ?? scrollProgress ?? fallback);
    const stage = getStage(progress, stageRotations);
    const pointerX = lowPower || reduceMotion ? 0 : state.pointer.x;
    const pointerY = lowPower || reduceMotion ? 0 : state.pointer.y;

    if (reduceMotion) {
      globeGroup.current.rotation.set(stage.x, stage.y, stage.z);
      stageGroup.current.position.y = stage.lift;
      return;
    }

    const damping = 1 - Math.exp(-delta * 3.6);
    manualRotation.current.x = THREE.MathUtils.lerp(
      manualRotation.current.x,
      manualRotation.current.targetX,
      damping,
    );
    manualRotation.current.y = THREE.MathUtils.lerp(
      manualRotation.current.y,
      manualRotation.current.targetY,
      damping,
    );
    globeGroup.current.rotation.x = THREE.MathUtils.lerp(
      globeGroup.current.rotation.x,
      stage.x + manualRotation.current.x - pointerY * 0.075,
      damping,
    );
    globeGroup.current.rotation.y = THREE.MathUtils.lerp(
      globeGroup.current.rotation.y,
      stage.y + manualRotation.current.y + pointerX * 0.11,
      damping,
    );
    globeGroup.current.rotation.z = THREE.MathUtils.lerp(globeGroup.current.rotation.z, stage.z, damping);
    stageGroup.current.position.y = THREE.MathUtils.lerp(
      stageGroup.current.position.y,
      stage.lift - pointerY * 0.045,
      damping,
    );
    stageGroup.current.position.x = THREE.MathUtils.lerp(
      stageGroup.current.position.x,
      pointerX * 0.045,
      damping,
    );
    const pulse = 1 + Math.sin(progress * Math.PI * 9) * 0.012;
    stageGroup.current.scale.setScalar(THREE.MathUtils.lerp(stageGroup.current.scale.x, pulse, damping));
  });

  return (
    <group ref={stageGroup}>
      <group ref={globeGroup} rotation={[0.04, -0.58, -0.07]}>
        <mesh>
          <sphereGeometry args={[1.52, lowPower ? 48 : 80, lowPower ? 48 : 80]} />
          <meshPhysicalMaterial
            map={earthTexture ?? undefined}
            color="#ffffff"
            metalness={0.2}
            roughness={0.43}
            clearcoat={0.72}
            clearcoatRoughness={0.3}
          />
        </mesh>

        <Atmosphere lowPower={lowPower} />

        <mesh rotation={[Math.PI / 2.8, 0.25, 0.12]}>
          <torusGeometry args={[1.84, 0.009, 10, lowPower ? 96 : 180]} />
          <meshStandardMaterial color="#d8ddd8" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh rotation={[-Math.PI / 3.8, -0.16, -0.2]}>
          <torusGeometry args={[1.7, 0.006, 8, lowPower ? 96 : 180]} />
          <meshBasicMaterial color="#d8ddd8" transparent opacity={0.38} />
        </mesh>

        {points.map((point, index) => (
          <group key={`${locations[index].lat}-${locations[index].lon}`} position={point}>
            <mesh>
              <sphereGeometry args={[index === 0 ? 0.052 : 0.036, 16, 16]} />
              <meshBasicMaterial color={locations[index].color} />
            </mesh>
            <mesh scale={2.1}>
              <sphereGeometry args={[index === 0 ? 0.052 : 0.036, 12, 12]} />
              <meshBasicMaterial color={locations[index].color} transparent opacity={0.15} />
            </mesh>
          </group>
        ))}
        {points.slice(1).map((point, index) => (
          <Connection key={`${locations[index + 1].lat}-${locations[index + 1].lon}`} from={points[0]} to={point} />
        ))}

        <OrbitingBeacons reduceMotion={reduceMotion} />
        {mode === "journey" && (
          <ServiceHotspots
            destinations={destinations}
            activeIndex={activeIndex}
            onSelectIndex={onSelectIndex ?? (() => undefined)}
            lowPower={lowPower}
          />
        )}
      </group>
    </group>
  );
}

export function GlobeScene({
  activeIndex = 0,
  scrollProgress,
  progressRef,
  onSelectIndex,
  destinations,
  mode = "hero",
}: GlobeSceneProps) {
  const container = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const powerQuery = window.matchMedia("(max-width: 720px), (pointer: coarse)");
    const updatePreferences = () => {
      setReduceMotion(motionQuery.matches);
      setLowPower(powerQuery.matches);
    };
    updatePreferences();
    setMounted(true);
    motionQuery.addEventListener("change", updatePreferences);
    powerQuery.addEventListener("change", updatePreferences);
    return () => {
      motionQuery.removeEventListener("change", updatePreferences);
      powerQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    const target = container.current;
    if (!mounted || !target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "240px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => setSelectedIndex(activeIndex), [activeIndex]);

  const selectIndex = (index: number) => {
    setSelectedIndex(index);
    onSelectIndex?.(index);
  };

  if (!mounted) return <div className="globe-fallback" aria-hidden="true" />;

  return (
    <div
      ref={container}
      className="globe-canvas"
      role={mode === "journey" ? "region" : undefined}
      aria-label={mode === "journey" ? "Globe interactif des services TURKANOR" : undefined}
      aria-hidden={mode === "hero" ? true : undefined}
    >
      <Canvas
        dpr={lowPower ? [1, 1.15] : [1, 1.6]}
        frameloop={!visible || reduceMotion ? "demand" : "always"}
        camera={{ position: [0, 0.08, 5.15], fov: 41 }}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <ambientLight intensity={0.68} />
        <hemisphereLight color="#f7f4e9" groundColor="#03281e" intensity={1.45} />
        <directionalLight position={[3.5, 4.5, 5]} intensity={3.4} color="#fffaf0" />
        <pointLight position={[-4, -2, 2]} intensity={4.8} color="#0ca46a" />
        <pointLight position={[3.5, -2, 1]} intensity={3.2} color="#d8c58d" />
        <Globe
          reduceMotion={reduceMotion}
          lowPower={lowPower}
          activeIndex={Math.max(0, Math.min(destinations.length - 1, selectedIndex))}
          scrollProgress={scrollProgress}
          progressRef={progressRef}
          onSelectIndex={selectIndex}
          destinations={destinations}
          mode={mode}
        />
        {!lowPower && (
          <Stars
            radius={28}
            depth={12}
            count={440}
            factor={1.45}
            saturation={0}
            fade
            speed={reduceMotion ? 0 : 0.16}
          />
        )}
      </Canvas>
    </div>
  );
}
