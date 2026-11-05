"use client";

import React, { useEffect, useState } from "react";
import { FLAGSHIP_PRODUCTS, ProductItem } from "./ProductShowcaseGrid";

export interface SpecsModalProps {
  isOpen: boolean;
  subjectId: string | null; // "titanium-phone" | "camera-specs" | "magsafe-dock" | "pro-earbuds" | "leather-case"
  onClose: () => void;
  onAddToBag: (product: ProductItem, selectedColor: string) => void;
  onChangeSubject?: (subjectId: string) => void;
}

interface ArchitecturalSpecData {
  productId: string;
  code: string;
  tagline: string;
  title: string;
  frameStart: number;
  frameEnd: number;
  defaultFrame: number;
  dimensions: {
    height: string;
    width: string;
    depth: string;
    weight: string;
  };
  blueprintLabel: string;
  materials: {
    name: string;
    origin: string;
    composition: string;
    percentage: number;
  }[];
  engineeringNotes: {
    title: string;
    detail: string;
  }[];
}

const ARCHITECTURAL_DOSSIERS: Record<string, ArchitecturalSpecData> = {
  "titanium-phone": {
    productId: "titanium-phone",
    code: "CAD-SPEC // AUR-01-TI",
    tagline: "FLAGSHIP CRAFTSMANSHIP • CHASSIS ARCHITECTURE",
    title: "Aurelia One Pro — Grade 5 Titanium",
    frameStart: 1,
    frameEnd: 60,
    defaultFrame: 22,
    dimensions: {
      height: "159.9 mm",
      width: "76.7 mm",
      depth: "8.25 mm",
      weight: "187 grams",
    },
    blueprintLabel: "UNIBODY TI-6AL-4V STRUCTURAL SHELL • 1.15MM BEZEL",
    materials: [
      {
        name: "Aerospace Grade 5 Titanium (Ti-6Al-4V)",
        origin: "PVD Micro-Blasted Outer Band",
        composition: "90% Ti • 6% Al • 4% V",
        percentage: 92,
      },
      {
        name: "Ceramic-Infused Sapphire Front Shield",
        origin: "Dual-Ion Exchange Matrix",
        composition: "2,200 HV Mohs Scratch Resistance",
        percentage: 88,
      },
      {
        name: "100% Recycled Thermal Substructure",
        origin: "Solid-State Diffusion Bonded",
        composition: "Graphite + Aluminum Vapor Chamber",
        percentage: 95,
      },
    ],
    engineeringNotes: [
      {
        title: "Solid-State Diffusion Bonding",
        detail:
          "Fuses the Grade 5 titanium band to the internal recycled aluminum frame through 14-hour thermomechanical cycling.",
      },
      {
        title: "Contoured Micro-Arc Edges",
        detail:
          "CNC-chamfered 0.8mm perimeter radii reduce perceived thickness while improving one-handed ergonomics.",
      },
      {
        title: "IP68 Surgical-Grade Sealing",
        detail:
          "Precision laser-welded acoustic meshes and fluorosilicone gaskets rated to 6 meters for 30 minutes.",
      },
    ],
  },
  "camera-specs": {
    productId: "titanium-phone",
    code: "OPTICS-SPEC // AUR-3X-PRO",
    tagline: "PRECISION OPTICS • TRIPLE-LENS PRO CAMERA SYSTEM",
    title: "Studio-Grade Optical Array",
    frameStart: 61,
    frameEnd: 120,
    defaultFrame: 95,
    dimensions: {
      height: "38.4 mm Module",
      width: "36.8 mm Module",
      depth: "3.95 mm Bezels",
      weight: "Sapphire Elements",
    },
    blueprintLabel: "50MP MAIN • 120MM 5X TETRAPRISM • 48MP MACRO",
    materials: [
      {
        name: "Optical-Grade Sapphire Lens Covers",
        origin: "7-Layer Nano Anti-Reflective Coating",
        composition: "99.4% Light Transmission",
        percentage: 99,
      },
      {
        name: "Tetraprism Folded Glass Periscope",
        origin: "4-Axis 3D Sensor-Shift OIS",
        composition: "10,000 Micro-Adjustments / Sec",
        percentage: 94,
      },
      {
        name: "Machined Titanium Lens Rings",
        origin: "diamond-turned PVD bevels",
        composition: "Zero-Flare Baffle Geometry",
        percentage: 90,
      },
    ],
    engineeringNotes: [
      {
        title: "50MP Quad-Pixel 2nd-Gen Sensor",
        detail:
          "2.44µm quad-pixel pitch with 14-stop dynamic range and zero shutter lag studio RAW capture.",
      },
      {
        title: "120mm f/2.8 Tetraprism Telephoto",
        detail:
          "Folded glass prism reflects light four times, enabling a 5x optical zoom inside an 8.25mm chassis.",
      },
      {
        title: "48MP Ultra-Wide & 2cm Macro",
        detail:
          "Captures razor-sharp leather grain, watch movements, and studio textures down to 20 millimeters.",
      },
    ],
  },
  "magsafe-dock": {
    productId: "magsafe-dock",
    code: "CAD-SPEC // AUR-DOCK-QI2",
    tagline: "SEAMLESS ECOSYSTEM • MAGNETIC POWER ARCHITECTURE",
    title: "Sculpted Aluminum Qi2 Charging Stand",
    frameStart: 121,
    frameEnd: 180,
    defaultFrame: 150,
    dimensions: {
      height: "142.0 mm",
      width: "88.0 mm",
      depth: "104.5 mm",
      weight: "640 grams",
    },
    blueprintLabel: "CNC BILLET ALUMINUM • 25W QI2 DUAL-ZONE",
    materials: [
      {
        name: "6061-T6 Aerospace Billet Aluminum",
        origin: "5-Axis CNC Milled Monoblock",
        composition: "Bead-Blasted Anodized Finish",
        percentage: 96,
      },
      {
        name: "N52H High-Flux Neodymium Ring",
        origin: "18-Pole Precision Magnetic Array",
        composition: "1,100g Holding Force",
        percentage: 91,
      },
      {
        name: "Weighted Stainless Steel Footplate",
        origin: "Micro-Suction Silicone Base",
        composition: "One-Handed Detach Stability",
        percentage: 95,
      },
    ],
    engineeringNotes: [
      {
        title: "25W Active-Cooled Qi2 Induction",
        detail:
          "Delivers 0% to 50% charge in 24 minutes while aluminum thermal mass dissipates heat silently.",
      },
      {
        title: "62° Ergonomic Viewing Inclination",
        detail:
          "Calibrated for desk-level Standby telemetry, FaceID recognition, and video calls.",
      },
      {
        title: "Recessed Secondary Acoustic Cradle",
        detail:
          "Dedicated 5W Qi pad sculpted into the base for Aurelia Acoustic Pro earbuds.",
      },
    ],
  },
  "pro-earbuds": {
    productId: "pro-earbuds",
    code: "ACOUSTIC-SPEC // AUR-BUDS-01",
    tagline: "STUDIO ACOUSTICS • LOSSLESS TITANIUM CHAMBERS",
    title: "Aurelia Acoustic Pro Earbuds",
    frameStart: 130,
    frameEnd: 175,
    defaultFrame: 158,
    dimensions: {
      height: "45.2 mm Case",
      width: "60.6 mm Case",
      depth: "21.7 mm Case",
      weight: "5.3g / Earbud",
    },
    blueprintLabel: "11MM BERYLLIUM DRIVER • -48DB HYBRID ANC",
    materials: [
      {
        name: "Acoustic-Grade Titanium Shells",
        origin: "Resonance-Damped Inner Chamber",
        composition: "Zero Harmonic Distortion (<0.08%)",
        percentage: 97,
      },
      {
        name: "11mm Beryllium-Coated Diaphragm",
        origin: "Dual-Neodymium Voice Coil",
        composition: "5Hz – 45kHz Frequency Response",
        percentage: 94,
      },
      {
        name: "Medical-Grade Liquid Silicone Tips",
        origin: "4 Sizes Included in Trunk",
        composition: "Passive Acoustic Seal",
        percentage: 90,
      },
    ],
    engineeringNotes: [
      {
        title: "24-Bit / 96kHz Ultra-Wideband Audio",
        detail:
          "Proprietary low-latency lossless codec preserves studio master nuance without compression.",
      },
      {
        title: "6-Microphone Beamforming Array",
        detail:
          "Samples external ambient noise 48,000 times per second for up to -48dB studio isolation.",
      },
      {
        title: "38-Hour Combined MagSafe Case",
        detail:
          "Snaps magnetically onto the Sculpted Aluminum Stand or any Qi2 / MagSafe charger.",
      },
    ],
  },
  "leather-case": {
    productId: "leather-case",
    code: "ATELIER-SPEC // AUR-LTHR-04",
    tagline: "PREMIUM WITH CARE • FULL-GRAIN SADDLE LEATHER",
    title: "Full-Grain MagSafe Saddle Case",
    frameStart: 181,
    frameEnd: 240,
    defaultFrame: 220,
    dimensions: {
      height: "163.1 mm",
      width: "79.8 mm",
      depth: "10.4 mm",
      weight: "34 grams",
    },
    blueprintLabel: "VEGETABLE-TANNED HIDE • N52 MAGSAFE ARRAY",
    materials: [
      {
        name: "Full-Grain European Bullhide Leather",
        origin: " Drum-Dyed Vegetable Tanning",
        composition: "Un-sanded Natural Top-Grain",
        percentage: 100,
      },
      {
        name: "Japanese Alcantara Microfiber Lining",
        origin: "0.4mm Recessed Cushioning",
        composition: "Scratch-Free Chassis Cradle",
        percentage: 92,
      },
      {
        name: "CNC-Machined Anodized Aluminum Buttons",
        origin: "Knurled Tactile Action",
        composition: "Crisp Mechanical Click Response",
        percentage: 95,
      },
    ],
    engineeringNotes: [
      {
        title: "Organic Patina Evolution",
        detail:
          "Untreated with synthetic plastic coatings so natural oils deepen the cognac saddle tone over time.",
      },
      {
        title: "1.2mm Raised Sapphire Camera Bezel",
        detail:
          "Double-folded leather lip shields both the front glass and rear triple-lens array on flat surfaces.",
      },
      {
        title: "Flush Embedded N52 MagSafe Ring",
        detail:
          "38 precision-aligned neodymium magnets ensure instantaneous lock-on with stands and wallets.",
      },
    ],
  },
};

