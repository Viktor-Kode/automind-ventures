"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4 text-[#0A0F1E]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-lg leading-tight">
              Automind<span className="text-[#F5A623]">ventures</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/apply"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              Apply
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-menu-toggle"
            className="md:hidden text-white/70 hover:text-white p-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#111827] px-4 py-4 flex flex-col gap-3">
          <Link
            href="/"
            className="text-white/80 hover:text-white py-2 font-medium transition-colors"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/apply"
            className="text-white/80 hover:text-white py-2 font-medium transition-colors"
            onClick={() => setOpen(false)}
          >
            Apply
          </Link>
        </div>
      )}
    </nav>
  );
}
