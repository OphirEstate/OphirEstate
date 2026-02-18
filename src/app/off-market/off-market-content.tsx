"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Search, SlidersHorizontal, MapPin, Home, Maximize, X, ChevronDown, Key, Shield, Handshake, BedDouble, ChevronLeft, ChevronRight, Bath, Car, TreePine, Building, Loader2 } from "lucide-react";
import { ContactForm } from "@/components/ui";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

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
  surfaceUnit: string;
  price: string;
  views: string | null;
  type: string | null;
  parking: number | null;
  propertyId: string;
  category: "patrimoine" | "offmarket";
  images: string | null;
  exclusive: boolean;
}

const reasonKeys = ["successions", "arbitrages", "family", "allocation", "repositioning", "inheritance"] as const;

const approachKeys = ["mandate", "introduction", "verified"] as const;
const approachIcons = [Key, Handshake, Shield];

const countries = ["Tous", "France", "Monaco", "Suisse", "Belgique"];
const arrondissements = ["Tous", "Paris 2ème", "Paris 3ème", "Paris 6ème", "Paris 7ème", "Paris 8ème", "Paris 16ème", "Neuilly-sur-Seine"];
const types = ["Tous", "Appartement", "Maison", "Villa", "Hôtel Particulier", "Loft", "Domaine", "Domaine équestre", "Châteaux", "Immeuble", "Manoir", "Terrain"];
const roomsOptions = ["Tous", "1+", "2+", "3+", "4+", "5+", "6+", "8+", "10+"];
const bedroomsOptions = ["Tous", "1+", "2+", "3+", "4+", "5+"];

// Property interface for display
interface Property {
  id: number;
  title: string;
  country: string;
  arrondissement: string;
  type: string;
  price: number;
  surface: number;
  surfaceUnit: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  exclusive: boolean;
  image: string;
  images: string[];
  status: string;
  description: string;
  features: string[];
}

