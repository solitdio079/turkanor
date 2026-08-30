export type Service = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  items: string[];
  icon: ServiceIcon;
  tone: "emerald" | "red" | "gold" | "blue";
  location: {
    city: string;
    country: string;
    code: string;
    lat: number;
    lon: number;
  };
  image?: string;
};

export type ServiceIcon =
  | "search"
  | "ship"
  | "handshake"
  | "network"
  | "verify"
  | "industry"
  | "travel"
  | "property"
  | "education"
  | "medical";

export const services: Service[] = [
  {
    id: "sourcing",
    number: "01",
    title: "Sourcing & Approvisionnement",
    shortTitle: "Sourcing",
    description:
      "Vous recherchez un produit, un fabricant ou une usine ? Nous cadrons le besoin, identifions les fournisseurs et comparons les options avant l'achat.",
    items: [
      "Recherche de produits et fournisseurs",
      "Fabricants, usines et devis comparés",
      "Achats personnalisés",
      "Vérification des fournisseurs",
    ],
    icon: "search",
    tone: "emerald",
    location: { city: "Bursa", country: "Türkiye", code: "BRS", lat: 40.195, lon: 29.06 },
    image: "/images/sourcing-reference.webp",
  },
  {
    id: "import-export",
    number: "02",
    title: "Import–Export & Commerce international",
    shortTitle: "Import–Export",
    description:
      "Nous coordonnons les commandes, les documents commerciaux et les échanges avec les partenaires logistiques pour garder chaque étape identifiable.",
    items: [
      "Accompagnement à l'achat",
      "Coordination des commandes",
      "Documentation commerciale",
      "Suivi des expéditions",
    ],
    icon: "ship",
    tone: "blue",
    location: { city: "Mersin", country: "Türkiye", code: "MER", lat: 36.812, lon: 34.641 },
  },
  {
    id: "representation",
    number: "03",
    title: "Représentation commerciale",
    shortTitle: "Représentation",
    description:
      "TURKANOR sert de relais aux entreprises africaines en Türkiye et aux entreprises turques en Afrique, au plus près des interlocuteurs locaux.",
    items: [
      "Représentation Afrique–Türkiye",
      "Recherche de clients",
      "Recherche de distributeurs",
      "Présence commerciale locale",
    ],
    icon: "handshake",
    tone: "gold",
    location: { city: "Abidjan", country: "Côte d’Ivoire", code: "ABJ", lat: 5.36, lon: -4.008 },
  },
  {
    id: "b2b",
    number: "04",
    title: "Développement commercial & B2B",
    shortTitle: "Business B2B",
    description:
      "Prospection, mises en relation et recherche de partenaires s'organisent autour d'un objectif commercial précis. Chaque contact doit avoir une raison d'être.",
    items: [
      "Prospection commerciale",
      "Mise en relation B2B",
      "Partenaires et investisseurs",
      "Développement de nouveaux marchés",
    ],
    icon: "network",
    tone: "red",
    location: { city: "Dakar", country: "Sénégal", code: "DKR", lat: 14.716, lon: -17.467 },
  },
  {
    id: "negociation",
    number: "05",
    title: "Négociation & Suivi des opérations",
    shortTitle: "Négociation",
    description:
      "Nous préparons les discussions sur les prix, les délais et les conditions, puis maintenons le suivi de la production, de la qualité et des commandes.",
    items: [
      "Négociation des prix",
      "Conditions commerciales",
      "Suivi de production",
      "Contrôle qualité et inspection",
    ],
    icon: "verify",
    tone: "emerald",
    location: { city: "Conakry", country: "Guinée", code: "CKY", lat: 9.641, lon: -13.578 },
  },
  {
    id: "industrie",
    number: "06",
    title: "Industrie & Projets",
    shortTitle: "Industrie",
    description:
      "Machines, équipements, matériaux ou solutions d'usine : nous partons du besoin technique pour rechercher des options adaptées et coordonner les échanges.",
    items: [
      "Machines industrielles",
      "Équipements professionnels",
      "Matériaux de construction",
      "Solutions techniques et d'usine",
    ],
    icon: "industry",
    tone: "gold",
    location: { city: "Kocaeli", country: "Türkiye", code: "KOC", lat: 40.766, lon: 29.916 },
  },
  {
    id: "business-travel",
    number: "07",
    title: "Business Travel & Services en Türkiye",
    shortTitle: "Business Travel",
    description:
      "Un déplacement d'affaires doit laisser du temps aux affaires. Agenda, accueil, hébergement, transport et interprétation sont réunis dans un même parcours.",
    items: [
      "Voyages d'affaires",
      "Accueil et hôtels",
      "Chauffeur et transport",
      "Interprétation et rendez-vous",
    ],
    icon: "travel",
    tone: "blue",
    location: { city: "İstanbul", country: "Türkiye", code: "IST", lat: 41.008, lon: 28.978 },
  },
  {
    id: "immobilier",
    number: "08",
    title: "Immobilier en Türkiye",
    shortTitle: "Immobilier",
    description:
      "Nous recherchons des biens selon vos critères et facilitons la mise en relation avec les professionnels concernés sur le terrain.",
    items: [
      "Appartements et villas",
      "Locaux commerciaux",
      "Terrains",
      "Mise en relation sectorielle",
    ],
    icon: "property",
    tone: "red",
    location: { city: "İzmir", country: "Türkiye", code: "IZM", lat: 38.423, lon: 27.143 },
  },
  {
    id: "etudes",
    number: "09",
    title: "Études en Türkiye",
    shortTitle: "Études",
    description:
      "Nous aidons les étudiants à clarifier leur orientation, repérer les universités, préparer leur admission et explorer les possibilités de bourse.",
    items: [
      "Orientation et universités",
      "Admission",
      "Accompagnement étudiant",
      "Opportunités de bourses",
    ],
    icon: "education",
    tone: "emerald",
    location: { city: "Ankara", country: "Türkiye", code: "ANK", lat: 39.933, lon: 32.86 },
    image: "/images/studies-reference.webp",
  },
  {
    id: "medical",
    number: "10",
    title: "Services médicaux",
    shortTitle: "Médical",
    description:
      "Nous recherchons les établissements et spécialistes correspondant à la demande, puis organisons les rendez-vous et la coordination administrative et logistique.",
    items: [
      "Recherche d'établissements",
      "Médecins et spécialistes",
      "Organisation des rendez-vous",
      "Accompagnement logistique",
    ],
    icon: "medical",
    tone: "blue",
    location: { city: "Antalya", country: "Türkiye", code: "AYT", lat: 36.896, lon: 30.713 },
    image: "/images/medical-reference.webp",
  },
];
