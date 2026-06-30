import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/mock-data/categories";
import { products } from "@/lib/mock-data/products";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { productSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

interface Props {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category: catSlug, product: productSlug } = await params;
  const product = products.find((p) => p.slug === productSlug && p.category === catSlug);
  if (!product) notFound();

  const cat = categories.find((c) => c.slug === catSlug);
  const sub = cat?.subcategories.find((s) => s.slug === product.subcategory);
  const related = products
    .filter((p) => p.subcategory === product.subcategory && p.slug !== product.slug)
    .slice(0, 3);

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: cat?.name ?? catSlug, href: `/products/${catSlug}` },
    { name: product.name, href: `/products/${catSlug}/${productSlug}` },
  ];

  return (
    <>
      <JsonLd schema={productSchema(product)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />
      {product.faqs.length > 0 && <JsonLd schema={faqPageSchema(product.faqs)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Image */}
          <div className="relative h-72 sm:h-96 rounded-lg overflow-hidden bg-line">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.complianceTags.map((tag) => (
                <SafetyTag key={tag} label={tag} variant="compliance" />
              ))}
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-3">{product.name}</h1>
            <p className="text-ink/70 text-lg leading-relaxed mb-4">{product.shortDescription}</p>
            <p className="text-ink/60 leading-relaxed mb-6">{product.description}</p>

            {/* Quote CTA */}
            <div className="bg-surface border border-line rounded-lg p-5">
              <p className="font-semibold text-ink mb-3">Request a quote for this product</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/contact?item=${product.slug}`}
                  className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
                >
                  <Cross size={12} />
                  Request a Quote
                </Link>
                <a
                  href="tel:+18004805855"
                  className="inline-flex items-center font-mono text-sm font-semibold text-ink hover:text-safety-red transition-colors"
                >
                  (800) 480-5855
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Specs */}
        {product.specs.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display font-bold text-2xl text-ink mb-5 flex items-center gap-2">
              <Cross size={14} className="text-safety-red" />
              Specifications
            </h2>
            <div className="bg-white border border-line rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-white"}>
                      <td className="font-mono font-medium text-ink/60 px-4 py-3 w-1/3 border-r border-line">{spec.label}</td>
                      <td className="text-ink px-4 py-3">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQs */}
        {product.faqs.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display font-bold text-2xl text-ink mb-5">Frequently Asked Questions</h2>
            <FaqAccordion faqs={product.faqs} />
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-ink mb-5">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/products/${rp.category}/${rp.slug}`}
                  className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative h-36 bg-line">
                    <Image src={rp.image} alt={rp.name} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-sans font-semibold text-ink text-sm group-hover:text-safety-red transition-colors">{rp.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
