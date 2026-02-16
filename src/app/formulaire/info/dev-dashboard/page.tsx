"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Loader2,
  RefreshCw,
  Plus,
  X,
  Home,
  MapPin,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Upload,
  Building,
  Layers,
  ImageIcon,
} from "lucide-react";

interface Property {
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
  parking: number;
  propertyId: string;
  category: string;
  images: string | null;
  createdAt: string;
}

const TYPE_OPTIONS = ["Appartement", "Villa", "Bureau", "Terrain", "Château"];

const initialForm = {
  category: "",
  visible_from: "",
  name: "",
  type: "",
  description: "",
  location: "",
  rooms: "",
  bedrooms: "",
  surface: "",
  bathrooms: "",
  parking: "",
  price: "",
  nearby_visits: "",
};

export default function DevDashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showCustomType, setShowCustomType] = useState(false);
  const [customType, setCustomType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [nextPropertyId, setNextPropertyId] = useState("P001");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/properties");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      const props = data.data || [];
      setProperties(props);
      setNextPropertyId(`P${String(props.length + 1).padStart(3, "0")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (!response.ok) {
          router.push("/formulaire/info/login");
          return;
        }
        const data = await response.json();
        if (data.role !== "dev") {
          router.push("/formulaire/info/dashboard");
          return;
        }
        fetchProperties();
      } catch {
        router.push("/formulaire/info/login");
      }
    };
    checkAuth();
  }, [router, fetchProperties]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/formulaire/info/login");
    } catch {
      router.push("/formulaire/info/login");
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // 1. Upload images if any
      let imageFilenames: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("images", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.error || "Erreur lors de l'upload des images");
        }

        const uploadData = await uploadRes.json();
        imageFilenames = uploadData.filenames;
      }

      // 2. Create property
      const typeValue = showCustomType ? customType : form.type;

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          description: form.description,
          rooms: parseInt(form.rooms) || 0,
          bedrooms: parseInt(form.bedrooms) || 0,
          bathrooms: parseInt(form.bathrooms) || 0,
          surface: parseInt(form.surface) || 0,
          price: form.price || "0",
          type: typeValue || null,
          parking: parseInt(form.parking) || 0,
          category: form.category,
          images: imageFilenames.length > 0 ? imageFilenames.join(",") : null,
          visible_from: form.visible_from || null,
          nearby_visits: form.nearby_visits || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors de la création");
      }

      const result = await res.json();
      setSuccess(`Bien créé avec succès — ID: ${result.propertyId}`);
      setForm(initialForm);
      setSelectedFiles([]);
      setShowCustomType(false);
      setCustomType("");
      setShowAddForm(false);
      fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const patrimoineCount = properties.filter((p) => p.category === "patrimoine").length;
  const offmarketCount = properties.filter((p) => p.category === "offmarket").length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gold/20 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl text-white">
              Gestion des <span className="text-gold">Biens</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Espace développeur</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                setShowAddForm(true);
                setSuccess("");
                setError("");
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gold hover:bg-gold-light text-dark font-semibold transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter un bien</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
            <button
              onClick={fetchProperties}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gold transition-colors disabled:opacity-50"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-dark transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-dark-lighter border border-gold/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 flex items-center justify-center">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total</p>
                <p className="text-xl sm:text-2xl font-semibold text-white">{properties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-dark-lighter border border-gold/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 flex items-center justify-center">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Patrimoine</p>
                <p className="text-xl sm:text-2xl font-semibold text-white">{patrimoineCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-dark-lighter border border-gold/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 flex items-center justify-center">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Off-Market</p>
                <p className="text-xl sm:text-2xl font-semibold text-white">{offmarketCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-4 sm:mb-6 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Property List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-dark-lighter border border-gold/10">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-dark-lighter border border-gold/10">
            <Building className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucun bien pour le moment</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-2 bg-gold hover:bg-gold-light text-dark font-semibold transition-colors text-sm"
            >
              Ajouter votre premier bien
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Cards */}
            <div className="block lg:hidden space-y-4">
              {properties.map((property) => (
                <div
                  key={property.documentId}
                  className="bg-dark-lighter border border-gold/10 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{property.name}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {property.propertyId} — {formatDate(property.createdAt)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 ${property.category === "patrimoine" ? "bg-gold/20 text-gold" : "bg-blue-500/20 text-blue-400"}`}>
                      {property.category === "patrimoine" ? "Patrimoine" : "Off-Market"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-gray-300">{property.location}</span>
                    </div>
                    {property.type && (
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-gray-300">{property.type}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-gray-400 text-xs mt-2">
                      <span>{property.rooms} pièces</span>
                      <span>{property.surface} m²</span>
                      <span>{property.price === "0" ? "Prix sur demande" : `${Number(property.price).toLocaleString("fr-FR")} €`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden lg:block bg-dark-lighter border border-gold/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-dark border-b border-gold/20">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">ID</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Nom</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Catégorie</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Type</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Lieu</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Surface</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Prix</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {properties.map((property) => (
                      <tr key={property.documentId} className="hover:bg-gold/5 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-400 font-mono">{property.propertyId}</td>
                        <td className="px-4 py-4 text-sm text-white font-medium">{property.name}</td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2 py-1 ${property.category === "patrimoine" ? "bg-gold/20 text-gold" : "bg-blue-500/20 text-blue-400"}`}>
                            {property.category === "patrimoine" ? "Patrimoine" : "Off-Market"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{property.type || "—"}</td>
                        <td className="px-4 py-4 text-sm text-gray-300">{property.location}</td>
                        <td className="px-4 py-4 text-sm text-gray-300">{property.surface} m²</td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {property.price === "0" ? "Sur demande" : `${Number(property.price).toLocaleString("fr-FR")} €`}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400">{formatDate(property.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />

          <div className="relative bg-dark-lighter border-t sm:border border-gold/20 w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold/20 sticky top-0 bg-dark-lighter z-10">
              <h2 className="font-serif text-lg sm:text-xl text-white">
                Ajouter un <span className="text-gold">bien</span>
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
              {/* Row: Category + Date + ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Catégorie *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    required
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm appearance-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="patrimoine">Patrimoine</option>
                    <option value="offmarket">OffMarket</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de visibilité
                  </label>
                  <input
                    type="date"
                    value={form.visible_from}
                    onChange={(e) => updateForm("visible_from", e.target.value)}
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm"
                  />
                </div>

                {/* Auto ID */}
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Identifiant
                  </label>
                  <div className="bg-dark/50 border border-gray-700 px-3 py-3 text-gray-400 text-sm">
                    {nextPropertyId} (auto-généré)
                  </div>
                </div>
              </div>

              {/* Row: Name + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Nom du bien"
                    required
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Type
                  </label>
                  {!showCustomType ? (
                    <select
                      value={form.type}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setShowCustomType(true);
                          updateForm("type", "");
                        } else {
                          updateForm("type", e.target.value);
                        }
                      }}
                      className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm appearance-none"
                    >
                      <option value="">Sélectionner un type</option>
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="__custom__">+ Ajouter un nouveau Type</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        placeholder="Nouveau type..."
                        className="flex-1 bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateForm("type", customType);
                          setShowCustomType(false);
                        }}
                        className="px-3 py-2 bg-gold text-dark text-sm font-semibold hover:bg-gold-light transition-colors"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomType(false);
                          setCustomType("");
                        }}
                        className="px-3 py-2 border border-gray-600 text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Description détaillée du bien..."
                  rows={4}
                  className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500 resize-none"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lieu *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="Adresse ou arrondissement"
                  required
                  className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                />
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Pièces
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.rooms}
                    onChange={(e) => updateForm("rooms", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Chambres
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={(e) => updateForm("bedrooms", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Surface (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.surface}
                    onChange={(e) => updateForm("surface", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Salle de bains
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms}
                    onChange={(e) => updateForm("bathrooms", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Parking
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.parking}
                    onChange={(e) => updateForm("parking", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    placeholder="0"
                    className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Nearby Visits */}
              <div className="space-y-2">
                <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em]">
                  Lieu autour (visites à proximité)
                </label>
                <input
                  type="text"
                  value={form.nearby_visits}
                  onChange={(e) => updateForm("nearby_visits", e.target.value)}
                  placeholder="Tour Eiffel, Musée du Louvre..."
                  className="w-full bg-dark border border-gray-700 focus:border-gold px-3 py-3 text-white outline-none transition-colors text-sm placeholder:text-gray-500"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images
                </label>
                <div className="border border-dashed border-gray-700 hover:border-gold/50 transition-colors p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Cliquez pour sélectionner des images
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      JPG, PNG, WebP — Une ou plusieurs images
                    </p>
                  </label>
                </div>

                {/* File Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-dark border border-gray-700 px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ImageIcon className="w-4 h-4 text-gold shrink-0" />
                          <span className="text-gray-300 truncate">{file.name}</span>
                          <span className="text-gray-500 text-xs shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 sm:py-2 border border-gray-600 text-gray-300 hover:border-gold hover:text-gold transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 sm:py-2 bg-gold hover:bg-gold-light text-dark font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Ajouter le bien
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
