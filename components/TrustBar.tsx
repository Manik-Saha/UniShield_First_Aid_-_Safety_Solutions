export function TrustBar() {
  return (
    <div className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
        <a
          href="tel:+18004805855"
          className="font-mono text-sm font-medium text-white hover:text-signal-amber transition-colors shrink-0"
          aria-label="Call us at (800) 480-5855"
        >
          (800) 480-5855
        </a>
        <p className="hidden sm:block font-mono text-xs text-white/60 tracking-wide text-right">
          Serving 5 SoCal Counties&nbsp;·&nbsp;Since 1996&nbsp;·&nbsp;OSHA Compliant
        </p>
      </div>
    </div>
  );
}
