"use client";

import { useState, useActionState } from "react";
import { submitLead, type LeadFormData } from "@/lib/actions/submitLead";
import { categories } from "@/lib/mock-data/categories";
import { courses } from "@/lib/mock-data/courses";
import { services } from "@/lib/mock-data/services";

interface LeadFormProps {
  prefilledInterest?: string;
  prefilledType?: LeadFormData["inquiryType"];
  mode?: "default" | "careers";
}

const INQUIRY_TYPES: { value: LeadFormData["inquiryType"]; label: string }[] = [
  { value: "quote", label: "Request a Quote" },
  { value: "training", label: "Training Inquiry" },
  { value: "service", label: "Service Inquiry" },
  { value: "general", label: "General Question" },
  { value: "careers", label: "Careers / Employment" },
];

export function LeadForm({ prefilledInterest, prefilledType, mode = "default" }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const data: LeadFormData = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      company: fd.get("company") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      inquiryType: (fd.get("inquiryType") as LeadFormData["inquiryType"]) ?? "general",
      interest: fd.get("interest") as string,
      message: fd.get("message") as string,
    };

    const result = await submitLead(data);
    setPending(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again or call us directly.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border-2 border-compliance bg-compliance/5 p-8 text-center">
        <p className="text-2xl font-display font-bold text-compliance mb-2">Request sent.</p>
        <p className="text-ink/70">
          Thank you — we&apos;ll be in touch within one business day. For urgent needs,
          call <a href="tel:+18004805855" className="text-safety-red font-semibold">(800) 480-5855</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {prefilledInterest && (
        <div className="bg-surface border border-line rounded p-3 text-sm text-ink/70">
          Requesting info about: <span className="font-semibold text-ink">{prefilledInterest}</span>
        </div>
      )}
      <input type="hidden" name="interest" value={prefilledInterest ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name *" name="firstName" required autoComplete="given-name" />
        <Field label="Last Name *" name="lastName" required autoComplete="family-name" />
      </div>

      <Field label="Company" name="company" autoComplete="organization" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone *" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Email *" name="email" type="email" required autoComplete="email" />
      </div>

      {mode !== "careers" && (
        <>
          <SelectField
            label="Inquiry Type"
            name="inquiryType"
            defaultValue={prefilledType ?? "quote"}
            options={INQUIRY_TYPES}
          />

          <div>
            <label htmlFor="interest-select" className="block text-sm font-semibold text-ink mb-1">
              Product / Course / Service (optional)
            </label>
            <select
              id="interest-select"
              name="interest"
              defaultValue={prefilledInterest ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
            >
              <option value="">— Select one —</option>
              <optgroup label="Products">
                {categories.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="Training Courses">
                {courses.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="Services">
                {services.map((s) => (
                  <option key={s.slug} value={s.name}>{s.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </>
      )}

      {mode === "careers" && (
        <input type="hidden" name="inquiryType" value="careers" />
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-ink mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red resize-y"
          placeholder={mode === "careers" ? "Tell us about your experience and what kind of role you're interested in." : "Tell us about your facility, number of employees, and what you need."}
        />
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-safety-red font-medium">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded transition-colors w-full sm:w-auto"
      >
        {pending ? "Sending…" : "Send Request"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
