import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { DemoSwitcherDock } from "@/components/common/DemoSwitcherDock";
import { ActiveOrderFloatTracker } from "@/components/customer/ActiveOrderFloatTracker";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://srj-ai.github.io/canteen-ordering-system/"),
  title: {
    default: "GPREC Campus Food Court & Digital Canteen System",
    template: "%s | GPREC Food Court",
  },
  description:
    "Official high-speed digital canteen ordering, physical table QR dine-in, VIP faculty priority tickets, and real-time Kitchen Display System (KDS) for G. Pulla Reddy Engineering College (GPREC), Kurnool.",
  keywords: [
    "GPREC",
    "G. Pulla Reddy Engineering College",
    "GPREC Canteen",
    "Campus Food Court",
    "QR Code Dine In",
    "Kurnool Engineering College",
    "Student Canteen App",
    "Kitchen Display System",
    "Faculty Fast Track Canteen",
    "Online Canteen Ordering",
  ],
  authors: [{ name: "GPREC Food Court Operations", url: "https://srj-ai.github.io/canteen-ordering-system/" }],
  creator: "G. Pulla Reddy Engineering College (Autonomous)",
  publisher: "GPREC Canteen Management",
  applicationName: "GPREC Food Court",
  generator: "Next.js",
  manifest: "/canteen-ordering-system/manifest.json",
  icons: {
    icon: [
      { url: "/canteen-ordering-system/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/canteen-ordering-system/icon.svg",
    apple: "/canteen-ordering-system/apple-icon.svg",
  },
  alternates: {
    canonical: "https://srj-ai.github.io/canteen-ordering-system/",
  },
  openGraph: {
    title: "GPREC Campus Food Court & Digital Canteen",
    description:
      "Order hot South Indian tiffins, thalis, and beverages directly from table QR codes with instant live kitchen tracking at G. Pulla Reddy Engineering College.",
    url: "https://srj-ai.github.io/canteen-ordering-system/",
    siteName: "GPREC Food Court",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/canteen-ordering-system/icon.svg",
        width: 512,
        height: 512,
        alt: "GPREC Food Court Cloche Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPREC Campus Food Court & Canteen System",
    description:
      "Next-generation contactless QR dining, live kitchen ticket board, and fast-track faculty priority queues at GPREC Kurnool.",
    images: ["/canteen-ordering-system/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "GPREC Campus Food Court",
  "image": "https://srj-ai.github.io/canteen-ordering-system/icon.svg",
  "url": "https://srj-ai.github.io/canteen-ordering-system/",
  "servesCuisine": "South Indian, Fast Food, Beverages, Pure Vegetarian",
  "priceRange": "₹20 - ₹150",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "G. Pulla Reddy Nagar, Nandyal Road",
    "addressLocality": "Kurnool",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "518007",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 15.8281,
    "longitude": 78.0373
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "07:30",
      "closes": "18:00"
    }
  ],
  "menu": "https://srj-ai.github.io/canteen-ordering-system/menu/",
  "acceptsReservations": "False"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", sans.variable, serif.variable)}>
      <head>
        <link rel="icon" href="/canteen-ordering-system/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/canteen-ordering-system/apple-icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn("min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white")}>
        <AuthProvider>
          {children}
          <ActiveOrderFloatTracker />
          <DemoSwitcherDock />
        </AuthProvider>
      </body>
    </html>
  );
}
