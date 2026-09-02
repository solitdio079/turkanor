import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { content, getDestinations, type Language, type SiteContent } from "~/data/worldContent";
import { ServiceIcon } from "./ServiceIcon";

const GlobeScene = lazy(() =>
  import("~/components/GlobeScene").then(({ GlobeScene }) => ({ default: GlobeScene })),
);

type ServiceJourneyProps = { language: Language };

function PageMark({ number, label, location }: { number: string; label: string; location?: string }) {
  return (
    <div className="page-mark" data-scene-item>
      <span>{number}</span><p>{label}</p><i aria-hidden="true" />
      {location && <em>{location}</em>}
    </div>
  );
}

function CatalogueHeading({ kicker, title }: { kicker: string; title: string }) {
  return <header className="catalogue-heading"><p data-scene-item>{kicker}</p><h2 data-scene-item>{title}</h2></header>;
}

function ServiceRows({ items, start }: { items: SiteContent["solutions"]["items"]; start: number }) {
  return (
    <div className="service-rows">
      {items.map((service, index) => (
        <article className="service-row" key={service.id}>
          <div className="service-row-number" data-scene-item>{String(start + index).padStart(2, "0")}</div>
          <div className="service-row-icon" data-scene-item><ServiceIcon name={service.icon} /></div>
          <div className="service-row-copy"><h3 data-scene-item>{service.title}</h3><p data-scene-item>{service.description}</p></div>
          {service.image && <img src={service.image} alt="" loading="lazy" decoding="async" data-scene-item />}
        </article>
      ))}
    </div>
  );
}

