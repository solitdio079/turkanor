import type { ServiceIcon } from "./services";

export type Language = "fr" | "en" | "tr";

export type Location = {
  city: string;
  country: string;
  code: string;
  lat: number;
  lon: number;
};

export type LocalizedService = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  items: string[];
  cta: string;
  icon: ServiceIcon;
  image: string;
  location: Location;
};

type LocalizedChapter = {
  eyebrow: string;
  title: string;
  accent?: string;
  body: string[];
  items?: string[];
};

export type SiteContent = {
  seo: { title: string; description: string };
  navigation: {
    home: string;
    about: string;
    services: string;
    sectors: string;
    turkiye: string;
    africa: string;
    projects: string;
    partners: string;
    contact: string;
    project: string;
    menu: string;
  };
  interface: {
    next: string;
    choosePoint: string;
    step: string;
    network: string;
    openMenu: string;
    closeMenu: string;
    changeLanguage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    servicesCta: string;
    projectCta: string;
    hint: string;
  };
  about: LocalizedChapter & {
    mission: [string, string];
    vision: [string, string];
    approach: [string, string];
    team: [string, string];
  };
  services: LocalizedService[];
  sectors: LocalizedChapter;
  turkiye: LocalizedChapter & { cities: string[] };
  africa: LocalizedChapter & { regions: string[] };
  projects: LocalizedChapter & { fields: string[] };
  partners: LocalizedChapter;
  why: LocalizedChapter & { values: Array<[string, string]> };
  method: LocalizedChapter & { steps: Array<[string, string]> };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    whatsapp: string;
    email: string;
    form: {
      name: string;
      company: string;
      country: string;
      phone: string;
      email: string;
      service: string;
      description: string;
      choose: string;
      submit: string;
    };
  };
};

const locations = {
  opening: { city: "İstanbul", country: "Türkiye", code: "IST", lat: 41.008, lon: 28.978 },
  about: { city: "Ankara", country: "Türkiye", code: "ANK", lat: 39.933, lon: 32.86 },
  sourcing: { city: "Bursa", country: "Türkiye", code: "BRS", lat: 40.195, lon: 29.06 },
  studies: { city: "Ankara", country: "Türkiye", code: "EDU", lat: 39.933, lon: 32.86 },
  medical: { city: "İstanbul", country: "Türkiye", code: "MED", lat: 41.05, lon: 29.05 },
  realEstate: { city: "İzmir", country: "Türkiye", code: "IZM", lat: 38.423, lon: 27.143 },
  sectors: { city: "Gaziantep", country: "Türkiye", code: "GZT", lat: 37.066, lon: 37.383 },
  turkiye: { city: "Konya", country: "Türkiye", code: "TR", lat: 37.874, lon: 32.493 },
  africa: { city: "Abidjan", country: "Côte d’Ivoire", code: "AFR", lat: 5.36, lon: -4.008 },
  projects: { city: "Mersin", country: "Türkiye", code: "OPS", lat: 36.812, lon: 34.641 },
  partners: { city: "Dakar", country: "Sénégal", code: "B2B", lat: 14.716, lon: -17.467 },
  why: { city: "Conakry", country: "Guinée", code: "CKY", lat: 9.641, lon: -13.578 },
  method: { city: "Kahramanmaraş", country: "Türkiye", code: "KCM", lat: 37.575, lon: 36.922 },
  contact: { city: "Bamako", country: "Mali", code: "BKO", lat: 12.639, lon: -8.003 },
} satisfies Record<string, Location>;

const serviceBases = [
  { id: "sourcing", number: "01", icon: "ship", image: "/images/catalogue/sourcing-neutral.webp", location: locations.sourcing },
  { id: "b2b", number: "02", icon: "network", image: "/images/catalogue/partnership.webp", location: locations.partners },
  { id: "representation", number: "03", icon: "handshake", image: "/images/catalogue/logistics.webp", location: locations.africa },
  { id: "services-turkiye", number: "04", icon: "travel", image: "/images/catalogue/turkiye-bridge.webp", location: locations.turkiye },
] satisfies Array<Pick<LocalizedService, "id" | "number" | "icon" | "image" | "location">>;

