"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTER_SCROLL_OFFSETS } from "./Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StorySection {
  id: string;
  index: number;
  startFrame: number;
  endFrame: number;
  startProgress: number;
  endProgress: number;
  chapterScrollOffset: number;
  tagline: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaAction: string;
  specs: { label: string; value: string }[];
}

export const STORY_SECTIONS: StorySection[] = [
  {
    id: "devices",
    index: 0,
    startFrame: 1,
    endFrame: 60,
    startProgress: 0.0,
    endProgress: 0.25,
    chapterScrollOffset: CHAPTER_SCROLL_OFFSETS[0], // 0%
    tagline: "FLAGSHIP CRAFTSMANSHIP",
    heading: "THE FUTURE IN YOUR HANDS.",
    description:
      "Engineered from aerospace-grade titanium with contoured edges and surgical-grade durability.",
    ctaLabel: "EXPLORE DESIGN",
    ctaAction: "titanium-phone",
    specs: [
      { label: "CHASSIS", value: "Grade 5 Titanium" },
      { label: "BEZEL", value: "1.15mm Micro-Arc" },
      { label: "WEIGHT", value: "187g Balanced" },
    ],
  },
  {
    id: "craft",
    index: 1,
    startFrame: 61,
    endFrame: 120,
    startProgress: 0.25,
    endProgress: 0.5,
    chapterScrollOffset: CHAPTER_SCROLL_OFFSETS[1], // 26%
    tagline: "PRECISION OPTICS",
    heading: "SEE IT FORM. CAPTURE EVERY DETAIL.",
    description:
      "Our next-generation triple-lens pro camera system captures studio-grade light, macro textures, and cinematic depth in every frame.",
    ctaLabel: "VIEW CAMERA SPECS",
    ctaAction: "camera-specs",
    specs: [
      { label: "MAIN SENSOR", value: "50MP Quad-Pixel" },
      { label: "TELEPHOTO", value: "120mm 5x Tetraprism" },
      { label: "COATING", value: "7-Layer Anti-Reflective" },
    ],
  },
  {
    id: "ecosystem",
    index: 2,
    startFrame: 121,
    endFrame: 180,
    startProgress: 0.5,
    endProgress: 0.75,
    chapterScrollOffset: CHAPTER_SCROLL_OFFSETS[2], // 52%
    tagline: "SEAMLESS ECOSYSTEM",
    heading: "A HOME FOR YOUR POWER.",
    description:
      "Effortless magnetic alignment. Snap your device onto our sculpted aluminum charging stand alongside acoustic-grade wireless audio.",
    ctaLabel: "SHOP ACCESSORIES",
    ctaAction: "magsafe-dock",
    specs: [
      { label: "ARCHITECTURE", value: "CNC Billet Aluminum" },
      { label: "DELIVERY", value: "25W Qi2 Magnetic" },
      { label: "AUDIO", value: "Lossless Titanium Buds" },
    ],
  },
  {
    id: "protection",
    index: 3,
    startFrame: 181,
    endFrame: 240,
    startProgress: 0.75,
    endProgress: 1.0,
    chapterScrollOffset: CHAPTER_SCROLL_OFFSETS[3], // 78%
    tagline: "PREMIUM WITH CARE",
    heading: "PROTECTION WITH PURPOSE.",
    description:
      "Wrapped in full-grain saddle leather with integrated MagSafe magnets. Designed to age beautifully while shielding what matters.",
    ctaLabel: "SHOP LEATHER CASES",
    ctaAction: "leather-case",
    specs: [
      { label: "MATERIAL", value: "Full-Grain Vegetable Tanned" },
      { label: "ARRAY", value: "N52 Neodymium MagSafe" },
      { label: "LINING", value: "Japanese Microfiber" },
    ],
  },
];

const TOTAL_FRAMES = 240;

// Exact scene cut windows where crossfades occur: Frames 58-63, 118-123, 178-183
const SCENE_CUT_WINDOWS: [number, number][] = [
  [58, 63],
  [118, 123],
  [178, 183],
];

function getFramePath(frameNumber: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNumber)));
  const padded = String(clamped).padStart(4, "0");
  return `/frames/frame_${padded}.webp`;
}

