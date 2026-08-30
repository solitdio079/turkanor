import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  content,
  getDestinations,
  type Language,
  type LocalizedService,
  type SiteContent,
} from "~/data/worldContent";
import { ServiceIcon } from "./ServiceIcon";

const GlobeScene = lazy(() =>
  import("~/components/GlobeScene").then(({ GlobeScene }) => ({ default: GlobeScene })),
);

type ServiceJourneyProps = { language: Language };

function EditorialImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="story-image">
      <img src={src} alt={alt} width="1536" height="1024" loading="lazy" decoding="async" />
      <span aria-hidden="true">TURKANOR / CATALOGUE 2026</span>
    </figure>
  );
}

function ServiceSheet({ service, index }: { service: LocalizedService; index: number }) {
  return (
    <div className="story-sheet service-sheet" data-orbit-content data-native-scroll tabIndex={0}>
      <div className="sheet-kicker">
        <span>DOSSIER {service.number}</span>
        <p>{service.location.city} / {service.location.code}</p>
        <i><ServiceIcon name={service.icon} /></i>
      </div>
      <EditorialImage src={service.image} alt="" />
      <h2>{service.title}</h2>
      <p className="sheet-lead">{service.description}</p>
      <ul className="service-list">
        {service.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <a className="sheet-action" href="#contact">
        {service.cta} <span>↗</span>
      </a>
      <div className="sheet-route" aria-hidden="true">
        <span>{index % 2 === 0 ? "TR" : "AFR"}</span><i /><span>{index % 2 === 0 ? "AFR" : "TR"}</span>
      </div>
    </div>
  );
}

function AboutSheet({ copy }: { copy: SiteContent["about"] }) {
  const notes = [copy.mission, copy.vision, copy.approach, copy.team];
  return (
    <div className="story-sheet about-sheet" data-orbit-content data-native-scroll tabIndex={0}>
      <p className="story-code">{copy.eyebrow}</p>
      <h2>{copy.title} <em>{copy.accent}</em></h2>
      <div className="about-layout">
        <EditorialImage src="/images/catalogue/general-manager.webp" alt="Mohamed A. Diawara, General Manager de TURKANOR Corporation" />
        <div className="about-copy">
          {copy.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <div className="about-notes">
        {notes.map(([title, description], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function RegionsSheet({
  kind,
  copy,
  image,
}: {
  kind: "turkiye" | "africa";
  copy: SiteContent["turkiye"] | SiteContent["africa"];
  image: string;
}) {
  const markers = kind === "turkiye" && "cities" in copy ? copy.cities : "regions" in copy ? copy.regions : [];
  return (
    <div className={`story-sheet region-sheet region-${kind}`} data-orbit-content data-native-scroll tabIndex={0}>
      <p className="story-code">{copy.eyebrow}</p>
      <h2>{copy.title} <em>{copy.accent}</em></h2>
      <EditorialImage src={image} alt="" />
      {copy.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
      <div className="region-markers">
        {markers.map((marker, index) => (
          <span key={marker}><i />{String(index + 1).padStart(2, "0")} — {marker}</span>
        ))}
      </div>
      {copy.items && <div className="region-capabilities">{copy.items.map((item) => <span key={item}>{item}</span>)}</div>}
    </div>
  );
}

export function ServiceJourney({ language }: ServiceJourneyProps) {
  const root = useRef<HTMLElement>(null);
  const globeProgress = useRef(0);
  const destinations = useMemo(() => getDestinations(language), [language]);
  const copy = content[language];
  const [activeChapter, setActiveChapter] = useState(0);

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
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const chapters = gsap.utils.toArray<HTMLElement>(".orbit-chapter", root.current);

      context = gsap.context(() => {
        chapters.forEach((chapter, index) => {
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => setActiveChapter(index),
            onEnterBack: () => setActiveChapter(index),
            onUpdate: (self) => {
              globeProgress.current = Math.min(1, (index + self.progress) / Math.max(1, chapters.length - 1));
            },
          });

          if (!reduced) {
            const panel = chapter.querySelector<HTMLElement>("[data-orbit-content]");
            if (!panel) return;
            gsap.timeline({
              scrollTrigger: {
                trigger: chapter,
                start: "top 92%",
                end: "bottom 8%",
                scrub: 1,
              },
            })
              .fromTo(
                panel,
                { y: 26, scale: 0.985 },
                { y: 0, scale: 1, ease: "power3.out", duration: 0.28 },
              )
              .to(panel, {
                y: -20,
                scale: 0.992,
                ease: "power2.in",
                duration: 0.2,
              }, 0.8);
          }
        });
        ScrollTrigger.refresh();
      }, root);
    }

    void startMotion();
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [language]);

  useEffect(() => {
    const panels = root.current?.querySelectorAll<HTMLElement>("[data-native-scroll]");
    if (!panels) return;

    const cleanups = Array.from(panels, (panel) => {
      const handleWheel = (event: WheelEvent) => {
        const maximum = panel.scrollHeight - panel.clientHeight;
        if (maximum <= 1) return;

        const movingDown = event.deltaY > 0;
        const canMoveDown = panel.scrollTop < maximum - 1;
        const canMoveUp = panel.scrollTop > 1;

        // Keep the journey fixed while this panel still has content in the
        // requested direction. At either edge the event reaches Lenis again,
        // allowing the visitor to continue to the next/previous chapter.
        if ((movingDown && canMoveDown) || (!movingDown && canMoveUp)) {
          event.stopPropagation();
        }
      };

      panel.addEventListener("wheel", handleWheel, { passive: true });
      return () => panel.removeEventListener("wheel", handleWheel);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [language]);

  const scrollToChapter = (index: number) => {
    document.querySelector<HTMLElement>(`[data-chapter-index="${index}"]`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  };

  const selectDestination = (index: number) => {
    setActiveChapter(index);
    scrollToChapter(index);
  };

  const current = destinations[activeChapter] ?? destinations[0];
  const nextChapter = Math.min(activeChapter + 1, destinations.length - 1);

  return (
    <section id="accueil" ref={root} className="world-experience">
      <div className="orbit-journey">
        <div className="orbit-sticky">
          <div className="catalogue-backdrop" aria-hidden="true" />
          <div className="orbit-atmosphere" />
          <div className="orbit-globe">
            <Suspense fallback={<div className="globe-fallback" aria-hidden="true" />}>
              <GlobeScene
                destinations={destinations}
                activeIndex={activeChapter}
                progressRef={globeProgress}
                mode="journey"
                onSelectIndex={selectDestination}
              />
            </Suspense>
          </div>

          <div className="orbit-coordinate coordinate-ist">
            <span>{copy.interface.network}</span>
            <strong>TR · 39.0000° N</strong>
          </div>
          <div className="orbit-coordinate coordinate-afr">
            <span>{copy.interface.choosePoint}</span>
            <strong>AFR · 17.5707° W</strong>
          </div>

          <div className="orbit-readout" aria-live="polite">
            <span>{String(activeChapter + 1).padStart(2, "0")} / {destinations.length}</span>
            <div>
              <strong>{current.location.city} · {current.location.code}</strong>
              <small>{current.label}</small>
            </div>
            {activeChapter < destinations.length - 1 && (
              <button type="button" onClick={() => scrollToChapter(nextChapter)}>
                {copy.interface.next} <i>↗</i>
              </button>
            )}
          </div>

          <nav className="orbit-dots" aria-label={copy.interface.choosePoint}>
            {destinations.map((destination, index) => (
              <button
                key={destination.id}
                type="button"
                className={activeChapter === index ? "active" : ""}
                aria-label={`${destination.number} — ${destination.label}`}
                onClick={() => selectDestination(index)}
              >
                <span>{destination.number}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="orbit-chapters">
          <article className="orbit-chapter chapter-prologue" data-chapter-index="0">
            <div className="world-prologue" data-orbit-content>
              <p className="eyebrow"><span />{copy.hero.eyebrow}</p>
              <h1><span>{copy.hero.title}</span><em>{copy.hero.accent}</em></h1>
              <p>{copy.hero.body}</p>
              <div className="prologue-actions">
                <button type="button" className="button button-red" onClick={() => scrollToChapter(2)}>
                  {copy.hero.servicesCta} <span>↓</span>
                </button>
                <button type="button" className="text-button" onClick={() => scrollToChapter(destinations.length - 1)}>
                  {copy.hero.projectCta} <span>↗</span>
                </button>
              </div>
              <small>{copy.hero.hint}</small>
            </div>
          </article>

          <article id="a-propos" className="orbit-chapter chapter-right chapter-about" data-chapter-index="1">
            <AboutSheet copy={copy.about} />
          </article>

          {copy.services.map((service, index) => (
            <article
              id={service.id}
              key={service.id}
              className={`orbit-chapter ${index % 2 === 0 ? "chapter-left" : "chapter-right"}`}
              data-chapter-index={index + 2}
            >
              {index === 0 && <span id="services" className="chapter-anchor" />}
              <ServiceSheet service={service} index={index} />
            </article>
          ))}

          <article id="secteurs" className="orbit-chapter chapter-left chapter-sectors" data-chapter-index="6">
            <div className="story-sheet sectors-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.sectors.eyebrow}</p>
              <h2>{copy.sectors.title} <em>{copy.sectors.accent}</em></h2>
              <EditorialImage src="/images/catalogue/sectors-neutral.webp" alt="" />
              {copy.sectors.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
              <div className="sector-list">
                {copy.sectors.items?.map((item, index) => (
                  <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>
                ))}
              </div>
            </div>
          </article>

          <article id="turkiye" className="orbit-chapter chapter-right" data-chapter-index="7">
            <RegionsSheet kind="turkiye" copy={copy.turkiye} image="/images/catalogue/turkiye-bridge.webp" />
          </article>

          <article id="afrique" className="orbit-chapter chapter-left" data-chapter-index="8">
            <RegionsSheet kind="africa" copy={copy.africa} image="/images/catalogue/turkiye-africa.webp" />
          </article>

          <article id="projets" className="orbit-chapter chapter-right chapter-projects" data-chapter-index="9">
            <div className="story-sheet projects-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.projects.eyebrow}</p>
              <h2>{copy.projects.title} <em>{copy.projects.accent}</em></h2>
              <EditorialImage src="/images/catalogue/sourcing-neutral.webp" alt="" />
              {copy.projects.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
              <div className="project-fields">
                {copy.projects.fields.map((field) => <span key={field}>{field}</span>)}
              </div>
              <div className="project-types">{copy.projects.items?.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </article>

          <article id="partenaires" className="orbit-chapter chapter-left chapter-partners" data-chapter-index="10">
            <div className="story-sheet partners-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.partners.eyebrow}</p>
              <h2>{copy.partners.title} <em>{copy.partners.accent}</em></h2>
              <EditorialImage src="/images/catalogue/partnership.webp" alt="" />
              {copy.partners.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
              <div className="partner-placeholders" aria-label={copy.navigation.partners}>
                {copy.projects.items?.slice(0, 5).map((partner) => <span key={partner}>{partner}</span>)}
              </div>
            </div>
          </article>

          <article id="pourquoi" className="orbit-chapter chapter-right chapter-values" data-chapter-index="11">
            <div className="story-sheet values-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.why.eyebrow}</p>
              <h2>{copy.why.title} <em>{copy.why.accent}</em></h2>
              {copy.why.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
              <div className="story-values">
                {copy.why.values.map(([title, description], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </article>

          <article id="methode" className="orbit-chapter chapter-left chapter-method" data-chapter-index="12">
            <div className="story-sheet method-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.method.eyebrow}</p>
              <h2>{copy.method.title} <em>{copy.method.accent}</em></h2>
              {copy.method.body.map((paragraph) => <p className="sheet-lead" key={paragraph}>{paragraph}</p>)}
              <ol>
                {copy.method.steps.map(([title, description], index) => (
                  <li key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{title}</strong><p>{description}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <article id="contact" className="orbit-chapter chapter-right chapter-contact" data-chapter-index="13">
            <div className="story-sheet contact-sheet" data-orbit-content data-native-scroll tabIndex={0}>
              <p className="story-code">{copy.contact.eyebrow}</p>
              <h2>{copy.contact.title} <em>{copy.contact.accent}</em></h2>
              <p className="sheet-lead">{copy.contact.body}</p>
              <div className="contact-columns">
                <div>
                  <div className="story-contact-actions">
                    <a href="https://wa.me/905368935945" target="_blank" rel="noreferrer">{copy.contact.whatsapp}<span>↗</span></a>
                    <a href="mailto:turkanorcorporation@gmail.com">{copy.contact.email}<span>↗</span></a>
                  </div>
                  <dl className="contact-list">
                    <div><dt>Türkiye</dt><dd><a href="tel:+905368935945">+90 (536) 893 59 45</a></dd></div>
                    <div><dt>Guinée · Conakry</dt><dd><a href="tel:+224629018494">+224 629 018 494</a></dd></div>
                    <div><dt>Côte d’Ivoire</dt><dd><a href="tel:+2250719705470">+225 071 970 54 70</a></dd></div>
                    <div><dt>Mali</dt><dd><a href="tel:+22383653701">+223 83 65 37 01</a></dd></div>
                  </dl>
                </div>

                <form className="project-form" name="project-request" method="POST" data-netlify="true">
                  <input type="hidden" name="form-name" value="project-request" />
                  <label><span>{copy.contact.form.name}</span><input name="name" autoComplete="name" required /></label>
                  <label><span>{copy.contact.form.company}</span><input name="company" autoComplete="organization" /></label>
                  <label><span>{copy.contact.form.country}</span><input name="country" autoComplete="country-name" required /></label>
                  <label><span>{copy.contact.form.phone}</span><input name="phone" type="tel" autoComplete="tel" required /></label>
                  <label className="form-wide"><span>{copy.contact.form.email}</span><input name="email" type="email" autoComplete="email" required /></label>
                  <label className="form-wide">
                    <span>{copy.contact.form.service}</span>
                    <select name="service" defaultValue="" required>
                      <option value="" disabled>{copy.contact.form.choose}</option>
                      {copy.services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
                    </select>
                  </label>
                  <label className="form-wide"><span>{copy.contact.form.description}</span><textarea name="description" rows={3} required /></label>
                  <button className="form-submit form-wide" type="submit">{copy.contact.form.submit}<span>↗</span></button>
                </form>
              </div>
              <footer className="contact-footer"><strong>TURKANOR CORPORATION</strong><span>© {new Date().getFullYear()}</span></footer>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