export function OffMarketContent() {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages]?.offMarket || messages.fr.offMarket;

  // Strapi properties state
  const [strapiProperties, setStrapiProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState(false);

  // Fetch properties from Strapi
  const fetchProperties = useCallback(async () => {
    setLoadingProperties(true);
    setPropertiesError(false);
    try {
      const response = await fetch("/api/properties?category=offmarket");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const mappedProperties: Property[] = data.data.map((item: StrapiProperty) => {
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
            surfaceUnit: item.surfaceUnit || "m2",
            rooms: item.rooms,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            parking: item.parking || 0,
            exclusive: item.exclusive === true,
            image: imageUrl,
            images: allImages,
            status: "Off-Market",
            description: item.description.replace(/<[^>]*>/g, ''),
            features: item.views?.split(",").map(v => v.trim()) || [],
          };
        });
        setStrapiProperties(mappedProperties);
      }
    } catch (error) {
      console.error("Error fetching off-market properties:", error);
      setPropertiesError(true);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const reasons = reasonKeys.map((key) => ({
    label: t.reasons.items[key].label,
    description: t.reasons.items[key].description,
  }));

  const approach = approachKeys.map((key, index) => ({
    icon: approachIcons[index],
    title: t.approach.items[key].title,
    description: t.approach.items[key].description,
  }));

  const allLabel = t.properties.all;

  // Only use Strapi properties
  const displayProperties = strapiProperties;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(allLabel);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = right/next, -1 = left/prev

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
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const [selectedArrondissement, setSelectedArrondissement] = useState(allLabel);
  const [selectedType, setSelectedType] = useState(allLabel);
  const [surfaceMin, setSurfaceMin] = useState("");
  const [surfaceMax, setSurfaceMax] = useState("");
  const [selectedRooms, setSelectedRooms] = useState(allLabel);
  const [selectedBedrooms, setSelectedBedrooms] = useState(allLabel);
  const [selectedExclusive, setSelectedExclusive] = useState(allLabel);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    return displayProperties.filter((property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.arrondissement.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === allLabel || property.country === selectedCountry;
      const matchesArrondissement = selectedArrondissement === allLabel || property.arrondissement === selectedArrondissement;
      const matchesType = selectedType === allLabel || property.type === selectedType;

      const minSurface = surfaceMin ? parseInt(surfaceMin) : 0;
      const maxSurface = surfaceMax ? parseInt(surfaceMax) : Infinity;
      const matchesSurface = property.surface >= minSurface && property.surface <= maxSurface;

      const minRooms = selectedRooms === allLabel ? 0 : parseInt(selectedRooms.replace("+", ""));
      const matchesRooms = property.rooms >= minRooms;

      const minBedrooms = selectedBedrooms === allLabel ? 0 : parseInt(selectedBedrooms.replace("+", ""));
      const matchesBedrooms = property.bedrooms >= minBedrooms;

      const matchesExclusive = selectedExclusive === allLabel ||
        (selectedExclusive === "Exclusif" && property.exclusive) ||
        (selectedExclusive === "Classique" && !property.exclusive);

      return matchesSearch && matchesCountry && matchesArrondissement && matchesType && matchesSurface && matchesRooms && matchesBedrooms && matchesExclusive;
    });
  }, [displayProperties, searchQuery, selectedCountry, selectedArrondissement, selectedType, surfaceMin, surfaceMax, selectedRooms, selectedBedrooms, selectedExclusive, allLabel]);

  const activeFiltersCount = [
    selectedCountry !== allLabel,
    selectedArrondissement !== allLabel,
    selectedType !== allLabel,
    surfaceMin !== "" || surfaceMax !== "",
    selectedRooms !== allLabel,
    selectedBedrooms !== allLabel,
    selectedExclusive !== allLabel,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCountry(allLabel);
    setSelectedArrondissement(allLabel);
    setSelectedType(allLabel);
    setSurfaceMin("");
    setSurfaceMax("");
    setSelectedRooms(allLabel);
    setSelectedBedrooms(allLabel);
    setSelectedExclusive(allLabel);
    setSearchQuery("");
  };

  return (
    <>
      {/* Hero Section - Dark, mysterious with reveal effect */}
      <section className="relative min-h-[80vh] bg-dark overflow-hidden flex items-center">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-lighter via-dark to-dark" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Lock icon decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
          <Lock className="w-[600px] h-[600px] text-gold" strokeWidth={0.5} />
        </div>

        {/* Decorative border frame */}
        <div className="absolute inset-10 lg:inset-20 border border-gold/10 pointer-events-none hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Eye icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-10"
            >
              <div className="relative">
                <div className="w-20 h-20 border border-gold/30 rounded-full flex items-center justify-center">
                  <EyeOff className="w-8 h-8 text-gold-light" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gold" />
                </div>
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gold uppercase tracking-[0.4em] text-sm font-semibold mb-8 block"
            >
              {t.hero.badge}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight text-white mb-10 leading-[1.1]"
            >
              {t.hero.title}<span className="text-gold-gradient">{t.hero.titleHighlight}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-6">
                {t.hero.paragraph1}
              </p>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                {t.hero.paragraph2}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-lighter to-transparent" />
      </section>

      {/* Properties Section with Search and Filters */}
      <section className="py-20 bg-dark-lighter relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">
              {t.properties.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-4">
              {t.properties.title}
            </h2>
            <p className="text-gray-400 font-light max-w-2xl mx-auto">
              {t.properties.subtitle}
            </p>
          </motion.div>

          {/* Search and Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-dark border border-gold/20 p-4 lg:p-6">
              {/* Main search row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={t.properties.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-dark-lighter border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none transition-colors"
                  />
                </div>

                {/* Filter toggle button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-3 px-6 py-4 border transition-all ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-gold/20 border-gold/40 text-gold-light'
                      : 'bg-dark-lighter border-gold/10 text-gray-300 hover:border-gold/30'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>{t.properties.filters}</span>
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
                  {/* Row 1: Country, Arrondissement, Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Country filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                        {t.properties.country}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Arrondissement filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                        {t.properties.district}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedArrondissement}
                          onChange={(e) => setSelectedArrondissement(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          {arrondissements.map((arr) => (
                            <option key={arr} value={arr}>{arr}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Type filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                        {t.properties.propertyType}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          {types.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Exclusive + Surface range */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Exclusive filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                        Statut
                      </label>
                      <div className="relative">
                        <select
                          value={selectedExclusive}
                          onChange={(e) => setSelectedExclusive(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                        >
                          <option value={allLabel}>{allLabel}</option>
                          <option value="Exclusif">Exclusif</option>
                          <option value="Classique">Classique</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Surface range */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                        {t.properties.surface}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder={t.properties.min}
                          value={surfaceMin}
                          onChange={(e) => setSurfaceMin(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder={t.properties.max}
                          value={surfaceMax}
                          onChange={(e) => setSurfaceMax(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white placeholder-gray-500 focus:border-gold/30 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Rooms & Bedrooms in same row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Rooms filter */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                          {t.properties.rooms}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedRooms}
                            onChange={(e) => setSelectedRooms(e.target.value)}
                            className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                          >
                            {roomsOptions.map((option) => (
                              <option key={option} value={option}>{option === "Tous" ? allLabel : option + " " + t.properties.roomsUnit}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                      </div>

                      {/* Bedrooms filter */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                          {t.properties.bedrooms}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBedrooms}
                            onChange={(e) => setSelectedBedrooms(e.target.value)}
                            className="w-full px-4 py-3 bg-dark-lighter border border-gold/10 text-white appearance-none focus:border-gold/30 focus:outline-none cursor-pointer"
                          >
                            {bedroomsOptions.map((option) => (
                              <option key={option} value={option}>{option === "Tous" ? allLabel : option + " " + t.properties.bedroomsUnit}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear filters */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-6 flex items-center gap-2 text-gold-light hover:text-gold transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">{t.properties.resetFilters} ({activeFiltersCount})</span>
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                <span className="text-gold-light font-semibold">{filteredProperties.length}</span> {t.properties.propertiesFound}
              </p>
              {activeFiltersCount > 0 && (
                <p className="text-gray-500 text-sm">
                  {activeFiltersCount} {t.properties.activeFilters}
                </p>
              )}
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

          {/* Properties Grid */}
          {!loadingProperties && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => openPropertyModal(property)}
              >
                <div className="bg-dark border border-gold/10 hover:border-gold/30 transition-all duration-500 overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold ${
                        property.status === "Exclusif"
                          ? "bg-gold text-dark"
                          : "bg-dark/80 text-gold-light border border-gold/30"
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    {/* Lock overlay */}
                    <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 border border-gold/50 rounded-full flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gold-light" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-white mb-2 group-hover:text-gold-light transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{property.arrondissement}</span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>{property.rooms} {t.properties.roomsAbbr}</span>
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" />
                          <span>{property.bedrooms} {t.properties.bedsAbbr}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span>{property.surface} {property.surfaceUnit === "hectares" ? "ha" : "m²"}</span>
                      </div>
                    </div>

                    {/* Type & Access */}
                    <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-400">
                          {t.properties.priceOnRequest}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {property.type}
                      </span>
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
              className="text-center py-16"
            >
              <Lock className="w-16 h-16 text-gold/30 mx-auto mb-6" />
              <h3 className="font-serif text-2xl text-white mb-3">{t.properties.noResults}</h3>
              <p className="text-gray-500 mb-6">{t.properties.noResultsMessage}</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gold/30 text-gold-light hover:bg-gold/10 transition-colors"
              >
                {t.properties.resetButton}
              </button>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-400 mb-6">
              {t.properties.searchCta}
            </p>
            <div className="inline-flex items-center gap-4 px-8 py-4 border border-gold/30 bg-gold/5 hover:bg-gold/10 transition-colors cursor-pointer">
              <Lock className="w-5 h-5 text-gold" />
              <span className="text-gray-300">{t.properties.accessOnRequest}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Off-Market Section */}
      <section className="py-24 bg-dark relative overflow-hidden">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 50px,
              #aa864a 50px,
              #aa864a 51px
            )`
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t.reasons.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-6">
              {t.reasons.title}
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              {t.reasons.subtitle}
            </p>
          </motion.div>

          {/* Grid of reasons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group"
              >
                <div className="relative p-6 lg:p-8 bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute top-3 right-3 text-4xl font-serif text-gold/5 group-hover:text-gold/10 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-serif text-lg lg:text-xl text-white mb-2 group-hover:text-gold-light transition-colors">
                      {reason.label}
                    </h3>
                    <p className="text-gray-500 text-sm font-light">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-24 bg-dark-lighter relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t.approach.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white">
              {t.approach.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0">
            {approach.map((item, index) => {
              const Icon = item.icon;
              const isMiddle = index === 1;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 * index }}
                  className={`relative ${isMiddle ? 'lg:-mt-8 lg:z-10' : ''}`}
                >
                  <div className={`p-8 lg:p-10 ${isMiddle ? 'bg-dark border-2 border-gold/30' : 'bg-dark border border-gold/10'} h-full`}>
                    <div className={`w-14 h-14 ${isMiddle ? 'bg-gold/20' : 'bg-gold/10'} flex items-center justify-center mb-6`}>
                      <Icon className={`w-7 h-7 ${isMiddle ? 'text-gold' : 'text-gold-light'}`} />
                    </div>
                    <h3 className="font-serif text-xl lg:text-2xl text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      {item.description}
                    </p>
                    {isMiddle && (
                      <div className="mt-6 pt-6 border-t border-gold/20">
                        <p className="text-gold-light text-sm uppercase tracking-wider">
                          {t.approach.preferred}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 border border-gold/20 bg-dark">
              <Lock className="w-5 h-5 text-gold" />
              <span className="text-gray-300 font-light">{t.approach.guarantee}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-24 bg-dark relative overflow-hidden">
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Message */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-gold" />
                <Eye className="w-5 h-5 text-gold" />
              </div>

              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-6">
                {t.contact.title}
              </h2>

              <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                {t.contact.subtitle}
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4">
                {[t.contact.badges.confidentiality, t.contact.badges.tailored, t.contact.badges.exclusivity].map((item) => (
                  <div key={item} className="flex items-center gap-2 px-4 py-2 border border-gold/20 bg-dark-lighter/50">
                    <Lock className="w-3 h-3 text-gold" />
                    <span className="text-gray-400 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
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

                  {/* Image indicators */}
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

              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 text-sm uppercase tracking-wider font-semibold ${
                  selectedProperty.status === "Exclusif"
                    ? "bg-gold text-dark"
                    : "bg-dark/80 text-gold-light border border-gold/30"
                }`}>
                  {selectedProperty.status}
                </span>
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
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold" />
                  <span className="text-gray-400">{t.properties.priceOnRequest}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-dark-lighter border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Maximize className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t.modal.surface}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.surface} {selectedProperty.surfaceUnit === "hectares" ? "ha" : "m²"}</span>
                </div>
                <div className="p-4 bg-dark-lighter border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Home className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t.modal.rooms}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.rooms}</span>
                </div>
                {selectedProperty.bedrooms > 0 && (
                  <div className="p-4 bg-dark-lighter border border-gold/10">
                    <div className="flex items-center gap-2 text-gold-light mb-1">
                      <BedDouble className="w-4 h-4" />
                      <span className="text-sm uppercase tracking-wider">{t.modal.bedrooms}</span>
                    </div>
                    <span className="text-2xl font-serif text-white">{selectedProperty.bedrooms}</span>
                  </div>
                )}
                <div className="p-4 bg-dark-lighter border border-gold/10">
                  <div className="flex items-center gap-2 text-gold-light mb-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{t.modal.bathrooms}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">{selectedProperty.bathrooms}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-serif text-xl text-white mb-4">{t.modal.description}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Info on demand */}
              <p className="text-gold-light text-sm italic mb-6">+ d&apos;informations sur demande</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-serif text-xl text-white mb-4">{t.modal.features}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedProperty.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-3 bg-dark-lighter border border-gold/10"
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
                    <span className="text-gray-500 text-xs uppercase tracking-wider block">{t.modal.type}</span>
                    <span className="text-white">{selectedProperty.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gold/10">
                  <MapPin className="w-5 h-5 text-gold" />
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block">{t.modal.location}</span>
                    <span className="text-white">{selectedProperty.country}</span>
                  </div>
                </div>
                {selectedProperty.parking > 0 && (
                  <div className="flex items-center gap-3 p-4 border border-gold/10">
                    <Car className="w-5 h-5 text-gold" />
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block">{t.modal.parking}</span>
                      <span className="text-white">{selectedProperty.parking} {selectedProperty.parking > 1 ? t.modal.parkingUnitPlural : t.modal.parkingUnit}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-gold/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gold" />
                    <span className="text-gray-400">
                      {t.modal.availableOnRequest}
                    </span>
                  </div>
                  <button
                    onClick={handleContactClick}
                    className="px-8 py-4 bg-gold hover:bg-gold-light text-dark font-semibold uppercase tracking-wider transition-colors"
                  >
                    {t.modal.contactUs}
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
