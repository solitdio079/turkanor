import type { ServiceIcon } from "./services";

export type Language = "fr" | "en" | "tr";

export type Location = {
  city: string;
  country: string;
  code: string;
  lat: number;
  lon: number;
};

export type CatalogueService = {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  image?: string;
};

type CatalogueStep = { title: string; description: string; image: string };
type Sector = { title: string; details: string[] };
type TurkiyeService = { title: string; details: string[]; image: string };

export type SiteContent = {
  seo: { title: string; description: string };
  navigation: {
    home: string; about: string; services: string; sectors: string; sourcing: string;
    turkiye: string; bridge: string; contact: string; project: string; menu: string;
  };
  interface: {
    next: string; choosePoint: string; network: string; openMenu: string;
    closeMenu: string; changeLanguage: string; catalogue: string;
  };
  hero: {
    eyebrow: string; title: string; accent: string; statement: string; servicesLine: string;
    servicesCta: string; projectCta: string; hint: string;
  };
  contents: { title: string; items: Array<[string, string]> };
  about: { title: string; paragraphs: string[]; domainsTitle: string; domains: string[] };
  manager: {
    title: string; name: string; quote: string; imageAlt: string; solutionsTitle: string;
    solutions: Array<{ title: string; description: string }>;
  };
  solutions: { sectionTitle: string; title: string; intro: string; items: CatalogueService[] };
  sectors: { sectionTitle: string; title: string; items: Sector[]; footnote: string };
  sourcing: { sectionTitle: string; title: string; intro: string; steps: CatalogueStep[]; closing: string };
  turkiye: { sectionTitle: string; title: string; items: TurkiyeService[] };
  bridge: {
    sectionTitle: string; title: string; turkiyeTitle: string; turkiyeItems: string[];
    africaTitle: string; africaItems: string[]; body: string; pillars: string[]; signature: string;
  };
  closing: { title: string };
  contact: {
    bridge: string; ecosystem: string[]; eyebrow: string; title: string; body: string;
    cta: string; whatsapp: string; email: string; footerTitle: string; footerLine: string;
    form: { name: string; company: string; country: string; phone: string; email: string; service: string; description: string; choose: string; submit: string };
  };
};

const serviceMeta: Array<Pick<CatalogueService, "id" | "icon" | "image">> = [
  { id: "sourcing-international", icon: "search", image: "/images/catalogue/sourcing-neutral.webp" },
  { id: "import-export", icon: "ship", image: "/images/catalogue/logistics.webp" },
  { id: "b2b-matchmaking", icon: "network", image: "/images/catalogue/partnership.webp" },
  { id: "representation-commerciale", icon: "handshake", image: "/images/catalogue/partnership.webp" },
  { id: "business-development", icon: "industry", image: "/images/catalogue/business-development.webp" },
  { id: "negociation-suivi", icon: "verify", image: "/images/catalogue/step-negotiation.webp" },
];

function servicesFor(entries: Array<Pick<CatalogueService, "title" | "description">>): CatalogueService[] {
  return entries.map((entry, index) => ({ ...serviceMeta[index], ...entry }));
}

const sourcingImages = [
  "/images/catalogue/step-identification.webp", "/images/catalogue/step-partners.webp",
  "/images/catalogue/step-analysis.webp", "/images/catalogue/step-negotiation.webp",
  "/images/catalogue/step-production.webp", "/images/catalogue/step-logistics.webp",
];

const turkiyeImages = [
  "/images/catalogue/turkiye-business-travel.webp", "/images/catalogue/turkiye-real-estate.webp",
  "/images/catalogue/turkiye-studies.webp", "/images/catalogue/turkiye-medical.webp",
];

