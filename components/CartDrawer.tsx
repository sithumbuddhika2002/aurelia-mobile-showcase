"use client";

import React, { useEffect, useState } from "react";
import type { ProductItem } from "./ProductShowcaseGrid";

export interface BagLineItem {
  product: ProductItem;
  color: string;
  quantity: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagLineItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearBag: () => void;
  onInspectProduct?: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
  onInspectProduct,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<"bag" | "confirm" | "done">(
    "bag"
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [monogramText, setMonogramText] = useState("");
  const [includeMonogram, setIncludeMonogram] = useState(false);

  // Reset checkout step when drawer re-opens with items
  useEffect(() => {
    if (isOpen && items.length > 0 && checkoutStep === "done") {
      setCheckoutStep("bag");
    }
  }, [isOpen, items.length, checkoutStep]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCompleteReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("done");
    onClearBag();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-[#141413]/55 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Aurelia Boutique Shopping Bag"
    >
      <aside
        data-lenis-prevent
        className="relative w-full max-w-lg h-full bg-[#E6DAC8] text-[#1C1917] border-l border-[#1C1917]/15 shadow-[0_0_80px_rgba(20,20,19,0.35)] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <div className="px-7 sm:px-9 pt-8 pb-6 border-b border-[#1C1917]/12 flex items-center justify-between bg-[#E6DAC8]/90 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#141413]" />
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.26em] text-[#6E655F]">
                AURELIA PRIVATE BOUTIQUE
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] tracking-tight">
              {checkoutStep === "done"
                ? "Dispatch Confirmed"
                : checkoutStep === "confirm"
                ? "Private Client Dispatch"
                : `Your Bag (${totalCount})`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Shopping Bag"
            className="w-10 h-10 rounded-full border border-[#1C1917]/15 bg-[#1C1917]/[0.04] hover:bg-[#141413] hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Complimentary White-Glove Courier Banner */}
        <div className="px-7 sm:px-9 py-3 bg-[#DFD2BE] border-b border-[#1C1917]/10 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#1C1917]">
          <span className="flex items-center gap-2 font-medium">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            COMPLIMENTARY ARMORED COURIER DELIVERY
          </span>
          <span className="font-mono text-[#6E655F]">INSURED</span>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-7 sm:px-9 py-6">
          {checkoutStep === "done" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#141413] text-white flex items-center justify-center mb-6 shadow-lg">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#6E655F] mb-2">
                DOSSIER #AUR-849201
              </span>
              <h3 className="font-serif text-3xl text-[#1C1917] mb-3">
                Atelier Reservation Confirmed
              </h3>
              <p className="text-sm text-[#6E655F] max-w-sm leading-relaxed mb-8">
                {clientName
                  ? `Thank you, ${clientName}. `
                  : "Thank you. "}
                Your bespoke titanium hardware and hand-stitched leather
                accessories are being prepared for white-glove courier
                dispatch.
              </p>
              {includeMonogram && monogramText && (
                <div className="mb-8 px-5 py-3 rounded-2xl bg-[#1C1917]/[0.05] border border-[#1C1917]/12 text-xs text-[#1C1917]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E655F] block mb-1">
                    ENGRAVED ATELIER MONOGRAM
                  </span>
                  <span className="font-serif tracking-[0.3em] text-base">
                    {monogramText.toUpperCase()}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep("bag");
                  onClose();
                }}
                className="px-8 py-4 rounded-full bg-[#141413] text-white text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#292624] transition-colors cursor-pointer"
              >
                RETURN TO SHOWCASE
              </button>
            </div>
          ) : checkoutStep === "confirm" ? (
            <form onSubmit={handleCompleteReservation} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setCheckoutStep("bag")}
                  className="text-[11px] uppercase tracking-[0.2em] text-[#6E655F] hover:text-[#1C1917] flex items-center gap-1.5 mb-4 cursor-pointer"
                >
                  <span>← Back to Bag</span>
                </button>
                <p className="text-xs text-[#6E655F] leading-relaxed">
                  Enter your private client dispatch details. No immediate
                  card charge is processed until your concierge confirms serial
                  allocation.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#1C1917] font-semibold mb-2">
                  FULL NAME OR ATELIER ACCOUNT
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Julian Vance"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#EFE6D8] border border-[#1C1917]/15 text-sm text-[#1C1917] placeholder-[#6E655F]/60 focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#1C1917] font-semibold mb-2">
                  PRIVATE DISPATCH EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@aurelia-atelier.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#EFE6D8] border border-[#1C1917]/15 text-sm text-[#1C1917] placeholder-[#6E655F]/60 focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1917]/[0.04] border border-[#1C1917]/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6E655F]">
                  <span>Allocated Items ({totalCount})</span>
                  <span>${subtotal.toLocaleString()} USD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6E655F]">
                  <span>Armored Courier & 5-Year Care</span>
                  <span className="text-[#1C1917] font-medium">INCLUDED</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#141413] text-white text-xs font-medium uppercase tracking-[0.22em] hover:bg-[#292624] transition-all cursor-pointer"
              >
                CONFIRM PRIVATE ALLOCATION — ${subtotal.toLocaleString()}
              </button>
            </form>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-14 h-14 rounded-full border border-[#1C1917]/15 flex items-center justify-center text-[#6E655F] mb-5">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-[#1C1917] mb-2">
                Your Atelier Bag is Empty
              </h3>
              <p className="text-xs text-[#6E655F] max-w-xs leading-relaxed mb-8">
                Select from our Grade 5 Titanium Smartphone, Sculpted Qi2
                Charging Stand, Acoustic Pro Earbuds, or Saddle Leather Case.
              </p>
              <a
                href="#collection"
                onClick={onClose}
                className="px-7 py-3.5 rounded-full bg-[#141413] text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#292624] transition-colors"
              >
                EXPLORE COLLECTION
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.color}`}
                  className="p-4 rounded-2xl bg-[#EFE6D8]/85 border border-[#1C1917]/12 flex items-center gap-4 transition-all hover:border-[#1C1917]/25"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onInspectProduct?.(item.product.id);
                    }}
                    className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#DFD2BE] border border-[#1C1917]/10 shrink-0 group cursor-pointer"
                  >
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      style={{
                        objectPosition:
                          item.product.objectPosition || "72% 50%",
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#6E655F] block">
                          {item.product.category}
                        </span>
                        <h4 className="font-serif text-lg text-[#1C1917] truncate">
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-[#6E655F] hover:text-[#1C1917] p-1 transition-colors cursor-pointer"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-[#6E655F] mt-0.5 mb-3">
                      Finish:{" "}
                      <span className="text-[#1C1917] font-medium">
                        {item.color}
                      </span>
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls (- / +) */}
                      <div className="inline-flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-[#E6DAC8] border border-[#1C1917]/15">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, -1)}
                          aria-label="Decrease quantity"
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-[#1C1917] hover:bg-[#1C1917]/10 transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-xs font-mono font-medium min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, 1)}
                          aria-label="Increase quantity"
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-[#1C1917] hover:bg-[#1C1917]/10 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-serif text-lg text-[#1C1917]">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Optional Complimentary Laser / Blind-Deboss Monogramming */}
              <div className="p-4 rounded-2xl border border-[#1C1917]/12 bg-[#1C1917]/[0.03]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-[11px] font-medium text-[#1C1917] block">
                      Complimentary Atelier Monogramming
                    </span>
                    <span className="text-[10px] text-[#6E655F]">
                      Precision laser-etched or blind-debossed initials (up to 4
                      characters)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeMonogram}
                    onChange={(e) => setIncludeMonogram(e.target.checked)}
                    className="accent-[#141413] w-4 h-4 cursor-pointer"
                  />
                </label>

                {includeMonogram && (
                  <input
                    type="text"
                    maxLength={4}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value)}
                    placeholder="INITIALS (E.G. J.V.)"
                    className="mt-3 w-full px-3.5 py-2 rounded-xl bg-[#EFE6D8] border border-[#1C1917]/15 text-xs uppercase tracking-[0.25em] text-[#1C1917] placeholder-[#6E655F]/60 focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && checkoutStep === "bag" && (
          <div className="px-7 sm:px-9 py-6 bg-[#DFD2BE]/90 border-t border-[#1C1917]/15 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#6E655F]">
                <span>Insured White-Glove Courier</span>
                <span className="font-mono text-[#1C1917]">COMPLIMENTARY</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#6E655F]">
                <span>5-Year Titanium & Optical Care</span>
                <span className="font-mono text-[#1C1917]">INCLUDED</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1C1917]/10">
                <span className="font-serif text-xl text-[#1C1917]">
                  Estimated Subtotal
                </span>
                <span className="font-serif text-2xl text-[#1C1917]">
                  ${subtotal.toLocaleString()} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutStep("confirm")}
              className="w-full py-4 rounded-full bg-[#141413] text-[#FFFFFF] text-xs font-sans font-medium uppercase tracking-[0.22em] hover:bg-[#292624] hover:shadow-[0_12px_30px_rgba(20,20,19,0.25)] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>PROCEED TO PRIVATE CHECKOUT</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
