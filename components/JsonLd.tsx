interface JsonLdProps {
  schema?: Record<string, unknown>;
}

export function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
