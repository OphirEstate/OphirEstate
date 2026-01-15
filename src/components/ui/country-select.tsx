"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";

interface CountrySelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export function CountrySelect({
  label,
  placeholder = "Sélectionner un pays",
  value,
  onChange,
  required,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: string) => {
    setSelectedValue(country);
    onChange?.(country);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {label && (
        <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em]">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-transparent border-b border-gray-700 focus:border-gold py-4 text-left outline-none transition-colors text-lg font-light flex items-center justify-between",
            selectedValue ? "text-white" : "text-gray-500"
          )}
        >
          <span>{selectedValue || placeholder}</span>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-dark-lighter border border-gold/30 shadow-2xl max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-dark border border-gray-700 focus:border-gold rounded-sm py-2 pl-10 pr-4 text-white outline-none transition-colors text-base font-light placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "w-full px-4 py-3 text-left text-base font-light transition-colors hover:bg-gold/10",
                      selectedValue === country
                        ? "text-gold-light bg-gold/5"
                        : "text-gray-300"
                    )}
                  >
                    {country}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 text-base">
                  Aucun pays trouvé
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
