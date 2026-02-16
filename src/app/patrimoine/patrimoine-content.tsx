"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ContactForm } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";
import { Loader2 } from "lucide-react";

// Strapi property interface
interface StrapiProperty {
  id: number;
  documentId: string;
  name: string;
  location: string;
  description: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  price: string;
  views: string | null;
  type: string | null;
  parking: number | null;
  propertyId: string;
  category: "patrimoine" | "offmarket";
  images: string | null; // Comma-separated image filenames stored in GitHub
}
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
  Maximize,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Car,
  Building,
  Lock,
  Sparkles,
  Eye
} from "lucide-react";

// Property type definition
interface Property {
  id: number;
  title: string;
  country: string;
  arrondissement: string;
  type: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  image: string;
  images: string[];
  highlight: string;
  description: string;
  features: string[];
}

const filterOptions = {
  fr: {
    countries: ["France", "Monaco", "Suisse", "Belgique"],
    arrondissements: ["Paris 6ème", "Paris 7ème", "Paris 8ème", "Paris 16ème", "Neuilly-sur-Seine"],
    types: ["Appartement", "Maison", "Villa", "Hôtel Particulier", "Loft"],
  },
  en: {
    countries: ["France", "Monaco", "Switzerland", "Belgium"],
    arrondissements: ["Paris 6th", "Paris 7th", "Paris 8th", "Paris 16th", "Neuilly-sur-Seine"],
    types: ["Apartment", "House", "Villa", "Mansion", "Loft"],
  },
};

const roomsOptions = ["3+", "4+", "5+", "6+", "8+", "10+"];
const bedroomsOptions = ["2+", "3+", "4+", "5+", "6+"];

