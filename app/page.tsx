"use client"

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
import { Slider } from "@/components/ui/slider"
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
import { useMobile } from "@/hooks/use-mobile"

// Custom styles for the slider component
import "./slider-styles.css"

// Add this script to the head of the document to apply saved preferences immediately
// This will prevent the flash of default styling on page load

// Add this at the beginning of the file, right after the imports
useEffect(() => {
  // Script to apply saved color and font preferences immediately
  const applySavedPreferences = () => {
    if (typeof window !== "undefined") {
      try {
        // Get saved preferences
        var savedAccentColor = localStorage.getItem("accentColorPreference") || "orange"
        var savedFontFamily = localStorage.getItem("fontFamilyPreference") || "jetbrains"

        // Font family mapping
        var fontFamilyMap = {
          jetbrains: "'JetBrains Mono', monospace",
          inter: "'Inter', sans-serif",
          poppins: "'Poppins', sans-serif",
          georgia: "Georgia, serif",
        }

        // Color variable mapping
        var colorMap = {
          orange: "var(--terminal-orange)",
          blue: "var(--terminal-blue)",
          green: "var(--terminal-green)",
          purple: "var(--terminal-purple)",
          pink: "var(--terminal-pink)",
          red: "var(--terminal-red)",
          yellow: "var(--terminal-yellow)",
          teal: "var(--terminal-teal)",
          indigo: "var(--terminal-indigo)",
          white: "white",
        }

        // Apply font family
        document.documentElement.style.setProperty(
          "font-family",
          fontFamilyMap[savedFontFamily] || fontFamilyMap.jetbrains,
          "important",
        )

        // Create a style element for immediate styling
        var styleEl = document.createElement("style")
        styleEl.textContent =
          "* { font-family: " + (fontFamilyMap[savedFontFamily] || fontFamilyMap.jetbrains) + " !important; }"
        document.head.appendChild(styleEl)

        // Define CSS variables for terminal colors
        document.documentElement.style.setProperty("--terminal-orange", "#ff5a00")
        document.documentElement.style.setProperty("--terminal-blue", "#3b82f6")
        document.documentElement.style.setProperty("--terminal-green", "#22c55e")
        document.documentElement.style.setProperty("--terminal-purple", "#a855f7")
        document.documentElement.style.setProperty("--terminal-pink", "#ec4899")
        document.documentElement.style.setProperty("--terminal-red", "#ef4444")
        document.documentElement.style.setProperty("--terminal-yellow", "#eab308")
        document.documentElement.style.setProperty("--terminal-teal", "#14b8a6")
        document.documentElement.style.setProperty("--terminal-indigo", "#6366f1")
      } catch (e) {
        console.error("Error applying saved preferences:", e)
      }
    }
  }

  // Call the function immediately
  applySavedPreferences()

  // No need to create a script element and append it to the head
}, [])

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
  { id: "inter", name: "Inter", class: "font-sans", fontFamily: "'Inter', sans-serif" },
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
  const isMobile = useMobile()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.hoverTextClass} hover:bg-terminal-gray-light rounded-xl`}
        >
          <span className="truncate mr-1">{selectedLanguage ? selectedLanguage.name : placeholder}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 flex-none" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-terminal-gray border-terminal-gray-light rounded-xl">
        <Command className="bg-terminal-gray rounded-xl">
          <CommandInput
            placeholder="Search language..."
            className="text-terminal-foreground focus:outline-none focus:ring-0 focus:border-terminal-gray-light [&_svg]:text-gray-300"
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
                  <span className="truncate">{language.name}</span>
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
function FormalitySlider({
  value,
  onChange,
  accentColor,
}: {
  value: number
  onChange: (value: number) => void
  accentColor: string
}) {
  const isMobile = useMobile()
  const accent = getAccentColor(accentColor)
  const sliderClass = accent.sliderClass

  // Add a class for the thumb color
  const thumbColorClass = `thumb-${accentColor}`

  // Use a ref to avoid unnecessary re-renders
  const sliderRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={`bg-terminal-gray border border-terminal-gray-light rounded-xl p-4 ${thumbColorClass}`}
      ref={sliderRef}
    >
      <div className="flex justify-between items-center mb-2">
        <Label className="text-xs text-terminal-foreground">
          Formality: <span className={accent.textClass}>{getFormalityLabel(value)}</span>
        </Label>
      </div>
      <div className="py-2">
        <Slider
          value={[value]}
          min={0}
          max={10}
          step={0.1}
          onValueChange={(value) => onChange(Math.round(value[0]))}
          className={sliderClass}
        />
      </div>

      {/* Simplified labels - same for both mobile and desktop */}
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-terminal-foreground opacity-50">Casual</span>
        <span className="text-[10px] text-terminal-foreground opacity-50">Neutral</span>
        <span className="text-[10px] text-terminal-foreground opacity-50">Formal</span>
      </div>
    </div>
  )
}

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

  // Add a new state variable for speech rate after the other state variables
  const [speechRate, setSpeechRate] = useState<"slow" | "normal" | "fast">("normal")
  const [showSpeedOptions, setShowSpeedOptions] = useState(false)

  // Modify the speak function to use the speech rate
  const speak = useCallback(
    (text: string, languageCode: string, rate: "slow" | "normal" | "fast" = "normal") => {
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
          setVoiceForLanguage(utterance, voices, voiceLanguage)
        }
      } else {
        const voices = speechSynthesisRef.current.getVoices()
        setVoiceForLanguage(utterance, voices, voiceLanguage)
      }

      // Set event handlers
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = (event) => {
        setIsPlaying(false)
        setError(`Speech synthesis error: ${event.error}`)
      }

      // Start speaking
      speechSynthesisRef.current.speak(utterance)
      setIsPlaying(true)
    },
    [speechRate],
  )

  // Helper function to set the appropriate voice
  const setVoiceForLanguage = (
    utterance: SpeechSynthesisUtterance,
    voices: SpeechSynthesisVoice[],
    langCode: string,
  ) => {
    // First try to find an exact match
    let voice = voices.find((v) => v.lang === langCode)

    // If no exact match, try to find a voice that starts with the language code
    if (!voice) {
      const langPrefix = langCode.split("-")[0]
      voice = voices.find((v) => v.lang.startsWith(langPrefix))
    }

    // If we found a voice, use it
    if (voice) {
      utterance.voice = voice
    }

    // For Japanese specifically, try to find a Japanese voice
    if (langCode === "ja-JP" && !voice) {
      voice = voices.find((v) => v.lang.includes("ja") || v.name.includes("Japanese"))
      if (voice) utterance.voice = voice
    }
  }

  const stop = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsPlaying(false)
    }
  }, [])

  return { speak, stop, isPlaying, error }
}

// ElevenLabs TTS function - FIXED to properly handle Japanese
async function speakWithElevenLabs(
  text: string,
  apiKey: string,
  languageCode: string,
  rate: "slow" | "normal" | "fast" = "normal",
  voiceId = "21m00Tcm4TlvDq8ikWAM",
) {
  try {
    // Enhanced language-specific voice mapping with better detection
    const languageVoiceMap: Record<string, string> = {
      ja: "pNInz6obpgDQGcFmaJgB", // Japanese voice
      zh: "TxGEqnHWrfWFTfGW9XjX", // Chinese voice
      ko: "z3SUtsYQEjhJdJmeYW3w", // Korean voice
      // Add more language-specific voices as needed
    }

    // Use language-specific voice if available
    const selectedVoiceId = languageVoiceMap[languageCode] || voiceId

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
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost,
        },
        // Explicitly set the language based on the languageCode
        voice_settings_overrides: {
          language: languageCode,
          speed: rate === "slow" ? 0.7 : rate === "fast" ? 1.3 : 1.0,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    // Adjust playback rate for HTML5 Audio element as a fallback
    audio.playbackRate = rate === "slow" ? 0.7 : rate === "fast" ? 1.3 : 1.0
    audio.play()

    return { success: true, audio }
  } catch (error) {
    console.error("Error with ElevenLabs TTS:", error)
    return { success: false, error }
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
  const [formality, setFormality] = useState(5) // Default to neutral (middle of 0-10 scale)
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])
  const [accentColor, setAccentColor] = useState("orange") // Default accent color
  const [fontFamily, setFontFamily] = useState("jetbrains") // Default font
  const [copySuccess, setCopySuccess] = useState(false)
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("")
  const [useElevenLabs, setUseElevenLabs] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)
  const [speechRate, setSpeechRate] = useState<"slow" | "normal" | "fast">("normal")
  const [showSpeedOptions, setShowSpeedOptions] = useState(false)

  // Use the text-to-speech hook
  const { speak, stop, isPlaying, error: speechError } = useTextToSpeech()

  // Get the current accent color object
  const accent = getAccentColor(accentColor)

  // Use debounced values for resize-sensitive states
  const debouncedFormality = useDebounce(formality, 100)

  // Get the current font family object
  const currentFont = fontFamilies.find((f) => f.id === fontFamily) || fontFamilies[0]

  // Add a ref for the sheet content
  const sheetContentRef = useRef<HTMLDivElement>(null)

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

  // Apply font and accent color to document root when they change
  useEffect(() => {
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
      }

      /* Consistent focus styles */
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
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
    `

    // Add the style element to the head
    document.head.appendChild(styleEl)

    // Clean up
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [fontFamily, currentFont, accent])

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("geminiApiKey")
    const savedModel = localStorage.getItem("geminiModel")
    const savedApiVersion = localStorage.getItem("geminiApiVersion")
    const savedSourceLang = localStorage.getItem("sourceLanguage")
    const savedTargetLang = localStorage.getItem("targetLanguage")
    const savedHistory = localStorage.getItem("translationHistory")
    const savedAccentColor = localStorage.getItem("accentColorPreference")
    const savedFontFamily = localStorage.getItem("fontFamilyPreference")
    const savedElevenLabsApiKey = localStorage.getItem("elevenLabsApiKey")
    const savedUseElevenLabs = localStorage.getItem("useElevenLabs")

    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    if (savedModel) {
      setSelectedModel(savedModel)
    }

    if (savedApiVersion) {
      setApiVersion(savedApiVersion)
    }

    if (savedSourceLang) {
      setSourceLanguage(savedSourceLang)
    }

    if (savedTargetLang) {
      setTargetLanguage(savedTargetLang)
    } else {
      setTargetLanguage("ja")
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse translation history", e)
      }
    }

    if (savedAccentColor) {
      setAccentColor(savedAccentColor)
    }

    if (savedFontFamily) {
      setFontFamily(savedFontFamily)
    }

    if (savedElevenLabsApiKey) {
      setElevenLabsApiKey(savedElevenLabsApiKey)
    }

    if (savedUseElevenLabs) {
      setUseElevenLabs(savedUseElevenLabs === "true")
    }
  }, [])

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
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setSourceLanguage(item.sourceLanguage)
    setTargetLanguage(item.targetLanguage)
    setFormality(item.formality)
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

  const handleCopyText = () => {
    navigator.clipboard.writeText(translatedText)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Modify the handlePlayText function to use the speech rate
  const handlePlayText = async () => {
    if (!translatedText) return

    setTtsError(null)

    if (isPlayingAudio) {
      // Stop current playback
      stop()
      setIsPlayingAudio(false)
      return
    }

    setIsPlayingAudio(true)

    try {
      if (useElevenLabs && elevenLabsApiKey) {
        // Use ElevenLabs for more realistic voices
        const result = await speakWithElevenLabs(translatedText, elevenLabsApiKey, targetLanguage, speechRate)
        if (!result.success) {
          setTtsError("Error with ElevenLabs TTS. Falling back to browser TTS.")
          speak(translatedText, targetLanguage, speechRate)
        }
      } else {
        // Use browser's built-in speech synthesis
        speak(translatedText, targetLanguage, speechRate)
      }
    } catch (error) {
      console.error("TTS error:", error)
      setTtsError("Error playing audio. Please try again.")
      setIsPlayingAudio(false)
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

  useEffect(() => {
    // Update isPlayingAudio state based on the hook's isPlaying state
    setIsPlayingAudio(isPlaying)

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

    try {
      // Get language names for better prompting
      const sourceLangName = languages.find((l) => l.code === sourceLanguage)?.name || sourceLanguage
      const targetLangName = languages.find((l) => l.code === targetLanguage)?.name || targetLanguage

      // Get formality instruction based on the slider value
      const formalityInstruction = getFormalityInstruction(formality)

      // Use the selected model and API version
      const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${selectedModel}:generateContent?key=${apiKey}`

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text from ${sourceLangName} to ${targetLangName}. ${formalityInstruction} Only return the translated text without any explanations or additional text:

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
      })

      const data = await response.json()

      if (data.error) {
        setError(`API Error: ${data.error.message || "Translation failed"}`)
        console.error("API Error:", data.error)
        setTranslatedText("")
      } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        // Extract just the translated text, removing any quotes or explanations
        let result = data.candidates[0].content.parts[0].text
        // Remove quotes and potential explanations
        result = result.replace(/^["']|["']$/g, "")
        result = result.replace(/^Translation: /i, "")
        setTranslatedText(result)

        // Add to history
        addToHistory({
          id: Date.now().toString(),
          sourceText,
          translatedText: result,
          sourceLanguage,
          targetLanguage,
          formality,
          timestamp: Date.now(),
        })
      } else {
        console.error("Unexpected API response:", data)
        setError("Unexpected response format from API")
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
  useEffect(() => {
    if (showSpeedOptions) {
      const handleClickOutside = (e: MouseEvent) => {
        setShowSpeedOptions(false)
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showSpeedOptions])

  return (
    <div className="container max-w-4xl py-20 px-4 mx-auto">
      <Card className="w-full bg-terminal-background border-terminal-gray rounded-2xl overflow-hidden">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="w-[calc(50%-1.5rem)] min-w-0">
              <LanguageCombobox
                value={sourceLanguage}
                onChange={saveSourceLanguage}
                placeholder="Source language"
                accentColor={accentColor}
              />
            </div>
            <div
              className={`flex items-center justify-center w-6 h-6 ${accent.class.split(" ")[0]} rounded-full flex-none`}
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </div>
            <div className="w-[calc(50%-1.5rem)] min-w-0">
              <LanguageCombobox
                value={targetLanguage}
                onChange={saveTargetLanguage}
                placeholder="Target language"
                accentColor={accentColor}
              />
            </div>
          </div>

          {/* Responsive Formality Slider */}
          <FormalitySlider value={debouncedFormality} onChange={setFormality} accentColor={accentColor} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to translate"
                className={`min-h-[200px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} placeholder:text-terminal-gray-muted rounded-xl`}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>
            <div className="space-y-2 relative">
              <Textarea
                placeholder="Translation will appear here"
                className={`min-h-[200px] resize-none bg-terminal-gray border-terminal-gray-light text-terminal-foreground placeholder:text-terminal-gray-muted rounded-xl`}
                value={translatedText}
                readOnly
              />
              {/* Update the UI to include the speed button */}
              {/* Replace the existing buttons in the textarea with this updated version */}
              <div className="absolute bottom-2 right-2 flex space-x-2">
                {translatedText && (
                  <>
                    <div className="relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                        onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                      >
                        <span className="text-xs text-terminal-foreground opacity-70">{getSpeedIcon(speechRate)}</span>
                        <span className="sr-only">Adjust speech rate</span>
                      </Button>
                      {showSpeedOptions && (
                        <div className="absolute bottom-full right-0 mb-2 bg-terminal-gray border border-terminal-gray-light rounded-lg shadow-lg overflow-hidden">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRate === "slow" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={() => {
                                setSpeechRate("slow")
                                setShowSpeedOptions(false)
                              }}
                            >
                              Slow (0.7x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRate === "normal" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={() => {
                                setSpeechRate("normal")
                                setShowSpeedOptions(false)
                              }}
                            >
                              Normal (1.0x)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`justify-start px-3 py-1.5 ${speechRate === "fast" ? accent.textClass : "text-terminal-foreground opacity-70"} hover:bg-terminal-gray-light`}
                              onClick={() => {
                                setSpeechRate("fast")
                                setShowSpeedOptions(false)
                              }}
                            >
                              Fast (1.3x)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={handlePlayText}
                      disabled={!translatedText}
                    >
                      {isPlayingAudio ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Play translation</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 opacity-70 hover:opacity-100 bg-transparent hover:bg-terminal-gray-light rounded-lg ${accent.hoverTextClass}`}
                      onClick={handleCopyText}
                    >
                      {copySuccess ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-terminal-foreground opacity-70" />
                      )}
                      <span className="sr-only">Copy to clipboard</span>
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
            <Drawer>
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
              <DrawerContent className="bg-terminal-background border-terminal-gray text-terminal-foreground rounded-t-2xl drawer-content">
                <DrawerHeader>
                  <DrawerTitle className={accent.textClass}>Translation History</DrawerTitle>
                  <DrawerDescription className="text-terminal-foreground opacity-70">
                    Your recent translations
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  {/* Use a fixed height instead of a dynamic one to avoid ResizeObserver issues */}
                  <div className="h-[50vh] overflow-y-auto pr-2">
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
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
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
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
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
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
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
                            className={`bg-terminal-gray border-terminal-gray-light text-terminal-foreground ${accent.focusClass} rounded-xl`}
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
