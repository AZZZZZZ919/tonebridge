"use client"

import type React from "react"

import { useCallback } from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Check,
  ChevronsUpDown,
  ChevronRight,
  History,
  Clock,
  Trash,
  Copy,
  Volume2,
  Loader2,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Custom styles for the slider component
import "./slider-styles.css"

// Add this at the beginning of the file, right after the imports
function FixedHeightDrawerContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer-fixed-height">
      <div className="drawer-content-inner">{children}</div>
    </div>
  )
}

// Comprehensive language list
const languages = [
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "ceb", name: "Cebuano" },
  { code: "ny", name: "Chichewa" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "co", name: "Corsican" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "tl", name: "Filipino" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "fy", name: "Frisian" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "iw", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jw", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "ko", name: "Korean" },
  { code: "ku", name: "Kurdish" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Maori" },
  { code: "mr", name: "Marathi" },
  { code: "mn", name: "Mongolian" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "ne", name: "Nepali" },
  { code: "no", name: "Norwegian" },
  { code: "or", name: "Odia (Oriya)" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sm", name: "Samoan" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "sr", name: "Serbian" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
]

// Map language codes to BCP-47 language tags for speech synthesis
const languageToVoiceMap: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP", // Ensure this is correctly set for Japanese
  ko: "ko-KR",
  pt: "pt-BR",
  ru: "ru-RU",
  zh: "zh-CN",
  "zh-TW": "zh-TW",
  ar: "ar-SA",
  nl: "nl-NL",
  hi: "hi-IN",
  id: "id-ID",
  pl: "pl-PL",
  sv: "sv-SE",
  tr: "tr-TR",
  da: "da-DK",
  fi: "fi-FI",
  no: "nb-NO",
  th: "th-TH",
  vi: "vi-VN",
  // Add more mappings as needed
}

// Define languages supported by ElevenLabs with their voice IDs
// This is a more comprehensive list of languages that work well with ElevenLabs
const elevenLabsSupportedLanguages: Record<string, { voiceId: string; name: string }> = {
  en: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "English" },
  ja: { voiceId: "pNInz6obpgDQGcFmaJgB", name: "Japanese" },
  zh: { voiceId: "TxGEqnHWrfWFTfGW9XjX", name: "Chinese" },
  ko: { voiceId: "z3SUtsYQEjhJdJmeYW3w", name: "Korean" },
  fr: { voiceId: "jsCqWAovK2LkecY7zXl4", name: "French" },
  de: { voiceId: "5Q0t7uMcjvnagumLfvUV", name: "German" },
  es: { voiceId: "JBFqnCBsd6RMkjVDRZzb", name: "Spanish" },
  pt: { voiceId: "G4i7KVQYYiPZUhkNZsII", name: "Portuguese" },
  ru: { voiceId: "0lXuWgTwKj9c9MODvR9h", name: "Russian" },
  it: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Italian" },
  ar: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Arabic" },
  hi: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Hindi" },
  nl: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Dutch" },
}

// Define gender-specific voice IDs for ElevenLabs
const elevenLabsVoicesByGender: Record<string, Record<"male" | "female", string>> = {
  default: {
    male: "TxGEqnHWrfWFTfGW9XjX", // Daniel - deep male voice
    female: "EXAVITQu4vr4xnSDxMaL", // Rachel - female voice
  },
  en: {
    male: "ODq5zmih8GrVes37Dizd", // Adam - deep male voice
    female: "EXAVITQu4vr4xnSDxMaL", // Rachel - female voice
  },
  ja: {
    male: "pNInz6obpgDQGcFmaJgB", // Japanese male
    female: "XrExE9yKIg1WjnnlVkGX", // Japanese female
  },
  zh: {
    male: "TxGEqnHWrfWFTfGW9XjX", // Chinese male
    female: "TxGEqnHWrfWFTfGW9XjX", // Using same voice as fallback
  },
  ko: {
    male: "z3SUtsYQEjhJdJmeYW3w", // Korean male
    female: "z3SUtsYQEjhJdJmeYW3w", // Using same voice as fallback
  },
  fr: {
    male: "jsCqWAovK2LkecY7zXl4", // French male
    female: "t0jbNlBVZ17f02VDIeMI", // French female
  },
  de: {
    male: "5Q0t7uMcjvnagumLfvUV", // German male
    female: "gU3zMoQ9hZKQRgKnMoYF", // German female
  },
  es: {
    male: "JBFqnCBsd6RMkjVDRZzb", // Spanish male
    female: "JBFqnCBsd6RMkjVDRZzb", // Using same voice as fallback
  },
}

// Function to check if a language is supported by ElevenLabs
const isLanguageSupportedByElevenLabs = (languageCode: string): boolean => {
  // Return true for all languages to attempt ElevenLabs TTS for any language
  return true
}

