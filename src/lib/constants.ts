// Configuration Hero
export const HERO_CONFIG = {
  backgroundImage: "/images/hero-bg.jpg",
  backgroundAlt: "Immeuble Haussmannien Parisien avec balcons en fer forgé",
  badge: "L'Excellence Immobilière",
  title: {
    line1: "Bâtir avec",
    highlight1: "Sagesse",
    line2: "Investir avec",
    highlight2: "Vision",
  },
  subtitle: "Une sélection exclusive de biens d'exception où la simplicité rencontre le luxe absolu.",
  ctaPrimary: "Découvrir la Collection",
  ctaSecondary: "Notre Philosophie",
} as const;

// Liens de navigation
export const NAV_LINKS = [
  { href: "/", label: "Maison Ophir" },
  { href: "/patrimoine", label: "Patrimoine" },
  { href: "/diaspora", label: "Diaspora" },
  { href: "/advisory", label: "Advisory" },
  { href: "/off-market", label: "Off-Market" },
  { href: "/allocation", label: "Allocation" },
] as const;

// Navigation footer
export const FOOTER_NAV = [
  { href: "#", label: "Biens" },
  { href: "#", label: "À Propos" },
  { href: "#", label: "Services" },
  { href: "#", label: "Journal" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
  { href: "/politique-cookies", label: "Politique cookies" },
  { href: "/clause-off-market", label: "Clause Off-market" },
] as const;

// Informations de contact
export const CONTACT_INFO = {
  address: "12 Avenue Montaigne,\n75008 Paris, France",
  phone: "+33 1 42 00 00 00",
  email: "contact@ophirestate.com",
} as const;

// Réseaux sociaux
export const SOCIAL_LINKS = [
  { href: "#", icon: "instagram" as const },
  { href: "#", icon: "linkedin" as const },
  { href: "#", icon: "facebook" as const },
] as const;

// Données des biens
export const PROPERTIES = [
  {
    id: 1,
    title: "Palais de la Côte",
    location: "Nice, Côte d'Azur",
    price: "12,5 M€",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    beds: 6,
    baths: 8,
    area: "850 m²",
    status: "À Vendre",
  },
  {
    id: 2,
    title: "L'Obsidienne",
    location: "Paris, 8ème Arr.",
    price: "8,9 M€",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    beds: 4,
    baths: 5,
    area: "420 m²",
    status: "À Vendre",
  },
  {
    id: 3,
    title: "Domaine d'Or",
    location: "Saint-Tropez, Provence",
    price: "18,2 M€",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    beds: 9,
    baths: 10,
    area: "1200 m²",
    status: "À Vendre",
  },
] as const;

// Données des services
export const SERVICES = [
  {
    id: 1,
    title: "Recherche de Biens",
    description: "Accès à des biens hors-marché et des opportunités rares dans les emplacements les plus prisés.",
    icon: "search" as const,
  },
  {
    id: 2,
    title: "Conseil en Investissement",
    description: "Accompagnement stratégique pour optimiser la valeur de votre patrimoine immobilier.",
    icon: "briefcase" as const,
  },
  {
    id: 3,
    title: "Conciergerie Privée",
    description: "Services de relocation, conseil en décoration d'intérieur et gestion de votre cadre de vie.",
    icon: "key" as const,
  },
] as const;

// Statistiques
export const STATS = [
  { value: "150+", label: "Biens d'Exception" },
  { value: "2 Mds€+", label: "Volume de Ventes" },
] as const;

// Textes des sections
export const SECTION_TEXTS = {
  philosophy: {
    title: "L'Art de",
    titleHighlight: "l'Élégance Intemporelle",
    paragraphs: [
      "Chez Ophir Estate, nous croyons que le vrai luxe réside dans la simplicité des choses. Il ne s'agit pas seulement d'une adresse, mais du sentiment de rentrer chez soi dans un chef-d'œuvre.",
      "Notre palette de couleurs, inspirée par le mystère profond du ciel nocturne et l'éclat éternel de l'or, reflète notre engagement envers la stabilité et la prospérité. Nous sélectionnons des biens qui ne sont pas de simples structures, mais des héritages.",
    ],
    quote: "Le luxe est dans chaque détail.",
    quoteAuthor: "Hubert de Givenchy",
  },
  properties: {
    label: "Sélection Exclusive",
    title: "Résidences d'Exception",
    viewAll: "Voir Tous les Biens",
  },
  services: {
    label: "Notre Expertise",
    title: "Services Immobiliers Haut de Gamme",
    description: "Nous offrons une approche à 360 degrés de l'immobilier de luxe, garantissant que chaque aspect de votre acquisition ou vente soit traité avec précision.",
  },
  contact: {
    title: "Prêt à Élever Votre Art de Vivre ?",
    subtitle: "Contactez notre bureau privé pour planifier une consultation confidentielle.",
    form: {
      name: "Nom",
      namePlaceholder: "Laurent Durand",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      country: "Pays",
      countryPlaceholder: "Sélectionner votre pays",
      subject: "Sujet",
      subjectPlaceholder: "Objet de votre demande",
      message: "Message",
      messagePlaceholder: "Décrivez votre projet ou votre demande...",
      submit: "Envoyer la Demande",
    },
  },
  footer: {
    description: "Agence Immobilière de Luxe basée à Paris, au service des clients les plus exigeants avec discrétion et excellence.",
    navigation: "Navigation",
    legal: "Mentions légales",
    contact: "Contact",
    copyright: "Ophir Estate. Tous droits réservés.",
  },
  navbar: {
    contactButton: "Contactez-Nous",
  },
  hero: {
    scroll: "Défiler",
  },
  contactPage: {
    title: "Contactez-Nous",
    subtitle: "Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre projet immobilier.",
    info: {
      title: "Nos Coordonnées",
      address: "Adresse",
      phone: "Téléphone",
      email: "Email",
      hours: "Horaires",
      hoursValue: "Lun - Ven : 9h00 - 19h00\nSam : Sur rendez-vous",
    },
  },
} as const;
