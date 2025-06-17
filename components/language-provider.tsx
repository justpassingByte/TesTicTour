"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import enTranslations from "@/app/locales/en/common.json"
import viTranslations from "@/app/locales/vi/common.json"
import koTranslations from "@/app/locales/ko/common.json"
import zhTranslations from "@/app/locales/zh/common.json"

export type Language = "en" | "vi" | "ko" | "zh"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const loadTranslations = (lang: Language) => {
  switch (lang) {
    case "en":
      return enTranslations
    case "vi":
      return viTranslations
    case "ko":
      return koTranslations
    case "zh":
      return zhTranslations
    default:
      return enTranslations // Fallback to English
  }
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    const translations = loadTranslations(language)
    return (translations as Record<string, string>)[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