function formatPrice(price: number, locale: string = 'fr'): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PatrimoineContent() {
  const { locale, t } = useLanguage();

  // Strapi properties state
  const [strapiProperties, setStrapiProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch properties from Strapi
  const fetchProperties = useCallback(async () => {
    console.log("=== DEBUG CLIENT FETCH ===");
    console.log("Starting fetch...");
    setLoadingProperties(true);
    try {
      const response = await fetch("/api/properties?category=patrimoine");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch failed:", errorText);
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log("Raw data received:", data);
      console.log("data.data exists:", !!data.data);
      console.log("data.data is array:", Array.isArray(data.data));
      console.log("data.data length:", data.data?.length);

      if (data.data && Array.isArray(data.data)) {
        const mappedProperties: Property[] = data.data.map((item: StrapiProperty) => {
          console.log("Mapping item:", item.id, item.name);

          // Parse comma-separated image filenames
          const imageFilenames = item.images
            ? item.images.split(",").map(f => f.trim()).filter(f => f.length > 0)
            : [];

          const resolveImageUrl = (filename: string): string => {
            if (filename.startsWith("http")) return filename;
            if (/^\d{10,}-/.test(filename)) {
              return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`;
            }
            return `/images/properties/${filename}`;
          };

          const allImages = imageFilenames.length > 0
            ? imageFilenames.map(resolveImageUrl)
            : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"];

          const imageUrl = allImages[0];

          return {
            id: item.id,
            title: item.name,
            country: "France",
            arrondissement: item.location,
            type: item.type || "Appartement",
            price: parseInt(item.price) || 0,
            surface: item.surface,
            rooms: item.rooms,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            parking: item.parking || 0,
            image: imageUrl,
            images: allImages,
            highlight: item.views?.split(",")[0]?.trim() || "Exclusif",
            description: item.description.replace(/<[^>]*>/g, ''),
            features: item.views?.split(",").map(v => v.trim()) || [],
          };
        });
        console.log("Mapped properties count:", mappedProperties.length);
        console.log("Mapped properties:", mappedProperties);
        setStrapiProperties(mappedProperties);
      } else {
        console.log("No data.data array found!");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoadingProperties(false);
      console.log("=== END DEBUG CLIENT ===");
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Only use Strapi properties
  const luxuryProperties = strapiProperties;

  const filters = filterOptions[locale as keyof typeof filterOptions] || filterOptions.fr;
  const allLabel = locale === 'en' ? 'All' : 'Tous';

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedArrondissement, setSelectedArrondissement] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [surfaceMin, setSurfaceMin] = useState("");
  const [surfaceMax, setSurfaceMax] = useState("");
  const [selectedRooms, setSelectedRooms] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProperty) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProperty]);

  const filteredProperties = useMemo(() => {
    return luxuryProperties.filter((property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.arrondissement.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = !selectedCountry || property.country === selectedCountry;
      const matchesArrondissement = !selectedArrondissement || property.arrondissement === selectedArrondissement;
      const matchesType = !selectedType || property.type === selectedType;

      const minPrice = priceMin ? parseInt(priceMin) : 0;
      const maxPrice = priceMax ? parseInt(priceMax) : Infinity;
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;

      const minSurface = surfaceMin ? parseInt(surfaceMin) : 0;
      const maxSurface = surfaceMax ? parseInt(surfaceMax) : Infinity;
      const matchesSurface = property.surface >= minSurface && property.surface <= maxSurface;

      const minRooms = !selectedRooms ? 0 : parseInt(selectedRooms.replace("+", ""));
      const matchesRooms = property.rooms >= minRooms;

      const minBedrooms = !selectedBedrooms ? 0 : parseInt(selectedBedrooms.replace("+", ""));
      const matchesBedrooms = property.bedrooms >= minBedrooms;

      return matchesSearch && matchesCountry && matchesArrondissement && matchesType && matchesPrice && matchesSurface && matchesRooms && matchesBedrooms;
    });
  }, [luxuryProperties, searchQuery, selectedCountry, selectedArrondissement, selectedType, priceMin, priceMax, surfaceMin, surfaceMax, selectedRooms, selectedBedrooms]);

  const activeFiltersCount = [
    selectedCountry !== "",
    selectedArrondissement !== "",
    selectedType !== "",
    priceMin !== "" || priceMax !== "",
    surfaceMin !== "" || surfaceMax !== "",
    selectedRooms !== "",
    selectedBedrooms !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedArrondissement("");
    setSelectedType("");
    setPriceMin("");
    setPriceMax("");
    setSurfaceMin("");
    setSurfaceMax("");
    setSelectedRooms("");
    setSelectedBedrooms("");
    setSearchQuery("");
  };

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
  };

  const closePropertyModal = () => {
    setSelectedProperty(null);
  };

  const nextImage = () => {
    if (selectedProperty) {
      setSlideDirection(1);
      setCurrentImageIndex((prev) =>
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setSlideDirection(-1);
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  const handleContactClick = () => {
    closePropertyModal();
    setTimeout(() => {
      const contactSection = document.getElementById("patrimoine-contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      {/* Hero Section - Full width background with centered content */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1920&auto=format&fit=crop"
            alt="Immeuble parisien haussmannien"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden lg:block" />
        <div className="absolute top-1/3 right-10 w-px h-48 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
        <div className="absolute bottom-1/4 left-20 w-24 h-24 border border-gold/10 rotate-45 hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-8 block">
              {t("patrimoine.hero.badge")}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight text-white mb-10 leading-[1.1]">
              {t("patrimoine.hero.title")}{" "}
              <span className="text-gold-gradient">{t("patrimoine.hero.titleHighlight")}</span>
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/50" />
              <div className="w-2 h-2 rotate-45 bg-gold/30" />
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/50" />
            </div>

            <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">
              <p>
                {t("patrimoine.hero.paragraph1")}
              </p>
              <p className="text-gray-400">
                {t("patrimoine.hero.paragraph2")}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Luxury Properties Section */}
      <section className="py-24 bg-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-20 right-10 w-32 h-32 border border-gold/5 rotate-45 hidden lg:block" />
        <div className="absolute bottom-20 left-10 w-24 h-24 border border-gold/5 rotate-12 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                {t("patrimoine.collection.badge")}
              </span>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6">
              {t("patrimoine.collection.title")}<span className="text-gold-gradient">{t("patrimoine.collection.titleHighlight")}</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              {t("patrimoine.collection.subtitle")}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-dark-lighter border border-gold/20 p-6">
              {/* Main search row */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={t("patrimoine.filters.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-dark border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-3 px-6 py-4 border transition-all ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-gold/20 border-gold/40 text-gold-light'
                      : 'bg-dark border-gold/10 text-gray-300 hover:border-gold/30'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>{t("patrimoine.filters.button")}</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-6 h-6 bg-gold text-dark text-sm font-semibold rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Expandable filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-6 pt-6 border-t border-gold/10"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.country")}</label>
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value="">{allLabel}</option>
                          {filters.countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.district")}</label>
                      <div className="relative">
                        <select
                          value={selectedArrondissement}
                          onChange={(e) => setSelectedArrondissement(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value="">{allLabel}</option>
                          {filters.arrondissements.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.propertyType")}</label>
                      <div className="relative">
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value="">{allLabel}</option>
                          {filters.types.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.budget")}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder={t("patrimoine.filters.min")}
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder={t("patrimoine.filters.max")}
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.surface")}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder={t("patrimoine.filters.min")}
                          value={surfaceMin}
                          onChange={(e) => setSurfaceMin(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder={t("patrimoine.filters.max")}
                          value={surfaceMax}
                          onChange={(e) => setSurfaceMax(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.rooms")}</label>
                      <div className="relative">
                        <select
                          value={selectedRooms}
                          onChange={(e) => setSelectedRooms(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value="">{allLabel}</option>
                          {roomsOptions.map((r) => <option key={r} value={r}>{r} {t("patrimoine.filters.roomsUnit")}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">{t("patrimoine.filters.bedrooms")}</label>
                      <div className="relative">
                        <select
                          value={selectedBedrooms}
                          onChange={(e) => setSelectedBedrooms(e.target.value)}
                          className="w-full px-4 py-3 bg-dark border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value="">{allLabel}</option>
                          {bedroomsOptions.map((b) => <option key={b} value={b}>{b} {t("patrimoine.filters.bedroomsUnit")}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-6 flex items-center gap-2 text-gold-light hover:text-gold transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">{t("patrimoine.filters.reset")} ({activeFiltersCount})</span>
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                <span className="text-gold-light font-semibold">{filteredProperties.length}</span> {t("patrimoine.filters.resultsCount")}
              </p>
            </div>
          </motion.div>

          {/* Loading State */}
          {loadingProperties && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{locale === 'en' ? 'Loading properties...' : 'Chargement des biens...'}</p>
              </div>
            </div>
          )}

          {/* Luxury Properties Grid - Innovative Display */}
          {!loadingProperties && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => openPropertyModal(property)}
              >
                <div className="relative bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all duration-700 overflow-hidden">
                  {/* Main Image with Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

                    {/* Highlight badge */}
                    <div className="absolute top-6 left-6">
                      <div className="px-4 py-2 bg-gold text-dark text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        {property.highlight}
                      </div>
                    </div>

                    {/* View button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-20 h-20 rounded-full border-2 border-gold/50 flex items-center justify-center bg-dark/50 backdrop-blur-sm">
                        <Eye className="w-8 h-8 text-gold" />
                      </div>
                    </div>

                    {/* Bottom content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 text-gold-light mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm uppercase tracking-wider">{property.arrondissement}</span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 group-hover:text-gold-light transition-colors">
                        {property.title}
                      </h3>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-6 border-t border-gold/10">
                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <Maximize className="w-4 h-4 text-gold" />
                        <span className="text-white font-medium">{property.surface} m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold" />
                        <span className="text-white font-medium">{property.rooms} {t("patrimoine.property.rooms")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-gold" />
                        <span className="text-white font-medium">{property.bedrooms} {t("patrimoine.property.beds")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-gold" />
                        <span className="text-white font-medium">{property.bathrooms} {t("patrimoine.property.baths")}</span>
                      </div>
                    </div>

                    {/* Price - Prominent display */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">{t("patrimoine.property.price")}</span>
                        <span className="font-serif text-3xl text-gold-light">{formatPrice(property.price, locale)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 border border-gold/20 text-gold-light text-sm group-hover:bg-gold/10 transition-colors">
                        <span>{t("patrimoine.property.discover")}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {/* No results */}
          {!loadingProperties && filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 text-gold/30 mx-auto mb-6" />
              <h3 className="font-serif text-2xl text-white mb-3">{t("patrimoine.property.noResults")}</h3>
              <p className="text-gray-500 mb-6">{t("patrimoine.property.noResultsMessage")}</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gold/30 text-gold-light hover:bg-gold/10 transition-colors"
              >
                {t("patrimoine.filters.reset")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Services Section - Vertical Timeline Style */}
      <section className="py-32 bg-dark relative">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-dark-lighter hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t("patrimoine.services.badge")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white max-w-2xl">
              {t("patrimoine.services.title")}
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent hidden md:block" />

            <div className="space-y-16 md:space-y-24">
              {[1, 2, 3].map((num, index) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
                >
                  {/* Number */}
                  <div className="md:col-span-2 flex items-center gap-6">
                    <div className="relative">
                      <span className="font-serif text-6xl lg:text-8xl text-gold/20">
                        0{num}
                      </span>
                      {/* Dot on timeline */}
                      <div className="absolute top-1/2 -right-4 w-3 h-3 bg-gold rounded-full hidden md:block transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-10 md:pl-12 lg:pl-20">
                    <div className="bg-dark-lighter p-8 lg:p-12 border-l-2 border-gold/30 hover:border-gold transition-colors">
                      <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4">
                        {t(`patrimoine.services.service${num}.title`)}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {t(`patrimoine.services.service${num}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Split with Image */}
      <section id="patrimoine-contact" className="relative bg-dark-footer overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
          {/* Image Side */}
          <div className="relative h-[400px] lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
              alt="Intérieur luxueux"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-footer/90 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-footer to-transparent lg:hidden" />

            {/* Overlay content */}
            <div className="absolute bottom-10 left-10 right-10 lg:hidden">
              <h2 className="font-serif text-3xl text-white mb-4">
                {t("patrimoine.contact.title")}
              </h2>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative py-16 lg:py-24 px-6 lg:px-16">
            {/* Decorative corner */}
            <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-gold/20 hidden lg:block" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white mb-6 hidden lg:block">
                {t("patrimoine.contact.title")}
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed mb-12">
                {t("patrimoine.contact.subtitle")}
              </p>

              <ContactForm animate={false} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={closePropertyModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-lighter border border-gold/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePropertyModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-dark/80 border border-gold/30 text-gray-400 hover:text-white hover:border-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery */}
            <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-dark">
              <AnimatePresence initial={false} mode="popLayout" custom={slideDirection}>
                <motion.div
                  key={currentImageIndex}
                  custom={slideDirection}
                  initial={{ x: slideDirection * 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: slideDirection * -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedProperty.images[currentImageIndex]}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image navigation */}
              {selectedProperty.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-dark/80 border border-gold/30 text-white hover:bg-gold/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-dark/80 border border-gold/30 text-white hover:bg-gold/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedProperty.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideDirection(idx > currentImageIndex ? 1 : -1);
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? "bg-gold" : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Highlight badge */}
              <div className="absolute top-4 left-4">
                <div className="px-4 py-2 bg-gold text-dark text-sm uppercase tracking-wider font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {selectedProperty.highlight}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">{selectedProperty.arrondissement}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                  {selectedProperty.title}
                </h2>
                {/* Price - Prominent */}
                <div className="inline-block px-6 py-3 bg-gold/10 border border-gold/30">
                  <span className="font-serif text-3xl text-gold-light">{formatPrice(selectedProperty.price, locale)}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-dark border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Maximize className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t("patrimoine.modal.surface")}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.surface} m²</span>
                </div>
                <div className="p-4 bg-dark border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Home className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t("patrimoine.modal.rooms")}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.rooms}</span>
                </div>
                <div className="p-4 bg-dark border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <BedDouble className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t("patrimoine.modal.bedrooms")}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.bedrooms}</span>
                </div>
                <div className="p-4 bg-dark border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t("patrimoine.modal.bathrooms")}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.bathrooms}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-serif text-xl text-white mb-4">{t("patrimoine.modal.description")}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-serif text-xl text-white mb-4">{t("patrimoine.modal.features")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedProperty.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-3 bg-dark border border-gold/10"
                    >
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 border border-gold/10">
                  <Building className="w-5 h-5 text-gold" />
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block">{t("patrimoine.modal.type")}</span>
                    <span className="text-white">{selectedProperty.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gold/10">
                  <MapPin className="w-5 h-5 text-gold" />
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block">{t("patrimoine.modal.location")}</span>
                    <span className="text-white">{selectedProperty.country}</span>
                  </div>
                </div>
                {selectedProperty.parking > 0 && (
                  <div className="flex items-center gap-3 p-4 border border-gold/10">
                    <Car className="w-5 h-5 text-gold" />
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block">{t("patrimoine.modal.parking")}</span>
                      <span className="text-white">{selectedProperty.parking} {selectedProperty.parking > 1 ? t("patrimoine.modal.parkingUnitPlural") : t("patrimoine.modal.parkingUnit")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-gold/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <span className="text-gray-400 block mb-1">{t("patrimoine.modal.interested")}</span>
                    <span className="text-gold-light text-lg font-serif">{formatPrice(selectedProperty.price, locale)}</span>
                  </div>
                  <button
                    onClick={handleContactClick}
                    className="px-8 py-4 bg-gold hover:bg-gold-light text-dark font-semibold uppercase tracking-wider transition-colors"
                  >
                    {t("patrimoine.modal.requestVisit")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
