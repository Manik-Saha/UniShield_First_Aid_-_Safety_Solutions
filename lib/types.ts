export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  org: string;
  location: string;
}

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  subcategories: Subcategory[];
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  image: string;
  specs: { label: string; value: string }[];
  faqs: FAQ[];
  complianceTags: string[];
}

export interface Course {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  heroImage: string;
  durationLabel: string;
  curriculum: { title: string; body: string }[];
  faqs: FAQ[];
  complianceTags: string[];
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  heroImage: string;
  bullets: string[];
}

export interface Industry {
  slug: string;
  name: string;
  headline: string;
  body: string;
  heroImage: string;
  painPoints: string[];
  relatedProducts: string[];
  relatedServices: string[];
  relatedCourses: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  authorTitle: string;
  publishedAt: string;
  coverImage: string;
  relatedSlugs: string[];
}
