export const FREE_CREDITS = 15;

export function refundCredit() {
  if (typeof window === 'undefined') return;
  setCredits(getCredits() + 1);
}

export function getCredits(): number {
  if (typeof window === 'undefined') return FREE_CREDITS;
  const stored = sessionStorage.getItem('creauna_credits');
  if (stored === null) {
    sessionStorage.setItem('creauna_credits', String(FREE_CREDITS));
    return FREE_CREDITS;
  }
  return Math.max(0, parseInt(stored, 10) || 0);
}

export function setCredits(amount: number) {
  sessionStorage.setItem('creauna_credits', String(Math.max(0, amount)));
}

export function consumeCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  setCredits(current - 1);
  return true;
}

export function isPaid(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('creauna_paid') === 'true';
}

export function setPaid(value: boolean) {
  sessionStorage.setItem('creauna_paid', value ? 'true' : 'false');
}
