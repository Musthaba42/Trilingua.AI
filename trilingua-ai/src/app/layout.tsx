import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trilingua AI — Learn anything, in any language",
    template: "%s | Trilingua AI",
  },
  description:
    "AI-native multilingual learning platform. Master AI, cybersecurity, programming and more in English, Tamil, and Hindi with an AI tutor by your side.",
  keywords: [
    "learning platform",
    "AI tutor",
    "multilingual",
    "Tamil",
    "Hindi",
    "coding",
    "machine learning",
    "cybersecurity",
  ],
  authors: [{ name: "Trilingua AI" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Trilingua AI — Learn anything, in any language",
    description: "AI-native multilingual learning platform with structured courses, live coding, and an AI tutor side-by-side.",
    type: "website",
    locale: "en_IN",
    siteName: "Trilingua AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trilingua AI",
    description: "Master tech in your own language. AI-native learning for everyone.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
