"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Cross } from "@/components/Cross";

const NAV = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: "⊞" },
  { href: "/admin/leads",        label: "Leads",        icon: "✉" },
  { href: "/admin/blog",         label: "Blog Posts",   icon: "✍" },
  { href: "/admin/products",     label: "Products",     icon: "⊕" },
  { href: "/admin/courses",      label: "Courses",      icon: "◎" },
  { href: "/admin/services",     label: "Services",     icon: "⚙" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "❝" },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page gets no shell
  if (pathname === "/admin/login") return <>{children}</>;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-ink flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 font-display font-bold text-white text-base">
          <span className="text-safety-red"><Cross size={14} /></span>
          UniShield
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-safety-red text-white font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base leading-none" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="block text-xs text-white/40 hover:text-white/70 transition-colors mb-3"
          >
            ↗ View public site
          </Link>
          <button
            onClick={signOut}
            className="w-full text-left text-xs text-white/40 hover:text-safety-red transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