function servicesFor(
  entries: Array<Omit<LocalizedService, "id" | "number" | "icon" | "image" | "location">>,
): LocalizedService[] {
  return entries.map((entry, index) => ({ ...serviceBases[index], ...entry }));
}

export const content: Record<Language, SiteContent> = {
  fr: {
    seo: {
      title: "TURKANOR Corporation | Commerce et services Türkiye–Afrique",
      description: "TURKANOR accompagne entreprises, étudiants, patients et investisseurs entre la Türkiye et l’Afrique : sourcing, études, santé et immobilier.",
    },
    navigation: {
      home: "Accueil", about: "À propos", services: "Services", sectors: "Secteurs",
      turkiye: "Türkiye", africa: "Afrique", projects: "Projets", partners: "Partenaires",
      contact: "Contact", project: "Démarrer un projet", menu: "Navigation",
    },
    interface: {
      next: "Étape suivante", choosePoint: "Choisissez un point", step: "Étape",
      network: "Réseau TURKANOR", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu",
      changeLanguage: "Changer de langue",
    },
    hero: {
      eyebrow: "Türkiye · Afrique · Monde",
      title: "Connecting",
      accent: "Türkiye & Africa",
      body: "TURKANOR connecte la Türkiye et l’Afrique par le sourcing, l’import-export, la mise en relation B2B et la représentation commerciale.",
      servicesCta: "Nos services",
      projectCta: "Démarrer un projet",
      hint: "Faites défiler ou choisissez directement une destination sur le globe.",
    },
    about: {
      eyebrow: "Qui sommes-nous ?",
      title: "TURKANOR",
      accent: "Corporation",
      body: [
        "TURKANOR CORPORATION facilite les échanges commerciaux et les partenariats entre la Türkiye, l’Afrique et les marchés internationaux.",
        "Nous accompagnons entreprises, entrepreneurs, investisseurs et professionnels dans leurs projets internationaux, avec un interlocuteur direct et un suivi de terrain.",
      ],
      mission: ["Notre ambition", "Développer un réseau international reliant progressivement les marchés africains aux capacités commerciales et industrielles de Türkiye."],
      vision: ["Deux marchés", "Connecter importateurs, distributeurs, entrepreneurs et investisseurs africains aux fabricants, fournisseurs et industriels turcs."],
      approach: ["Notre méthode", "Comprendre le besoin, rechercher, comparer, négocier et suivre chaque opération jusqu’à son aboutissement."],
      team: ["Direction", "Mohamed A. Diawara porte une vision fondée sur des partenariats durables et des résultats concrets."],
    },
    services: servicesFor([
      {
        title: "Sourcing, Import & Export", shortTitle: "Commerce",
        description: "Nous recherchons en Türkiye les produits, fournisseurs, fabricants et usines adaptés à vos besoins, puis coordonnons l’opération jusqu’à l’expédition.",
        items: ["Identification du besoin", "Recherche de partenaires", "Analyse et comparaison", "Négociation", "Suivi de production", "Expédition & logistique"],
        cta: "Faire une demande",
      },
      {
        title: "Mise en relation B2B", shortTitle: "B2B",
        description: "Nous mettons en relation les entreprises avec des fournisseurs, fabricants, distributeurs et partenaires commerciaux adaptés à leurs objectifs.",
        items: ["Recherche de partenaires", "Fournisseurs & fabricants", "Distributeurs", "Entrepreneurs", "Investisseurs", "Rendez-vous B2B"],
        cta: "Trouver un partenaire",
      },
      {
        title: "Représentation & développement commercial", shortTitle: "Développement",
        description: "Nous représentons les entreprises sur de nouveaux marchés et développons les relations commerciales qui soutiennent leur croissance.",
        items: ["Représentation commerciale", "Prospection", "Accès au marché", "Développement de réseau", "Négociation", "Suivi des opérations"],
        cta: "Développer mon marché",
      },
      {
        title: "Services en Türkiye", shortTitle: "Türkiye",
        description: "TURKANOR devient votre partenaire de terrain pour vos déplacements, investissements, études et démarches médicales en Türkiye.",
        items: ["Business travel", "Immobilier", "Études & orientation", "Services médicaux", "Interprétation", "Visites & coordination"],
        cta: "Préparer mon séjour",
      },
    ]),
    sectors: {
      eyebrow: "Nos secteurs",
      title: "Des opportunités dans", accent: "plusieurs secteurs.",
      body: ["Matériaux, machines, équipements ou solutions de production : nous adaptons la recherche aux besoins réels de chaque client."],
      items: ["Construction & BTP", "Industrie", "Agriculture", "Agroalimentaire", "Automobile", "Mobilier", "Technologie", "Énergie"],
    },
    turkiye: {
      eyebrow: "Présence / Türkiye", title: "La Türkiye dans", accent: "toute son étendue.",
      body: ["Notre lecture du marché ne s’arrête pas à İstanbul. Nous recherchons les capacités industrielles, universitaires, médicales, immobilières et logistiques là où elles se trouvent."],
      cities: ["Ankara", "İstanbul", "İzmir", "Bursa", "Konya", "Mersin", "Gaziantep", "Kahramanmaraş"],
      items: ["Zones industrielles", "Usines", "Universités", "Hôpitaux", "Immobilier", "Ports", "Infrastructures"],
    },
    africa: {
      eyebrow: "Connexions / Afrique", title: "Des marchés pluriels.", accent: "Des relais contextualisés.",
      body: ["TURKANOR accompagne clients et partenaires africains dans leurs projets avec la Türkiye en tenant compte des réalités propres à chaque marché."],
      regions: ["Afrique de l’Ouest", "Afrique centrale", "Afrique de l’Est", "Afrique du Nord"],
    },
    projects: {
      eyebrow: "Türkiye - Afrique", title: "Connecter deux marchés.", accent: "Créer des opportunités communes.",
      body: ["Notre réseau rapproche les capacités commerciales et industrielles de Türkiye des besoins des marchés africains."],
      items: ["Fabricants", "Industriels", "Fournisseurs", "Importateurs", "Distributeurs", "Entrepreneurs", "Investisseurs"],
      fields: ["Un réseau", "Plusieurs marchés", "Des partenaires", "Des échanges", "Des résultats"],
    },
    partners: {
      eyebrow: "Notre réseau", title: "Des partenaires choisis.", accent: "Des rôles clairement définis.",
      body: ["Entreprises, fabricants, fournisseurs, distributeurs, investisseurs, industriels et partenaires internationaux composent l’écosystème que nous mettons en mouvement."],
    },
    why: {
      eyebrow: "Pourquoi TURKANOR", title: "La confiance se construit", accent: "dans les détails.",
      body: ["Notre valeur tient autant à la qualité des contacts qu’à la manière de préparer, expliquer et suivre chaque étape."],
      values: [["Expertise", "Une équipe dédiée aux projets Türkiye–Afrique."], ["Proximité", "Un accompagnement direct et personnalisé."], ["Réseau", "Des relations professionnelles dans plusieurs secteurs."], ["Accompagnement", "Une assistance adaptée à chaque projet."], ["Professionnalisme", "Qualité, suivi et communication à chaque étape."]],
    },
    method: {
      eyebrow: "De la recherche à l’expédition", title: "Une méthode claire,", accent: "en six étapes.",
      body: ["Chaque étape mobilise notre réseau de partenaires et rend l’opération plus lisible, de la définition du besoin à la livraison."],
      steps: [["Identification du besoin", "Analyse de la demande, des volumes et des exigences."], ["Recherche de partenaires", "Sélection de fournisseurs, fabricants et usines en Türkiye."], ["Analyse & comparaison", "Étude des offres, prix, capacités et délais."], ["Négociation", "Recherche des meilleures conditions commerciales."], ["Suivi de production", "Coordination de la commande jusqu’à sa finalisation."], ["Expédition & logistique", "Organisation de l’acheminement et suivi de l’expédition."]],
    },
    contact: {
      eyebrow: "Dernière escale / Parlons concret", title: "Quel projet voulez-vous", accent: "faire avancer ?",
      body: "Indiquez le besoin, le pays, l’échéance et le résultat attendu. Nous reviendrons vers vous avec le bon point de départ.",
      whatsapp: "Écrire sur WhatsApp", email: "Envoyer un e-mail",
      form: { name: "Nom", company: "Entreprise", country: "Pays", phone: "Téléphone", email: "E-mail", service: "Service recherché", description: "Description du projet", choose: "Choisir un service", submit: "Envoyer ma demande" },
    },
  },
  en: {
    seo: {
      title: "TURKANOR Corporation | Türkiye–Africa trade and services",
      description: "TURKANOR supports businesses, students, patients and investors between Türkiye and Africa through sourcing, education, healthcare and real estate services.",
    },
    navigation: {
      home: "Home", about: "About", services: "Services", sectors: "Sectors", turkiye: "Türkiye",
      africa: "Africa", projects: "Projects", partners: "Partners", contact: "Contact",
      project: "Start a project", menu: "Navigation",
    },
    interface: {
      next: "Next stop", choosePoint: "Choose a point", step: "Stop", network: "TURKANOR network",
      openMenu: "Open menu", closeMenu: "Close menu", changeLanguage: "Change language",
    },
    hero: {
      eyebrow: "Türkiye · Africa · World", title: "Connecting", accent: "Türkiye & Africa",
      body: "TURKANOR connects Türkiye and Africa through sourcing, import-export, B2B matchmaking and commercial representation.",
      servicesCta: "Our services", projectCta: "Start a project",
      hint: "Scroll or choose a destination directly on the globe.",
    },
    about: {
      eyebrow: "Who we are", title: "TURKANOR", accent: "Corporation",
      body: ["TURKANOR CORPORATION facilitates trade and partnerships between Türkiye, Africa and international markets.", "We support companies, entrepreneurs, investors and professionals in their international projects through direct contact and on-the-ground follow-up."],
      mission: ["Our ambition", "Build an international network progressively linking African markets to Türkiye’s commercial and industrial capabilities."],
      vision: ["Two markets", "Connect African importers, distributors, entrepreneurs and investors with Turkish manufacturers, suppliers and industrial companies."],
      approach: ["Our method", "Understand the need, research, compare, negotiate and follow every operation through to completion."],
      team: ["Management", "Mohamed A. Diawara leads a vision built on lasting partnerships and tangible results."],
    },
    services: servicesFor([
      { title: "Sourcing, Import & Export", shortTitle: "Trade", description: "We find the products, suppliers, manufacturers and factories in Türkiye that match your needs, then coordinate the operation through shipment.", items: ["Needs assessment", "Partner research", "Analysis & comparison", "Negotiation", "Production follow-up", "Shipping & logistics"], cta: "Send a request" },
      { title: "B2B Matchmaking", shortTitle: "B2B", description: "We connect companies with suppliers, manufacturers, distributors and commercial partners suited to their objectives.", items: ["Partner research", "Suppliers & manufacturers", "Distributors", "Entrepreneurs", "Investors", "B2B meetings"], cta: "Find a partner" },
      { title: "Commercial representation & development", shortTitle: "Development", description: "We represent companies in new markets and develop the commercial relationships that support their growth.", items: ["Commercial representation", "Prospecting", "Market access", "Network development", "Negotiation", "Operations follow-up"], cta: "Develop my market" },
      { title: "Services in Türkiye", shortTitle: "Türkiye", description: "TURKANOR is your local partner for business trips, investments, studies and medical arrangements in Türkiye.", items: ["Business travel", "Real estate", "Studies & guidance", "Medical services", "Interpretation", "Visits & coordination"], cta: "Plan my stay" },
    ]),
    sectors: { eyebrow: "Our sectors", title: "Opportunities across", accent: "multiple sectors.", body: ["Materials, machines, equipment or production solutions: we tailor every search to the client’s real requirements."], items: ["Construction", "Industry", "Agriculture", "Food processing", "Automotive", "Furniture", "Technology", "Energy"] },
    turkiye: { eyebrow: "Presence / Türkiye", title: "Türkiye in", accent: "its full breadth.", body: ["Our market view does not stop at İstanbul. We find industrial, academic, medical, property and logistics capacity wherever it is strongest."], cities: ["Ankara", "İstanbul", "İzmir", "Bursa", "Konya", "Mersin", "Gaziantep", "Kahramanmaraş"], items: ["Industrial zones", "Factories", "Universities", "Hospitals", "Real estate", "Ports", "Infrastructure"] },
    africa: { eyebrow: "Connections / Africa", title: "Many markets.", accent: "Context-aware connections.", body: ["TURKANOR supports African clients and partners in projects with Türkiye while respecting the realities of each market."], regions: ["West Africa", "Central Africa", "East Africa", "North Africa"] },
    projects: { eyebrow: "Türkiye - Africa", title: "Connect two markets.", accent: "Create shared opportunities.", body: ["Our network brings Türkiye’s commercial and industrial capabilities closer to the needs of African markets."], items: ["Manufacturers", "Industrial companies", "Suppliers", "Importers", "Distributors", "Entrepreneurs", "Investors"], fields: ["One network", "Multiple markets", "Partners", "Trade", "Results"] },
    partners: { eyebrow: "Our network", title: "Selected partners.", accent: "Clearly defined roles.", body: ["Companies, manufacturers, suppliers, distributors, investors, industrial businesses and international partners form the ecosystem we activate."] },
    why: { eyebrow: "Why TURKANOR", title: "Trust is built", accent: "in the details.", body: ["Our value lies both in the quality of our contacts and in how we prepare, explain and follow every step."], values: [["Expertise", "A team dedicated to Türkiye–Africa projects."], ["Proximity", "Direct and personal support."], ["Network", "Professional relationships across sectors."], ["Guidance", "Support shaped around each project."], ["Professionalism", "Quality, follow-up and communication throughout."]] },
    method: { eyebrow: "From research to shipment", title: "A clear method,", accent: "in six steps.", body: ["Each step activates our partner network and makes the operation easier to follow, from defining the need to delivery."], steps: [["Needs assessment", "Review of the request, volumes and requirements."], ["Partner research", "Selection of suppliers, manufacturers and factories in Türkiye."], ["Analysis & comparison", "Review of offers, prices, capabilities and lead times."], ["Negotiation", "Search for the best commercial conditions."], ["Production follow-up", "Coordination from order confirmation to production completion."], ["Shipping & logistics", "Organisation and monitoring of goods transportation."]] },
    contact: { eyebrow: "Final stop / Let’s be specific", title: "What project do you want to", accent: "move forward?", body: "Tell us the need, country, timeline and expected outcome. We will come back with the right starting point.", whatsapp: "Write on WhatsApp", email: "Send an email", form: { name: "Name", company: "Company", country: "Country", phone: "Phone", email: "Email", service: "Service required", description: "Project description", choose: "Choose a service", submit: "Send my request" } },
  },
  tr: {
    seo: {
      title: "TURKANOR Corporation | Türkiye–Afrika ticaret ve hizmetleri",
      description: "TURKANOR; tedarik, eğitim, sağlık ve gayrimenkul alanlarında Türkiye ile Afrika arasında şirketlere, öğrencilere, hastalara ve yatırımcılara destek olur.",
    },
    navigation: {
      home: "Ana sayfa", about: "Hakkımızda", services: "Hizmetler", sectors: "Sektörler", turkiye: "Türkiye",
      africa: "Afrika", projects: "Projeler", partners: "İş ortakları", contact: "İletişim",
      project: "Proje başlat", menu: "Navigasyon",
    },
    interface: {
      next: "Sonraki durak", choosePoint: "Bir nokta seçin", step: "Durak", network: "TURKANOR ağı",
      openMenu: "Menüyü aç", closeMenu: "Menüyü kapat", changeLanguage: "Dili değiştir",
    },
    hero: {
      eyebrow: "Türkiye · Afrika · Dünya", title: "Türkiye ile Afrika", accent: "arasında güçlü bağlar",
      body: "TURKANOR; tedarik, ithalat-ihracat, B2B eşleştirme ve ticari temsil yoluyla Türkiye ile Afrika’yı birbirine bağlar.",
      servicesCta: "Hizmetlerimiz", projectCta: "Proje başlat",
      hint: "Kaydırın veya küre üzerindeki bir hedefi doğrudan seçin.",
    },
    about: {
      eyebrow: "Biz kimiz?", title: "TURKANOR", accent: "Corporation",
      body: ["TURKANOR CORPORATION; Türkiye, Afrika ve uluslararası pazarlar arasındaki ticareti ve ortaklıkları kolaylaştırır.", "Şirketlere, girişimcilere, yatırımcılara ve profesyonellere doğrudan iletişim ve saha takibiyle uluslararası projelerinde eşlik ederiz."],
      mission: ["Hedefimiz", "Afrika pazarlarını Türkiye’nin ticari ve endüstriyel kapasitesiyle kademeli olarak buluşturan uluslararası bir ağ kurmak."],
      vision: ["İki pazar", "Afrikalı ithalatçıları, distribütörleri, girişimcileri ve yatırımcıları Türk üretici, tedarikçi ve sanayicileriyle buluşturmak."],
      approach: ["Yöntemimiz", "İhtiyacı anlamak; araştırmak, karşılaştırmak, müzakere etmek ve her operasyonu sonuna kadar takip etmek."],
      team: ["Yönetim", "Mohamed A. Diawara, kalıcı ortaklıklar ve somut sonuçlar üzerine kurulu bir vizyona liderlik eder."],
    },
    services: servicesFor([
      { title: "Tedarik, İthalat & İhracat", shortTitle: "Ticaret", description: "İhtiyacınıza uygun ürünleri, tedarikçileri, üreticileri ve fabrikaları Türkiye’de bulur; operasyonu sevkiyata kadar koordine ederiz.", items: ["İhtiyacın belirlenmesi", "İş ortağı araştırması", "Analiz & karşılaştırma", "Müzakere", "Üretim takibi", "Sevkiyat & lojistik"], cta: "Talep gönder" },
      { title: "B2B İş Eşleştirme", shortTitle: "B2B", description: "Şirketleri hedeflerine uygun tedarikçiler, üreticiler, distribütörler ve ticari ortaklarla buluştururuz.", items: ["İş ortağı araştırması", "Tedarikçi & üreticiler", "Distribütörler", "Girişimciler", "Yatırımcılar", "B2B görüşmeleri"], cta: "İş ortağı bul" },
      { title: "Ticari temsil & iş geliştirme", shortTitle: "Geliştirme", description: "Şirketleri yeni pazarlarda temsil eder, büyümelerini destekleyen ticari ilişkileri geliştiririz.", items: ["Ticari temsil", "Müşteri araştırması", "Pazara giriş", "Ağ geliştirme", "Müzakere", "Operasyon takibi"], cta: "Pazarımı geliştir" },
      { title: "Türkiye’de Hizmetler", shortTitle: "Türkiye", description: "İş seyahatleri, yatırımlar, eğitim ve sağlık süreçlerinde Türkiye’deki yerel iş ortağınız oluruz.", items: ["İş seyahati", "Gayrimenkul", "Eğitim & yönlendirme", "Sağlık hizmetleri", "Tercümanlık", "Ziyaret & koordinasyon"], cta: "Seyahatimi planla" },
    ]),
    sectors: { eyebrow: "Sektörlerimiz", title: "Birçok sektörde", accent: "yeni fırsatlar.", body: ["Malzeme, makine, ekipman veya üretim çözümü: her araştırmayı müşterinin gerçek ihtiyacına göre şekillendiririz."], items: ["İnşaat", "Sanayi", "Tarım", "Gıda işleme", "Otomotiv", "Mobilya", "Teknoloji", "Enerji"] },
    turkiye: { eyebrow: "Varlık / Türkiye", title: "Türkiye’nin", accent: "tüm potansiyeli.", body: ["Pazar görüşümüz İstanbul’la sınırlı değil. Sanayi, eğitim, sağlık, gayrimenkul ve lojistik kapasitesini en güçlü olduğu şehirlerde araştırıyoruz."], cities: ["Ankara", "İstanbul", "İzmir", "Bursa", "Konya", "Mersin", "Gaziantep", "Kahramanmaraş"], items: ["Sanayi bölgeleri", "Fabrikalar", "Üniversiteler", "Hastaneler", "Gayrimenkul", "Limanlar", "Altyapı"] },
    africa: { eyebrow: "Bağlantılar / Afrika", title: "Farklı pazarlar.", accent: "Yerel bağlama uygun ilişkiler.", body: ["TURKANOR, Afrika’daki müşteri ve iş ortaklarının Türkiye ile yürüttüğü projelerde her pazarın gerçeklerini dikkate alır."], regions: ["Batı Afrika", "Orta Afrika", "Doğu Afrika", "Kuzey Afrika"] },
    projects: { eyebrow: "Türkiye - Afrika", title: "İki pazarı buluştur.", accent: "Ortak fırsatlar yarat.", body: ["Ağımız, Türkiye’nin ticari ve endüstriyel kapasitesini Afrika pazarlarının ihtiyaçlarıyla buluşturur."], items: ["Üreticiler", "Sanayi şirketleri", "Tedarikçiler", "İthalatçılar", "Distribütörler", "Girişimciler", "Yatırımcılar"], fields: ["Tek ağ", "Birçok pazar", "İş ortakları", "Ticaret", "Sonuçlar"] },
    partners: { eyebrow: "Ağımız", title: "Özenle seçilmiş ortaklar.", accent: "Net tanımlanmış roller.", body: ["Şirketler, üreticiler, tedarikçiler, distribütörler, yatırımcılar, sanayi kuruluşları ve uluslararası ortaklar harekete geçirdiğimiz ekosistemi oluşturur."] },
    why: { eyebrow: "Neden TURKANOR?", title: "Güven", accent: "ayrıntılarda kurulur.", body: ["Değerimiz hem bağlantılarımızın kalitesinden hem de her adımı hazırlama, açıklama ve takip etme biçimimizden gelir."], values: [["Uzmanlık", "Türkiye–Afrika projelerine odaklı bir ekip."], ["Yakınlık", "Doğrudan ve kişisel destek."], ["Ağ", "Farklı sektörlerde profesyonel ilişkiler."], ["Rehberlik", "Her projeye göre şekillenen destek."], ["Profesyonellik", "Her aşamada kalite, takip ve iletişim."]] },
    method: { eyebrow: "Araştırmadan sevkiyata", title: "Altı adımda", accent: "net bir yöntem.", body: ["Her aşamada iş ortağı ağımızı harekete geçirir, ihtiyacın belirlenmesinden teslimata kadar operasyonu görünür kılarız."], steps: [["İhtiyacın belirlenmesi", "Talep, hacim ve gereksinimlerin analizi."], ["İş ortağı araştırması", "Türkiye’de tedarikçi, üretici ve fabrikaların seçimi."], ["Analiz & karşılaştırma", "Teklif, fiyat, kapasite ve teslim sürelerinin incelenmesi."], ["Müzakere", "En iyi ticari koşulların aranması."], ["Üretim takibi", "Sipariş onayından üretimin tamamlanmasına kadar koordinasyon."], ["Sevkiyat & lojistik", "Ürün taşımacılığının organizasyonu ve takibi."]] },
    contact: { eyebrow: "Son durak / Net konuşalım", title: "Hangi projeyi", accent: "ilerletmek istiyorsunuz?", body: "İhtiyacı, ülkeyi, zamanlamayı ve beklediğiniz sonucu paylaşın. Size doğru başlangıç noktasıyla döneceğiz.", whatsapp: "WhatsApp’tan yaz", email: "E-posta gönder", form: { name: "Ad soyad", company: "Şirket", country: "Ülke", phone: "Telefon", email: "E-posta", service: "Aranan hizmet", description: "Proje açıklaması", choose: "Bir hizmet seçin", submit: "Talebimi gönder" } },
  },
};

