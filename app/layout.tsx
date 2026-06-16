import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "GearboxTraining — Toyota/Lexus Gearbox Repair Training",
    template: "%s | GearboxTraining"
  },
  description:
    "Professional 2-day hands-on Toyota/Lexus automatic gearbox repair training. Learn from certified experts. Get your certification. Limited slots available.",
  keywords: [
    "gearbox repair training",
    "Toyota gearbox",
    "Lexus gearbox",
    "automatic transmission",
    "mechanic training Nigeria",
    "gearbox certification"
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "GearboxTraining",
    title: "Toyota/Lexus Gearbox Repair Training — 2 Days Hands-On",
    description:
      "Master automatic gearbox repair in just 2 days. Certified training. Limited slots."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#0A0F1E] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
