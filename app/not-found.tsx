import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E6DAC8] text-[#1C1917] px-6 text-center">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#6E655F] mb-3">
        AURELIA MOBILE ATELIER
      </span>
      <h1 className="font-serif text-5xl mb-4">404 — Page Not Found</h1>
      <p className="text-sm text-[#6E655F] max-w-md mb-8">
        The requested archive page could not be located. Return to the flagship
        showcase.
      </p>
      <Link
        href="/"
        className="px-7 py-4 rounded-full bg-[#141413] text-white text-xs uppercase tracking-[0.22em]"
      >
        RETURN TO SHOWCASE
      </Link>
    </div>
  );
}
