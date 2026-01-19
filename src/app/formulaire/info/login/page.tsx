"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      // Redirect to dashboard using window.location for reliable redirect
      window.location.href = "/formulaire/info/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8 sm:py-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border border-gold/30 rounded-full mb-4 sm:mb-6">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">
            Espace <span className="text-gold">Administration</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm px-4">
            Connectez-vous pour accéder aux formulaires de contact
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-dark-lighter border border-gold/20 p-5 sm:p-8">
          {error && (
            <div className="flex items-center gap-3 p-3 sm:p-4 mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full bg-dark border border-gray-700 focus:border-gold px-3 sm:px-4 py-3 text-white outline-none transition-colors text-sm sm:text-base placeholder:text-gray-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className="w-full bg-dark border border-gray-700 focus:border-gold px-3 sm:px-4 py-3 text-white outline-none transition-colors text-sm sm:text-base placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 sm:mt-8 py-3 sm:py-4 bg-gold hover:bg-gold-light text-dark font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Connexion en cours...</span>
                <span className="sm:hidden">Connexion...</span>
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-4 sm:mt-6">
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
}
