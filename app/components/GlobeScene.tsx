import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import * as THREE from "three";
import worldAtlas from "world-atlas/countries-110m.json";
import type { GlobeDestination } from "~/data/worldContent";

type GlobeSceneProps = {
  mode?: "hero" | "journey";
  /** The currently visible editorial destination. */
  activeIndex?: number;
  /** A normalized 0–1 value through the service journey. */
  scrollProgress?: number;
  /** Prefer this for animation: ScrollTrigger can update it without React renders. */
  progressRef?: { current: number };
  /** Every editorial chapter is a real destination on the globe. */
  destinations: GlobeDestination[];
};

type Coordinate = [longitude: number, latitude: number];
type PolygonGeometry = { type: "Polygon"; coordinates: Coordinate[][] };
type MultiPolygonGeometry = { type: "MultiPolygon"; coordinates: Coordinate[][][] };
type CountryFeature = {
  id?: string | number;
  properties?: { name?: string };
  geometry: PolygonGeometry | MultiPolygonGeometry | null;
};
type CountryCollection = { type: "FeatureCollection"; features: CountryFeature[] };

const FEATURED_COUNTRIES = new Set(["792", "324", "384", "466"]);
const TURKIYE_ID = "792";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function getJourneyView(progress: number, lowPower: boolean, stageCount: number) {
  const p = clamp01(progress);
  const stagePosition = p * Math.max(1, stageCount - 1);
  const stageFraction = stagePosition - Math.floor(stagePosition);
  const travel = Math.pow(Math.max(0, Math.sin(stageFraction * Math.PI)), 0.72);
  const segment = Math.min(Math.max(0, Math.floor(stagePosition)), Math.max(0, stageCount - 2));
  const side = segment % 2 === 0 ? 1 : -1;
  const locationRadius = lowPower ? 4.05 : 3.25;
  const travelRadius = lowPower ? 5.85 : 5.55;
  const radius = THREE.MathUtils.lerp(locationRadius, travelRadius, travel);
  const angle = stagePosition * Math.PI * 2;
  const scale = THREE.MathUtils.lerp(lowPower ? 1 : 1.08, lowPower ? 0.92 : 0.94, travel);
  const fov = THREE.MathUtils.lerp(lowPower ? 48 : 37, lowPower ? 51 : 44, travel);

  return {
    angle,
    fov,
    travel,
    x: side * travel * (lowPower ? 0.24 : 0.54),
    y: (lowPower ? 0.08 : 0.12) + travel * (lowPower ? 0.18 : 0.38) * Math.sin((segment + 0.5) * 1.7),
    z: radius,
    scale,
  };
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

function traceRing(context: CanvasRenderingContext2D, ring: Coordinate[], width: number, height: number) {
  let previousX: number | undefined;
  ring.forEach(([longitude, latitude], index) => {
    const x = ((longitude + 180) / 360) * width;
    const y = ((90 - latitude) / 180) * height;
    if (index === 0 || previousX === undefined || Math.abs(x - previousX) > width * 0.45) context.moveTo(x, y);
    else context.lineTo(x, y);
    previousX = x;
  });
}

function traceCountry(context: CanvasRenderingContext2D, country: CountryFeature, width: number, height: number) {
  if (!country.geometry) return;
  const polygons = country.geometry.type === "Polygon"
    ? [country.geometry.coordinates]
    : country.geometry.coordinates;
  context.beginPath();
  polygons.forEach((polygon) => polygon.forEach((ring) => traceRing(context, ring, width, height)));
}

function createEarthTexture(lowPower: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = lowPower ? 1024 : 2048;
  canvas.height = lowPower ? 512 : 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const { width, height } = canvas;
  const ocean = context.createRadialGradient(width * 0.34, height * 0.28, 0, width * 0.48, height * 0.55, width * 0.78);
  ocean.addColorStop(0, "#126b64");
  ocean.addColorStop(0.48, "#06463e");
  ocean.addColorStop(1, "#011b1b");
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  // Natural Earth country geometry from world-atlas replaces the former
  // illustrative silhouettes. The texture stays local and works offline.
  const topology = worldAtlas as unknown as { objects: { countries: unknown } };
  const countries = feature(topology, topology.objects.countries) as CountryCollection;
  countries.features.forEach((country) => {
    const id = String(country.id ?? "");
    const numericId = Number.parseInt(id, 10) || 0;
    const featured = FEATURED_COUNTRIES.has(id);
    traceCountry(context, country, width, height);
    const lightness = 48 + (numericId % 6) * 2.2;
    context.fillStyle = id === TURKIYE_ID
      ? "#d6c28c"
      : featured
        ? "#82b986"
        : `hsl(${139 + (numericId % 9)}, ${22 + (numericId % 7)}%, ${lightness}%)`;
    if (featured) {
      context.shadowColor = id === TURKIYE_ID ? "rgba(232,210,148,.9)" : "rgba(136,207,151,.72)";
      context.shadowBlur = width / 420;
    }
    context.fill("evenodd");
    context.shadowBlur = 0;
    context.strokeStyle = featured ? "rgba(255,250,231,.9)" : "rgba(226,239,229,.42)";
    context.lineWidth = featured ? Math.max(1.6, width / 1050) : Math.max(0.55, width / 3100);
    context.stroke();
  });

  context.save();
  context.globalCompositeOperation = "soft-light";
  const sheen = context.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0, "rgba(255,255,255,.18)");
  sheen.addColorStop(0.48, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(0,0,0,.28)");
  context.fillStyle = sheen;
  context.fillRect(0, 0, width, height);
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

function Globe({
  reduceMotion,
  lowPower,
  activeIndex,
  scrollProgress,
  progressRef,
  destinations,
  mode = "hero",
}: Required<Pick<GlobeSceneProps, "activeIndex">> &
  Omit<GlobeSceneProps, "activeIndex"> & { reduceMotion: boolean; lowPower: boolean }) {
  const stageGroup = useRef<THREE.Group>(null);
  const globeGroup = useRef<THREE.Group>(null);
  const manualRotation = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { camera, gl, invalidate } = useThree();
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraGoal = useRef(new THREE.Vector3());
  const routeLocations = useMemo(() => {
    const seen = new Set<string>();
    return destinations.filter((destination) => {
      const key = `${destination.location.lat.toFixed(3)}:${destination.location.lon.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [destinations]);
  const routePoints = useMemo(
    () => routeLocations.map((destination) => pointOnSphere(destination.location.lat, destination.location.lon)),
    [routeLocations],
  );
  const routeConnections = useMemo(() => {
    const seen = new Set<string>();
    return destinations.slice(1).flatMap((destination, index) => {
      const previous = destinations[index];
      const fromKey = `${previous.location.lat.toFixed(3)}:${previous.location.lon.toFixed(3)}`;
      const toKey = `${destination.location.lat.toFixed(3)}:${destination.location.lon.toFixed(3)}`;
      const key = [fromKey, toKey].sort().join("→");
      if (seen.has(key)) return [];
      seen.add(key);
      return [{
        key,
        from: pointOnSphere(previous.location.lat, previous.location.lon),
        to: pointOnSphere(destination.location.lat, destination.location.lon),
      }];
    });
  }, [destinations]);
  const earthTexture = useMemo(() => createEarthTexture(lowPower), [lowPower]);
  const stageRotations = useMemo(
    () => destinations.map((destination, index) => ({
      x: THREE.MathUtils.degToRad(destination.location.lat),
      // One complete revolution is built into every leg. Because each landing
      // ends on an equivalent 2π orientation, the requested city still faces
      // the camera and reverse scrolling retraces the same trip exactly.
      y: -Math.PI / 2 - THREE.MathUtils.degToRad(destination.location.lon) - index * Math.PI * 2,
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
      stageGroup.current.position.x = 0;
      stageGroup.current.scale.setScalar(mode === "journey" ? (lowPower ? 0.88 : 0.92) : 1);
      if (mode === "journey") {
        camera.position.set(0, lowPower ? 0.12 : 0.08, lowPower ? 6.05 : 5.7);
        camera.lookAt(0, 0, 0);
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = lowPower ? 48 : 44;
          camera.updateProjectionMatrix();
        }
      }
      return;
    }

    const damping = 1 - Math.exp(-delta * 3.6);
    const cameraDamping = 1 - Math.exp(-delta * 4.25);
    const journeyView = mode === "journey" ? getJourneyView(progress, lowPower, stageRotations.length) : null;
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
      stage.x +
        manualRotation.current.x -
        pointerY * 0.075 +
        (journeyView ? Math.sin(journeyView.angle * 0.5) * journeyView.travel * 0.035 : 0),
      damping,
    );
    globeGroup.current.rotation.y = THREE.MathUtils.lerp(
      globeGroup.current.rotation.y,
      stage.y +
        manualRotation.current.y +
        pointerX * 0.11,
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
    const targetScale = journeyView
      ? journeyView.scale + Math.sin(progress * Math.PI * 7) * (lowPower ? 0.008 : 0.018)
      : pulse;
    stageGroup.current.scale.setScalar(
      THREE.MathUtils.lerp(stageGroup.current.scale.x, targetScale, damping),
    );

    if (journeyView) {
      cameraGoal.current.set(journeyView.x, journeyView.y, journeyView.z);
      camera.position.lerp(cameraGoal.current, cameraDamping);
      cameraGoal.current.set(0, stage.lift * 0.42 - pointerY * 0.025, 0);
      cameraTarget.current.lerp(cameraGoal.current, cameraDamping);
      camera.lookAt(cameraTarget.current);
      if (camera instanceof THREE.PerspectiveCamera) {
        const nextFov = THREE.MathUtils.lerp(camera.fov, journeyView.fov, cameraDamping);
        if (Math.abs(nextFov - camera.fov) > 0.001) {
          camera.fov = nextFov;
          camera.updateProjectionMatrix();
        }
      }
    }
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

        {routePoints.map((point, index) => {
          const destination = routeLocations[index];
          const active = destinations[activeIndex]?.location.code === destination.location.code;
          const color = destination.location.country.includes("Türkiye") ? "#f4dfaa" : "#e8f4e8";
          const markerSize = active ? 0.032 : 0.013;
          return (
          <group key={`${destination.location.lat}-${destination.location.lon}`} position={point}>
            <mesh>
              <sphereGeometry args={[markerSize, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh scale={active ? 1.95 : 1.55}>
              <sphereGeometry args={[markerSize, 12, 12]} />
              <meshBasicMaterial color={color} transparent opacity={active ? 0.2 : 0.075} />
            </mesh>
          </group>
          );
        })}
        {routeConnections.map((connection) => (
          <Connection key={connection.key} from={connection.from} to={connection.to} />
        ))}

      </group>
    </group>
  );
}

export function GlobeScene({
  activeIndex = 0,
  scrollProgress,
  progressRef,
  destinations,
  mode = "hero",
}: GlobeSceneProps) {
  const container = useRef<HTMLDivElement>(null);
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
        camera={{
          position: [0, 0.08, mode === "journey" ? 5.7 : 5.15],
          fov: mode === "journey" ? 44 : 41,
        }}
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
          activeIndex={Math.max(0, Math.min(destinations.length - 1, activeIndex))}
          scrollProgress={scrollProgress}
          progressRef={progressRef}
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
