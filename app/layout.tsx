import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, DM_Sans, Roboto, Montserrat, Lato, Source_Sans_3 } from "next/font/google"
import TranslationApp from "./client-layout"

// Load fonts
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" })
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], display: "swap", variable: "--font-roboto" })
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--font-montserrat" })
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], display: "swap", variable: "--font-lato" })
const sourceSans = Source_Sans_3({ subsets: ["latin"], display: "swap", variable: "--font-source-sans" })

export const metadata: Metadata = {
  title: "tonebridge",
  description: "AI-powered translation by tonebridge",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "tonebridge",
    description: "AI-powered translation by tonebridge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "tonebridge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tonebridge",
    description: "AI-powered translation by tonebridge",
    images: ["/og-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${roboto.variable} ${montserrat.variable} ${lato.variable} ${sourceSans.variable}`}
    >
      <body className={inter.className}>
        <TranslationApp />
      </body>
    </html>
  )
}
