import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "GPREC Campus Food Court & Canteen System",
  description: "Next-Generation QR Dine-In Ordering & Kitchen Display Terminal for G. Pulla Reddy Engineering College",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", sans.variable, serif.variable)}>
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
