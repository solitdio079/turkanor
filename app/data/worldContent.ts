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
    eyebrow: "TURKANOR Corporation", title: "CONNECTING", accent: "Türkiye & Africa",
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

const en: SiteContent = {
  seo: {
    title: "TURKANOR Corporation | Connecting Türkiye and Africa",
    description: "Sourcing, import-export, B2B, commercial representation and business development between Türkiye, Africa and international markets.",
  },
  navigation: {
    home: "Home", about: "Who we are", services: "Our solutions", sectors: "Our sectors",
    sourcing: "Sourcing & Import-Export", turkiye: "Services in Türkiye", bridge: "Türkiye - Africa",
    contact: "Contact", project: "Have a project?", menu: "Contents",
  },
  interface: {
    next: "Next page", choosePoint: "Browse the catalogue", network: "Türkiye · Africa · International",
    openMenu: "Open menu", closeMenu: "Close menu", changeLanguage: "Change language", catalogue: "2026 Catalogue",
  },
  hero: {
    eyebrow: "TURKANOR Corporation", title: "CONNECTING", accent: "Türkiye & Africa",
    statement: "Connecting Türkiye & Africa",
    servicesLine: "Sourcing · Import & Export · B2B · Commercial Representation · Business Development",
    servicesCta: "Discover our solutions", projectCta: "Have a project?", hint: "Scroll to browse the TURKANOR catalogue.",
  },
  contents: {
    title: "Contents",
    items: [["Who are we?", "02"], ["Our areas of expertise", "02"], ["Message from the General Manager", "03"], ["Our solutions", "04 - 05"], ["Our business sectors", "06"], ["Sourcing & Import-Export", "07 - 08"], ["Services in Türkiye", "09"], ["Türkiye - Africa", "10 - 11"]],
  },
  about: {
    title: "Who are we?",
    paragraphs: ["TURKANOR CORPORATION facilitates trade and partnerships between Türkiye, Africa and international markets.", "We support companies, entrepreneurs, investors and professionals in their international projects."],
    domainsTitle: "Our areas of expertise",
    domains: ["International sourcing", "Import & Export", "B2B matchmaking", "Commercial representation", "Business development", "Negotiation & follow-up"],
  },
  manager: {
    title: "Message from the General Manager", name: "Mohamed A. Diawara",
    quote: "Our ambition is to build lasting bridges between Türkiye and Africa by transforming commercial opportunities into concrete partnerships.",
    imageAlt: "Mohamed A. Diawara, General Manager of TURKANOR Corporation", solutionsTitle: "Our solutions",
    solutions: [
      { title: "International sourcing", description: "Researching products, suppliers, manufacturers and factories in Türkiye." },
      { title: "Import & Export", description: "Support for international trade operations." },
      { title: "B2B Matchmaking", description: "Connecting you with suitable companies and partners." },
    ],
  },
  solutions: {
    sectionTitle: "Our services", title: "Our solutions",
    intro: "We offer integrated solutions to support companies in their trade operations with Türkiye and facilitate their development in international markets. From supplier research and matchmaking to negotiation and operational follow-up, we support you at every stage with a professional, personalised and results-oriented approach.",
    items: servicesFor([
      { title: "International sourcing", description: "We identify and select the products, suppliers, manufacturers and factories in Türkiye that best meet your needs. We support you in finding reliable and competitive partners." },
      { title: "Import & Export", description: "We facilitate your international trade operations, from product identification to order follow-up and exchanges with the various partners, helping make your transactions safer and smoother." },
      { title: "B2B Matchmaking", description: "We connect companies with suppliers, manufacturers, distributors and commercial partners aligned with their sectors and development objectives." },
      { title: "Commercial representation", description: "We support companies seeking to establish or strengthen their presence in new markets by providing a local representative and facilitating relationships with economic stakeholders." },
      { title: "Business Development", description: "We identify new business opportunities, develop strategic relationships and help establish lasting partnerships to support your company's growth." },
      { title: "Negotiation & follow-up", description: "We support your commercial discussions, the negotiation of purchasing and partnership terms, and project follow-up to ensure better coordination among all parties." },
    ]),
  },
  sectors: {
    sectionTitle: "Our sectors", title: "Opportunities across multiple sectors",
    items: [
      { title: "Construction & Public Works", details: ["Materials", "Machinery", "Equipment"] },
      { title: "Industry", details: ["Machinery", "Equipment", "Production solutions"] },
      { title: "Agriculture", details: ["Machinery", "Equipment", "Agricultural solutions"] },
      { title: "Food processing", details: ["Products", "Processing", "Packaging"] },
      { title: "Automotive", details: ["Vehicles", "Parts", "Equipment"] },
      { title: "Furniture", details: ["Home", "Office", "Hospitality", "Retail"] },
      { title: "Technology", details: ["Equipment", "Technology solutions"] },
      { title: "Energy", details: ["Equipment", "Energy solutions"] },
    ],
    footnote: "And other sectors according to our clients' needs.",
  },
  sourcing: {
    sectionTitle: "Sourcing & Import-Export", title: "From research to shipment",
    intro: "We support you at every stage of your international sourcing project, mobilising our partner network and knowledge of the Turkish market to facilitate your operations and secure your trade exchanges.",
    steps: [
      { title: "Needs identification", description: "Analysis of your request, objectives, volumes and requirements to define your project's characteristics precisely.", image: sourcingImages[0] },
      { title: "Partner research", description: "Identification of suppliers, manufacturers and factories in Türkiye that match your sector and criteria.", image: sourcingImages[1] },
      { title: "Analysis & comparison", description: "Assessment of offers, prices, production capacities, lead times and commercial terms to help you make the best choice.", image: sourcingImages[2] },
      { title: "Negotiation", description: "Support in discussions with partners to seek the best commercial terms and facilitate the conclusion of agreements.", image: sourcingImages[3] },
      { title: "Production follow-up", description: "Coordination and monitoring of every stage, from order validation through completion of production.", image: sourcingImages[4] },
      { title: "Shipping & logistics", description: "Coordination with logistics partners to facilitate the movement of goods and monitor shipment.", image: sourcingImages[5] },
    ],
    closing: "Your project. Our network. Your opportunity.",
  },
  turkiye: {
    sectionTitle: "Services in Türkiye", title: "Your partner in Türkiye",
    items: [
      { title: "Business Travel", details: ["Airport reception", "Hotel", "Driver", "Interpretation", "B2B meetings", "Factory visits"], image: turkiyeImages[0] },
      { title: "Real estate", details: ["Apartments", "Villas", "Investment", "Personalised search", "Support"], image: turkiyeImages[1] },
      { title: "Studies", details: ["Airport reception", "Hotel", "Guidance", "Universities", "Admission", "Programmes", "Administrative support", "Driver", "Interpretation", "B2B meetings", "Factory visits"], image: turkiyeImages[2] },
      { title: "Medical services", details: ["Facility research", "Introductions", "Appointments", "Stay coordination"], image: turkiyeImages[3] },
    ],
  },
  bridge: {
    sectionTitle: "Türkiye - Africa", title: "Connecting two markets",
    turkiyeTitle: "Türkiye", turkiyeItems: ["Manufacturers", "Industrial companies", "Suppliers", "Companies", "Investors"],
    africaTitle: "Africa", africaItems: ["Importers", "Distributors", "Entrepreneurs", "Companies", "Investors"],
    body: "Our ambition is to develop an international network progressively connecting several African markets with Türkiye's commercial and industrial capabilities.",
    pillars: ["One network.", "Multiple markets.", "Shared opportunities."], signature: "TURKANOR · Connect · Facilitate · Develop",
  },
  closing: { title: "Let us build together." },
  contact: {
    bridge: "Türkiye - Africa Business Bridge",
    ecosystem: ["Companies", "Manufacturers", "Suppliers", "Distributors", "Investors", "Industrial companies", "Entrepreneurs", "International partners"],
    eyebrow: "Do you have", title: "a project?", body: "Tell us what you need. Let us build the opportunity together.",
    cta: "Contact us!", whatsapp: "Write on WhatsApp", email: "Send an email",
    footerTitle: "TURKANOR Corporation", footerLine: "Connecting Türkiye & Africa · Sourcing · Trade · B2B · Representation · Business Development · Türkiye · Africa · International",
    form: { name: "Name", company: "Company", country: "Country", phone: "Phone", email: "Email", service: "Service required", description: "Project description", choose: "Choose a service", submit: "Send my request" },
  },
};

