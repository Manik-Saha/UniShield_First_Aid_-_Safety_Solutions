import Link from "next/link";
import { categories } from "@/lib/mock-data/categories";
import { courses } from "@/lib/mock-data/courses";
import { SafetyTag } from "./SafetyTag";
import { Cross } from "./Cross";

const BLOG_CATEGORIES = [
  "Disaster Preparedness",
  "Fire Safety",
  "First Aid",
  "General",
  "Safety Training",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <span className="text-safety-red"><Cross size={16} /></span>
              UniShield
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              First aid supplies, restocking services, and on-site safety training for Southern California workplaces since 1996.
            </p>
            <div className="flex flex-wrap gap-2">
              <SafetyTag label="Since 1996" />
              <SafetyTag label="5 Counties" />
              <SafetyTag label="OSHA Compliant" variant="compliance" />
              <SafetyTag label="ANSI Z308.1" variant="compliance" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Products</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Training */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Training</h3>
            <ul className="flex flex-col gap-1.5">
              {courses.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/training/${c.slug}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/training" className="text-sm text-safety-red hover:text-red-400 transition-colors">
                  All courses →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Company</h3>
            <ul className="flex flex-col gap-1.5 mb-5">
              <li><Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/who-we-help" className="text-sm text-white/70 hover:text-white transition-colors">Who We Help</Link></li>
              <li><Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-sm text-white/70 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/faq" className="text-sm text-white/70 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
            <address className="not-italic text-sm text-white/60 leading-relaxed">
              599 4th St.<br />
              San Fernando, CA 91340<br />
              <a href="tel:+18004805855" className="hover:text-white transition-colors">(800) 480-5855</a><br />
              <a href="mailto:sales@socalfirstaid.com" className="hover:text-white transition-colors">sales@socalfirstaid.com</a>
            </address>
          </div>
        </div>

        {/* Blog categories */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Blog Topics</h3>
          <div className="flex flex-wrap gap-3">
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40 font-mono">
            © {year} UniShield First Aid & Safety. All rights reserved.
          </p>
          <p className="text-xs text-white/40 font-mono">
            Los Angeles · San Diego · Orange · Ventura · San Bernardino
          </p>
        </div>
      </div>
    </footer>
  );
}
