import type { Route } from "./+types/home";
import { ServiceJourney } from "~/components/ServiceJourney";
import { SiteHeader } from "~/components/SiteHeader";
import { SmoothScroll } from "~/components/SmoothScroll";
import { content, languageFromParam } from "~/data/worldContent";

export async function loader({ params }: Route.LoaderArgs) {
  if (params.lang && params.lang !== "fr" && params.lang !== "en" && params.lang !== "tr") {
    throw new Response("Not found", { status: 404 });
  }
  return { language: languageFromParam(params.lang) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const language = loaderData?.language ?? "fr";
  const seo = content[language].seo;
  return [
    { title: seo.title },
    {
      name: "description",
      content: seo.description,
    },
    { property: "og:title", content: seo.title },
    {
      property: "og:description",
      content: seo.description,
    },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: language === "tr" ? "tr_TR" : language === "en" ? "en_US" : "fr_FR" },
    { property: "og:site_name", content: "TURKANOR Corporation" },
    { property: "og:image", content: "/images/turkanor-logo.webp" },
    { property: "og:image:width", content: "320" },
    { property: "og:image:height", content: "320" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: seo.title,
    },
    {
      name: "twitter:description",
      content: seo.description,
    },
    { name: "twitter:image", content: "/images/turkanor-logo.webp" },
    { name: "theme-color", content: "#031f17" },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { tagName: "link", rel: "alternate", hrefLang: "fr", href: "/" },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: "/en" },
    { tagName: "link", rel: "alternate", hrefLang: "tr", href: "/tr" },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: "/" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { language } = loaderData;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TURKANOR Corporation",
    slogan: "From Trade to Transformation",
    areaServed: ["Türkiye", "Africa"],
    email: "turkanorcorporation@gmail.com",
    telephone: "+90 536 893 59 45",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+90 536 893 59 45",
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: ["French", "English", "Turkish"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+225 071 970 54 70",
        contactType: "customer service",
        areaServed: "CI",
        availableLanguage: "French",
      },
      {
        "@type": "ContactPoint",
        telephone: "+224 629 018 494",
        contactType: "customer service",
        areaServed: "GN",
        availableLanguage: "French",
      },
      {
        "@type": "ContactPoint",
        telephone: "+223 83 65 37 01",
        contactType: "customer service",
        areaServed: "ML",
        availableLanguage: "French",
      },
    ],
    knowsAbout: [
      "Sourcing",
      "Import-export",
      "Représentation commerciale",
      "Développement commercial B2B",
      "Projets industriels",
      "Business travel",
      "Études en Türkiye",
      "Services médicaux en Türkiye",
    ],
  };

  return (
    <>
      <SmoothScroll />
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader language={language} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main id="contenu">
        <ServiceJourney language={language} />
      </main>

      <a
        className="floating-whatsapp"
        href="https://wa.me/905368935945"
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter TURKANOR sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2a9.84 9.84 0 0 0-8.4 14.96L2.05 22l5.18-1.5A9.9 9.9 0 1 0 12.04 2Zm0 17.94a8.04 8.04 0 0 1-4.1-1.12l-.3-.18-3.07.9.93-2.99-.2-.31a8.06 8.06 0 1 1 6.74 3.7Zm4.42-6.03c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.27 7.27 0 0 1-1.34-1.67c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
          />
        </svg>
      </a>
    </>
  );
}