function formatFrameUrl(frame: number): string {
  const clamped = Math.max(1, Math.min(240, Math.round(frame)));
  return `/frames/frame_${String(clamped).padStart(4, "0")}.webp`;
}

export default function SpecsModal({
  isOpen,
  subjectId,
  onClose,
  onAddToBag,
  onChangeSubject,
}: SpecsModalProps) {
  const resolvedKey =
    subjectId && ARCHITECTURAL_DOSSIERS[subjectId]
      ? subjectId
      : "titanium-phone";
  const dossier = ARCHITECTURAL_DOSSIERS[resolvedKey];

  const product =
    FLAGSHIP_PRODUCTS.find((p) => p.id === dossier.productId) ||
    FLAGSHIP_PRODUCTS[0];

  const [currentFrame, setCurrentFrame] = useState<number>(
    dossier.defaultFrame
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0].name
  );
  const [activeTab, setActiveTab] = useState<
    "scrubber" | "blueprint" | "materials"
  >("scrubber");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync frame and color when subject changes
  useEffect(() => {
    setCurrentFrame(dossier.defaultFrame);
    setSelectedColor(product.colors[0].name);
    setActiveTab("scrubber");
  }, [resolvedKey, dossier.defaultFrame, product]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !subjectId) return null;

  const handlePointerMoveScrub = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const nextFrame = Math.round(
      dossier.frameStart + ratio * (dossier.frameEnd - dossier.frameStart)
    );
    setCurrentFrame(nextFrame);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#141413]/65 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dossier.title}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-[#E6DAC8] text-[#1C1917] border border-[#1C1917]/20 shadow-[0_30px_90px_rgba(20,20,19,0.45)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="px-6 sm:px-9 py-5 border-b border-[#1C1917]/12 flex flex-wrap items-center justify-between gap-4 bg-[#E6DAC8]/95">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#141413] text-white text-[10px] font-mono uppercase tracking-[0.2em]">
              {dossier.code}
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.24em] text-[#6E655F] font-medium">
              {dossier.tagline}
            </span>
          </div>

          {/* Subject Switcher Pills */}
          <div className="flex items-center gap-1.5">
            {[
              { id: "titanium-phone", label: "Chassis" },
              { id: "camera-specs", label: "Optics" },
              { id: "magsafe-dock", label: "Stand" },
              { id: "pro-earbuds", label: "Audio" },
              { id: "leather-case", label: "Leather" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeSubject?.(item.id)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
                  resolvedKey === item.id
                    ? "bg-[#1C1917] text-white font-medium"
                    : "bg-[#1C1917]/[0.06] text-[#6E655F] hover:text-[#1C1917]"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Specification Modal"
              className="ml-2 w-9 h-9 rounded-full bg-[#1C1917]/10 hover:bg-[#141413] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column (7 cols): Interactive 360° Frame Scrubber & Blueprint Stage */}
          <div className="lg:col-span-7 bg-[#DFD2BE] border-b lg:border-b-0 lg:border-r border-[#1C1917]/12 flex flex-col justify-between p-6 sm:p-8">
            {/* Mode Tabs */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex p-1 rounded-full bg-[#E6DAC8] border border-[#1C1917]/12">
                <button
                  type="button"
                  onClick={() => setActiveTab("scrubber")}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer ${
                    activeTab === "scrubber"
                      ? "bg-[#141413] text-white"
                      : "text-[#6E655F] hover:text-[#1C1917]"
                  }`}
                >
                  Interactive Studio Scrub
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("blueprint")}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer ${
                    activeTab === "blueprint"
                      ? "bg-[#141413] text-white"
                      : "text-[#6E655F] hover:text-[#1C1917]"
                  }`}
                >
                  CAD Blueprint
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("materials")}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer ${
                    activeTab === "materials"
                      ? "bg-[#141413] text-white"
                      : "text-[#6E655F] hover:text-[#1C1917]"
                  }`}
                >
                  Metallurgy
                </button>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#1C1917]">
                FRAME {String(currentFrame).padStart(3, "0")}
              </span>
            </div>

            {/* Interactive Visual Viewport */}
            {activeTab === "scrubber" && (
              <div className="space-y-4">
                <div
                  onPointerDown={(e) => {
                    setIsDragging(true);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={handlePointerMoveScrub}
                  onPointerUp={() => setIsDragging(false)}
                  onPointerCancel={() => setIsDragging(false)}
                  className="relative h-[300px] sm:h-[360px] w-full rounded-2xl overflow-hidden bg-[#E6DAC8] border border-[#1C1917]/15 cursor-ew-resize select-none"
                >
                  <img
                    src={formatFrameUrl(currentFrame)}
                    alt={`${dossier.title} frame ${currentFrame}`}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    style={{
                      objectPosition: product.objectPosition || "74% 50%",
                    }}
                  />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#141413]/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em]">
                    <span>← DRAG HORIZONTALLY TO INSPECT ANGLE →</span>
                    <span className="font-mono">
                      {String(currentFrame).padStart(3, "0")} /{" "}
                      {String(dossier.frameEnd).padStart(3, "0")}
                    </span>
                  </div>
                </div>

                {/* Precision Frame Scrubber Slider */}
                <div className="px-1">
                  <input
                    type="range"
                    min={dossier.frameStart}
                    max={dossier.frameEnd}
                    value={currentFrame}
                    onChange={(e) => setCurrentFrame(Number(e.target.value))}
                    aria-label="Scrub Product Frame Angle"
                    className="w-full accent-[#141413] cursor-pointer h-1.5 bg-[#1C1917]/20 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-[#6E655F] mt-1">
                    <span>
                      START FRAME {String(dossier.frameStart).padStart(3, "0")}
                    </span>
                    <span>OPTICAL SEQUENCE SCRUBBER</span>
                    <span>
                      END FRAME {String(dossier.frameEnd).padStart(3, "0")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blueprint" && (
              <div className="h-[340px] sm:h-[390px] w-full rounded-2xl bg-[#141413] text-[#E6DAC8] p-6 flex flex-col justify-between relative overflow-hidden border border-[#1C1917]/20">
                {/* Architectural Grid Lines */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #E6DAC8 1px, transparent 1px), linear-gradient(to bottom, #E6DAC8 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-[#E6DAC8]/70">
                  <span>{dossier.blueprintLabel}</span>
                  <span>SCALE 1:1 • TOLERANCE ±0.01MM</span>
                </div>

                {/* Vector Architectural CAD Schematic SVG */}
                <div className="relative z-10 flex-1 flex items-center justify-center my-2">
                  <svg
                    viewBox="0 0 420 220"
                    className="w-full max-w-md h-48 stroke-[#E6DAC8] fill-none"
                  >
                    {/* Outer Dimension Callout */}
                    <line
                      x1="65"
                      y1="20"
                      x2="65"
                      y2="200"
                      strokeWidth="0.75"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="20"
                      y="114"
                      fill="#E6DAC8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {dossier.dimensions.height}
                    </text>

                    {/* Primary Device Schematic Outline */}
                    <rect
                      x="95"
                      y="20"
                      width="105"
                      height="180"
                      rx="18"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="100"
                      y="25"
                      width="95"
                      height="170"
                      rx="14"
                      strokeWidth="0.7"
                      strokeOpacity="0.6"
                    />

                    {/* Triple-Lens Pro Camera Plateau Callout */}
                    <rect
                      x="106"
                      y="32"
                      width="44"
                      height="46"
                      rx="10"
                      strokeWidth="1.2"
                    />
                    <circle cx="118" cy="44" r="8" strokeWidth="1.2" />
                    <circle cx="118" cy="65" r="8" strokeWidth="1.2" />
                    <circle cx="137" cy="54" r="8" strokeWidth="1.2" />

                    {/* MagSafe N52 Magnet Ring Array */}
                    <circle
                      cx="147.5"
                      cy="115"
                      r="26"
                      strokeWidth="1.1"
                      strokeDasharray="4 2"
                    />
                    <circle cx="147.5" cy="115" r="19" strokeWidth="0.8" />
                    <line
                      x1="147.5"
                      y1="146"
                      x2="147.5"
                      y2="162"
                      strokeWidth="2"
                    />

                    {/* Side Profile Cross-Section */}
                    <rect
                      x="255"
                      y="20"
                      width="18"
                      height="180"
                      rx="5"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="285"
                      y1="20"
                      x2="345"
                      y2="20"
                      strokeWidth="0.6"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="285"
                      y1="200"
                      x2="345"
                      y2="200"
                      strokeWidth="0.6"
                      strokeDasharray="2 2"
                    />
                    <text
                      x="288"
                      y="95"
                      fill="#E6DAC8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      DEPTH: {dossier.dimensions.depth}
                    </text>
                    <text
                      x="288"
                      y="115"
                      fill="#E6DAC8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      WIDTH: {dossier.dimensions.width}
                    </text>
                    <text
                      x="288"
                      y="135"
                      fill="#E6DAC8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      MASS: {dossier.dimensions.weight}
                    </text>
                  </svg>
                </div>

                <div className="relative z-10 grid grid-cols-4 gap-2 pt-3 border-t border-[#E6DAC8]/15 text-center">
                  <div>
                    <span className="text-[9px] font-mono text-[#E6DAC8]/60 block">
                      HEIGHT
                    </span>
                    <span className="text-xs font-mono">
                      {dossier.dimensions.height}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#E6DAC8]/60 block">
                      WIDTH
                    </span>
                    <span className="text-xs font-mono">
                      {dossier.dimensions.width}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#E6DAC8]/60 block">
                      PROFILE
                    </span>
                    <span className="text-xs font-mono">
                      {dossier.dimensions.depth}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#E6DAC8]/60 block">
                      MASS
                    </span>
                    <span className="text-xs font-mono">
                      {dossier.dimensions.weight}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "materials" && (
              <div className="h-[340px] sm:h-[390px] w-full rounded-2xl bg-[#EFE6D8] border border-[#1C1917]/15 p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6E655F] block mb-4">
                    METALLURGICAL & MATERIAL COMPOSITION BREAKDOWN
                  </span>

                  <div className="space-y-5">
                    {dossier.materials.map((mat) => (
                      <div key={mat.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#1C1917]">
                            {mat.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#6E655F]">
                            {mat.composition}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E655F]">
                          {mat.origin}
                        </p>
                        <div className="w-full h-1.5 rounded-full bg-[#1C1917]/10 overflow-hidden">
                          <div
                            className="h-full bg-[#141413] rounded-full transition-all duration-500"
                            style={{ width: `${mat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1C1917]/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-[#6E655F]">
                  <span>ISO-13485 SURGICAL GRADE</span>
                  <span>100% CONFLICT-FREE ELEMENTS</span>
                </div>
              </div>
            )}

            {/* Quick Finish Comparison Bar */}
            <div className="pt-5 mt-5 border-t border-[#1C1917]/12 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E655F] block mb-1.5">
                  ATELIER FINISH:{" "}
                  <strong className="text-[#1C1917]">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-3 py-1.5 rounded-full text-[10px] flex items-center gap-2 border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? "border-[#141413] bg-[#141413] text-white"
                          : "border-[#1C1917]/15 bg-[#E6DAC8] text-[#1C1917]"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Editorial Engineering Notes & Purchase Action */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#E6DAC8]">
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] leading-tight">
                  {dossier.title}
                </h2>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif text-2xl text-[#1C1917]">
                  ${product.price.toLocaleString()} USD
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E655F]">
                  • IN STOCK FOR IMMEDIATE DISPATCH
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {dossier.engineeringNotes.map((note, idx) => (
                  <div
                    key={note.title}
                    className="p-4 rounded-2xl bg-[#EFE6D8]/80 border border-[#1C1917]/10"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#6E655F]">
                        0{idx + 1}
                      </span>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1C1917]">
                        {note.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6E655F] leading-relaxed">
                      {note.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Add to Bag CTA */}
            <div className="pt-5 border-t border-[#1C1917]/12 space-y-3">
              <button
                type="button"
                onClick={() => {
                  onAddToBag(product, selectedColor);
                  onClose();
                }}
                className="w-full py-4 rounded-full bg-[#141413] text-[#FFFFFF] text-xs font-sans font-medium uppercase tracking-[0.22em] hover:bg-[#292624] hover:shadow-[0_12px_30px_rgba(20,20,19,0.25)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>
                  ADD TO BAG + (${product.price.toLocaleString()})
                </span>
              </button>
              <p className="text-[10px] text-center uppercase tracking-[0.2em] text-[#6E655F]">
                SHIPS IN NUMBERED CEDAR PRESENTATION BOX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