const fr: SiteContent = {
  seo: {
    title: "TURKANOR Corporation | Connecter la Türkiye et l'Afrique",
    description: "Sourcing, import-export, B2B, représentation et développement commercial entre la Türkiye, l'Afrique et les marchés internationaux.",
  },
  navigation: {
    home: "Accueil", about: "Qui sommes-nous ?", services: "Nos solutions", sectors: "Nos secteurs",
    sourcing: "Sourcing & Import-Export", turkiye: "Services en Türkiye", bridge: "Türkiye - Afrique",
    contact: "Contact", project: "Vous avez un projet ?", menu: "Sommaire",
  },
  interface: {
    next: "Page suivante", choosePoint: "Parcourir le catalogue", network: "Türkiye · Afrique · International",
    openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", changeLanguage: "Changer de langue", catalogue: "Catalogue 2026",
  },
  hero: {
    eyebrow: "TURKANOR Corporation", title: "Connecting", accent: "Türkiye & Africa",
    statement: "Connecter la Türkiye & l'Afrique",
    servicesLine: "Sourcing · Import & Export · B2B · Représentation commerciale · Développement commercial",
    servicesCta: "Découvrir nos solutions", projectCta: "Vous avez un projet ?",
    hint: "Faites défiler pour parcourir le catalogue TURKANOR.",
  },
  contents: {
    title: "Sommaire",
    items: [["Qui sommes-nous ?", "02"], ["Nos domaines", "02"], ["Message du General Manager", "03"], ["Nos solutions", "04 - 05"], ["Nos secteurs d'activité", "06"], ["Sourcing & Import-Export", "07 - 08"], ["Services en Türkiye", "09"], ["Türkiye - Afrique", "10 - 11"]],
  },
  about: {
    title: "Qui sommes-nous ?",
    paragraphs: [
      "TURKANOR CORPORATION facilite les échanges commerciaux et les partenariats entre la Türkiye, l'Afrique et les marchés internationaux.",
      "Nous accompagnons entreprises, entrepreneurs, investisseurs et professionnels dans leurs projets internationaux.",
    ],
    domainsTitle: "Nos domaines",
    domains: ["Sourcing international", "Import & Export", "Mise en relation B2B", "Représentation commerciale", "Développement commercial", "Négociation & suivi"],
  },
  manager: {
    title: "Message du General Manager", name: "Mohamed A. Diawara",
    quote: "Notre ambition est de construire des ponts durables entre la Türkiye et l'Afrique en transformant les opportunités commerciales en partenariats concrets.",
    imageAlt: "Mohamed A. Diawara, General Manager de TURKANOR Corporation",
    solutionsTitle: "Nos solutions",
    solutions: [
      { title: "Sourcing international", description: "Recherche de produits, fournisseurs, fabricants et usines en Türkiye." },
      { title: "Import & Export", description: "Accompagnement des opérations commerciales internationales." },
      { title: "B2B Matchmaking", description: "Mise en relation avec des entreprises et partenaires adaptés." },
    ],
  },
  solutions: {
    sectionTitle: "Nos services", title: "Nos solutions",
    intro: "Nous proposons des solutions intégrées pour accompagner les entreprises dans leurs opérations commerciales avec la Türkiye et faciliter leur développement sur les marchés internationaux. De la recherche de fournisseurs à la mise en relation, en passant par la négociation et le suivi des opérations, nous vous accompagnons à chaque étape avec une approche professionnelle, personnalisée et orientée vers des résultats concrets.",
    items: servicesFor([
      { title: "Sourcing international", description: "Nous identifions et sélectionnons pour vous les produits, fournisseurs, fabricants et usines les plus adaptés à vos besoins en Türkiye. Nous vous accompagnons dans la recherche de partenaires fiables et compétitifs." },
      { title: "Import & Export", description: "Nous facilitons vos opérations commerciales internationales, de l'identification des produits jusqu'au suivi des commandes et des échanges avec les différents partenaires, afin de sécuriser et fluidifier vos transactions." },
      { title: "B2B Matchmaking", description: "Nous mettons en relation les entreprises avec des fournisseurs, fabricants, distributeurs et partenaires commerciaux correspondant à leurs secteurs d'activité et à leurs objectifs de développement." },
      { title: "Représentation commerciale", description: "Nous accompagnons les entreprises souhaitant s'implanter ou renforcer leur présence sur de nouveaux marchés, en assurant un relais local et en facilitant leurs relations avec les acteurs économiques." },
      { title: "Business Development", description: "Nous identifions de nouvelles opportunités commerciales, développons des relations stratégiques et contribuons à la mise en place de partenariats durables pour soutenir la croissance de votre entreprise." },
      { title: "Négociation & suivi", description: "Nous vous accompagnons dans vos échanges commerciaux, la négociation des conditions d'achat et de partenariat, ainsi que dans le suivi des projets afin de garantir une meilleure coordination entre les différentes parties." },
    ]),
  },
  sectors: {
    sectionTitle: "Nos secteurs", title: "Des opportunités dans plusieurs secteurs",
    items: [
      { title: "Construction & BTP", details: ["Matériaux", "Machines", "Équipements"] },
      { title: "Industrie", details: ["Machines", "Équipements", "Solutions de production"] },
      { title: "Agriculture", details: ["Machines", "Équipements", "Solutions agricoles"] },
      { title: "Agroalimentaire", details: ["Produits", "Transformation", "Conditionnement"] },
      { title: "Automobile", details: ["Véhicules", "Pièces", "Équipements"] },
      { title: "Mobilier", details: ["Maison", "Bureau", "Hôtellerie", "Commerce"] },
      { title: "Technologie", details: ["Équipements", "Solutions technologiques"] },
      { title: "Énergie", details: ["Équipements", "Solutions énergétiques"] },
    ],
    footnote: "Et autres secteurs selon les besoins de nos clients.",
  },
  sourcing: {
    sectionTitle: "Sourcing & Import-Export", title: "De la recherche à l'expédition",
    intro: "Nous vous accompagnons à chaque étape de votre projet d'approvisionnement international, en mobilisant notre réseau de partenaires et notre connaissance du marché turc pour faciliter vos opérations et sécuriser vos échanges commerciaux.",
    steps: [
      { title: "Identification du besoin", description: "Analyse de votre demande, de vos objectifs, de vos volumes et de vos exigences afin de définir précisément les caractéristiques de votre projet.", image: sourcingImages[0] },
      { title: "Recherche de partenaires", description: "Identification de fournisseurs, fabricants et usines en Türkiye correspondant à votre secteur d'activité et à vos critères.", image: sourcingImages[1] },
      { title: "Analyse & comparaison", description: "Étude des différentes offres, des prix, des capacités de production, des délais et des conditions commerciales afin de vous permettre de faire le meilleur choix.", image: sourcingImages[2] },
      { title: "Négociation", description: "Accompagnement des échanges avec les partenaires afin de rechercher les meilleures conditions commerciales et faciliter la conclusion des accords.", image: sourcingImages[3] },
      { title: "Suivi de production", description: "Coordination et suivi des différentes étapes du processus, de la validation de la commande jusqu'à la finalisation de la production.", image: sourcingImages[4] },
      { title: "Expédition & logistique", description: "Coordination avec les partenaires logistiques pour faciliter l'acheminement des marchandises et assurer le suivi de l'expédition.", image: sourcingImages[5] },
    ],
    closing: "Votre projet. Notre réseau. Votre opportunité.",
  },
  turkiye: {
    sectionTitle: "Services en Türkiye", title: "Votre partenaire en Türkiye",
    items: [
      { title: "Business Travel", details: ["Accueil aéroport", "Hôtel", "Chauffeur", "Interprétation", "Rendez-vous B2B", "Visites d'usines"], image: turkiyeImages[0] },
      { title: "Immobilier", details: ["Appartements", "Villas", "Investissement", "Recherche personnalisée", "Accompagnement"], image: turkiyeImages[1] },
      { title: "Études", details: ["Accueil aéroport", "Hôtel", "Orientation", "Universités", "Admission", "Programmes", "Accompagnement administratif", "Chauffeur", "Interprétation", "Rendez-vous B2B", "Visites d'usines"], image: turkiyeImages[2] },
      { title: "Services médicaux", details: ["Recherche d'établissement", "Mise en relation", "Rendez-vous", "Coordination du séjour"], image: turkiyeImages[3] },
    ],
  },
  bridge: {
    sectionTitle: "Türkiye - Afrique", title: "Connecter deux marchés",
    turkiyeTitle: "Türkiye", turkiyeItems: ["Fabricants", "Industriels", "Fournisseurs", "Entreprises", "Investisseurs"],
    africaTitle: "Afrique", africaItems: ["Importateurs", "Distributeurs", "Entrepreneurs", "Entreprises", "Investisseurs"],
    body: "Notre ambition est de développer un réseau international reliant progressivement plusieurs marchés africains aux capacités commerciales et industrielles de Türkiye.",
    pillars: ["Un réseau.", "Plusieurs marchés.", "Des opportunités communes."],
    signature: "TURKANOR · Connecter · Faciliter · Développer",
  },
  closing: { title: "Construisons ensemble." },
  contact: {
    bridge: "Türkiye - Africa Business Bridge",
    ecosystem: ["Entreprises", "Fabricants", "Fournisseurs", "Distributeurs", "Investisseurs", "Industriels", "Entrepreneurs", "Partenaires internationaux"],
    eyebrow: "Vous avez", title: "un projet ?", body: "Présentez-nous votre besoin. Construisons ensemble l'opportunité.",
    cta: "Contactez-nous !", whatsapp: "Écrire sur WhatsApp", email: "Envoyer un e-mail",
    footerTitle: "TURKANOR Corporation", footerLine: "Connecting Türkiye & Africa · Sourcing · Trade · B2B · Representation · Business Development · Türkiye · Afrique · International",
    form: { name: "Nom", company: "Entreprise", country: "Pays", phone: "Téléphone", email: "E-mail", service: "Service recherché", description: "Description du projet", choose: "Choisir un service", submit: "Envoyer ma demande" },
  },
};
