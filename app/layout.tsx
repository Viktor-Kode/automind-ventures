import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const metadata = {
  title: "AutoMind Ventures",
  description: "Connect with trusted automobile technicians via WhatsApp"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}


