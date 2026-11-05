"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar, { CHAPTER_SCROLL_OFFSETS } from "@/components/Navbar";
import ScrollCanvasHero from "@/components/ScrollCanvasHero";
import ProductShowcaseGrid, {
  FLAGSHIP_PRODUCTS,
  ProductItem,
} from "@/components/ProductShowcaseGrid";
import CartDrawer, { BagLineItem } from "@/components/CartDrawer";
import SpecsModal from "@/components/SpecsModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const lenisRef = useRef<Lenis | null>(null);

  const [activeSection, setActiveSection] = useState<number>(0);
  const [bagItems, setBagItems] = useState<BagLineItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [specsModalSubject, setSpecsModalSubject] = useState<string | null>(
    null
  );
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [highlightedProductId, setHighlightedProductId] = useState<
    string | null
  >(null);

  /**
   * Initialize Lenis Smooth Scroll with heavy, damped luxury physics:
   * - lerp: 0.055
   * - wheelMultiplier: 0.65 (reduces wheel/trackpad speed by 35%)
   * - touchMultiplier: 1.2
   * - Synced with gsap.ticker and ScrollTrigger.update
   */
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Smoothly scroll via Lenis directly to the exact scroll offset for each chapter:
   * Chapter 01 (Devices)    -> 0%
   * Chapter 02 (Craft)      -> 26%
   * Chapter 03 (Ecosystem)  -> 52%
   * Chapter 04 (Protection) -> 78%
   */
  const handleNavigateSection = useCallback((sectionIndex: number) => {
    const heroEl = document.getElementById("top");
    const heroTop = heroEl
      ? window.scrollY + heroEl.getBoundingClientRect().top
      : 0;
    const scrollableDistance = heroEl
      ? heroEl.offsetHeight - window.innerHeight
      : window.innerHeight * 8; // 900vh - 100vh

    const offsetRatio = CHAPTER_SCROLL_OFFSETS[sectionIndex] ?? 0;
    const targetY = heroTop + scrollableDistance * offsetRatio;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, {
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  /**
   * Handle CTA buttons inside the 4 editorial scroll chapters
   * Opens the interactive SpecsModal with architectural blueprints, dimensions,
   * material breakdown, and 360° studio frame scrubber.
   */
  const handleHeroCtaClick = useCallback((actionId: string) => {
    setSpecsModalSubject(actionId);
  }, []);

  /**
   * Add item to shopping bag & open the right-side CartDrawer
   */
  const handleAddToBag = useCallback((product: ProductItem, color: string) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, color, quantity: 1 }];
    });
    setIsBagOpen(true);
  }, []);

  /**
   * Add the complete 4-piece Atelier Suite to Bag and open CartDrawer
   */
  const handleAcquireSuite = useCallback(() => {
    setBagItems((prev) => {
      const next = [...prev];
      FLAGSHIP_PRODUCTS.forEach((product) => {
        const defaultColor = product.colors[0].name;
        const idx = next.findIndex(
          (item) =>
            item.product.id === product.id && item.color === defaultColor
        );
        if (idx > -1) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push({ product, color: defaultColor, quantity: 1 });
        }
      });
      return next;
    });
    setIsBagOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((index: number, delta: number) => {
    setBagItems((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      const nextQty = updated[index].quantity + delta;
      if (nextQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: nextQty };
      }
      return updated;
    });
  }, []);

  const handleRemoveBagItem = useCallback((index: number) => {
    setBagItems((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const handleClearBag = useCallback(() => {
    setBagItems([]);
  }, []);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const scrollToProductCard = useCallback((productId: string) => {
    setHighlightedProductId(productId);
    const el =
      document.getElementById(`product-${productId}`) ||
      document.getElementById("collection");

    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -96, duration: 1.6 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    setTimeout(() => {
      setHighlightedProductId(null);
    }, 3000);
  }, []);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = FLAGSHIP_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#E6DAC8] text-[#1C1917] relative selection:bg-[#141413] selection:text-white">
      {/* Fixed Top Luxury Navbar */}
      <Navbar
        bagCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => {
          const el = document.getElementById("collection");
          if (el) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(el, { duration: 1.6 });
            } else {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
      />

      {/* 900vh Pinned HTML5 Canvas 240-Frame Sequence & Left Editorial Storyline */}
      <ScrollCanvasHero
        onSectionChange={setActiveSection}
        onCtaClick={handleHeroCtaClick}
        onNavigateChapter={handleNavigateSection}
      />

      {/* Post-Scroll E-Commerce Product Grid */}
      <ProductShowcaseGrid
        onAddToBag={handleAddToBag}
        onAcquireSuite={handleAcquireSuite}
        onInspectSpecs={(productId) => setSpecsModalSubject(productId)}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        highlightedProductId={highlightedProductId}
      />

      {/* Minimalist Editorial Footer */}
      <footer className="bg-[#DFD2BE] border-t border-[#1C1917]/12 py-20 px-6 md:px-12 lg:px-16 text-[#1C1917]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#1C1917]/10">
          <div className="md:col-span-2">
            <span className="font-serif text-xl tracking-[0.28em] uppercase block mb-4">
              AURELIA MOBILE
            </span>
            <p className="text-sm text-[#6E655F] max-w-sm leading-relaxed">
              Minimalist luxury hardware and tactile accessories. Engineered
              from aerospace-grade titanium, precision sapphire optics, and
              heritage vegetable-tanned saddle leather.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] text-[#1C1917] font-semibold mb-4">
              Story Chapters
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E655F]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateSection(0)}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  01. Flagship Craftsmanship
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateSection(1)}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  02. Precision Optics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateSection(2)}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  03. Seamless Ecosystem
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateSection(3)}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  04. Protection With Purpose
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] text-[#1C1917] font-semibold mb-4">
              Private Client Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E655F]">
              <li>Complimentary Armored Courier Delivery</li>
              <li>5-Year Titanium & Optical Care</li>
              <li>Bespoke Monogramming Atelier</li>
              <li>Geneva • Paris • Tokyo • New York</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">
          <span>
            © 2026 AURELIA MOBILE ATELIER. ALL RIGHTS RESERVED.
          </span>
          <span>750VH GPU-DECODED CANVAS ENGINE • GSAP & LENIS</span>
        </div>
      </footer>

      {/* Slide-Over Luxury Bag Drawer */}
      <CartDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={handleClearBag}
        onInspectProduct={(productId) => {
          setIsBagOpen(false);
          setSpecsModalSubject(productId);
        }}
      />

      {/* Interactive Specs, CAD Blueprints & 360° Frame Scrubber Modal */}
      <SpecsModal
        isOpen={!!specsModalSubject}
        subjectId={specsModalSubject}
        onClose={() => setSpecsModalSubject(null)}
        onAddToBag={handleAddToBag}
        onChangeSubject={(nextSubject) => setSpecsModalSubject(nextSubject)}
      />

      {/* Search Overlay Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[85] bg-[#141413]/55 backdrop-blur-sm flex items-start justify-center pt-24 p-6"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            data-lenis-prevent
            className="w-full max-w-2xl rounded-3xl bg-[#E6DAC8] border border-[#1C1917]/20 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1C1917]/15 mb-6">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Titanium Phone, MagSafe Dock, Earbuds, Saddle Leather..."
                className="w-full bg-transparent text-[#1C1917] placeholder-[#6E655F] font-serif text-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[#6E655F] hover:text-[#1C1917] cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    scrollToProductCard(item.id);
                  }}
                  className="p-3.5 rounded-2xl bg-[#1C1917]/[0.04] hover:bg-[#1C1917]/[0.09] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      style={{
                        objectPosition: item.objectPosition || "72% 50%",
                      }}
                    />
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1917]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6E655F]">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                        setSpecsModalSubject(item.id);
                      }}
                      className="px-3 py-1 rounded-full border border-[#1C1917]/20 text-[10px] uppercase tracking-[0.18em] text-[#1C1917] hover:bg-[#141413] hover:text-white transition-colors"
                    >
                      Specs
                    </button>
                    <span className="font-serif text-lg text-[#1C1917]">
                      ${item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
