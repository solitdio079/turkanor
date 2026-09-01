import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { content, getDestinations, type Language, type SiteContent } from "~/data/worldContent";
import { ServiceIcon } from "./ServiceIcon";

const GlobeScene = lazy(() =>
  import("~/components/GlobeScene").then(({ GlobeScene }) => ({ default: GlobeScene })),
);

type ServiceJourneyProps = { language: Language };

function PageMark({ number, label }: { number: string; label: string }) {
  return <div className="page-mark"><span>{number}</span><p>{label}</p><i aria-hidden="true" /></div>;
}

function CatalogueHeading({ kicker, title }: { kicker: string; title: string }) {
  return <header className="catalogue-heading"><p>{kicker}</p><h2>{title}</h2></header>;
}

function ServiceRows({ items, start }: { items: SiteContent["solutions"]["items"]; start: number }) {
  return (
    <div className="service-rows">
      {items.map((service, index) => (
        <article className="service-row" key={service.id} data-reveal>
          <div className="service-row-number">{String(start + index).padStart(2, "0")}</div>
          <div className="service-row-icon"><ServiceIcon name={service.icon} /></div>
          <div className="service-row-copy"><h3>{service.title}</h3><p>{service.description}</p></div>
          {service.image && <img src={service.image} alt="" loading="lazy" decoding="async" />}
        </article>
      ))}
    </div>
  );
}

