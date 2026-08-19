// Normalizes Nigerian-style phone input (e.g. "0801 234 5678", "801 234 5678")
// into the E.164-ish format the backend/Termii expect: "+2348012345678".
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (input.trim().startsWith('+')) return `+${digits}`;
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}
