import { useState } from 'react';
import { Copy, X } from './icons';
import { useAppState } from '../data/AppContext';
import type { UserRole } from '../data/types';

const roleOptions: (UserRole | 'Admin')[] = ['PSP', 'Collector', 'Admin', 'Household', 'Recycler', 'Corporate'];

function randomPassword() {
  // Not cryptographically fussy -- this is a one-time temp password the
  // admin relays to the new user, who can (and should) change it after
  // first login once that flow exists.
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
}

export default function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { createUser } = useAppState();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | 'Admin'>('PSP');
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState(randomPassword());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ name: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const needsVehicle = role === 'PSP' || role === 'Collector';
  const needsLicense = role === 'Collector';
  const canSubmit = fullName.length > 1 && (phone || email) && password.length >= 6
    && (!needsVehicle || (vehicleType && plateNumber))
    && (!needsLicense || licenseNumber);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { password: finalPassword } = await createUser({
        fullName, phone: phone || undefined, email: email || undefined, password, role,
        vehicleType: needsVehicle ? vehicleType : undefined,
        plateNumber: needsVehicle ? plateNumber : undefined,
        licenseNumber: needsLicense ? licenseNumber : undefined,
      });
      setCreated({ name: fullName, password: finalPassword });
    } catch (err: any) {
      setError(err.message ?? 'Could not create this account');
    } finally {
      setBusy(false);
    }
  };

  const copyCredentials = () => {
    if (!created) return;
    const identifier = phone || email;
    navigator.clipboard.writeText(`MONARKLE login\nPhone/Email: ${identifier}\nPassword: ${created.password}`);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-(--color-surface) p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-(--color-ink)">
            {created ? 'Account created' : 'Create user account'}
          </h2>
          <button onClick={onClose} className="text-(--color-muted) hover:text-(--color-ink)">
            <X size={18} />
          </button>
        </div>

        {created ? (
          <div>
            <p className="mb-4 text-sm text-(--color-body)">
              <strong>{created.name}</strong>&apos;s account is ready. Share these credentials with them directly —
              this password won&apos;t be shown again.
            </p>
            <div className="mb-4 rounded-lg border border-(--color-border) bg-(--color-bg) p-3 font-mono text-sm text-(--color-ink)">
              <div>{phone || email}</div>
              <div>{created.password}</div>
            </div>
            <button
              onClick={copyCredentials}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-(--color-border) py-2.5 text-sm font-medium text-(--color-ink) hover:bg-(--color-bg)"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy credentials'}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-(--color-primary) py-2.5 text-sm font-medium text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Role</label>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      role === r ? 'bg-(--color-primary) text-white' : 'border border-(--color-border) text-(--color-body)'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                  placeholder="+234..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {needsVehicle && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Vehicle type</label>
                  <input
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                    placeholder="e.g. Van"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Plate number</label>
                  <input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                    placeholder="e.g. LND-442-KJ"
                  />
                </div>
              </div>
            )}

            {needsLicense && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">License number</label>
                <input
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Temporary password</label>
              <div className="flex gap-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 font-mono text-sm outline-none focus:border-(--color-primary)"
                />
                <button
                  type="button"
                  onClick={() => setPassword(randomPassword())}
                  className="whitespace-nowrap rounded-lg border border-(--color-border) px-3 text-sm font-medium text-(--color-body) hover:bg-(--color-bg)"
                >
                  Regenerate
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-(--color-danger)">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || busy}
              className="w-full rounded-lg bg-(--color-primary) py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
