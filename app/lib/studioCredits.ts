export const FREE_CREDITS = 15;

/** Client-side cache; authoritative balance comes from GET /api/credits */
export function getCredits(): number {
  if (typeof window === 'undefined') return FREE_CREDITS;
  const stored = sessionStorage.getItem('creauna_credits');
  if (stored === null) return FREE_CREDITS;
  return Math.max(0, parseInt(stored, 10) || 0);
}

export function setCredits(amount: number) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('creauna_credits', String(Math.max(0, amount)));
}

export async function syncCreditsFromServer(): Promise<number> {
  if (typeof window === 'undefined') return FREE_CREDITS;
  try {
    const res = await fetch('/api/credits');
    if (!res.ok) return getCredits();
    const data = await res.json();
    const credits = typeof data.credits === 'number' ? data.credits : FREE_CREDITS;
    setCredits(credits);
    return credits;
  } catch {
    return getCredits();
  }
}

/** @deprecated Server consumes credits in /api/studio/generate */
export function consumeCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  setCredits(current - 1);
  return true;
}

export function refundCredit() {
  setCredits(getCredits() + 1);
}

export function isPaid(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('creauna_paid') === 'true';
}

export function setPaid(value: boolean) {
  sessionStorage.setItem('creauna_paid', value ? 'true' : 'false');
}
