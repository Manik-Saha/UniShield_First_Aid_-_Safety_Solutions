import type { Product, Course, Service, BlogPost, FAQ } from "@/lib/types";

const ORG = {
  "@type": "LocalBusiness",
  name: "UniShield First Aid & Safety",
  alternateName: "SoCal First Aid",
  url: "https://www.socalfirstaid.com",
  telephone: "(800) 480-5855",
  email: "sales@socalfirstaid.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "599 4th St.",
    addressLocality: "San Fernando",
    addressRegion: "CA",
    postalCode: "91340",
    addressCountry: "US",
  },
  foundingDate: "1996",
  areaServed: [
    { "@type": "AdministrativeArea", name: "Los Angeles County" },
    { "@type": "AdministrativeArea", name: "San Diego County" },
    { "@type": "AdministrativeArea", name: "Orange County" },
    { "@type": "AdministrativeArea", name: "Ventura County" },
    { "@type": "AdministrativeArea", name: "San Bernardino County" },
  ],
};

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    ...ORG,
    "@id": "https://www.socalfirstaid.com/#organization",
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: "UniShield" },
  };
}

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.summary,
    provider: { "@type": "Organization", name: "UniShield First Aid & Safety" },
    image: course.heroImage,
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "Organization", name: "UniShield First Aid & Safety" },
    image: service.heroImage,
    areaServed: "Southern California",
  };
}

export function blogPostSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorTitle,
    },
    publisher: { "@type": "Organization", name: "UniShield First Aid & Safety" },
  };
}

export function faqPageSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://www.socalfirstaid.com${item.href}`,
    })),
  };
}