function SourcingSteps({ steps, start }: { steps: SiteContent["sourcing"]["steps"]; start: number }) {
  return (
    <div className="sourcing-steps">
      {steps.map((step, index) => (
        <article className="sourcing-step" key={step.title} data-reveal>
          <img src={step.image} alt="" loading="lazy" decoding="async" />
          <div><span>{String(start + index).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></div>
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
      const chapters = gsap.utils.toArray<HTMLElement>(".journey-chapter", root.current);

      context = gsap.context(() => {
        chapters.forEach((chapter, index) => {
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => setActiveChapter(index),
            onEnterBack: () => setActiveChapter(index),
            onUpdate: (self) => {
              globeProgress.current = Math.min(1, (index + self.progress) / chapters.length);
            },
          });

          if (reduced || index === 0) return;
          const panel = chapter.querySelector<HTMLElement>("[data-orbit-content]");
          if (!panel) return;
          const fromLeft = chapter.classList.contains("chapter-left");
          gsap.fromTo(panel,
            { opacity: .32, x: fromLeft ? -44 : 44, y: 44, scale: .975 },
            { opacity: 1, x: 0, y: 0, scale: 1, ease: "power3.out", scrollTrigger: { trigger: chapter, start: "top 88%", end: "top 40%", scrub: .8 } },
          );
        });

        if (!reduced) {
          gsap.timeline({ scrollTrigger: { trigger: ".chapter-hero", start: "top top", end: "bottom bottom", scrub: 1 } })
            .fromTo(".journey-trade-model", { scale: .74, xPercent: 7, yPercent: 7, opacity: 1 }, { scale: 1.08, xPercent: 0, yPercent: 0, duration: .24, ease: "none" })
            .to("[data-hero-copy]", { opacity: 0, y: -70, duration: .13 }, .13)
            .to(".journey-globe", { opacity: 1, scale: 1, duration: .2, ease: "power2.out" }, .22)
            .to(".journey-trade-model", { scale: 2.35, xPercent: -13, yPercent: 3, duration: .29, ease: "power1.in" }, .25)
            .to(".journey-trade-model", { scale: 6.4, xPercent: -33, yPercent: -2, opacity: 0, filter: "blur(10px)", duration: .34, ease: "power2.in" }, .53)
            .fromTo(".journey-entry-copy", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .14 }, .66)
            .to(".journey-entry-copy", { opacity: 0, y: -24, duration: .12 }, .86);
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current).forEach((element) => {
          if (reduced) return;
          gsap.fromTo(element, { opacity: .35, y: 34 }, { opacity: 1, y: 0, duration: .75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 91%", once: true } });
        });
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
            <GlobeScene destinations={destinations} activeIndex={activeChapter} progressRef={globeProgress} mode="journey" />
          </Suspense>
        </div>
        <img className="journey-trade-model" src="/images/catalogue/turkanor-trade-layers-v1.webp" alt="" width="1536" height="1024" />
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
            <PageMark number="02" label={copy.about.title} />
            <div className="about-editorial">
              <div><CatalogueHeading kicker="02" title={copy.about.title} />{copy.about.paragraphs.map((paragraph, index) => <p className={index === 0 ? "about-lead" : ""} key={paragraph}>{paragraph}</p>)}</div>
              <aside className="domains-block"><h3>{copy.about.domainsTitle}</h3><ol>{copy.about.domains.map((domain) => <li key={domain}>{domain}</li>)}</ol></aside>
            </div>
          </section>
        </article>

        <article id="direction" className="journey-chapter chapter-right" data-chapter-index="2">
          <section className="journey-panel paper-panel manager-page" data-orbit-content>
            <PageMark number="03" label={copy.manager.title} />
            <CatalogueHeading kicker="03" title={copy.manager.title} />
            <div className="manager-layout"><div className="manager-signature"><span>03</span><strong>{copy.manager.name}</strong><small>TURKANOR Corporation</small></div><blockquote>{copy.manager.quote}</blockquote></div>
            <div className="manager-solutions"><h3>{copy.manager.solutionsTitle}</h3>{copy.manager.solutions.map((solution) => <article key={solution.title}><strong>{solution.title}</strong><p>{solution.description}</p></article>)}</div>
          </section>
        </article>

        <article id="services" className="journey-chapter chapter-left chapter-wide" data-chapter-index="3">
          <section className="journey-panel wide-panel paper-panel solutions-page" data-orbit-content>
            <PageMark number="04" label={copy.solutions.sectionTitle} />
            <CatalogueHeading kicker={copy.solutions.sectionTitle} title={copy.solutions.title} />
            <p className="section-intro">{copy.solutions.intro}</p>
            <ServiceRows items={copy.solutions.items.slice(0, 4)} start={1} />
          </section>
        </article>

        <article className="journey-chapter chapter-right chapter-wide" data-chapter-index="4">
          <section className="journey-panel wide-panel paper-panel solutions-continuation" data-orbit-content>
            <PageMark number="05" label={copy.solutions.sectionTitle} />
            <ServiceRows items={copy.solutions.items.slice(4)} start={5} />
            <figure className="trade-development-image"><img src="/images/catalogue/business-development.webp" alt="" width="1850" height="1800" loading="lazy" decoding="async" /></figure>
          </section>
        </article>

        <article id="secteurs" className="journey-chapter chapter-left chapter-wide" data-chapter-index="5">
          <section className="journey-panel wide-panel green-panel sectors-page" data-orbit-content>
            <PageMark number="06" label={copy.sectors.sectionTitle} />
            <CatalogueHeading kicker={copy.sectors.sectionTitle} title={copy.sectors.title} />
            <div className="sectors-layout"><div className="sectors-list">{copy.sectors.items.map((sector, index) => <article key={sector.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{sector.title}</h3><p>{sector.details.join(" · ")}</p></article>)}</div><img src="/images/catalogue/sectors-neutral.webp" alt="" width="700" height="1500" loading="lazy" decoding="async" /></div>
            <p className="sector-footnote">{copy.sectors.footnote}</p>
          </section>
        </article>

        <article id="sourcing" className="journey-chapter chapter-right chapter-wide" data-chapter-index="6">
          <section className="journey-panel wide-panel paper-panel sourcing-page" data-orbit-content>
            <PageMark number="07" label={copy.sourcing.sectionTitle} />
            <CatalogueHeading kicker={copy.sourcing.sectionTitle} title={copy.sourcing.title} />
            <p className="section-intro">{copy.sourcing.intro}</p>
            <SourcingSteps steps={copy.sourcing.steps.slice(0, 3)} start={1} />
          </section>
        </article>

        <article className="journey-chapter chapter-left chapter-wide" data-chapter-index="7">
          <section className="journey-panel wide-panel green-panel sourcing-page sourcing-dark" data-orbit-content>
            <PageMark number="08" label={copy.sourcing.sectionTitle} />
            <CatalogueHeading kicker={copy.sourcing.sectionTitle} title={copy.sourcing.sectionTitle} />
            <SourcingSteps steps={copy.sourcing.steps.slice(3)} start={4} />
            <p className="sourcing-closing">{copy.sourcing.closing}</p>
          </section>
        </article>

        <article id="turkiye" className="journey-chapter chapter-right" data-chapter-index="8">
          <section className="journey-panel paper-panel turkiye-page" data-orbit-content>
            <PageMark number="09" label={copy.turkiye.sectionTitle} />
            <CatalogueHeading kicker={copy.turkiye.sectionTitle} title={copy.turkiye.title} />
            <div className="turkiye-services">{copy.turkiye.items.map((service, index) => <article key={service.title}><img src={service.image} alt="" width="460" height="460" loading="lazy" decoding="async" /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.details.join(" · ")}</p></div></article>)}</div>
          </section>
        </article>

        <article id="pont" className="journey-chapter chapter-left" data-chapter-index="9">
          <section className="journey-panel green-panel bridge-page" data-orbit-content>
            <PageMark number="10" label={copy.bridge.sectionTitle} />
            <CatalogueHeading kicker={copy.bridge.sectionTitle} title={copy.bridge.title} />
            <div className="bridge-markets"><article><h3>{copy.bridge.turkiyeTitle}</h3><ul>{copy.bridge.turkiyeItems.map((item) => <li key={item}>{item}</li>)}</ul></article><i aria-hidden="true"><span>TR</span><b>↔</b><span>AF</span></i><article><h3>{copy.bridge.africaTitle}</h3><ul>{copy.bridge.africaItems.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
            <p className="bridge-body">{copy.bridge.body}</p>
            <div className="bridge-pillars">{copy.bridge.pillars.map((pillar) => <strong key={pillar}>→ {pillar}</strong>)}</div>
            <p className="bridge-signature">{copy.bridge.signature}</p>
          </section>
        </article>

        <article id="ensemble" className="journey-chapter chapter-closing" data-chapter-index="10" aria-label={copy.closing.title}>
          <div data-orbit-content><PageMark number="11" label={copy.closing.title} /><h2>{copy.closing.title}</h2></div>
        </article>

        <article id="contact" className="journey-chapter chapter-wide chapter-contact" data-chapter-index="11">
          <section className="journey-panel contact-panel paper-panel contact-page" data-orbit-content>
            <PageMark number="12" label={copy.contact.cta} />
            <div className="contact-brandline"><strong>TURKANOR CORPORATION</strong><span>{copy.contact.bridge}</span></div>
            <p className="contact-ecosystem">{copy.contact.ecosystem.join(" · ")}</p>
            <div className="contact-layout">
              <div className="contact-copy"><p>{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><strong>{copy.contact.body}</strong><h3>{copy.contact.cta}</h3><div className="contact-actions"><a href="https://wa.me/905368935945" target="_blank" rel="noreferrer">{copy.contact.whatsapp}<span>↗</span></a><a href="mailto:turkanorcorporation@gmail.com">{copy.contact.email}<span>↗</span></a></div><dl className="contact-list"><div><dt>Türkiye</dt><dd><a href="tel:+905368935945">+90 (536) 893 59 45</a></dd></div><div><dt>Guinée · Conakry</dt><dd><a href="tel:+224629018494">+224 629 018 494</a></dd></div><div><dt>Côte d’Ivoire</dt><dd><a href="tel:+2250719705470">+225 071 970 54 70</a></dd></div><div><dt>Mali</dt><dd><a href="tel:+22383653701">+223 83 65 37 01</a></dd></div></dl></div>
              <form className="project-form" name="project-request" method="POST" data-netlify="true">
                <input type="hidden" name="form-name" value="project-request" />
                <label><span>{copy.contact.form.name}</span><input name="name" autoComplete="name" required /></label>
                <label><span>{copy.contact.form.company}</span><input name="company" autoComplete="organization" /></label>
                <label><span>{copy.contact.form.country}</span><input name="country" autoComplete="country-name" required /></label>
                <label><span>{copy.contact.form.phone}</span><input name="phone" type="tel" autoComplete="tel" required /></label>
                <label className="form-wide"><span>{copy.contact.form.email}</span><input name="email" type="email" autoComplete="email" required /></label>
                <label className="form-wide"><span>{copy.contact.form.service}</span><select name="service" defaultValue="" required><option value="" disabled>{copy.contact.form.choose}</option>{copy.solutions.items.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>
                <label className="form-wide"><span>{copy.contact.form.description}</span><textarea name="description" rows={4} required /></label>
                <button className="form-submit form-wide" type="submit">{copy.contact.form.submit}<span>↗</span></button>
              </form>
            </div>
            <footer className="catalogue-footer"><strong>{copy.contact.footerTitle}</strong><p>{copy.contact.footerLine}</p><span>© {new Date().getFullYear()}</span></footer>
          </section>
        </article>
      </div>
    </section>
  );
}