export type GlobeDestination = {
  id: string;
  number: string;
  label: string;
  location: Location;
};

export function getDestinations(language: Language): GlobeDestination[] {
  const copy = content[language];
  return [
    { id: "accueil", number: "00", label: copy.navigation.home, location: locations.opening },
    { id: "a-propos", number: "01", label: copy.navigation.about, location: locations.about },
    ...copy.services.map((service, index) => ({ ...service, number: String(index + 2).padStart(2, "0"), label: service.shortTitle })),
    { id: "secteurs", number: "06", label: copy.navigation.sectors, location: locations.sectors },
    { id: "turkiye", number: "07", label: copy.navigation.turkiye, location: locations.turkiye },
    { id: "afrique", number: "08", label: copy.navigation.africa, location: locations.africa },
    { id: "projets", number: "09", label: copy.navigation.projects, location: locations.projects },
    { id: "partenaires", number: "10", label: copy.navigation.partners, location: locations.partners },
    { id: "pourquoi", number: "11", label: copy.why.eyebrow, location: locations.why },
    { id: "methode", number: "12", label: copy.method.eyebrow, location: locations.method },
    { id: "contact", number: "13", label: copy.navigation.contact, location: locations.contact },
  ];
}

export function languageFromParam(value?: string): Language {
  return value === "en" || value === "tr" ? value : "fr";
}
