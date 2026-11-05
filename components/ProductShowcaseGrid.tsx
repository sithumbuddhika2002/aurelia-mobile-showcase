"use client";

import React, { useState } from "react";

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: "Devices" | "Ecosystem" | "Audio" | "Protection";
  price: number;
  badge: string;
  primaryImage: string;
  secondaryImage: string;
  objectPosition?: string;
  description: string;
  highlights: string[];
  colors: ProductColorOption[];
}

export const FLAGSHIP_PRODUCTS: ProductItem[] = [
  {
    id: "titanium-phone",
    name: "Aurelia One Pro",
    subtitle: "Aerospace Grade 5 Titanium • 256GB / 512GB / 1TB",
    category: "Devices",
    price: 1199,
    badge: "FLAGSHIP RELEASE",
    primaryImage: "/frames/frame_0018.webp",
    secondaryImage: "/frames/frame_0095.webp",
    objectPosition: "76% 50%",
    description:
      "Machined from solid Grade 5 titanium with micro-blasted contours, 120Hz LTPO OLED display, and next-generation triple-lens pro optics.",
    highlights: [
      "50MP Main + 5x Tetraprism Telephoto",
      "Aerospace Grade 5 Titanium Unibody",
      "36-Hour Studio Battery Architecture",
    ],
    colors: [
      { name: "Natural Titanium", hex: "#9E978E" },
      { name: "Obsidian Matte", hex: "#1F1E1D" },
      { name: "Warm Desert", hex: "#C8B7A1" },
    ],
  },
  {
    id: "magsafe-dock",
    name: "Sculpted Aluminum Stand",
    subtitle: "25W Qi2 Magnetic Dual Charging Architecture",
    category: "Ecosystem",
    price: 249,
    badge: "ATELIER EXCLUSIVE",
    primaryImage: "/frames/frame_0145.webp",
    secondaryImage: "/frames/frame_0168.webp",
    objectPosition: "68% 55%",
    description:
      "CNC-milled from a single block of bead-blasted aluminum with weighted base and precision-tuned N52 magnetic alignment.",
    highlights: [
      "25W Ultra-Fast Qi2 Magnetic Array",
      "Dual-Zone Phone & Earbuds Charging",
      "Solid Weighted Billet Aluminum",
    ],
    colors: [
      { name: "Raw Titanium Grey", hex: "#8A847C" },
      { name: "Anodized Espresso", hex: "#2B2623" },
    ],
  },
  {
    id: "pro-earbuds",
    name: "Aurelia Acoustic Pro",
    subtitle: "Lossless Spatial Audio • Titanium Acoustic Chambers",
    category: "Audio",
    price: 329,
    badge: "STUDIO GRADE",
    primaryImage: "/frames/frame_0158.webp",
    secondaryImage: "/frames/frame_0135.webp",
    objectPosition: "60% 68%",
    description:
      "Custom 11mm beryllium-coated drivers housed in acoustic-grade titanium shells with adaptive studio noise cancellation.",
    highlights: [
      "24-bit / 96kHz Lossless Wireless Audio",
      "-48dB Hybrid Studio Noise Cancellation",
      "MagSafe & Qi2 Wireless Charging Case",
    ],
    colors: [
      { name: "Brushed Titanium", hex: "#938C82" },
      { name: "Matte Obsidian", hex: "#181817" },
    ],
  },
  {
    id: "leather-case",
    name: "Full-Grain Saddle Case",
    subtitle: "Vegetable-Tanned Heritage Leather with MagSafe",
    category: "Protection",
    price: 129,
    badge: "HANDCRAFTED",
    primaryImage: "/frames/frame_0220.webp",
    secondaryImage: "/frames/frame_0238.webp",
    objectPosition: "72% 50%",
    description:
      "Wrapped in supple full-grain saddle leather that develops a rich, individual patina over time, lined with Japanese alcantara.",
    highlights: [
      "Full-Grain European Saddle Leather",
      "Integrated N52 MagSafe Magnet Ring",
      "Machined Anodized Metal Tactile Buttons",
    ],
    colors: [
      { name: "Cognac Saddle", hex: "#6B3E23" },
      { name: "Espresso Bark", hex: "#362318" },
      { name: "Obsidian Hide", hex: "#1A1918" },
    ],
  },
];

