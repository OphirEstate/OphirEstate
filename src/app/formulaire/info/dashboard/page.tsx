"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Trash2,
  Loader2,
  RefreshCw,
  Mail,
  User,
  MapPin,
  FileText,
  MessageSquare,
  Calendar,
  AlertCircle,
  Inbox,
  Eye,
  X,
} from "lucide-react";

interface Contact {
  id: number;
  documentId: string;
  fullName: string;
  Email: string;
  Country: string;
  Subject: string;
  Message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      if (!response.ok) {
        router.push("/formulaire/info/login");
        return;
      }
      fetchContacts();
    } catch {
      router.push("/formulaire/info/login");
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/formulaire/info/login");
          return;
        }
        throw new Error("Erreur lors du chargement");
      }
      const data = await response.json();
      setContacts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      return;
    }

    setDeleting(documentId);
    try {
      const response = await fetch(`/api/contacts/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Remove from local state
      setContacts((prev) => prev.filter((c) => c.documentId !== documentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur de suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/formulaire/info/login");
    } catch {
      router.push("/formulaire/info/login");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gold/20 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl text-white">
              Tableau de <span className="text-gold">bord</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Gestion des contacts</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={fetchContacts}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gold transition-colors disabled:opacity-50"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-dark transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:mb-8">
          <div className="bg-dark-lighter border border-gold/10 p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 flex items-center justify-center">
                <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total contacts</p>
                <p className="text-xl sm:text-2xl font-semibold text-white">{contacts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading / Empty State */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-dark-lighter border border-gold/10">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-dark-lighter border border-gold/10">
            <Inbox className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucun contact pour le moment</p>
          </div>
        ) : (
          <>
            {/* Mobile: Card Layout */}
            <div className="block lg:hidden space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.documentId}
                  className="bg-dark-lighter border border-gold/10 p-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">{contact.fullName}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 text-gold hover:text-gold-light hover:bg-gold/10 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.documentId)}
                        disabled={deleting === contact.documentId}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deleting === contact.documentId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold shrink-0" />
                      <a
                        href={`mailto:${contact.Email}`}
                        className="text-gray-300 hover:text-gold transition-colors truncate"
                      >
                        {contact.Email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-gray-300">{contact.Country}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="text-gray-300 line-clamp-1">{contact.Subject}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="text-gray-400 line-clamp-2">{contact.Message}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden lg:block bg-dark-lighter border border-gold/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-dark border-b border-gold/20">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nom
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Pays
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Sujet
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {contacts.map((contact) => (
                      <tr
                        key={contact.documentId}
                        className="hover:bg-gold/5 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-white font-medium">
                          {contact.fullName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          <a
                            href={`mailto:${contact.Email}`}
                            className="hover:text-gold transition-colors"
                          >
                            {contact.Email}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {contact.Country}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300 max-w-[150px]">
                          <p className="truncate" title={contact.Subject}>
                            {contact.Subject}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400 max-w-[200px]">
                          <p className="truncate" title={contact.Message}>
                            {contact.Message}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="p-2 text-gold hover:text-gold-light hover:bg-gold/10 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact.documentId)}
                              disabled={deleting === contact.documentId}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              title="Supprimer"
                            >
                              {deleting === contact.documentId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal for viewing contact details */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedContact(null)}
          />

          {/* Modal */}
          <div className="relative bg-dark-lighter border-t sm:border border-gold/20 w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-none">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold/20 sticky top-0 bg-dark-lighter z-10">
              <h2 className="font-serif text-lg sm:text-xl text-white">
                Détails du <span className="text-gold">contact</span>
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <p className="text-gray-300 text-sm sm:text-base">{formatDate(selectedContact.createdAt)}</p>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <User className="w-4 h-4" />
                  Nom complet
                </label>
                <p className="text-white font-medium text-sm sm:text-base">{selectedContact.fullName}</p>
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <a
                  href={`mailto:${selectedContact.Email}`}
                  className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base break-all"
                >
                  {selectedContact.Email}
                </a>
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <MapPin className="w-4 h-4" />
                  Pays
                </label>
                <p className="text-gray-300 text-sm sm:text-base">{selectedContact.Country}</p>
              </div>

              {/* Subject */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <FileText className="w-4 h-4" />
                  Sujet
                </label>
                <p className="text-gray-300 text-sm sm:text-base">{selectedContact.Subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </label>
                <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base">{selectedContact.Message}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 border-t border-gold/20 sticky bottom-0 bg-dark-lighter">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-6 py-3 sm:py-2 border border-gray-600 text-gray-300 hover:border-gold hover:text-gold transition-colors text-sm sm:text-base"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedContact.documentId);
                  setSelectedContact(null);
                }}
                className="px-6 py-3 sm:py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
