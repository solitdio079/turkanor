import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { content, type Language } from "~/data/worldContent";

const languagePaths: Record<Language, string> = { fr: "/", en: "/en", tr: "/tr" };

export function SiteHeader({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const copy = content[language];
  const links = [
    [copy.navigation.about, "#a-propos"],
    [copy.navigation.services, "#services"],
    [copy.navigation.bridge, "#pont"],
    [copy.navigation.contact, "#contact"],
  ] as const;

  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    if (window.location.hash !== href) window.history.pushState(null, "", href);

    // Wait for the fixed mobile menu to release the page before beginning the
    // globe journey. A native anchor jump can otherwise land halfway inside a
    // pinned scene while body scrolling is still locked.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const refreshedTarget = document.querySelector<HTMLElement>(href);
      if (!refreshedTarget) return;
      window.scrollTo({
        top: refreshedTarget.getBoundingClientRect().top + window.scrollY,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = mobileNavigation.current?.querySelectorAll<HTMLElement>("a[href]");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const focusFrame = requestAnimationFrame(() => first?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <a href="#accueil" className="brand" aria-label="TURKANOR Corporation">
        <span className="brand-mark"><img src="/images/turkanor-logo.webp" width="320" height="320" alt="" /></span>
        <span><strong>TURKANOR</strong><small>CORPORATION</small></span>
      </a>

      <nav className="desktop-nav" aria-label={copy.navigation.menu}>
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>

      <div className="header-tools">
        <nav className="language-switcher" aria-label={copy.interface.changeLanguage}>
          {(Object.keys(languagePaths) as Language[]).map((item) => (
            <Link key={item} to={languagePaths[item]} aria-current={item === language ? "page" : undefined}>
              {item.toUpperCase()}
            </Link>
          ))}
        </nav>
        <a className="header-cta" href="#contact">{copy.navigation.project}<span>↗</span></a>
      </div>

      <button
        ref={toggle}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? copy.interface.closeMenu : copy.interface.openMenu}</span>
        <i /><i />
      </button>

      <nav
        ref={mobileNavigation}
        id="mobile-navigation"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label={copy.navigation.menu}
        aria-hidden={!open}
      >
        <p>{copy.navigation.menu}</p>
        {links.map(([label, href], index) => (
          <a key={href} href={href} onClick={(event) => navigateFromMenu(event, href)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{label}
          </a>
        ))}
        <div className="mobile-languages">
          {(Object.keys(languagePaths) as Language[]).map((item) => (
            <Link key={item} to={languagePaths[item]} aria-current={item === language ? "page" : undefined}>
              {item.toUpperCase()}
            </Link>
          ))}
        </div>
        <a className="mobile-contact" href="https://wa.me/905368935945" target="_blank" rel="noreferrer">
          WhatsApp <span>↗</span>
        </a>
      </nav>
    </header>
  );
}