export interface ProductShowcaseGridProps {
  onAddToBag: (product: ProductItem, selectedColor: string) => void;
  onAcquireSuite?: () => void;
  onInspectSpecs?: (productId: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  highlightedProductId?: string | null;
}

export default function ProductShowcaseGrid({
  onAddToBag,
  onAcquireSuite,
  onInspectSpecs,
  wishlistIds,
  onToggleWishlist,
  highlightedProductId,
}: ProductShowcaseGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    "titanium-phone": "Natural Titanium",
    "magsafe-dock": "Raw Titanium Grey",
    "pro-earbuds": "Brushed Titanium",
    "leather-case": "Cognac Saddle",
  });
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>(
    {}
  );

  const categories = ["All", "Devices", "Ecosystem", "Audio", "Protection"];

  const filteredProducts =
    selectedCategory === "All"
      ? FLAGSHIP_PRODUCTS
      : FLAGSHIP_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAdd = (product: ProductItem) => {
    const chosenColor =
      selectedColors[product.id] || product.colors[0]?.name || "Standard";
    onAddToBag(product, chosenColor);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  return (
    <section
      id="collection"
      className="relative z-20 w-full bg-gradient-to-b from-[#E5D9C8] via-[#E2D5C1] to-[#DFD2BE] mt-0 pt-12 md:pt-24 pb-20 md:pb-32 border-t border-[#1C1917]/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        {/* Editorial Section Header ("CRAFTED TO LAST") */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8 pb-10 md:pb-14 border-b border-[#1C1917]/12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-6 md:w-8 h-[1px] bg-[#1C1917]" />
              <span className="text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#6E655F]">
                CRAFTED TO LAST • ATELIER COLLECTION
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-[-0.01em] leading-[1.06]">
              THE FLAGSHIP OBJECTS.
            </h2>
          </div>

          <div className="w-full lg:w-auto overflow-hidden">
            {/* Single-Row Horizontally Scrollable Category Filter Pills on Mobile */}
            <div
              className="flex overflow-x-auto no-scrollbar whitespace-nowrap items-center gap-1.5 p-1.5 rounded-full bg-[#1C1917]/[0.05] border border-[#1C1917]/10 max-w-full w-max"
              role="tablist"
              aria-label="Filter Products by Category"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer ${
                      active
                        ? "bg-[#141413] text-[#FFFFFF] shadow-sm"
                        : "text-[#6E655F] hover:text-[#1C1917]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4-Product Luxury Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-14">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isAdded = !!recentlyAdded[product.id];
            const isHighlighted = highlightedProductId === product.id;
            const currentColor =
              selectedColors[product.id] || product.colors[0].name;

            return (
              <article
                key={product.id}
                id={`product-${product.id}`}
                className={`group relative rounded-3xl overflow-hidden bg-[#EBE1D2]/85 border transition-all duration-500 flex flex-col justify-between ${
                  isHighlighted
                    ? "border-[#141413] ring-2 ring-[#141413]/20 shadow-[0_25px_60px_rgba(28,25,23,0.14)]"
                    : "border-[#1C1917]/12 hover:border-[#1C1917]/30 hover:shadow-[0_24px_60px_rgba(28,25,23,0.09)]"
                }`}
              >
                {/* Visual Stage with Primary + Hover Secondary Studio Frame */}
                <div
                  onClick={() => onInspectSpecs?.(product.id)}
                  className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-[#E5D9C7] cursor-pointer"
                >
                  {/* Top Card Badges & Wishlist Action */}
                  <div
                    className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="px-3.5 py-1.5 rounded-full bg-[#E6DAC8]/90 backdrop-blur-md border border-[#1C1917]/15 text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[#1C1917]">
                      {product.badge}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.name} from Wishlist`
                          : `Save ${product.name} to Wishlist`
                      }
                      className="w-10 h-10 rounded-full bg-[#E6DAC8]/90 backdrop-blur-md border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? "#141413" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Primary Studio Image */}
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    style={{
                      objectPosition: product.objectPosition || "72% 50%",
                    }}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                  />

                  {/* Secondary Studio Angle on Hover */}
                  <img
                    src={product.secondaryImage}
                    alt={`${product.name} alternate studio angle`}
                    style={{
                      objectPosition: product.objectPosition || "72% 50%",
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                  />

                  {/* Interactive 360° & CAD Blueprint Trigger Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectSpecs?.(product.id);
                    }}
                    className="absolute bottom-4 right-5 z-20 px-4 py-2 rounded-full bg-[#141413]/90 text-white text-[10px] font-medium uppercase tracking-[0.2em] opacity-90 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-[#141413]"
                  >
                    INSPECT SPECS +
                  </button>
                </div>

                {/* Card Content & Purchase Controls */}
                <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#ECE2D4]/70 to-[#E5D9C7]/90">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#6E655F] block mb-1">
                          {product.category}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1917] tracking-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                          ${product.price.toLocaleString()}
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-[#6E655F]">
                          USD • INCL. STUDIO CARE
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-[#6E655F] tracking-wide mb-4">
                      {product.subtitle}
                    </p>

                    <p className="text-sm text-[#1C1917]/80 leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Key Engineering Highlights + Blueprint Link */}
                    <div className="mb-7 border-t border-[#1C1917]/10 pt-4 flex items-end justify-between gap-4">
                      <ul className="space-y-1.5">
                        {product.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2.5 text-xs text-[#6E655F]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#141413]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => onInspectSpecs?.(product.id)}
                        className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#1C1917] underline underline-offset-4 hover:text-[#6E655F] shrink-0 cursor-pointer"
                      >
                        360° & CAD →
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Finish Swatches + Add to Bag Button */}
                  <div className="pt-5 border-t border-[#1C1917]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Finish Selector */}
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6E655F] mb-2">
                        FINISH:{" "}
                        <strong className="text-[#1C1917] font-medium">
                          {currentColor}
                        </strong>
                      </span>
                      <div className="flex items-center gap-2.5">
                        {product.colors.map((color) => {
                          const isSelected = currentColor === color.name;
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() =>
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: color.name,
                                }))
                              }
                              aria-label={`Select finish ${color.name}`}
                              title={color.name}
                              className={`w-6 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "ring-2 ring-offset-2 ring-offset-[#E6DAC8] ring-[#141413] scale-110"
                                  : "opacity-75 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: color.hex }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Matte Obsidian Add to Bag CTA */}
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className={`inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-xs font-sans font-medium uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${
                        isAdded
                          ? "bg-[#2C3E2E] text-white"
                          : "bg-[#141413] text-[#FFFFFF] hover:bg-[#292624] hover:shadow-[0_12px_28px_rgba(20,20,19,0.2)] active:scale-[0.98]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <span>ADDED TO BAG ✓</span>
                        </>
                      ) : (
                        <>
                          <span>ADD TO BAG +</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Complete Ecosystem Atelier Banner */}
        <div className="mt-20 rounded-3xl p-8 sm:p-12 lg:p-16 bg-[#141413] text-[#FFFFFF] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#E6DAC8]/70 block mb-3">
              THE COMPLETE ATELIER SUITE
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white tracking-tight mb-4">
              Acquire the Complete Four-Piece Titanium & Leather Ensemble.
            </h3>
            <p className="text-sm text-[#E6DAC8]/75 leading-relaxed">
              Includes the Aurelia One Pro (512GB), Sculpted Aluminum Qi2 Stand,
              Acoustic Pro Earbuds, and Full-Grain Saddle Leather Case in a
              numbered cedar presentation trunk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#E6DAC8]/60 block">
                ENSEMBLE PRIVILEGE
              </span>
              <span className="font-serif text-3xl sm:text-4xl text-white">
                $1,790
              </span>
              <span className="text-xs text-[#E6DAC8]/50 line-through ml-2">
                $1,906
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onAcquireSuite) {
                  onAcquireSuite();
                } else {
                  FLAGSHIP_PRODUCTS.forEach((p) =>
                    onAddToBag(p, p.colors[0].name)
                  );
                }
              }}
              className="px-8 py-4 rounded-full bg-[#E6DAC8] text-[#141413] text-xs font-sans font-semibold uppercase tracking-[0.22em] hover:bg-white transition-colors duration-300 cursor-pointer"
            >
              ACQUIRE THE SUITE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
