"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { categories } from "@/lib/mock-data/categories";
import { courses } from "@/lib/mock-data/courses";
import { services } from "@/lib/mock-data/services";
import type { LeadFormData } from "@/lib/actions/submitLead";

export function ContactFormSection() {
  const params = useSearchParams();
  const itemSlug = params.get("item");
  const courseSlug = params.get("course");
  const serviceSlug = params.get("service");
  const inquiryType = params.get("inquiryType") as LeadFormData["inquiryType"] | null;

  let prefilledInterest: string | undefined;
  let prefilledType: LeadFormData["inquiryType"] | undefined;

  if (itemSlug) {
    const cat = categories.find((c) => c.slug === itemSlug);
    const product = categories.flatMap((c) => c.subcategories).find((s) => s.slug === itemSlug);
    prefilledInterest = cat?.name ?? product?.name ?? itemSlug;
    prefilledType = "quote";
  } else if (courseSlug) {
    const course = courses.find((c) => c.slug === courseSlug);
    prefilledInterest = course?.name ?? courseSlug;
    prefilledType = "training";
  } else if (serviceSlug) {
    const svc = services.find((s) => s.slug === serviceSlug);
    prefilledInterest = svc?.name ?? serviceSlug;
    prefilledType = "service";
  }

  if (inquiryType) prefilledType = inquiryType;

  return (
    <LeadForm
      prefilledInterest={prefilledInterest}
      prefilledType={prefilledType}
    />
  );
}
