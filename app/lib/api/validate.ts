const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function sanitizeText(value: unknown, maxLen = 5000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export function requireFields<T extends Record<string, unknown>>(
  body: T,
  fields: (keyof T)[]
): string | null {
  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || (typeof val === 'string' && !val.trim())) {
      return `Campo requerido: ${String(field)}`;
    }
  }
  return null;
}
