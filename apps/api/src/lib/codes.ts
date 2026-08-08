export function generatePickupCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `PK-${n}`;
}

export function generateReferralCode(fullName: string): string {
  const first = fullName.split(' ')[0]?.toUpperCase().slice(0, 6) ?? 'USER';
  const n = Math.floor(1000 + Math.random() * 9000).toString(36).toUpperCase();
  return `${first}-${n}`;
}

export function generateDropoffQr(pickupCode: string): string {
  const suffix = pickupCode.replace('PK-', '').slice(-4).toUpperCase();
  const year = new Date().getFullYear();
  return `DO-${year}-${suffix}`;
}