const tr: SiteContent = {
  seo: {
    title: "TURKANOR Corporation | Türkiye ile Afrika'yı buluşturuyor",
    description: "Türkiye, Afrika ve uluslararası pazarlar arasında tedarik, ithalat-ihracat, B2B, ticari temsil ve iş geliştirme.",
  },
  navigation: {
    home: "Ana sayfa", about: "Biz kimiz?", services: "Çözümlerimiz", sectors: "Sektörlerimiz",
    sourcing: "Tedarik & İthalat-İhracat", turkiye: "Türkiye'de Hizmetler", bridge: "Türkiye - Afrika",
    contact: "İletişim", project: "Projeniz mi var?", menu: "İçindekiler",
  },
  interface: {
    next: "Sonraki sayfa", choosePoint: "Kataloğu inceleyin", network: "Türkiye · Afrika · Uluslararası",
    openMenu: "Menüyü aç", closeMenu: "Menüyü kapat", changeLanguage: "Dili değiştir", catalogue: "2026 Kataloğu",
  },
  hero: {
    eyebrow: "TURKANOR Corporation", title: "CONNECTING", accent: "Türkiye & Africa",
    statement: "Türkiye ile Afrika'yı buluşturmak",
    servicesLine: "Tedarik · İthalat & İhracat · B2B · Ticari Temsil · İş Geliştirme",
    servicesCta: "Çözümlerimizi keşfedin", projectCta: "Projeniz mi var?", hint: "TURKANOR kataloğunu incelemek için kaydırın.",
  },
  contents: {
    title: "İçindekiler",
    items: [["Biz kimiz?", "02"], ["Uzmanlık alanlarımız", "02"], ["Genel Müdürün Mesajı", "03"], ["Çözümlerimiz", "04 - 05"], ["Faaliyet sektörlerimiz", "06"], ["Tedarik & İthalat-İhracat", "07 - 08"], ["Türkiye'de Hizmetler", "09"], ["Türkiye - Afrika", "10 - 11"]],
  },
  about: {
    title: "Biz kimiz?",
    paragraphs: ["TURKANOR CORPORATION, Türkiye, Afrika ve uluslararası pazarlar arasındaki ticareti ve ortaklıkları kolaylaştırır.", "Şirketlere, girişimcilere, yatırımcılara ve profesyonellere uluslararası projelerinde destek veririz."],
    domainsTitle: "Uzmanlık alanlarımız",
    domains: ["Uluslararası tedarik", "İthalat & İhracat", "B2B iş eşleştirme", "Ticari temsil", "İş geliştirme", "Müzakere & takip"],
  },
  manager: {
    title: "Genel Müdürün Mesajı", name: "Mohamed A. Diawara",
    quote: "Hedefimiz, ticari fırsatları somut ortaklıklara dönüştürerek Türkiye ile Afrika arasında kalıcı köprüler kurmaktır.",
    imageAlt: "TURKANOR Corporation Genel Müdürü Mohamed A. Diawara", solutionsTitle: "Çözümlerimiz",
    solutions: [
      { title: "Uluslararası tedarik", description: "Türkiye'de ürün, tedarikçi, üretici ve fabrika araştırması." },
      { title: "İthalat & İhracat", description: "Uluslararası ticari operasyonlara destek." },
      { title: "B2B İş Eşleştirme", description: "Uygun şirketler ve iş ortaklarıyla bağlantı kurulması." },
    ],
  },
  solutions: {
    sectionTitle: "Hizmetlerimiz", title: "Çözümlerimiz",
    intro: "Şirketlerin Türkiye ile yürüttüğü ticari operasyonları desteklemek ve uluslararası pazarlardaki gelişimlerini kolaylaştırmak için bütünleşik çözümler sunuyoruz. Tedarikçi araştırmasından iş eşleştirmeye, müzakereden operasyon takibine kadar her aşamada profesyonel, kişiselleştirilmiş ve somut sonuç odaklı bir yaklaşımla yanınızdayız.",
    items: servicesFor([
      { title: "Uluslararası tedarik", description: "İhtiyaçlarınıza en uygun ürünleri, tedarikçileri, üreticileri ve fabrikaları Türkiye'de belirleyip seçiyoruz. Güvenilir ve rekabetçi iş ortakları bulmanızda size destek oluyoruz." },
      { title: "İthalat & İhracat", description: "Ürünlerin belirlenmesinden siparişlerin ve farklı iş ortaklarıyla yürütülen görüşmelerin takibine kadar uluslararası ticari operasyonlarınızı kolaylaştırarak işlemlerinizi daha güvenli ve akıcı hale getiriyoruz." },
      { title: "B2B İş Eşleştirme", description: "Şirketleri sektörlerine ve gelişim hedeflerine uygun tedarikçiler, üreticiler, distribütörler ve ticari ortaklarla buluşturuyoruz." },
      { title: "Ticari temsil", description: "Yeni pazarlara yerleşmek veya mevcut varlığını güçlendirmek isteyen şirketlere yerel temsil sağlayarak ekonomik aktörlerle ilişkilerini kolaylaştırıyoruz." },
      { title: "İş Geliştirme", description: "Yeni ticari fırsatlar belirliyor, stratejik ilişkiler geliştiriyor ve şirketinizin büyümesini desteklemek için kalıcı ortaklıkların kurulmasına katkıda bulunuyoruz." },
      { title: "Müzakere & takip", description: "Ticari görüşmelerinizde, satın alma ve ortaklık koşullarının müzakeresinde ve projelerin takibinde tüm taraflar arasında daha iyi koordinasyon sağlamak için size destek oluyoruz." },
    ]),
  },
  sectors: {
    sectionTitle: "Sektörlerimiz", title: "Birçok sektörde fırsatlar",
    items: [
      { title: "İnşaat & Yapı", details: ["Malzemeler", "Makineler", "Ekipmanlar"] },
      { title: "Sanayi", details: ["Makineler", "Ekipmanlar", "Üretim çözümleri"] },
      { title: "Tarım", details: ["Makineler", "Ekipmanlar", "Tarım çözümleri"] },
      { title: "Gıda sanayi", details: ["Ürünler", "İşleme", "Paketleme"] },
      { title: "Otomotiv", details: ["Araçlar", "Parçalar", "Ekipmanlar"] },
      { title: "Mobilya", details: ["Ev", "Ofis", "Otelcilik", "Ticaret"] },
      { title: "Teknoloji", details: ["Ekipmanlar", "Teknolojik çözümler"] },
      { title: "Enerji", details: ["Ekipmanlar", "Enerji çözümleri"] },
    ],
    footnote: "Müşterilerimizin ihtiyaçlarına göre diğer sektörler de dahildir.",
  },
  sourcing: {
    sectionTitle: "Tedarik & İthalat-İhracat", title: "Araştırmadan sevkiyata",
    intro: "Ortak ağımızı ve Türkiye pazarı bilgimizi harekete geçirerek uluslararası tedarik projenizin her aşamasında operasyonlarınızı kolaylaştırıyor ve ticari alışverişinizi güvence altına alıyoruz.",
    steps: [
      { title: "İhtiyacın belirlenmesi", description: "Projenizin özelliklerini net biçimde tanımlamak için talebinizin, hedeflerinizin, hacimlerinizin ve gereksinimlerinizin analizi.", image: sourcingImages[0] },
      { title: "İş ortağı araştırması", description: "Sektörünüze ve kriterlerinize uygun Türkiye'deki tedarikçi, üretici ve fabrikaların belirlenmesi.", image: sourcingImages[1] },
      { title: "Analiz & karşılaştırma", description: "En iyi seçimi yapmanızı sağlamak için farklı tekliflerin, fiyatların, üretim kapasitelerinin, sürelerin ve ticari koşulların incelenmesi.", image: sourcingImages[2] },
      { title: "Müzakere", description: "En iyi ticari koşulları bulmak ve anlaşmaların sonuçlandırılmasını kolaylaştırmak için iş ortaklarıyla yürütülen görüşmelere destek.", image: sourcingImages[3] },
      { title: "Üretim takibi", description: "Siparişin onaylanmasından üretimin tamamlanmasına kadar sürecin farklı aşamalarının koordinasyonu ve takibi.", image: sourcingImages[4] },
      { title: "Sevkiyat & lojistik", description: "Malların taşınmasını kolaylaştırmak ve sevkiyatı takip etmek için lojistik ortaklarıyla koordinasyon.", image: sourcingImages[5] },
    ],
    closing: "Sizin projeniz. Bizim ağımız. Sizin fırsatınız.",
  },
  turkiye: {
    sectionTitle: "Türkiye'de Hizmetler", title: "Türkiye'deki iş ortağınız",
    items: [
      { title: "İş Seyahati", details: ["Havalimanında karşılama", "Otel", "Şoför", "Tercümanlık", "B2B görüşmeleri", "Fabrika ziyaretleri"], image: turkiyeImages[0] },
      { title: "Gayrimenkul", details: ["Daireler", "Villalar", "Yatırım", "Kişiselleştirilmiş araştırma", "Destek"], image: turkiyeImages[1] },
      { title: "Eğitim", details: ["Havalimanında karşılama", "Otel", "Yönlendirme", "Üniversiteler", "Kabul", "Programlar", "İdari destek", "Şoför", "Tercümanlık", "B2B görüşmeleri", "Fabrika ziyaretleri"], image: turkiyeImages[2] },
      { title: "Sağlık hizmetleri", details: ["Kurum araştırması", "Bağlantı kurulması", "Randevular", "Konaklama koordinasyonu"], image: turkiyeImages[3] },
    ],
  },
  bridge: {
    sectionTitle: "Türkiye - Afrika", title: "İki pazarı buluşturmak",
    turkiyeTitle: "Türkiye", turkiyeItems: ["Üreticiler", "Sanayiciler", "Tedarikçiler", "Şirketler", "Yatırımcılar"],
    africaTitle: "Afrika", africaItems: ["İthalatçılar", "Distribütörler", "Girişimciler", "Şirketler", "Yatırımcılar"],
    body: "Hedefimiz, farklı Afrika pazarlarını Türkiye'nin ticari ve endüstriyel kapasitesiyle kademeli olarak buluşturan uluslararası bir ağ geliştirmektir.",
    pillars: ["Tek ağ.", "Birçok pazar.", "Ortak fırsatlar."], signature: "TURKANOR · Buluştur · Kolaylaştır · Geliştir",
  },
  closing: { title: "Birlikte inşa edelim." },
  contact: {
    bridge: "Türkiye - Afrika İş Köprüsü",
    ecosystem: ["Şirketler", "Üreticiler", "Tedarikçiler", "Distribütörler", "Yatırımcılar", "Sanayiciler", "Girişimciler", "Uluslararası ortaklar"],
    eyebrow: "Bir", title: "projeniz mi var?", body: "İhtiyacınızı bize anlatın. Fırsatı birlikte oluşturalım.",
    cta: "Bize ulaşın!", whatsapp: "WhatsApp'tan yazın", email: "E-posta gönderin",
    footerTitle: "TURKANOR Corporation", footerLine: "Connecting Türkiye & Africa · Tedarik · Ticaret · B2B · Temsil · İş Geliştirme · Türkiye · Afrika · Uluslararası",
    form: { name: "Ad soyad", company: "Şirket", country: "Ülke", phone: "Telefon", email: "E-posta", service: "Aranan hizmet", description: "Proje açıklaması", choose: "Bir hizmet seçin", submit: "Talebimi gönder" },
  },
};

