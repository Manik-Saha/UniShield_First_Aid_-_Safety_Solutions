interface SafetyTagProps {
  label: string;
  variant?: "compliance" | "neutral";
}

export function SafetyTag({ label, variant = "neutral" }: SafetyTagProps) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest rounded border font-medium";
  const variants = {
    compliance: "border-compliance text-compliance",
    neutral: "border-ink/40 text-ink/70",
  };

  return (
    <span className={`${base} ${variants[variant]}`} role="status">
      {label}
    </span>
  );
}
