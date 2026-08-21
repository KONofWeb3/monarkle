import { useState } from 'react';
import { X } from './icons';
import { changePassword } from '../lib/adminApi';
import { ApiError } from '../lib/api';

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit = currentPassword && newPassword.length >= 6 && newPassword === confirmPassword;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change your password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-(--color-surface) p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-(--color-ink)">
            {done ? 'Password changed' : 'Change password'}
          </h2>
          <button onClick={onClose} className="text-(--color-muted) hover:text-(--color-ink)">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div>
            <p className="mb-5 text-sm text-(--color-body)">
              Your password has been updated. Use it next time you log in.
            </p>
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
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--color-ink)">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-primary)"
              />
              {mismatch && <p className="mt-1.5 text-sm text-(--color-danger)">Passwords don&apos;t match.</p>}
            </div>

            {error && <p className="text-sm text-(--color-danger)">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || busy}
              className="w-full rounded-lg bg-(--color-primary) py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {busy ? 'Changing…' : 'Change password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