function getSceneCutMaskIntensity(exactFrame: number): number {
  for (const [start, end] of SCENE_CUT_WINDOWS) {
    if (exactFrame >= start && exactFrame <= end) {
      const normalized = (exactFrame - start) / (end - start);
      return Math.sin(normalized * Math.PI);
    }
  }
  return 0;
}

export interface ScrollCanvasHeroProps {
  onSectionChange?: (sectionIndex: number) => void;
  onCtaClick?: (actionId: string) => void;
  onNavigateChapter?: (chapterIndex: number) => void;
}

export default function ScrollCanvasHero({
  onSectionChange,
  onCtaClick,
}: ScrollCanvasHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileProgressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const soundButtonWrapRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const currentFrameRef = useRef<number>(1);
  const activeSectionRef = useRef<number>(0);
  const soundBtnVisibleRef = useRef<boolean>(true);
  const viewportMetricsRef = useRef<{
    width: number;
    height: number;
    dpr: number;
    targetWidth: number;
    targetHeight: number;
  }>({
    width: 1920,
    height: 1080,
    dpr: 1,
    targetWidth: 1920,
    targetHeight: 1080,
  });

  // Preloader state (only active before scroll unlocks)
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hidePreloader, setHidePreloader] = useState<boolean>(false);

  // Modern cinematic soundtrack audio player state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize modern cinematic audio element on mount
   */
  useEffect(() => {
    const audio = new Audio("/audio/cinematic-luxury.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = "";
    };
  }, []);

  /**
   * Measure and size the canvas backing store only on mount & window resize
   */
  const syncCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const targetWidth = Math.floor(width * dpr);
    const targetHeight = Math.floor(height * dpr);

    viewportMetricsRef.current = {
      width,
      height,
      dpr,
      targetWidth,
      targetHeight,
    };

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      if (ctxRef.current) {
        ctxRef.current.imageSmoothingEnabled = true;
        ctxRef.current.imageSmoothingQuality = "medium";
      }
    }
  }, []);

  /**
   * Split-Screen Mobile/Tablet & Full-Bleed Desktop Canvas 2D Renderer:
   * - On Mobile (< 768px) and Tablet (< 1024px):
   *   1) Fills the canvas with studio beige (#E5D9C8).
   *   2) Renders the sequence into the upper 54% of the viewport (`top: 56px` below the mobile navbar, `height: 52vh`).
   *   3) Uses a right-biased horizontal focal point (`70%` of `img.naturalWidth`) and zooms out (`0.85` of cover)
   *      so the entire phone, MagSafe stand, AND wireless earbuds case fit 100% inside the mobile frame without clipping.
   *   4) Feathers the top and bottom edges of the stage into `#E5D9C8` seamlessly.
   * - On Desktop (>= 1024px):
   *   100% intact full-screen cover math anchored to `alignX = 0.78`.
   */
  const renderFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx =
      ctxRef.current ||
      canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const index =
      Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNumber))) - 1;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { width: viewportWidth, dpr, targetWidth, targetHeight } =
      viewportMetricsRef.current;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    if (viewportWidth < 1024) {
      // 1. Fill entire canvas with exact studio beige (#E5D9C8)
      ctx.fillStyle = "#E5D9C8";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // 2. Dedicated top-half stage starting below the 56px mobile navbar
      const navOffset = (viewportWidth < 768 ? 56 : 64) * dpr;
      const stageHeight = targetHeight * 0.52;

      // 3. Calculate zoomed-out scale (~0.85 of cover) while ensuring the 70% focal point
      //    can sit horizontally centered without exposing the right edge of the 16:9 frame
      const stageCoverScale = Math.max(
        targetWidth / imgW,
        stageHeight / imgH
      );
      const minWidthScale = targetWidth / (imgW * 0.6);
      const scale = Math.max(stageCoverScale * 0.85, minWidthScale);

      const drawW = imgW * scale;
      const drawH = imgH * scale;

      // Center horizontally around 70% of source image width (where phone/dock/earbuds sit)
      const idealOffsetX = targetWidth * 0.5 - drawW * 0.7;
      const offsetX = Math.max(
        targetWidth - drawW,
        Math.min(0, idealOffsetX)
      );
      const offsetY = navOffset + (stageHeight - drawH) * 0.5;

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      // 4. Softly feather the top edge (below navbar) and bottom edge of the drawn image into #E5D9C8
      const topFeatherHeight = Math.max(24 * dpr, drawH * 0.12);
      const topGrad = ctx.createLinearGradient(
        0,
        Math.max(0, offsetY),
        0,
        Math.max(0, offsetY) + topFeatherHeight
      );
      topGrad.addColorStop(0, "#E5D9C8");
      topGrad.addColorStop(1, "rgba(229, 217, 200, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(
        0,
        0,
        targetWidth,
        Math.max(0, offsetY) + topFeatherHeight
      );

      const bottomEdgeY = offsetY + drawH;
      const bottomFeatherStart = bottomEdgeY - drawH * 0.18;
      const bottomGrad = ctx.createLinearGradient(
        0,
        bottomFeatherStart,
        0,
        bottomEdgeY + 4 * dpr
      );
      bottomGrad.addColorStop(0, "rgba(229, 217, 200, 0)");
      bottomGrad.addColorStop(1, "#E5D9C8");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(
        0,
        bottomFeatherStart,
        targetWidth,
        targetHeight - bottomFeatherStart
      );
    } else {
      // Desktop (>= 1024px): 100% intact full-screen cover anchored to right side
      const scale = Math.max(targetWidth / imgW, targetHeight / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      const offsetX = (targetWidth - drawW) * 0.78;
      const offsetY = (targetHeight - drawH) * 0.5;

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }
  }, []);

  /**
   * GPU-composited scene cut micro-transition at frames 58–63, 118–123, 178–183
   */
  const applySceneCutMask = useCallback((exactFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const k = getSceneCutMaskIntensity(exactFrame);
    if (k <= 0.001) {
      if (canvas.style.opacity !== "1") {
        canvas.style.transform = "scale3d(1, 1, 1)";
        canvas.style.opacity = "1";
      }
    } else {
      const scale = (1 + 0.015 * k).toFixed(4);
      const opacity = (1 - 0.1 * k).toFixed(3);
      canvas.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      canvas.style.opacity = opacity;
    }
  }, []);

  /**
   * Direct DOM transform/opacity updates for the 4 editorial text overlays
   * + compact mobile chapter progress fill line
   */
  const updateEditorialOverlays = useCallback((progress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));

    for (let idx = 0; idx < STORY_SECTIONS.length; idx++) {
      const section = STORY_SECTIONS[idx];
      const el = sectionRefs.current[idx];
      if (!el) continue;

      const start = section.startProgress;
      const end = section.endProgress;
      const span = end - start;
      const localProgress = (clampedProgress - start) / span;
      const clampedLocal = Math.max(0, Math.min(1, localProgress));

      const mobileFillEl = mobileProgressRefs.current[idx];
      if (mobileFillEl) {
        mobileFillEl.style.transform = `scaleX(${clampedLocal.toFixed(3)})`;
      }

      let opacity = 0;
      let translateY = 24;
      let pointerEvents: "auto" | "none" = "none";

      if (localProgress >= -0.02 && localProgress <= 1.02) {
        if (idx === 0 && localProgress <= 0.16) {
          opacity = 1;
          translateY = 0;
        } else if (localProgress < 0.18) {
          const t = Math.max(0, Math.min(1, localProgress / 0.18));
          const eased = 1 - Math.pow(1 - t, 3);
          opacity = eased;
          translateY = 24 * (1 - eased);
        } else if (localProgress <= 0.82) {
          opacity = 1;
          translateY = 0;
        } else {
          const t = Math.max(0, Math.min(1, (localProgress - 0.82) / 0.18));
          const eased = t * t;
          opacity = 1 - eased;
          translateY = -24 * eased;
        }

        if (opacity > 0.35) {
          pointerEvents = "auto";
        }
      } else if (localProgress > 1.02) {
        opacity = 0;
        translateY = -24;
      } else {
        opacity = 0;
        translateY = 24;
      }

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      el.style.pointerEvents = pointerEvents;
    }
  }, []);

  /**
   * Preload & pre-decode all 240 WebP frames on initial load before unlocking scroll
   */
  useEffect(() => {
    let isMounted = true;
    let loaded = 0;
    const preloadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    syncCanvasDimensions();
    document.body.style.overflow = "hidden";

    const markFrameDone = (index: number) => {
      if (!isMounted) return;
      loaded += 1;

      if (loaded % 4 === 0 || loaded === TOTAL_FRAMES || loaded === 1) {
        setLoadedCount(loaded);
      }

      if (index === 0) {
        renderFrame(1);
        updateEditorialOverlays(0);
      }

      if (loaded >= TOTAL_FRAMES) {
        setIsLoaded(true);
        document.body.style.overflow = "";
        renderFrame(currentFrameRef.current);
        const timer = setTimeout(() => {
          if (isMounted) {
            setHidePreloader(true);
            ScrollTrigger.refresh();
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = getFramePath(i + 1);
      img.onload = () => {
        if (typeof img.decode === "function") {
          img
            .decode()
            .catch(() => {})
            .finally(() => markFrameDone(i));
        } else {
          markFrameDone(i);
        }
      };
      img.onerror = () => markFrameDone(i);
      preloadedImages[i] = img;
    }

    imagesRef.current = preloadedImages;

    const failSafe = setTimeout(() => {
      if (isMounted && !isLoaded) {
        setIsLoaded(true);
        document.body.style.overflow = "";
        setTimeout(() => {
          if (isMounted) setHidePreloader(true);
        }, 300);
      }
    }, 7000);

    return () => {
      isMounted = false;
      clearTimeout(failSafe);
      document.body.style.overflow = "";
    };
  }, [syncCanvasDimensions, renderFrame, updateEditorialOverlays, isLoaded]);

  /**
   * GSAP ScrollTrigger controller (zero React re-renders during scroll)
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    syncCanvasDimensions();
    updateEditorialOverlays(0);
    renderFrame(1);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.15,
      onUpdate: (self) => {
        const progress = self.progress;
        const exactFrame = 1 + progress * (TOTAL_FRAMES - 1);
        const roundedFrame = Math.max(
          1,
          Math.min(TOTAL_FRAMES, Math.round(exactFrame))
        );

        applySceneCutMask(exactFrame);

        if (roundedFrame !== currentFrameRef.current) {
          currentFrameRef.current = roundedFrame;
          renderFrame(roundedFrame);
        }

        updateEditorialOverlays(progress);

        // Smoothly hide floating audio button once user scrolls past the hero into the product grid
        const shouldShowSoundBtn = progress < 0.97;
        if (shouldShowSoundBtn !== soundBtnVisibleRef.current) {
          soundBtnVisibleRef.current = shouldShowSoundBtn;
          if (soundButtonWrapRef.current) {
            soundButtonWrapRef.current.style.opacity = shouldShowSoundBtn
              ? "1"
              : "0";
            soundButtonWrapRef.current.style.pointerEvents = shouldShowSoundBtn
              ? "auto"
              : "none";
            soundButtonWrapRef.current.style.transform = shouldShowSoundBtn
              ? "scale(1)"
              : "scale(0.85)";
          }
        }

        const chapterIdx = Math.min(3, Math.floor(progress * 4));
        if (chapterIdx !== activeSectionRef.current) {
          activeSectionRef.current = chapterIdx;
          onSectionChange?.(chapterIdx);
        }
      },
    });

    const handleResize = () => {
      syncCanvasDimensions();
      renderFrame(currentFrameRef.current);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    syncCanvasDimensions,
    renderFrame,
    applySceneCutMask,
    updateEditorialOverlays,
    onSectionChange,
  ]);

  /**
   * Toggle Modern, Professional, Cinematic Soundtrack
   */
  const toggleStudioSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (!soundEnabled) {
      audio
        .play()
        .then(() => {
          setSoundEnabled(true);
          let vol = audio.volume;
          const targetVol = 0.55;
          fadeIntervalRef.current = setInterval(() => {
            vol = Math.min(targetVol, vol + 0.05);
            audio.volume = vol;
            if (vol >= targetVol) {
              if (fadeIntervalRef.current)
                clearInterval(fadeIntervalRef.current);
            }
          }, 50);
        })
        .catch((err) => {
          console.warn("Audio playback gesture needed:", err);
        });
    } else {
      let vol = audio.volume;
      fadeIntervalRef.current = setInterval(() => {
        vol = Math.max(0, vol - 0.08);
        audio.volume = vol;
        if (vol <= 0) {
          audio.pause();
          setSoundEnabled(false);
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 40);
    }
  };

  const loadingPercentage = Math.min(
    100,
    Math.round((loadedCount / TOTAL_FRAMES) * 100)
  );

  return (
    <>
      {/* Minimal Luxury Preloader (0% to 100%) before unlocking scroll */}
      {!hidePreloader && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-between px-8 py-12 bg-[#E5D9C8] text-[#1C1917] transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-[1440px] flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-[#6E655F]">
            <span>AURELIA MOBILE ATELIER</span>
            <span>OPTICAL SEQUENCE ARCHIVE</span>
          </div>

          <div className="w-full max-w-md flex flex-col items-center text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#6E655F] mb-3">
              CALIBRATING TITANIUM STUDIO SEQUENCE
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1C1917] mb-8">
              {loadingPercentage}%
            </h2>

            <div className="w-full h-[2px] bg-[#1C1917]/15 overflow-hidden relative">
              <div
                className="h-full bg-[#141413] transition-all duration-150 ease-out"
                style={{ width: `${loadingPercentage}%` }}
              />
            </div>

            <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6E655F]">
              <span>
                FRAME {String(loadedCount).padStart(3, "0")} / {TOTAL_FRAMES}
              </span>
              <span>24 FPS WEBP • GPU DECODED</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#6E655F]">
            SCROLL TO EXPERIENCE ONCE CALIBRATED
          </div>
        </div>
      )}

      {/* Master Pinned Scroll Container (height: 750vh) */}
      <section
        id="top"
        ref={containerRef}
        className="relative h-[750vh] w-full bg-[#E5D9C8]"
        aria-label="Interactive 3D Product Sequence Showcase"
      >
        {/* Sticky 100vh Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#E5D9C8]">
          {/* Background Layer (z-0): Full-Screen High-DPI HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none block will-change-[transform,opacity]"
          />

          {/* Desktop Left-Side Studio Vignette (>= 1024px) */}
          <div
            className="hidden lg:block absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#E6DAC8]/50 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Mobile & Tablet (< 1024px) Seamless Split-Screen Gradient Mask
              Melts the bottom edge of the upper-54% video stage invisibly into #E5D9C8 */}
          <div
            className="lg:hidden absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 42%, rgba(229, 217, 200, 0.85) 51%, #E5D9C8 56%)",
            }}
            aria-hidden="true"
          />

          {/* Editorial Overlays Container (z-10)
              - Mobile (< 1024px): strictly in the bottom 46% of the viewport (`bottom-0 h-[46vh] px-6 pb-8 pt-4 flex flex-col justify-end`)
              - Desktop (>= 1024px): 100% intact left-aligned vertical center */}
          <div className="relative z-10 h-full w-full max-w-[1440px] mx-auto flex items-end lg:items-center">
            <div className="relative w-full lg:max-w-xl h-[46vh] lg:h-auto px-6 pb-8 pt-4 sm:px-12 lg:pl-24 lg:pr-0 lg:py-0 flex flex-col justify-end lg:block bg-gradient-to-t from-[#E5D9C8] via-[#E5D9C8]/95 to-transparent lg:bg-none">
              {STORY_SECTIONS.map((section, idx) => (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform:
                      idx === 0
                        ? "translate3d(0, 0px, 0)"
                        : "translate3d(0, 24px, 0)",
                    pointerEvents: idx === 0 ? "auto" : "none",
                  }}
                  className={`${
                    idx === 0
                      ? "relative"
                      : "absolute inset-x-6 sm:inset-x-12 lg:left-24 lg:right-0 bottom-8 lg:bottom-auto lg:inset-y-0 flex flex-col justify-end lg:justify-center"
                  } will-change-[transform,opacity]`}
                >
                  {/* Compact Mobile Chapter Progress Bar (Mobile & Tablet only; hidden on Desktop) */}
                  <div className="lg:hidden flex items-center gap-3 mb-2.5 max-w-md">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#1C1917] shrink-0">
                      0{idx + 1} / 04
                    </span>
                    <div className="flex-1 h-[1.5px] bg-black/10 overflow-hidden rounded-full">
                      <div
                        ref={(el) => {
                          mobileProgressRefs.current[idx] = el;
                        }}
                        className="h-full bg-[#141413] origin-left will-change-transform"
                        style={{
                          transform: idx === 0 ? "scaleX(0.1)" : "scaleX(0)",
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#5C534E] truncate">
                      {section.tagline}
                    </span>
                  </div>

                  {/* Editorial Serif Heading */}
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-[56px] leading-[1.08] lg:leading-[1.05] tracking-tight lg:tracking-[-0.01em] text-[#1C1917] font-normal mb-2 lg:mb-5">
                    {section.heading}
                  </h1>

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm lg:text-[17px] leading-[1.58] lg:leading-[1.68] text-[#5C534E] lg:text-[#6E655F] line-clamp-3 lg:line-clamp-none max-w-md mb-4 lg:mb-7 font-normal">
                    {section.description}
                  </p>

                  {/* 3-Column Mini Specs Row */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2.5 sm:py-4 mb-4 sm:mb-8 border-y border-black/10 lg:border-[#1C1917]/12 max-w-md">
                    {section.specs.map((spec) => (
                      <div key={spec.label}>
                        <div className="text-[10px] lg:text-[9px] uppercase tracking-[0.18em] lg:tracking-[0.2em] text-[#5C534E] lg:text-[#6E655F] mb-0.5 sm:mb-1">
                          {spec.label}
                        </div>
                        <div className="text-xs font-medium text-[#1C1917] tracking-tight truncate">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Matte Obsidian CTA Button */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onCtaClick?.(section.ctaAction)}
                      className="group inline-flex items-center gap-3 py-3 px-6 sm:px-7 sm:py-4 rounded-full bg-[#141413] text-[#FFFFFF] text-xs font-sans font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[#292624] hover:shadow-[0_12px_30px_rgba(20,20,19,0.22)] active:scale-[0.98] cursor-pointer"
                    >
                      <span>{section.ctaLabel}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Luxury Audio Icon Button
              - Mobile: bottom-5 right-5 w-10 h-10 z-40
              - Desktop: sm:bottom-8 sm:right-10 md:right-14 sm:w-14 sm:h-14
              - Auto-hides smoothly once user scrolls past hero into product grid */}
          <div
            ref={soundButtonWrapRef}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-10 md:right-14 z-40 pointer-events-auto transition-[opacity,transform] duration-300 ease-out"
          >
            <button
              type="button"
              onClick={toggleStudioSound}
              aria-label={
                soundEnabled
                  ? "Mute Cinematic Studio Soundtrack"
                  : "Play Modern Cinematic Soundtrack"
              }
              title={
                soundEnabled
                  ? "Mute Cinematic Soundtrack"
                  : "Play Modern Cinematic Soundtrack"
              }
              className="group relative w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#141413] text-[#FFFFFF] flex items-center justify-center shadow-[0_10px_35px_rgba(20,20,19,0.3)] hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
            >
              {soundEnabled ? (
                <div className="flex items-end gap-[2.5px] sm:gap-[3px] h-3.5 sm:h-4">
                  <span className="w-[1.5px] h-full bg-white rounded-full animate-sound-bar-1" />
                  <span className="w-[1.5px] h-full bg-white rounded-full animate-sound-bar-2" />
                  <span className="w-[1.5px] h-full bg-white rounded-full animate-sound-bar-3" />
                  <span className="w-[1.5px] h-full bg-white rounded-full animate-sound-bar-4" />
                </div>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-[18px] sm:h-[18px]"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