export const content: Record<Language, SiteContent> = { fr, en, tr };

export type GlobeDestination = { id: string; number: string; label: string; location: Location };

const chapterLocations: Array<Omit<GlobeDestination, "label">> = [
  { id: "accueil", number: "00", location: { city: "İstanbul", country: "Türkiye", code: "IST", lat: 41.008, lon: 28.978 } },
  { id: "a-propos", number: "02", location: { city: "Conakry", country: "Guinée", code: "CKY", lat: 9.641, lon: -13.578 } },
  { id: "direction", number: "03", location: { city: "İstanbul", country: "Türkiye", code: "IST", lat: 41.008, lon: 28.978 } },
  { id: "services", number: "04", location: { city: "Bursa", country: "Türkiye", code: "BRS", lat: 40.195, lon: 29.06 } },
  { id: "services-suite", number: "05", location: { city: "Dakar", country: "Sénégal", code: "DKR", lat: 14.716, lon: -17.467 } },
  { id: "secteurs", number: "06", location: { city: "Gaziantep", country: "Türkiye", code: "GZT", lat: 37.066, lon: 37.383 } },
  { id: "sourcing", number: "07", location: { city: "Mersin", country: "Türkiye", code: "MER", lat: 36.812, lon: 34.641 } },
  { id: "sourcing-suite", number: "08", location: { city: "Abidjan", country: "Côte d'Ivoire", code: "ABJ", lat: 5.36, lon: -4.008 } },
  { id: "turkiye", number: "09", location: { city: "Konya", country: "Türkiye", code: "KON", lat: 37.874, lon: 32.493 } },
  { id: "pont", number: "10", location: { city: "Bamako", country: "Mali", code: "BKO", lat: 12.639, lon: -8.003 } },
  { id: "ensemble", number: "11", location: { city: "İstanbul", country: "Türkiye", code: "IST", lat: 41.008, lon: 28.978 } },
  { id: "contact", number: "12", location: { city: "Conakry", country: "Guinée", code: "CKY", lat: 9.641, lon: -13.578 } },
];

export function getDestinations(language: Language): GlobeDestination[] {
  const copy = content[language];
  const labels = [copy.navigation.home, copy.about.title, copy.manager.title, copy.solutions.title, copy.solutions.items[4].title, copy.sectors.sectionTitle, copy.sourcing.title, copy.sourcing.steps[3].title, copy.turkiye.sectionTitle, copy.bridge.sectionTitle, copy.closing.title, copy.contact.title];
  return chapterLocations.map((chapter, index) => ({ ...chapter, label: labels[index] }));
}

export function languageFromParam(param?: string): Language {
  return param === "en" || param === "tr" ? param : "fr";
}
