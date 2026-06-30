import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/mock-data/categories";
import { products } from "@/lib/mock-data/products";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catProducts = products.filter((p) => p.category === slug);

  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: cat.name, href: `/products/${cat.slug}` },
            ]}
          />
          <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display font-extrabold text-4xl text-white mb-4">{cat.name}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{cat.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <SafetyTag label="ANSI Compliant" variant="compliance" />
                <SafetyTag label="OSHA Compliant" variant="compliance" />
                <SafetyTag label="Quote-Based" />
              </div>
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden hidden md:block">
              <Image
                src={cat.heroImage}
                alt={cat.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {cat.subcategories.map((sub) => {
          const subProducts = catProducts.filter((p) => p.subcategory === sub.slug);
          return (
            <SectionReveal key={sub.slug}>
              <section className="mb-14">
                <div className="mb-6 pb-3 border-b border-line flex items-center gap-2">
                  <Cross size={14} className="text-safety-red" />
                  <h2 className="font-display font-bold text-xl text-ink">{sub.name}</h2>
                </div>
                <p className="text-ink/60 mb-6 text-sm">{sub.description}</p>
                {subProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${cat.slug}/${product.slug}`}
                        className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="relative h-44 bg-line">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.complianceTags.slice(0, 2).map((tag) => (
                              <SafetyTag key={tag} label={tag} variant="compliance" />
                            ))}
                          </div>
                          <h3 className="font-sans font-semibold text-ink text-sm mb-1 group-hover:text-safety-red transition-colors">{product.name}</h3>
                          <p className="text-xs text-ink/60 leading-relaxed mb-3">{product.shortDescription}</p>
                          <span className="text-xs font-semibold text-safety-red">Request a Quote →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink/40 italic">Products in this subcategory coming soon. <Link href="/contact" className="text-safety-red">Contact us</Link> for availability.</p>
                )}
              </section>
            </SectionReveal>
          );
        })}
      </div>
    </>
  );
}
