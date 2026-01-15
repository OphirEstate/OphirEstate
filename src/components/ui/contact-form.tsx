"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Textarea, CountrySelect } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

interface ContactFormProps {
  animate?: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({ animate = true }: ContactFormProps) {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages] || messages.fr;
  const contact = t.contact;

  const [formData, setFormData] = useState({
    fullName: "",
    Email: "",
    Country: "",
    Subject: "",
    Message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, Country: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation du pays
    if (!formData.Country) {
      setStatus("error");
      setErrorMessage(locale === "fr" ? "Veuillez sélectionner un pays" : "Please select a country");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setStatus("success");
      setFormData({
        fullName: "",
        Email: "",
        Country: "",
        Subject: "",
        Message: "",
      });

      // Reset status after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    }
  };

  const successMessage = locale === "fr"
    ? "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
    : "Your message has been sent successfully. We will respond as soon as possible.";

  const FormContent = (
    <div className="bg-dark p-6 md:p-10 lg:p-16 border border-gold/30 shadow-2xl">
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
          <h3 className="text-2xl font-serif text-white mb-4">
            {locale === "fr" ? "Message envoyé !" : "Message sent!"}
          </h3>
          <p className="text-gray-400 max-w-md">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 text-left">
          {/* Nom et Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <Input
              label={contact.form.name}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={contact.form.namePlaceholder}
              required
            />
            <Input
              label={contact.form.email}
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              placeholder={contact.form.emailPlaceholder}
              required
            />
          </div>

          {/* Pays et Sujet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <CountrySelect
              label={contact.form.country}
              placeholder={contact.form.countryPlaceholder}
              value={formData.Country}
              onChange={handleCountryChange}
              required
            />
            <Input
              label={contact.form.subject}
              type="text"
              name="Subject"
              value={formData.Subject}
              onChange={handleInputChange}
              placeholder={contact.form.subjectPlaceholder}
              required
            />
          </div>

          {/* Message */}
          <Textarea
            label={contact.form.message}
            name="Message"
            value={formData.Message}
            onChange={handleInputChange}
            rows={4}
            placeholder={contact.form.messagePlaceholder}
            required
          />

          {/* Error Message */}
          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full mt-6 md:mt-10 py-5 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                {locale === "fr" ? "Envoi en cours..." : "Sending..."}
              </span>
            ) : (
              contact.form.submit
            )}
          </Button>
        </form>
      )}
    </div>
  );

  if (!animate) {
    return FormContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {FormContent}
    </motion.div>
  );
}