function SourcingSteps({ steps, start }: { steps: SiteContent["sourcing"]["steps"]; start: number }) {
  return (
    <div className="sourcing-steps">
      {steps.map((step, index) => (
        <article className="sourcing-step" key={step.title}>
          <img src={step.image} alt="" loading="lazy" decoding="async" data-scene-item />
          <div data-scene-item><span>{String(start + index).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></div>
        </article>
      ))}
    </div>
  );
}

export function ServiceJourney({ language }: ServiceJourneyProps) {
  const root = useRef<HTMLElement>(null);
  const globeProgress = useRef(0);
  const destinations = useMemo(() => getDestinations(language), [language]);
  const [activeChapter, setActiveChapter] = useState(0);
  const copy = content[language];
  const openDestination = useCallback((index: number) => {
    const target = root.current?.querySelector<HTMLElement>(`[data-chapter-index="${index}"]`);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    async function startMotion() {
      if (!root.current) return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      const rootElement = root.current;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const chapters = gsap.utils.toArray<HTMLElement>(".journey-chapter", rootElement);
      const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
      const smoothstep = (value: number) => {
        const clamped = clamp01(value);
        return clamped * clamped * (3 - 2 * clamped);
      };

      context = gsap.context(() => {
        let chapterCenters: number[] = [];
        const measureCenters = () => {
          chapterCenters = chapters.map((chapter) => {
            const bounds = chapter.getBoundingClientRect();
            return bounds.top + window.scrollY + bounds.height / 2 - window.innerHeight / 2;
          });
        };
        const updateJourney = () => {
          if (chapterCenters.length < 2) return;
          const currentScroll = window.scrollY;
          if (currentScroll <= chapterCenters[0]) {
            globeProgress.current = 0;
            setActiveChapter(0);
            return;
          }
          const lastIndex = chapterCenters.length - 1;
          if (currentScroll >= chapterCenters[lastIndex]) {
            globeProgress.current = 1;
            setActiveChapter(lastIndex);
            return;
          }

          const segment = Math.max(0, chapterCenters.findIndex((center, index) => index < lastIndex && currentScroll >= center && currentScroll < chapterCenters[index + 1]));
          const start = chapterCenters[segment];
          const end = chapterCenters[segment + 1];
          const local = clamp01((currentScroll - start) / Math.max(1, end - start));
          // The route completes before the next pinned scene opens. During the
          // viewport-sized gap, the globe is therefore the only visible layer.
          const travel = smoothstep((local - .26) / .36);
          globeProgress.current = (segment + travel) / lastIndex;
          setActiveChapter(local < .5 ? segment : segment + 1);
        };

        ScrollTrigger.create({
          trigger: rootElement,
          start: "top top",
          end: "bottom bottom",
          onRefresh: () => { measureCenters(); updateJourney(); },
          onUpdate: updateJourney,
        });

        chapters.forEach((chapter, index) => {
          if (reduced || index === 0) return;
          const panel = chapter.querySelector<HTMLElement>("[data-orbit-content]");
          if (!panel) return;
          const track = panel.querySelector<HTMLElement>("[data-scene-track]");
          const items = gsap.utils.toArray<HTMLElement>("[data-scene-item]", panel);
          const patterns = [
            { x: -110, y: 26, rotate: -1.8, scale: .96 },
            { x: 104, y: -18, rotate: 1.4, scale: .94 },
            { x: 0, y: 92, rotate: 0, scale: .97 },
            { x: -58, y: -72, rotate: -1.1, scale: .93 },
            { x: 72, y: 62, rotate: 1.6, scale: .95 },
            { x: 18, y: -94, rotate: .7, scale: .92 },
          ] as const;
          const revealStart = 1;
          const revealSpan = Math.max(3.2, items.length * .62);
          // Let the page mark, chapter title, and opening copy settle before the
          // editorial track begins to travel. This is especially important on
          // mobile, where the larger type otherwise reaches the clipped edge
          // before its own entrance has finished.
          const trackStart = revealStart + Math.min(3, Math.max(2.2, items.length * .14));
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            panel,
            {
              autoAlpha: 0,
              clipPath: "circle(0% at 50% 50%)",
              filter: "blur(12px)",
              scale: .76,
              transformOrigin: "50% 50%",
            },
            {
              autoAlpha: 1,
              clipPath: "circle(150% at 50% 50%)",
              filter: "blur(0px)",
              scale: 1,
              duration: 1,
              ease: "power3.inOut",
            },
          );

          if (track) {
            timeline.fromTo(
              track,
              { y: 0 },
              {
                y: () => -Math.max(0, track.scrollHeight - panel.clientHeight),
                duration: revealSpan,
                ease: "none",
              },
              trackStart,
            );
          }

          items.forEach((item, itemIndex) => {
            const pattern = patterns[(itemIndex * 5 + index * 3) % patterns.length];
            const isMedia = item.matches("img, figure") || Boolean(item.querySelector("img"));
            const basePosition = revealStart + itemIndex * (revealSpan / Math.max(1, items.length));
            const jitter = ((itemIndex * 7 + index * 11) % 5 - 2) * .08;
            timeline.fromTo(
              item,
              {
                autoAlpha: 0,
                x: pattern.x,
                y: pattern.y,
                rotate: pattern.rotate,
                scale: isMedia ? 1.08 : pattern.scale,
                filter: `blur(${isMedia ? 5 : 3}px)`,
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: .82,
                ease: "power3.out",
              },
              Math.max(revealStart, basePosition + jitter),
            );
          });

          timeline
            .to(panel, { autoAlpha: 1, duration: .7 })
            .to(panel, {
              autoAlpha: 0,
              clipPath: "circle(0% at 50% 50%)",
              filter: "blur(10px)",
              scale: .8,
              duration: 1,
              ease: "power3.inOut",
            });
        });

        if (!reduced) {
          gsap.timeline({ scrollTrigger: { trigger: ".chapter-hero", start: "top top", end: "bottom bottom", scrub: 1 } })
            .to("[data-hero-copy]", { opacity: 0, y: -70, duration: .22 }, .08)
            .fromTo(".journey-entry-copy", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .18 }, .38)
            .to(".journey-entry-copy", { opacity: 0, y: -24, duration: .16 }, .72);
        }

        ScrollTrigger.refresh();
      }, root);
    }

    void startMotion();
    return () => { cancelled = true; context?.revert(); };
  }, [language]);

  return (
    <section id="accueil" ref={root} className="world-experience">
      <div className="journey-visual" aria-hidden="true">
        <div className="journey-grid" />
        <div className="journey-globe">
          <Suspense fallback={<div className="globe-fallback" />}>
            <GlobeScene destinations={destinations} activeIndex={activeChapter} progressRef={globeProgress} mode="journey" onDestinationSelect={openDestination} />
          </Suspense>
        </div>
        <div className="journey-vignette" />
        <p className="journey-entry-copy">{copy.bridge.signature}</p>
      </div>

      <div className="journey-chapters">
        <article className="journey-chapter chapter-hero" data-chapter-index="0">
          <div className="hero-primary" data-hero-copy>
            <p className="hero-kicker">{copy.hero.eyebrow}<span>{copy.interface.catalogue}</span></p>
            <h1><span>{copy.hero.title}</span><em>{copy.hero.accent}</em></h1>
            <strong>{copy.hero.statement}</strong>
            <p className="hero-service-line">{copy.hero.servicesLine}</p>
            <div className="hero-actions"><a href="#a-propos">{copy.hero.servicesCta}<span>→</span></a><a href="#contact">{copy.hero.projectCta}<span>→</span></a></div>
            <small>{copy.hero.hint}</small>
          </div>
        </article>

        <article id="a-propos" className="journey-chapter chapter-left" data-chapter-index="1">
          <section className="journey-panel paper-panel about-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="02" label={copy.about.title} location={`${destinations[1].location.city} · ${destinations[1].location.country}`} />
              <div className="about-editorial">
                <div><CatalogueHeading kicker="02" title={copy.about.title} />{copy.about.paragraphs.map((paragraph, index) => <p className={index === 0 ? "about-lead" : ""} key={paragraph} data-scene-item>{paragraph}</p>)}</div>
                <aside className="domains-block" data-scene-item><h3>{copy.about.domainsTitle}</h3><ol>{copy.about.domains.map((domain) => <li key={domain}>{domain}</li>)}</ol></aside>
              </div>
            </div>
          </section>
        </article>

        <article id="direction" className="journey-chapter chapter-right" data-chapter-index="2">
          <section className="journey-panel paper-panel manager-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="03" label={copy.manager.title} location={`${destinations[2].location.city} · ${destinations[2].location.country}`} />
              <CatalogueHeading kicker="03" title={copy.manager.title} />
              <div className="manager-layout"><div className="manager-signature" data-scene-item><span>03</span><strong>{copy.manager.name}</strong><small>TURKANOR Corporation</small></div><blockquote data-scene-item>{copy.manager.quote}</blockquote></div>
              <div className="manager-solutions"><h3 data-scene-item>{copy.manager.solutionsTitle}</h3>{copy.manager.solutions.map((solution) => <article key={solution.title} data-scene-item><strong>{solution.title}</strong><p>{solution.description}</p></article>)}</div>
            </div>
          </section>
        </article>

        <article id="services" className="journey-chapter chapter-left chapter-wide" data-chapter-index="3">
          <section className="journey-panel wide-panel paper-panel solutions-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="04" label={copy.solutions.sectionTitle} location={`${destinations[3].location.city} · ${destinations[3].location.country}`} />
              <CatalogueHeading kicker={copy.solutions.sectionTitle} title={copy.solutions.title} />
              <p className="section-intro" data-scene-item>{copy.solutions.intro}</p>
              <ServiceRows items={copy.solutions.items.slice(0, 4)} start={1} />
            </div>
          </section>
        </article>

        <article id="services-suite" className="journey-chapter chapter-right chapter-wide" data-chapter-index="4">
          <section className="journey-panel wide-panel paper-panel solutions-continuation" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="05" label={copy.solutions.sectionTitle} location={`${destinations[4].location.city} · ${destinations[4].location.country}`} />
              <ServiceRows items={copy.solutions.items.slice(4)} start={5} />
              <figure className="trade-development-image" data-scene-item><img src="/images/catalogue/business-development.webp" alt="" width="1850" height="1800" loading="lazy" decoding="async" /></figure>
            </div>
          </section>
        </article>

        <article id="secteurs" className="journey-chapter chapter-left chapter-wide" data-chapter-index="5">
          <section className="journey-panel wide-panel green-panel sectors-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="06" label={copy.sectors.sectionTitle} location={`${destinations[5].location.city} · ${destinations[5].location.country}`} />
              <CatalogueHeading kicker={copy.sectors.sectionTitle} title={copy.sectors.title} />
              <div className="sectors-layout"><div className="sectors-list">{copy.sectors.items.map((sector, index) => <article key={sector.title} data-scene-item><span>{String(index + 1).padStart(2, "0")}</span><h3>{sector.title}</h3><p>{sector.details.join(" · ")}</p></article>)}</div><img src="/images/catalogue/sectors-neutral.webp" alt="" width="700" height="1500" loading="lazy" decoding="async" data-scene-item /></div>
              <p className="sector-footnote" data-scene-item>{copy.sectors.footnote}</p>
            </div>
          </section>
        </article>

        <article id="sourcing" className="journey-chapter chapter-right chapter-wide" data-chapter-index="6">
          <section className="journey-panel wide-panel paper-panel sourcing-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="07" label={copy.sourcing.sectionTitle} location={`${destinations[6].location.city} · ${destinations[6].location.country}`} />
              <CatalogueHeading kicker={copy.sourcing.sectionTitle} title={copy.sourcing.title} />
              <p className="section-intro" data-scene-item>{copy.sourcing.intro}</p>
              <SourcingSteps steps={copy.sourcing.steps.slice(0, 3)} start={1} />
            </div>
          </section>
        </article>

        <article id="sourcing-suite" className="journey-chapter chapter-left chapter-wide" data-chapter-index="7">
          <section className="journey-panel wide-panel green-panel sourcing-page sourcing-dark" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="08" label={copy.sourcing.sectionTitle} location={`${destinations[7].location.city} · ${destinations[7].location.country}`} />
              <CatalogueHeading kicker={copy.sourcing.sectionTitle} title={copy.sourcing.sectionTitle} />
              <SourcingSteps steps={copy.sourcing.steps.slice(3)} start={4} />
              <p className="sourcing-closing" data-scene-item>{copy.sourcing.closing}</p>
            </div>
          </section>
        </article>

        <article id="turkiye" className="journey-chapter chapter-right" data-chapter-index="8">
          <section className="journey-panel paper-panel turkiye-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="09" label={copy.turkiye.sectionTitle} location={`${destinations[8].location.city} · ${destinations[8].location.country}`} />
              <CatalogueHeading kicker={copy.turkiye.sectionTitle} title={copy.turkiye.title} />
              <div className="turkiye-services">{copy.turkiye.items.map((service, index) => <article key={service.title}><img src={service.image} alt="" width="460" height="460" loading="lazy" decoding="async" data-scene-item /><div data-scene-item><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.details.join(" · ")}</p></div></article>)}</div>
            </div>
          </section>
        </article>

        <article id="pont" className="journey-chapter chapter-left" data-chapter-index="9">
          <section className="journey-panel green-panel bridge-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="10" label={copy.bridge.sectionTitle} location={`${destinations[9].location.city} · ${destinations[9].location.country}`} />
              <CatalogueHeading kicker={copy.bridge.sectionTitle} title={copy.bridge.title} />
              <div className="bridge-markets"><article data-scene-item><h3>{copy.bridge.turkiyeTitle}</h3><ul>{copy.bridge.turkiyeItems.map((item) => <li key={item}>{item}</li>)}</ul></article><i aria-hidden="true" data-scene-item><span>TR</span><b>↔</b><span>AF</span></i><article data-scene-item><h3>{copy.bridge.africaTitle}</h3><ul>{copy.bridge.africaItems.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
              <p className="bridge-body" data-scene-item>{copy.bridge.body}</p>
              <div className="bridge-pillars">{copy.bridge.pillars.map((pillar) => <strong key={pillar} data-scene-item>→ {pillar}</strong>)}</div>
              <p className="bridge-signature" data-scene-item>{copy.bridge.signature}</p>
            </div>
          </section>
        </article>

        <article id="ensemble" className="journey-chapter chapter-closing" data-chapter-index="10" aria-label={copy.closing.title}>
          <div data-orbit-content><div className="scene-track closing-track" data-scene-track><PageMark number="11" label={copy.closing.title} location={`${destinations[10].location.city} · ${destinations[10].location.country}`} /><h2 data-scene-item>{copy.closing.title}</h2></div></div>
        </article>

        <article id="contact" className="journey-chapter chapter-wide chapter-contact" data-chapter-index="11">
          <section className="journey-panel contact-panel paper-panel contact-page" data-orbit-content>
            <div className="scene-track" data-scene-track>
              <PageMark number="12" label={copy.contact.cta} location={`${destinations[11].location.city} · ${destinations[11].location.country}`} />
              <div className="contact-brandline" data-scene-item><strong>TURKANOR CORPORATION</strong><span>{copy.contact.bridge}</span></div>
              <p className="contact-ecosystem" data-scene-item>{copy.contact.ecosystem.join(" · ")}</p>
              <div className="contact-layout">
                <div className="contact-copy"><p data-scene-item>{copy.contact.eyebrow}</p><h2 data-scene-item>{copy.contact.title}</h2><strong data-scene-item>{copy.contact.body}</strong><h3 data-scene-item>{copy.contact.cta}</h3><div className="contact-actions"><a href="https://wa.me/905368935945" target="_blank" rel="noreferrer" data-scene-item>{copy.contact.whatsapp}<span>↗</span></a><a href="mailto:turkanorcorporation@gmail.com" data-scene-item>{copy.contact.email}<span>↗</span></a></div><dl className="contact-list"><div data-scene-item><dt>Türkiye</dt><dd><a href="tel:+905368935945">+90 (536) 893 59 45</a></dd></div><div data-scene-item><dt>Guinée · Conakry</dt><dd><a href="tel:+224629018494">+224 629 018 494</a></dd></div><div data-scene-item><dt>Côte d’Ivoire</dt><dd><a href="tel:+2250719705470">+225 071 970 54 70</a></dd></div><div data-scene-item><dt>Mali</dt><dd><a href="tel:+22383653701">+223 83 65 37 01</a></dd></div></dl></div>
              </div>
              <footer className="catalogue-footer"><strong data-scene-item>{copy.contact.footerTitle}</strong><p data-scene-item>{copy.contact.footerLine}</p><span data-scene-item>© {new Date().getFullYear()}</span></footer>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
