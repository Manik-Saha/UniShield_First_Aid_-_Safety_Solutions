interface CrossProps {
  className?: string;
  size?: number;
}

export function Cross({ className = "", size = 16 }: CrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="6" y="0" width="4" height="16" />
      <rect x="0" y="6" width="16" height="4" />
    </svg>
  );
}
