"use server";

import { createClient } from "@/lib/supabase/server";

export interface LeadFormData {
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  email: string;
  inquiryType: "quote" | "training" | "service" | "general" | "careers";
  interest?: string;
  message?: string;
}

export interface LeadResult {
  success: boolean;
  error?: string;
}

export async function submitLead(data: LeadFormData): Promise<LeadResult> {
  if (!data.firstName?.trim()) return { success: false, error: "First name is required." };
  if (!data.lastName?.trim()) return { success: false, error: "Last name is required." };
  if (!data.phone?.trim()) return { success: false, error: "Phone number is required." };
  if (!data.email?.trim() || !data.email.includes("@")) {
    return { success: false, error: "A valid email address is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    first_name:   data.firstName.trim(),
    last_name:    data.lastName.trim(),
    company:      data.company?.trim() || null,
    phone:        data.phone.trim(),
    email:        data.email.trim().toLowerCase(),
    inquiry_type: data.inquiryType,
    interest:     data.interest?.trim() || null,
    message:      data.message?.trim() || null,
    status:       "new",
  });

  if (error) {
    console.error("Lead insert error:", error.message);
    return { success: false, error: "Something went wrong. Please try again or call us directly." };
  }

  return { success: true };
}
