"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconLinkProps {
  href: string;
  icon: IconDefinition;
  title: string;
  external?: boolean;
  className?: string;
}

export function IconLink({ href, icon, title, external, className }: IconLinkProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      title={title}
      className={`w-7 h-7 inline-flex items-center justify-center rounded transition-colors ${className ?? "text-ink/40 hover:text-ink hover:bg-surface"}`}
    >
      <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
    </Link>
  );
}
