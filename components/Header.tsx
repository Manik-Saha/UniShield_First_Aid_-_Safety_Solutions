"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { categories } from "@/lib/mock-data/categories";
import { courses } from "@/lib/mock-data/courses";
import { Cross } from "./Cross";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Who We Help", href: "/who-we-help" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold text-xl text-ink shrink-0"
            aria-label="UniShield First Aid & Safety — home"
          >
            <span className="text-safety-red" aria-hidden="true">
              <Cross size={20} />
            </span>
            <span>UniShield</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
            {/* Products dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === "products"}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "products" ? null : "products")
                }
                onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                className="flex items-center gap-1 text-sm font-sans font-medium text-ink hover:text-safety-red transition-colors py-2"
              >
                Products
                <span aria-hidden="true" className="text-xs">▾</span>
              </button>
              {activeDropdown === "products" && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-line rounded-lg shadow-xl p-4 grid gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products/${cat.slug}`}
                      className="block text-sm text-ink hover:text-safety-red transition-colors py-1 border-b border-line last:border-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="block text-sm font-semibold text-safety-red mt-1"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Browse all products →
                  </Link>
                </div>
              )}
            </div>

            {/* Training dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === "training"}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "training" ? null : "training")
                }
                onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                className="flex items-center gap-1 text-sm font-sans font-medium text-ink hover:text-safety-red transition-colors py-2"
              >
                Training
                <span aria-hidden="true" className="text-xs">▾</span>
              </button>
              {activeDropdown === "training" && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-line rounded-lg shadow-xl p-4 grid gap-1 max-h-80 overflow-y-auto">
                  {courses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/training/${course.slug}`}
                      className="block text-sm text-ink hover:text-safety-red transition-colors py-1 border-b border-line last:border-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {course.name}
                    </Link>
                  ))}
                  <Link
                    href="/training"
                    className="block text-sm font-semibold text-safety-red mt-1"
                    onClick={() => setActiveDropdown(null)}
                  >
                    See all courses →
                  </Link>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-sans font-medium text-ink hover:text-safety-red transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 bg-safety-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              <Cross size={12} />
              Get a Free Quote
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 text-ink"
            >
              <span
                className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-opacity duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-label="Navigation menu"
          className="lg:hidden border-t border-line bg-white"
        >
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">Products</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="text-sm text-ink py-2 border-b border-line/50 hover:text-safety-red"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <p className="text-xs font-mono uppercase tracking-widest text-ink/40 mt-3 mb-2">Training</p>
            {courses.map((c) => (
              <Link
                key={c.slug}
                href={`/training/${c.slug}`}
                className="text-sm text-ink py-2 border-b border-line/50 hover:text-safety-red"
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-ink py-2 hover:text-safety-red"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-4 flex items-center justify-center gap-1.5 bg-safety-red text-white text-sm font-semibold px-4 py-3 rounded"
              onClick={() => setMobileOpen(false)}
            >
              <Cross size={12} />
              Get a Free Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