// Available models for Google AI Studio free tier
const availableModels = [
  { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
]

// Formality levels with more granularity
const getFormalityLabel = (value: number) => {
  if (value <= 1) return "Very Casual"
  if (value <= 3) return "Casual"
  if (value <= 5) return "Neutral"
  if (value <= 7) return "Formal"
  return "Very Formal"
}

// Translation history item type
interface TranslationHistoryItem {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  formality: number
  timestamp: number
}

// Available accent colors
const accentColors = [
  {
    id: "orange",
    name: "Orange (Default)",
    class: "bg-terminal-orange hover:bg-terminal-orange-light",
    sliderClass: "[&>span]:bg-terminal-orange",
    hoverTextClass: "hover:text-terminal-orange",
    textClass: "text-terminal-orange",
    borderClass: "border-terminal-orange",
    focusClass: "focus:border-terminal-orange focus:ring-terminal-orange",
    variable: "var(--terminal-orange)",
  },
  {
    id: "blue",
    name: "Blue",
    class: "bg-blue-500 hover:bg-blue-600",
    sliderClass: "[&>span]:bg-blue-500",
    hoverTextClass: "hover:text-blue-500",
    textClass: "text-blue-500",
    borderClass: "border-blue-500",
    focusClass: "focus:border-blue-500 focus:ring-blue-500",
    variable: "var(--terminal-blue)",
  },
  {
    id: "green",
    name: "Green",
    class: "bg-green-500 hover:bg-green-600",
    sliderClass: "[&>span]:bg-green-500",
    hoverTextClass: "hover:text-green-500",
    textClass: "text-green-500",
    borderClass: "border-green-500",
    focusClass: "focus:border-green-500 focus:ring-green-500",
    variable: "var(--terminal-green)",
  },
  {
    id: "purple",
    name: "Purple",
    class: "bg-purple-500 hover:bg-purple-600",
    sliderClass: "[&>span]:bg-purple-500",
    hoverTextClass: "hover:text-purple-500",
    textClass: "text-purple-500",
    borderClass: "border-purple-500",
    focusClass: "focus:border-purple-500 focus:ring-purple-500",
    variable: "var(--terminal-purple)",
  },
  {
    id: "pink",
    name: "Pink",
    class: "bg-pink-500 hover:bg-pink-600",
    sliderClass: "[&>span]:bg-pink-500",
    hoverTextClass: "hover:text-pink-500",
    textClass: "text-pink-500",
    borderClass: "border-pink-500",
    focusClass: "focus:border-pink-500 focus:ring-pink-500",
    variable: "var(--terminal-pink)",
  },
  {
    id: "red",
    name: "Red",
    class: "bg-red-500 hover:bg-red-600",
    sliderClass: "[&>span]:bg-red-500",
    hoverTextClass: "hover:text-red-500",
    textClass: "text-red-500",
    borderClass: "border-red-500",
    focusClass: "focus:border-red-500 focus:ring-red-500",
    variable: "var(--terminal-red)",
  },
  {
    id: "yellow",
    name: "Yellow",
    class: "bg-yellow-500 hover:bg-yellow-600",
    sliderClass: "[&>span]:bg-yellow-500",
    hoverTextClass: "hover:text-yellow-500",
    textClass: "text-yellow-500",
    borderClass: "border-yellow-500",
    focusClass: "focus:border-yellow-500 focus:ring-yellow-500",
    variable: "var(--terminal-yellow)",
  },
  {
    id: "teal",
    name: "Teal",
    class: "bg-teal-500 hover:bg-teal-600",
    sliderClass: "[&>span]:bg-teal-500",
    hoverTextClass: "hover:text-teal-500",
    textClass: "text-teal-500",
    borderClass: "border-teal-500",
    focusClass: "focus:border-teal-500 focus:ring-teal-500",
    variable: "var(--terminal-teal)",
  },
  {
    id: "indigo",
    name: "Indigo",
    class: "bg-indigo-500 hover:bg-indigo-600",
    sliderClass: "[&>span]:bg-indigo-500",
    hoverTextClass: "hover:text-indigo-500",
    textClass: "text-indigo-500",
    borderClass: "border-indigo-500",
    focusClass: "focus:border-indigo-500 focus:ring-indigo-500",
    variable: "var(--terminal-indigo)",
  },
  {
    id: "white",
    name: "White",
    class: "bg-white hover:bg-gray-100 text-black",
    sliderClass: "[&>span]:bg-white",
    hoverTextClass: "hover:text-white",
    textClass: "text-white",
    borderClass: "border-white",
    focusClass: "focus:border-white focus:ring-white",
    variable: "white",
  },
]

// Available font families
const fontFamilies = [
  { id: "jetbrains", name: "JetBrains Mono (Default)", class: "font-mono", fontFamily: "'JetBrains Mono', monospace" },
  { id: "inter", name: "Inter", class: "font-sans", fontFamily: "var(--font-inter), sans-serif" },
  { id: "dm-sans", name: "DM Sans", class: "font-dm-sans", fontFamily: "var(--font-dm-sans), sans-serif" },
  { id: "roboto", name: "Roboto", class: "font-roboto", fontFamily: "var(--font-roboto), sans-serif" },
  { id: "montserrat", name: "Montserrat", class: "font-montserrat", fontFamily: "var(--font-montserrat), sans-serif" },
  { id: "lato", name: "Lato", class: "font-lato", fontFamily: "var(--font-lato), sans-serif" },
  {
    id: "source-sans",
    name: "Source Sans",
    class: "font-source-sans",
    fontFamily: "var(--font-source-sans), sans-serif",
  },
  { id: "poppins", name: "Poppins", class: "font-poppins", fontFamily: "'Poppins', sans-serif" },
  { id: "georgia", name: "Georgia", class: "font-serif", fontFamily: "Georgia, serif" },
]

// Helper function to get accent color properties
const getAccentColor = (accentColorId: string) => {
  return accentColors.find((c) => c.id === accentColorId) || accentColors[0]
}

function LanguageCombobox({
  value,
  onChange,
  placeholder,
  accentColor,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  accentColor: string
}) {
  const [open, setOpen] = useState(false)
  const selectedLanguage = languages.find((lang) => lang.code === value)
  const accent = getAccentColor(accentColor)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.hoverTextClass} hover:bg-terminal-gray-light rounded-xl`}
        >
          {selectedLanguage ? selectedLanguage.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-terminal-gray border-terminal-gray-light rounded-xl">
        <Command className="bg-terminal-gray rounded-xl command-menu-seamless">
          <CommandInput
            placeholder="Search language..."
            className="text-terminal-foreground focus:outline-none focus:ring-0 border-transparent focus:border-transparent [&_svg]:text-terminal-gray-muted"
          />
          <CommandList>
            <CommandEmpty className="text-terminal-foreground">No language found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.name}
                  onSelect={() => {
                    onChange(language.code)
                    setOpen(false)
                  }}
                  className={`text-terminal-foreground hover:bg-terminal-gray-light ${accent.hoverTextClass}`}
                >
                  {value === language.code && <Check className={`mr-2 h-4 w-4 ${accent.textClass}`} />}
                  {value !== language.code && <span className="mr-6" />}
                  {language.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Update the FormalitySlider component to only color the value part, not the "Formality:" label

// Add a debounce function to handle resize-related state changes
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Text-to-speech function using Web Speech API
function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis
    }

    // Clean up on unmount
    return () => {
      if (speechSynthesisRef.current && utteranceRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  // Modify the speak function to use the speech rate and gender
  const speak = useCallback(
    (
      text: string,
      languageCode: string,
      rate: "slow" | "normal" | "fast" = "normal",
      gender: "male" | "female" = "male",
    ) => {
      if (!speechSynthesisRef.current) {
        setError("Speech synthesis not supported in your browser")
        return
      }

      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Map language code to BCP-47 language tag
      const voiceLanguage = languageToVoiceMap[languageCode] || languageCode

      // Set language
      utterance.lang = voiceLanguage

      // Function to set the voice for a given language and gender
      const setVoiceForLanguage = (
        utterance: SpeechSynthesisUtterance,
        voices: SpeechSynthesisVoice[],
        languageCode: string,
        gender: "male" | "female",
      ) => {
        // Filter voices by language
        const matchingVoices = voices.filter(
          (v) => v.lang === languageCode || v.lang.startsWith(languageCode.split("-")[0]),
        )

        if (matchingVoices.length > 0) {
          // Try to find a voice matching the requested gender with better detection
          const genderVoices = matchingVoices.filter((v) => {
            const name = v.name.toLowerCase()
            if (gender === "male") {
              // Look for male indicators or absence of female indicators
              return (
                name.includes("male") ||
                name.includes("man") ||
                name.includes("david") ||
                name.includes("alex") ||
                name.includes("daniel") ||
                name.includes("thomas") ||
                (!name.includes("female") && !name.includes("woman") && !name.includes("samantha"))
              )
            } else {
              // Look for female indicators
              return (
                name.includes("female") ||
                name.includes("woman") ||
                name.includes("samantha") ||
                name.includes("victoria") ||
                name.includes("susan") ||
                name.includes("karen") ||
                name.includes("zira")
              )
            }
          })

          // Use gender-specific voice if available, otherwise use first matching voice
          utterance.voice = genderVoices.length > 0 ? genderVoices[0] : matchingVoices[0]

          // Log which voice was selected for debugging
          console.log(`Selected voice: ${utterance.voice?.name} for ${gender} ${languageCode}`)
        } else {
          console.warn(`No voice found for language: ${languageCode}`)
        }

        // Always adjust pitch based on gender for more noticeable difference
        utterance.pitch = gender === "male" ? 0.4 : 1.6
      }

      // Set speech rate based on selection
      switch (rate) {
        case "slow":
          utterance.rate = 0.7
          break
        case "normal":
          utterance.rate = 1.0
          break
        case "fast":
          utterance.rate = 1.3
          break
        default:
          utterance.rate = 1.0
      }

      // Force load voices if needed
      if (speechSynthesisRef.current.getVoices().length === 0) {
        speechSynthesisRef.current.onvoiceschanged = () => {
          const voices = speechSynthesisRef.current?.getVoices() || []
          setVoiceForLanguage(utterance, voices, voiceLanguage, gender)
        }
      } else {
        const voices = speechSynthesisRef.current.getVoices()
        setVoiceForLanguage(utterance, voices, voiceLanguage, gender)
      }

      // Set event handlers - don't show "interrupted" errors as they're expected
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = (event) => {
        setIsPlaying(false)
        // Only show error if it's not an interruption (which is expected when stopping)
        if (event.error !== "interrupted") {
          setError(`Speech synthesis error: ${event.error}`)
        }
      }

      // Start speaking
      speechSynthesisRef.current.speak(utterance)
      setIsPlaying(true)
    },
    [],
  )

  const stop = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsPlaying(false)
    }
  }, [])

  return { speak, stop, isPlaying, error }
}

// ElevenLabs TTS function - FIXED to properly handle all languages and free tier limitations
async function speakWithElevenLabs(
  text: string,
  apiKey: string,
  languageCode: string,
  rate: "slow" | "normal" | "fast" = "normal",
  gender: "male" | "female" = "male",
  onEnd: () => void,
) {
  // Validate inputs before making the API call
  if (!text || !apiKey) {
    console.error("Missing required parameters for ElevenLabs TTS")
    onEnd()
    return { success: false, error: "Missing required parameters" }
  }

  // Limit text length to prevent API issues (ElevenLabs has limits)
  const maxTextLength = 5000
  const trimmedText = text.length > maxTextLength ? text.substring(0, maxTextLength) : text

  try {
    // Get the appropriate voice ID based on language and gender
    let selectedVoiceId = "21m00Tcm4TlvDq8ikWAM" // Default male voice

    // Check if we have a gender-specific voice for this language
    if (elevenLabsVoicesByGender[languageCode]) {
      selectedVoiceId = elevenLabsVoicesByGender[languageCode][gender]
    } else {
      // Fall back to default gender voices
      selectedVoiceId = elevenLabsVoicesByGender.default[gender]
    }

    // Always use multilingual model for better language support
    const modelId = "eleven_multilingual_v2"

    // Set stability based on rate
    let stability = 0.5
    const similarity_boost = 0.5

    // Adjust settings based on rate
    switch (rate) {
      case "slow":
        stability = 0.7 // More stable for slower speech
        break
      case "fast":
        stability = 0.3 // Less stable for faster speech
        break
      default:
        stability = 0.5
    }

    // Add explicit language setting in the API request
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: trimmedText,
        model_id: modelId,
        voice_settings: {
          stability: gender === "male" ? 0.3 : stability, // Lower stability for male voices (more variation)
          similarity_boost: gender === "male" ? 0.7 : similarity_boost, // Higher similarity for male voices
          // Adjust settings based on gender
          ...(gender === "female" && {
            style: 0.5, // Add some style for female voices
            use_speaker_boost: true,
          }),
          ...(gender === "male" && {
            style: 0.2, // Lower style for male voices (more natural)
            use_speaker_boost: false, // Disable speaker boost for male voices
          }),
        },
        // Always apply pitch adjustment for gender, more aggressively for male voices
        pitch: gender === "male" ? -0.4 : 0.2, // Much lower pitch for male, slightly higher for female
      }),
    })

    if (!response.ok) {
      // Try to parse the error response
      let errorMessage = `ElevenLabs API error: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          // Handle structured error response
          if (typeof errorData.detail === "object") {
            if (errorData.detail.status === "invalid_api_key") {
              errorMessage = "Invalid ElevenLabs API key. Please check your settings."
            } else {
              errorMessage = errorData.detail.message || errorMessage
            }
          } else {
            // Check for free tier limitation messages
            if (
              errorData.detail.includes("Unusual activity detected") ||
              errorData.detail.includes("Free Tier usage disabled")
            ) {
              errorMessage = "ElevenLabs free tier limit reached. Consider upgrading to a paid plan or try again later."
            } else {
              errorMessage = errorData.detail || errorMessage
            }
          }
        }
      } catch (e) {
        // If we can't parse the error, just use the status code
        console.error("Failed to parse error response:", e)
      }

      throw new Error(errorMessage)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    // Adjust playback rate for HTML5 Audio element as a fallback
    audio.playbackRate = rate === "slow" ? 0.7 : rate === "fast" ? 1.3 : 1.0

    // Set up event listeners
    audio.addEventListener("ended", () => {
      onEnd()
      URL.revokeObjectURL(audioUrl)
    })

    audio.addEventListener("error", (e) => {
      console.error("Audio playback error", e)
      onEnd()
      URL.revokeObjectURL(audioUrl)
    })

    // Play the audio
    await audio.play()

    return { success: true, audio }
  } catch (error) {
    console.error("Error with ElevenLabs TTS:", error)
    onEnd() // Make sure to call onEnd even if there's an error
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Add a function to get the gender icon
const getGenderIcon = (gender: "male" | "female") => {
  return gender === "male" ? "Male" : "Female"
}

// Add this function after the other utility functions
const checkElevenLabsApiStatus = async (apiKey: string): Promise<boolean> => {
  if (!apiKey || apiKey.trim().length < 8) {
    return false
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.error("Error checking ElevenLabs API status:", error)
    return false
  }
}

// Modify the Sheet component to prevent auto-focus on the API key input
export default function TranslationApp() {
  const [apiKey, setApiKey] = useState("")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en") // Changed from "auto" to "en"
  const [targetLanguage, setTargetLanguage] = useState("ja")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash")
  const [apiVersion, setApiVersion] = useState("v1")
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])
  const [accentColor, setAccentColor] = useState("orange") // Default accent color
  const [fontFamily, setFontFamily] = useState("jetbrains") // Default font
  // Replace the single copySuccess state with individual ones for each window
  const [copySuccessCasual, setCopySuccessCasual] = useState(false)
  const [copySuccessNeutral, setCopySuccessNeutral] = useState(false)
  const [copySuccessFormal, setCopySuccessFormal] = useState(false)
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("")
  const [useElevenLabs, setUseElevenLabs] = useState(false)
  // Replace this line:
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  // With these lines:
  const [isPlayingCasual, setIsPlayingCasual] = useState(false)
  const [isPlayingNeutral, setIsPlayingNeutral] = useState(false)
  const [isPlayingFormal, setIsPlayingFormal] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  // Add these state variables after the existing ones
  const [casualTranslation, setCasualTranslation] = useState("")
  const [neutralTranslation, setNeutralTranslation] = useState("")
  const [formalTranslation, setFormalTranslation] = useState("")

  // Add separate speed and gender settings for each window
  const [speechRateCasual, setSpeechRateCasual] = useState<"slow" | "normal" | "fast">("normal")
  const [speechRateNeutral, setSpeechRateNeutral] = useState<"slow" | "normal" | "fast">("normal")
  const [speechRateFormal, setSpeechRateFormal] = useState<"slow" | "normal" | "fast">("normal")
  const [voiceGenderCasual, setVoiceGenderCasual] = useState<"male" | "female">("male")
  const [voiceGenderNeutral, setVoiceGenderNeutral] = useState<"male" | "female">("male")
  const [voiceGenderFormal, setVoiceGenderFormal] = useState<"male" | "female">("male")

  // Add a new state variable for tracking drawer open state after the other state variables:
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)

  // Add separate dropdown state variables for each window
  const [showSpeedOptionsCasual, setShowSpeedOptionsCasual] = useState(false)
  const [showSpeedOptionsNeutral, setShowSpeedOptionsNeutral] = useState(false)
  const [showSpeedOptionsFormal, setShowSpeedOptionsFormal] = useState(false)
  const [showGenderOptionsCasual, setShowGenderOptionsCasual] = useState(false)
  const [showGenderOptionsNeutral, setShowGenderOptionsNeutral] = useState(false)
  const [showGenderOptionsFormal, setShowGenderOptionsFormal] = useState(false)

  // Use the text-to-speech hook
  const { speak, stop, isPlaying, error: speechError } = useTextToSpeech()

  // Get the current accent color object
  const accent = getAccentColor(accentColor)

  // Use debounced values for resize-sensitive states
  const [formality, setFormality] = useState<number>(5)
  const debouncedFormality = useDebounce(formality, 100)

  // Get the current font family object
  const currentFont = fontFamilies.find((f) => f.id === fontFamily) || fontFamilies[0]

  // Add a ref for the sheet content
  const sheetContentRef = useRef<HTMLDivElement>(null)

  // Add a ref for the history content:
  const historyContentRef = useRef<HTMLDivElement>(null)

  // Function to prevent auto-focus when sheet opens
  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      // Use setTimeout to ensure this runs after the sheet has opened
      setTimeout(() => {
        // If there's an active element, blur it
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }, 0)
    }
  }

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Apply font and accent color to document root when they change
  useEffect(() => {
    if (!hasMounted) {
      return
    }
    // Apply font to document root
    document.documentElement.style.setProperty("font-family", currentFont.fontFamily, "important")

    // Create a style element to force the font on all elements
    const styleEl = document.createElement("style")
    styleEl.textContent = `
    * {
      font-family: ${currentFont.fontFamily} !important;
    }
    .radix-select-content *,
    .radix-popover-content *,
    .radix-dropdown-menu-content *,
    [data-radix-popper-content-wrapper] *,
    [role="dialog"] * {
      font-family: ${currentFont.fontFamily} !important;
    }
    
    /* Apply accent color to focus rings and outlines */
    .accent-color-text {
      color: ${accent.variable} !important;
    }
    
    .accent-color-border {
      border-color: ${accent.variable} !important;
    }
    
    .accent-color-bg {
      background-color: ${accent.variable} !important;
    }

    /* Fix double outlines */
    *:focus {
      outline: none !important;
    }

    /* Consistent focus styles */
    button:focus-visible, 
    input:focus-visible, 
    select:focus-visible, 
    textarea:focus-visible,
    [data-radix-select-trigger]:focus-visible,
    [data-radix-select-trigger][data-state="open"] {
      outline: none !important;
      box-shadow: 0 0 0 2px ${accent.variable} !important;
      border-color: transparent !important;
    }

    /* Fix for radix components */
    [data-radix-popper-content-wrapper] * {
      outline: none !important;
    }

    /* Fix for command input */
    [cmdk-input] {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--terminal-gray-light) !important;
    }

    /* Adjust drawer pull indicator opacity */
    [data-radix-drawer-content] [data-state] {
      opacity: 0.7 !important;
    }
  `

    // Add the style element to the head
    document.head.appendChild(styleEl)

    // Add a class to the document body for the current accent color
    document.body.className = `${accentColor}-accent ${document.body.className}`.trim()

    // Clean up
    return () => {
      document.head.removeChild(styleEl)
      document.body.className = document.body.className.replace(`${accentColor}-accent`, "").trim()
    }
  }, [fontFamily, currentFont, accent, hasMounted, accentColor])

  useEffect(() => {
    if (!hasMounted) {
      return
    }
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("geminiApiKey")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // Load saved model and API version if available
    const savedModel = localStorage.getItem("geminiModel")
    if (savedModel) {
      setSelectedModel(savedModel)
    }

    // Load saved API version if available
    const savedApiVersion = localStorage.getItem("geminiApiVersion")
    if (savedApiVersion) {
      setApiVersion(savedApiVersion)
    }

    // Load saved languages if available, otherwise use defaults
    const savedSourceLang = localStorage.getItem("sourceLanguage")
    if (savedSourceLang) {
      setSourceLanguage(savedSourceLang)
    } else {
      // Set default source language to Japanese
      setSourceLanguage("ja")
    }

    const savedTargetLang = localStorage.getItem("targetLanguage")
    if (savedTargetLang) {
      setTargetLanguage(savedTargetLang)
    } else {
      // If no target language is saved, default to English
      setTargetLanguage("en")
    }

    // Load translation history
    const savedHistory = localStorage.getItem("translationHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse translation history", e)
      }
    }

    // Load saved preferences
    const savedAccentColor = localStorage.getItem("accentColorPreference")
    if (savedAccentColor) {
      setAccentColor(savedAccentColor)
    }

    const savedFontFamily = localStorage.getItem("fontFamilyPreference")
    if (savedFontFamily) {
      setFontFamily(savedFontFamily)
    }

    // Load ElevenLabs API key if available
    const savedElevenLabsApiKey = localStorage.getItem("elevenLabsApiKey")
    if (savedElevenLabsApiKey) {
      setElevenLabsApiKey(savedElevenLabsApiKey)
    }

    const savedUseElevenLabs = localStorage.getItem("useElevenLabs")
    if (savedUseElevenLabs) {
      setUseElevenLabs(savedUseElevenLabs === "true")
    }
  }, [hasMounted])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem("geminiApiKey", key)
  }

  const saveElevenLabsApiKey = (key: string) => {
    setElevenLabsApiKey(key)
    localStorage.setItem("elevenLabsApiKey", key)
  }

  const saveUseElevenLabs = (value: boolean) => {
    setUseElevenLabs(value)
    localStorage.setItem("useElevenLabs", value.toString())
  }

  const saveModel = (model: string) => {
    setSelectedModel(model)
    localStorage.setItem("geminiModel", model)
  }

  const saveApiVersion = (version: string) => {
    setApiVersion(version)
    localStorage.setItem("geminiApiVersion", version)
  }

  const saveHistory = (newHistory: TranslationHistoryItem[]) => {
    setHistory(newHistory)
    localStorage.setItem("translationHistory", JSON.stringify(newHistory))
  }

  const addToHistory = (item: TranslationHistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50) // Keep only the last 50 translations
    saveHistory(newHistory)
  }

  const clearHistory = () => {
    saveHistory([])
  }

  const loadFromHistory = (item: TranslationHistoryItem) => {
    // First load the data
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setSourceLanguage(item.sourceLanguage)
    setTargetLanguage(item.targetLanguage)
    setFormality(item.formality)

    // Use a small timeout to ensure the data is loaded before closing the drawer
    // This prevents any visual resizing during the transition
    setTimeout(() => {
      setHistoryDrawerOpen(false)
    }, 10)
  }

  const saveAccentColor = (color: string) => {
    setAccentColor(color)
    localStorage.setItem("accentColorPreference", color)
  }

  const saveFontFamily = (font: string) => {
    setFontFamily(font)
    localStorage.setItem("fontFamilyPreference", font)
  }

  const saveSourceLanguage = (lang: string) => {
    setSourceLanguage(lang)
    localStorage.setItem("sourceLanguage", lang)
  }

  const saveTargetLanguage = (lang: string) => {
    setTargetLanguage(lang)
    localStorage.setItem("targetLanguage", lang)
  }

  // Update the handleCopyText function to handle individual copy states
  const handleCopyText = (textToCopy?: string, translationType?: "casual" | "neutral" | "formal") => {
    const text = textToCopy || translatedText
    navigator.clipboard.writeText(text)

    // Set the appropriate copy success state based on translation type
    if (translationType === "casual") {
      setCopySuccessCasual(true)
      setTimeout(() => setCopySuccessCasual(false), 2000)
    } else if (translationType === "neutral") {
      setCopySuccessNeutral(true)
      setTimeout(() => setCopySuccessNeutral(false), 2000)
    } else if (translationType === "formal") {
      setCopySuccessFormal(true)
      setTimeout(() => setCopySuccessFormal(false), 2000)
    }
  }

  // Modify the handlePlayText function to use the appropriate settings for each window
  const handlePlayText = async (textToPlay?: string, translationType?: "casual" | "neutral" | "formal") => {
    const text = textToPlay || translatedText
    if (!text) return

    setTtsError(null)

    // Check if any audio is currently playing and stop it
    if (isPlayingCasual || isPlayingNeutral || isPlayingFormal) {
      stop()
      setIsPlayingCasual(false)
      setIsPlayingNeutral(false)
      setIsPlayingFormal(false)
      return
    }

    // Get the appropriate settings based on translation type
    let currentSpeechRate: "slow" | "normal" | "fast" = "normal"
    let currentVoiceGender: "male" | "female" = "male"

    if (translationType === "casual") {
      setIsPlayingCasual(true)
      currentSpeechRate = speechRateCasual
      currentVoiceGender = voiceGenderCasual
    } else if (translationType === "neutral") {
      setIsPlayingNeutral(true)
      currentSpeechRate = speechRateNeutral
      currentVoiceGender = voiceGenderNeutral
    } else if (translationType === "formal") {
      setIsPlayingFormal(true)
      currentSpeechRate = speechRateFormal
      currentVoiceGender = voiceGenderFormal
    }

    // Debug logging
    console.log(`Playing ${translationType} with rate: ${currentSpeechRate}, gender: ${currentVoiceGender}`)

    try {
      if (useElevenLabs && elevenLabsApiKey) {
        // Validate API key format before attempting to use ElevenLabs
        if (!elevenLabsApiKey.trim() || elevenLabsApiKey.length < 8) {
          setTtsError("Invalid ElevenLabs API key format. Using browser TTS instead.")
          speak(text, targetLanguage, currentSpeechRate, currentVoiceGender)
          return
        }

        // Use ElevenLabs for more realistic voices
        const result = await speakWithElevenLabs(
          text,
          elevenLabsApiKey,
          targetLanguage,
          currentSpeechRate,
          currentVoiceGender,
          () => {
            // Reset all playing states when audio ends
            setIsPlayingCasual(false)
            setIsPlayingNeutral(false)
            setIsPlayingFormal(false)
          },
        )

        if (!result.success) {
          console.warn("ElevenLabs TTS failed, falling back to browser TTS:", result.error)

          // Check for free tier limitation messages
          if (
            result.error &&
            (result.error.includes("free tier") ||
              result.error.includes("Free Tier") ||
              result.error.includes("Unusual activity"))
          ) {
            setTtsError(
              "ElevenLabs free tier limit reached. The free plan has usage restrictions. Falling back to browser TTS.",
            )
          } else {
            setTtsError(
              result.error
                ? `${result.error} Using browser TTS instead.`
                : "ElevenLabs TTS unavailable. Using browser TTS instead.",
            )
          }

          // Small delay before falling back to browser TTS
          setTimeout(() => {
            speak(text, targetLanguage, currentSpeechRate, currentVoiceGender)
          }, 100)
        }
      } else {
        // Use browser's built-in speech synthesis
        speak(text, targetLanguage, currentSpeechRate, currentVoiceGender)
      }
    } catch (error) {
      console.error("TTS error:", error)
      setTtsError("Error playing audio. Please try again.")
      // Reset all playing states on error
      setIsPlayingCasual(false)
      setIsPlayingNeutral(false)
      setIsPlayingFormal(false)
    }
  }

  // Add a function to get the speed icon
  const getSpeedIcon = (speed: "slow" | "normal" | "fast") => {
    switch (speed) {
      case "slow":
        return "0.7x"
      case "normal":
        return "1.0x"
      case "fast":
        return "1.3x"
      default:
        return "1.0x"
    }
  }

  // Add a function to get the gender icon
  const getGenderIcon = (gender: "male" | "female") => {
    return gender === "male" ? "Male" : "Female"
  }

  useEffect(() => {
    // Update playing states based on the hook's isPlaying state
    if (!isPlaying) {
      // When speech stops, reset all playing states
      setIsPlayingCasual(false)
      setIsPlayingNeutral(false)
      setIsPlayingFormal(false)
    }

    // Set error if there's a speech error
    if (speechError) {
      setTtsError(speechError)
    }
  }, [isPlaying, speechError])

  const getFormalityInstruction = (level: number) => {
    if (level <= 1) return "Use very casual, colloquial language in the translation, including slang where appropriate."
    if (level <= 3) return "Use casual, informal language in the translation."
    if (level <= 5) return "" // Neutral, no special instruction
    if (level <= 7) return "Use formal language in the translation."
    return "Use very formal, polite language in the translation, with the highest level of respect."
  }

  // Also update the handleTranslate function to remove the special case for "auto"
  const handleTranslate = async () => {
    if (!apiKey) {
      setError("Please enter your Gemini API key in settings")
      return
    }

    if (!sourceText.trim()) {
      return
    }

    setIsTranslating(true)
    setError("")

    // Clear previous translations
    setCasualTranslation("")
    setNeutralTranslation("")
    setFormalTranslation("")

    try {
      // Get language names for better prompting
      const sourceLangName = languages.find((l) => l.code === sourceLanguage)?.name || sourceLanguage
      const targetLangName = languages.find((l) => l.code === targetLanguage)?.name || targetLanguage

      // Use the selected model and API version
      const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${selectedModel}:generateContent?key=${apiKey}`

      // Create three parallel translation requests
      const translationPromises = [
        // Casual translation
        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text from ${sourceLangName} to ${targetLangName}. Use very casual, colloquial language in the translation, including slang where appropriate. Only return the translated text without any explanations or additional text:

${sourceText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
            },
          }),
        }),
        // Neutral translation
        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text from ${sourceLangName} to ${targetLangName}. Use neutral, standard language in the translation. Only return the translated text without any explanations or additional text:

${sourceText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
            },
          }),
        }),
        // Formal translation
        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text from ${sourceLangName} to ${targetLangName}. Use very formal, polite language in the translation, with the highest level of respect. Only return the translated text without any explanations or additional text:

${sourceText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
            },
          }),
        }),
      ]

      // Wait for all translations to complete
      const responses = await Promise.all(translationPromises)
      const dataPromises = responses.map((response) => response.json())
      const results = await Promise.all(dataPromises)

      // Process each translation result
      results.forEach((data, index) => {
        if (data.error) {
          setError(`API Error: ${data.error.message || "Translation failed"}`)
          console.error("API Error:", data.error)
        } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          // Extract just the translated text, removing any quotes or explanations
          let result = data.candidates[0].content.parts[0].text
          // Remove quotes and potential explanations
          result = result.replace(/^["']|["']$/g, "")
          result = result.replace(/^Translation: /i, "")

          // Set the appropriate translation based on index
          if (index === 0) {
            setCasualTranslation(result)
          } else if (index === 1) {
            setNeutralTranslation(result)
          } else if (index === 2) {
            setFormalTranslation(result)
          }
        } else {
          console.error("Unexpected API response:", data)
          setError("Unexpected response format from API")
        }
      })

      // Add to history (using neutral translation as the main one)
      if (results[1] && results[1].candidates && results[1].candidates[0]?.content?.parts?.[0]?.text) {
        let neutralResult = results[1].candidates[0].content.parts[0].text
        neutralResult = neutralResult.replace(/^["']|["']$/g, "")
        neutralResult = neutralResult.replace(/^Translation: /i, "")

        addToHistory({
          id: Date.now().toString(),
          sourceText,
          translatedText: neutralResult,
          sourceLanguage,
          targetLanguage,
          formality: 5, // Neutral formality for history
          timestamp: Date.now(),
        })
      }
    } catch (err) {
      console.error("Translation error:", err)
      setError("Failed to connect to Gemini API. Check your API key and internet connection.")
    } finally {
      setIsTranslating(false)
    }
  }

  // Get the button class based on the selected accent color
  const getButtonClass = () => {
    return accent.class
  }

  // Add a click handler to close the speed options when clicking outside
  // Replace the existing useEffect hooks with these updated ones:

  // Add a click handler to close the speed options when clicking outside
  useEffect(() => {
    if (showSpeedOptionsCasual || showSpeedOptionsNeutral || showSpeedOptionsFormal) {
      const handleClickOutside = (e: MouseEvent) => {
        // Only close if clicking outside the speed options container
        const speedOptionsContainer = document.querySelector(".speed-options-container")
        if (speedOptionsContainer && !speedOptionsContainer.contains(e.target as Node)) {
          setShowSpeedOptionsCasual(false)
          setShowSpeedOptionsNeutral(false)
          setShowSpeedOptionsFormal(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showSpeedOptionsCasual, showSpeedOptionsNeutral, showSpeedOptionsFormal])

  // Add a click handler to close the gender options when clicking outside
  useEffect(() => {
    if (showGenderOptionsCasual || showGenderOptionsNeutral || showGenderOptionsFormal) {
      const handleClickOutside = (e: MouseEvent) => {
        // Only close if clicking outside the gender options container
        const genderOptionsContainer = document.querySelector(".gender-options-container")
        if (genderOptionsContainer && !genderOptionsContainer.contains(e.target as Node)) {
          setShowGenderOptionsCasual(false)
          setShowGenderOptionsNeutral(false)
          setShowGenderOptionsFormal(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showGenderOptionsCasual, showGenderOptionsNeutral, showGenderOptionsFormal])

  // Add an effect to scroll down when the drawer opens:
  useEffect(() => {
    if (historyDrawerOpen && historyContentRef.current) {
      // Small delay to ensure the drawer is fully rendered
      setTimeout(() => {
        if (historyContentRef.current) {
          // Scroll to the top first to provide a visual cue
          historyContentRef.current.scrollTop = 0

          // Then animate scrolling down a bit to show there's content
          setTimeout(() => {
            if (historyContentRef.current) {
              historyContentRef.current.scrollTo({
                top: 100,
                behavior: "smooth",
              })
            }
          }, 300)
        }
      }, 100)
    }
  }, [historyDrawerOpen])

  // Add this with the other state variables
  const [elevenLabsApiStatus, setElevenLabsApiStatus] = useState<"unknown" | "available" | "unavailable">("unknown")

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    if (useElevenLabs && elevenLabsApiKey && hasMounted) {
      setElevenLabsApiStatus("unknown")

      checkElevenLabsApiStatus(elevenLabsApiKey).then((isAvailable) => {
        setElevenLabsApiStatus(isAvailable ? "available" : "unavailable")
      })
    }
  }, [elevenLabsApiKey, useElevenLabs, hasMounted])

  // Check if the current target language is supported by ElevenLabs
  const isCurrentLanguageSupportedByElevenLabs = isLanguageSupportedByElevenLabs(targetLanguage)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-background">
      <div className="flex justify-center w-full mb-8 mt-8">
        <Image
          src="/images/tonebridge-logo.png"
          alt="Tonebridge Logo"
          width={200}
          height={35}
          className="object-contain"
        />
      </div>
      <Card className="w-full max-w-4xl bg-terminal-background border-terminal-gray rounded-2xl overflow-hidden">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="w-[calc(50%-1.5rem)]">
              <LanguageCombobox
                value={sourceLanguage}
                onChange={saveSourceLanguage}
                placeholder="Source language"
                accentColor={accentColor}
              />
            </div>
            <div className={`flex items-center justify-center w-6 h-6 ${accent.class.split(" ")[0]} rounded-full`}>
              <ChevronRight className="h-4 w-4 text-black" />
            </div>
            <div className="w-[calc(50%-1.5rem)]">
              <LanguageCombobox
                value={targetLanguage}
                onChange={saveTargetLanguage}
                placeholder="Target language"
                accentColor={accentColor}
              />
            </div>
          </div>

          {/* Responsive Formality Slider */}

          {/* Replace the existing translation grid section with this: */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-terminal-foreground opacity-70">Source Text</Label>
              <Textarea
                placeholder="Enter text to translate"
                className={`min-h-[180px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} placeholder:text-terminal-gray-muted rounded-xl`}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>

            {/* Casual Translation Window */}
            <div className="space-y-2 relative">
              <Label className="text-xs text-terminal-foreground opacity-70">Casual</Label>
              <Textarea
                placeholder="Casual translation will appear here"
                className={`min-h-[180px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground placeholder:text-terminal-gray-muted rounded-xl`}
                value={casualTranslation}
                readOnly
              />
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {casualTranslation && (
                  <>
                    <div className="relative speed-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowSpeedOptionsCasual(!showSpeedOptionsCasual)
                          setShowGenderOptionsCasual(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsNeutral(false)
                          setShowSpeedOptionsFormal(false)
                          setShowGenderOptionsNeutral(false)
                          setShowGenderOptionsFormal(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getSpeedIcon(speechRateCasual)}
                        </span>
                        <span className="sr-only">Adjust speech rate</span>
                      </Button>
                      {showSpeedOptionsCasual && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateCasual === "slow" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateCasual("slow")
                                setShowSpeedOptionsCasual(false)
                              }}
                            >
                              Slow (0.7x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateCasual === "normal" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateCasual("normal")
                                setShowSpeedOptionsCasual(false)
                              }}
                            >
                              Normal (1.0x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateCasual === "fast" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateCasual("fast")
                                setShowSpeedOptionsCasual(false)
                              }}
                            >
                              Fast (1.3x)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative gender-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowGenderOptionsCasual(!showGenderOptionsCasual)
                          setShowSpeedOptionsCasual(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsNeutral(false)
                          setShowSpeedOptionsFormal(false)
                          setShowGenderOptionsNeutral(false)
                          setShowGenderOptionsFormal(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getGenderIcon(voiceGenderCasual)}
                        </span>
                        <span className="sr-only">Adjust voice gender</span>
                      </Button>
                      {showGenderOptionsCasual && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderCasual === "male" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderCasual("male")
                                setShowGenderOptionsCasual(false)
                              }}
                            >
                              Male
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderCasual === "female" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderCasual("female")
                                setShowGenderOptionsCasual(false)
                              }}
                            >
                              Female
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handlePlayText(casualTranslation, "casual")}
                      disabled={!casualTranslation}
                    >
                      {isPlayingCasual ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Play casual translation</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handleCopyText(casualTranslation, "casual")}
                    >
                      {copySuccessCasual ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Copy casual translation</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Neutral Translation Window */}
            <div className="space-y-2 relative">
              <Label className="text-xs text-terminal-foreground opacity-70">Neutral</Label>
              <Textarea
                placeholder="Neutral translation will appear here"
                className={`min-h-[180px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground placeholder:text-terminal-gray-muted rounded-xl`}
                value={neutralTranslation}
                readOnly
              />
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {neutralTranslation && (
                  <>
                    <div className="relative speed-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowSpeedOptionsNeutral(!showSpeedOptionsNeutral)
                          setShowGenderOptionsNeutral(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsCasual(false)
                          setShowSpeedOptionsFormal(false)
                          setShowGenderOptionsCasual(false)
                          setShowGenderOptionsFormal(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getSpeedIcon(speechRateNeutral)}
                        </span>
                        <span className="sr-only">Adjust speech rate</span>
                      </Button>
                      {showSpeedOptionsNeutral && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateNeutral === "slow" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateNeutral("slow")
                                setShowSpeedOptionsNeutral(false)
                              }}
                            >
                              Slow (0.7x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateNeutral === "normal" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateNeutral("normal")
                                setShowSpeedOptionsNeutral(false)
                              }}
                            >
                              Normal (1.0x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateNeutral === "fast" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateNeutral("fast")
                                setShowSpeedOptionsNeutral(false)
                              }}
                            >
                              Fast (1.3x)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative gender-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowGenderOptionsNeutral(!showGenderOptionsNeutral)
                          setShowSpeedOptionsNeutral(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsCasual(false)
                          setShowSpeedOptionsFormal(false)
                          setShowGenderOptionsCasual(false)
                          setShowGenderOptionsFormal(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getGenderIcon(voiceGenderNeutral)}
                        </span>
                        <span className="sr-only">Adjust voice gender</span>
                      </Button>
                      {showGenderOptionsNeutral && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderNeutral === "male" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderNeutral("male")
                                setShowGenderOptionsNeutral(false)
                              }}
                            >
                              Male
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderNeutral === "female" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderNeutral("female")
                                setShowGenderOptionsNeutral(false)
                              }}
                            >
                              Female
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handlePlayText(neutralTranslation, "neutral")}
                      disabled={!neutralTranslation}
                    >
                      {isPlayingNeutral ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Play neutral translation</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handleCopyText(neutralTranslation, "neutral")}
                    >
                      {copySuccessNeutral ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Copy neutral translation</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Formal Translation Window */}
            <div className="space-y-2 relative">
              <Label className="text-xs text-terminal-foreground opacity-70">Formal</Label>
              <Textarea
                placeholder="Formal translation will appear here"
                className={`min-h-[180px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground placeholder:text-terminal-gray-muted rounded-xl`}
                value={formalTranslation}
                readOnly
              />
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {formalTranslation && (
                  <>
                    <div className="relative speed-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowSpeedOptionsFormal(!showSpeedOptionsFormal)
                          setShowGenderOptionsFormal(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsCasual(false)
                          setShowSpeedOptionsNeutral(false)
                          setShowGenderOptionsCasual(false)
                          setShowGenderOptionsNeutral(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getSpeedIcon(speechRateFormal)}
                        </span>
                        <span className="sr-only">Adjust speech rate</span>
                      </Button>
                      {showSpeedOptionsFormal && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateFormal === "slow" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateFormal("slow")
                                setShowSpeedOptionsFormal(false)
                              }}
                            >
                              Slow (0.7x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateFormal === "normal" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateFormal("normal")
                                setShowSpeedOptionsFormal(false)
                              }}
                            >
                              Normal (1.0x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRateFormal === "fast" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSpeechRateFormal("fast")
                                setShowSpeedOptionsFormal(false)
                              }}
                            >
                              Fast (1.3x)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative gender-options-container">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowGenderOptionsFormal(!showGenderOptionsFormal)
                          setShowSpeedOptionsFormal(false)
                          // Close other windows' dropdowns
                          setShowSpeedOptionsCasual(false)
                          setShowSpeedOptionsNeutral(false)
                          setShowGenderOptionsCasual(false)
                          setShowGenderOptionsNeutral(false)
                        }}
                      >
                        <span className="text-[10px] text-terminal-foreground opacity-70">
                          {getGenderIcon(voiceGenderFormal)}
                        </span>
                        <span className="sr-only">Adjust voice gender</span>
                      </Button>
                      {showGenderOptionsFormal && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderFormal === "male" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderFormal("male")
                                setShowGenderOptionsFormal(false)
                              }}
                            >
                              Male
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${voiceGenderFormal === "female" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoiceGenderFormal("female")
                                setShowGenderOptionsFormal(false)
                              }}
                            >
                              Female
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handlePlayText(formalTranslation, "formal")}
                      disabled={!formalTranslation}
                    >
                      {isPlayingFormal ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Play formal translation</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={() => handleCopyText(formalTranslation, "formal")}
                    >
                      {copySuccessFormal ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Copy formal translation</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {ttsError && (
            <div className="p-3 bg-terminal-gray border border-terminal-orange rounded-xl">
              <p className="text-sm text-terminal-orange">{ttsError}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-terminal-gray border border-terminal-orange rounded-xl">
              <p className="text-sm text-terminal-orange">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-terminal-gray pt-4 flex justify-between items-center">
          <Button
            className={`flex-1 mr-2 ${getButtonClass()} text-black font-bold rounded-xl`}
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
          >
            {isTranslating ? "Translating..." : "Translate"}
          </Button>

          <div className="flex space-x-2">
            {/* History Button */}
            <Drawer open={historyDrawerOpen} onOpenChange={setHistoryDrawerOpen} className="drawer-no-resize">
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground hover:bg-terminal-gray-light ${accent.hoverTextClass} rounded-xl`}
                >
                  <History className="h-5 w-5" />
                  <span className="sr-only">History</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent
                className="bg-terminal-background border-terminal-gray text-terminal-foreground rounded-t-2xl drawer-content"
                data-custom-drawer="true"
              >
                <FixedHeightDrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className={accent.textClass}>Translation History</DrawerTitle>
                    <DrawerDescription className="text-terminal-foreground opacity-70">
                      Your recent translations
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    {/* Use a fixed height instead of a dynamic one to avoid ResizeObserver issues */}
                    <div ref={historyContentRef} className="h-[50vh] overflow-y-auto pr-2">
                      {history.length === 0 ? (
                        <div className="py-4 text-center text-terminal-foreground opacity-50">
                          No translation history yet
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {history.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3 bg-terminal-gray border border-terminal-gray-light rounded-xl hover:border-${accentColor === "orange" ? "terminal-orange" : `${accentColor}-500`} cursor-pointer`}
                              onClick={() => loadFromHistory(item)}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center text-xs" style={{ color: accent.variable }}>
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(item.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-xs text-terminal-foreground opacity-70 mb-2">
                                {languages.find((l) => l.code === item.sourceLanguage)?.name} &gt;{" "}
                                {languages.find((l) => l.code === item.targetLanguage)?.name} (
                                {getFormalityLabel(item.formality)})
                              </div>
                              <div className="text-sm text-terminal-foreground line-clamp-2">{item.sourceText}</div>
                              <div className="text-sm text-terminal-foreground opacity-70 mt-1 line-clamp-2">
                                {item.translatedText}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DrawerFooter className="border-t border-terminal-gray">
                    <Button
                      variant="outline"
                      className={`${accent.borderClass} ${accent.textClass} hover:bg-terminal-gray rounded-xl`}
                      onClick={clearHistory}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear History
                    </Button>
                    <DrawerClose asChild>
                      <Button className="bg-terminal-gray text-terminal-foreground hover:bg-terminal-gray-light rounded-xl">
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </FixedHeightDrawerContent>
              </DrawerContent>
            </Drawer>

            {/* Settings Button */}
            <Sheet onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground hover:bg-terminal-gray-light ${accent.hoverTextClass} rounded-xl`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                ref={sheetContentRef}
                className="bg-terminal-background border-terminal-gray text-terminal-foreground rounded-l-2xl max-h-screen p-0 w-[350px] sm:w-[400px] max-w-[90vw]"
              >
                <div className="h-full overflow-y-auto">
                  <div className="p-6">
                    <SheetHeader>
                      <SheetTitle className={accent.textClass}>Settings</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="apiKey" className="text-terminal-foreground">
                          Gemini API Key
                        </Label>
                        <Input
                          id="apiKey"
                          type="password"
                          value={apiKey}
                          onChange={(e) => saveApiKey(e.target.value)}
                          placeholder="Enter your Gemini API key"
                          className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
                          autoFocus={false}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="model" className="text-terminal-foreground">
                          Model
                        </Label>
                        <Select value={selectedModel} onValueChange={saveModel}>
                          <SelectTrigger
                            id="model"
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl`}
                          >
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent className="bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl">
                            {availableModels.map((model) => (
                              <SelectItem
                                key={model.id}
                                value={model.id}
                                className={`text-terminal-foreground focus:bg-terminal-gray-light ${accent.hoverTextClass}`}
                              >
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="apiVersion" className="text-terminal-foreground">
                          API Version
                        </Label>
                        <Select value={apiVersion} onValueChange={saveApiVersion}>
                          <SelectTrigger
                            id="apiVersion"
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl`}
                          >
                            <SelectValue placeholder="Select API version" />
                          </SelectTrigger>
                          <SelectContent className="bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl">
                            <SelectItem
                              value="v1"
                              className={`text-terminal-foreground focus:bg-terminal-gray-light ${accent.hoverTextClass}`}
                            >
                              v1
                            </SelectItem>
                            <SelectItem
                              value="v1beta"
                              className={`text-terminal-foreground focus:bg-terminal-gray-light ${accent.hoverTextClass}`}
                            >
                              v1beta
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border-t border-terminal-gray-light pt-4">
                        <h3 className={`text-sm font-medium mb-2 ${accent.textClass}`}>Text-to-Speech Settings</h3>

                        <div className="flex items-center space-x-2 mb-4">
                          <input
                            type="checkbox"
                            id="useElevenLabs"
                            checked={useElevenLabs}
                            onChange={(e) => saveUseElevenLabs(e.target.checked)}
                            className="rounded bg-terminal-gray border-terminal-gray-light"
                          />
                          <Label htmlFor="useElevenLabs" className="text-terminal-foreground text-sm">
                            Use ElevenLabs for realistic voices
                          </Label>
                        </div>

                        {useElevenLabs && (
                          <div className="grid gap-2 mb-4">
                            <Label htmlFor="elevenLabsApiKey" className="text-terminal-foreground">
                              ElevenLabs API Key
                            </Label>
                            <Input
                              id="elevenLabsApiKey"
                              type="password"
                              value={elevenLabsApiKey}
                              onChange={(e) => saveElevenLabsApiKey(e.target.value)}
                              placeholder="Enter your ElevenLabs API key"
                              className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
                            />
                            {elevenLabsApiStatus !== "unknown" && (
                              <div
                                className={`text-xs mt-1 ${
                                  elevenLabsApiStatus === "available" ? "text-green-500" : "text-terminal-orange"
                                }`}
                              >
                                {elevenLabsApiStatus === "available"
                                  ? "✓ ElevenLabs API connected"
                                  : "⚠ ElevenLabs API unavailable"}
                              </div>
                            )}
                            <div className="mt-2 p-3 bg-terminal-gray-light rounded-lg">
                              <h4 className="text-xs font-medium mb-1">Language Support:</h4>
                              <p className="text-[10px] text-terminal-foreground opacity-80">
                                ElevenLabs will attempt to speak all languages using its multilingual model. If a
                                language doesn't sound right, the app will automatically fall back to browser TTS.
                              </p>
                              <h4 className="text-xs font-medium mt-2 mb-1">Free Tier Limitations:</h4>
                              <p className="text-[10px] text-terminal-foreground opacity-80">
                                ElevenLabs free tier has usage limits and may be temporarily disabled if unusual
                                activity is detected. If you encounter errors, the app will automatically fall back to
                                browser TTS.
                              </p>
                            </div>
                            <p className="text-[10px] text-terminal-foreground opacity-50 mt-1">
                              Get a free API key at{" "}
                              <a
                                href="https://elevenlabs.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={accent.textClass}
                              >
                                elevenlabs.io
                              </a>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2 mt-4">
                        <Label htmlFor="accentColor" className="text-terminal-foreground">
                          Accent Color
                        </Label>
                        <Select value={accentColor} onValueChange={saveAccentColor}>
                          <SelectTrigger
                            id="accentColor"
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl`}
                          >
                            <SelectValue placeholder="Select accent color" />
                          </SelectTrigger>
                          <SelectContent className="bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl max-h-[300px]">
                            {accentColors.map((color) => (
                              <SelectItem
                                key={color.id}
                                value={color.id}
                                className={`text-terminal-foreground focus:bg-terminal-gray-light ${accent.hoverTextClass}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${
                                      color.id === "orange"
                                        ? "bg-terminal-orange"
                                        : color.id === "white"
                                          ? "bg-white border border-gray-300"
                                          : `bg-${color.id}-500`
                                    }`}
                                  />
                                  <span>{color.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2 mt-4">
                        <Label htmlFor="fontFamily" className="text-terminal-foreground">
                          Font Family
                        </Label>
                        <Select value={fontFamily} onValueChange={saveFontFamily}>
                          <SelectTrigger
                            id="fontFamily"
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl`}
                          >
                            <SelectValue placeholder="Select font family" />
                          </SelectTrigger>
                          <SelectContent className="bg-terminal-gray border-terminal-gray-light text-terminal-foreground rounded-xl">
                            {fontFamilies.map((font) => (
                              <SelectItem
                                key={font.id}
                                value={font.id}
                                className={`text-terminal-foreground focus:bg-terminal-gray-light ${accent.hoverTextClass} ${font.class}`}
                              >
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] text-terminal-foreground opacity-50">
                          If you're having issues with your API key, make sure you've enabled the Gemini API in Google
                          AI Studio, try different model and API version combinations, or verify that you haven't
                          exceeded your quota.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
