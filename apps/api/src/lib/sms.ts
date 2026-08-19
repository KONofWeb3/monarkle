// SMS/OTP delivery via Termii (https://termii.com). Falls back to mock mode
// (logs the code instead of sending) when TERMII_API_KEY isn't set, so local
// dev and testing keep working without a live account.

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID ?? 'N-Alert'; // Termii's shared default sender ID for testing
const TERMII_BASE_URL = 'https://api.ng.termii.com/api/sms/send';

export const smsEnabled = Boolean(TERMII_API_KEY);

function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// In-memory OTP store for this dev/demo backend. Swap for a Redis/DB-backed
// store with real expiry handling before real production traffic.
const otpStore = new Map<string, { code: string; expiresAt: number }>();
const OTP_TTL_MS = 5 * 60 * 1000;

export async function sendOtp(phone: string): Promise<{ sent: boolean; mock: boolean }> {
  const code = generateOtp();
  otpStore.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });

  if (!smsEnabled) {
    console.log(`[mock OTP] ${phone} -> ${code} (set TERMII_API_KEY to send real SMS)`);
    return { sent: true, mock: true };
  }

  // A failed real send (e.g. an unapproved sender ID) must not block signup/
  // login — OTP verification is disabled for now anyway (see auth.routes.ts),
  // so the code only needs to exist somewhere, not necessarily be delivered.
  // Fall back to mock/logged mode rather than throwing.
  try {
    const res = await fetch(TERMII_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        from: TERMII_SENDER_ID,
        sms: `Your MONARKLE verification code is ${code}. It expires in 5 minutes.`,
        type: 'plain',
        channel: 'generic',
        api_key: TERMII_API_KEY,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Termii SMS send failed (${res.status}): ${body}`);
    }

    return { sent: true, mock: false };
  } catch (err) {
    console.warn(`[OTP] Real SMS send failed, falling back to mock mode: ${(err as Error).message}`);
    console.log(`[mock OTP] ${phone} -> ${code}`);
    return { sent: true, mock: true };
  }
}

export function verifyOtp(phone: string, code: string): boolean {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  const valid = entry.code === code;
  if (valid) otpStore.delete(phone);
  return valid;
}
