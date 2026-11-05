"use client";

import React, { useEffect, useState } from "react";

export interface NavbarProps {
  bagCount: number;
  wishlistCount?: number;
  activeSection?: number;
  onNavigateSection?: (sectionIndex: number) => void;
  onOpenBag?: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
}

export const CHAPTER_SCROLL_OFFSETS = [0.0, 0.26, 0.52, 0.78] as const;

const NAV_LINKS = [
  { label: "Devices", sectionIndex: 0, frameRange: "001–060", offset: 0.0 },
  { label: "Craft", sectionIndex: 1, frameRange: "061–120", offset: 0.26 },
  { label: "Ecosystem", sectionIndex: 2, frameRange: "121–180", offset: 0.52 },
  { label: "Protection", sectionIndex: 3, frameRange: "181–240", offset: 0.78 },
];

export default function Navbar({
  bagCount = 0,
  wishlistCount = 0,
  activeSection = 0,
  onNavigateSection,
  onOpenBag,
  onOpenSearch,
  onOpenWishlist,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger subtle scale bounce animation when bagCount changes
  useEffect(() => {
    if (bagCount === 0) return;
    setBadgeBounce(true);
    const timer = setTimeout(() => setBadgeBounce(false), 380);
    return () => clearTimeout(timer);
  }, [bagCount]);

  const handleNavClick = (index: number) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(index);
      return;
    }
    const heroEl = document.getElementById("top");
    const scrollableDistance = heroEl
      ? heroEl.offsetHeight - window.innerHeight
      : window.innerHeight * 6.5;
    const targetProgress = CHAPTER_SCROLL_OFFSETS[index] ?? 0;
    window.scrollTo({
      top: scrollableDistance * targetProgress,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 max-md:h-14 max-md:px-4 max-md:py-0 max-md:bg-[#E5D9C8]/85 max-md:backdrop-blur-md max-md:border-b max-md:border-black/5 ${
        scrolled
          ? "md:py-4 md:bg-[#E6DAC8]/82 md:backdrop-blur-md md:border-b md:border-[#1C1917]/10 md:shadow-[0_4px_30px_rgba(28,25,23,0.04)]"
          : "md:py-6 md:bg-transparent md:border-b md:border-transparent"
      }`}
    >
      <div className="max-w-[1440px] h-14 md:h-auto mx-auto md:px-12 lg:px-16 flex items-center justify-between">
        {/* Left: Brand Logo — Single-line whitespace-nowrap on mobile */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(0);
          }}
          className="group flex items-center gap-3 focus:outline-none shrink-0"
          aria-label="Aurelia Mobile Home"
        >
          <span className="font-serif text-xs md:text-lg font-semibold tracking-[0.22em] md:tracking-[0.28em] whitespace-nowrap uppercase text-[#1C1917] transition-opacity duration-300 group-hover:opacity-75">
            AURELIA MOBILE
          </span>
          <span className="hidden lg:inline-block text-[10px] font-sans uppercase tracking-[0.22em] text-[#6E655F] border-l border-[#1C1917]/20 pl-3 whitespace-nowrap">
            ATELIER
          </span>
        </a>

        {/* Center: Minimal Editorial Links */}
        <nav
          className="hidden md:flex items-center gap-9 lg:gap-11"
          aria-label="Primary Navigation"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.sectionIndex;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.sectionIndex)}
                className="group relative py-1 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer focus:outline-none"
              >
                <span
                  className={
                    isActive
                      ? "text-[#1C1917] font-semibold"
                      : "text-[#6E655F] group-hover:text-[#1C1917]"
                  }
                >
                  {item.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#141413] transition-all duration-300 ${
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                  }`}
                />
              </button>
            );
          })}
          <a
            href="#collection"
            className="group relative py-1 text-xs uppercase tracking-[0.2em] font-medium text-[#6E655F] hover:text-[#1C1917] transition-colors duration-300"
          >
            Boutique
            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#141413] transition-all duration-300 group-hover:w-full opacity-60" />
          </a>
        </nav>

        {/* Right: Minimal Line Icons for Search, Wishlist Heart, and Bag with Counter Badge */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          {/* Search Icon */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search Flagship Collection"
            className="relative p-1.5 sm:p-2 text-[#1C1917] hover:text-[#6E655F] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-full"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7.5" />
              <path d="M20 20L16.35 16.35" />
            </svg>
          </button>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Wishlist (${wishlistCount} saved items)`}
            className="relative p-1.5 sm:p-2 text-[#1C1917] hover:text-[#6E655F] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-full"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={wishlistCount > 0 ? "#141413" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1C1917] text-white text-[9px] font-medium flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Bag Icon with Dynamic Scale Bounce Counter Badge */}
          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`Shopping Bag with ${bagCount} items`}
            className="group flex items-center gap-1.5 sm:gap-2.5 pl-1.5 pr-1 py-1 text-[#1C1917] hover:opacity-85 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-full"
          >
            <div className="relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-[20px] sm:min-w-[23px] sm:h-[23px] px-1.5 rounded-full bg-[#141413] text-[#FFFFFF] text-[10px] sm:text-[11px] font-sans font-medium tracking-tight transition-transform duration-300 ${
                badgeBounce
                  ? "scale-125 ring-4 ring-[#141413]/20"
                  : "scale-100 group-hover:scale-105"
              }`}
            >
              {bagCount}
            </span>
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Mobile Navigation"
            className="md:hidden p-1.5 text-[#1C1917] focus:outline-none"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#E5D9C8]/95 backdrop-blur-xl border-b border-[#1C1917]/15 px-5 py-5 -mx-4">
          <div className="flex flex-col gap-3.5">
            {NAV_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.sectionIndex)}
                className="flex items-center justify-between py-2 text-left text-xs uppercase tracking-[0.22em] text-[#1C1917] border-b border-[#1C1917]/10"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-[#6E655F] font-mono">
                  0{item.sectionIndex + 1}
                </span>
              </button>
            ))}
            <a
              href="#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-xs uppercase tracking-[0.22em] font-semibold text-[#1C1917]"
            >
              Explore Full Boutique →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
