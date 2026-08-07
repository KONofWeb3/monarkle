import { useState } from 'react';
import { Leaf } from '../components/icons';
import { useAppState } from '../data/AppContext';

export default function LoginPage() {
  const { signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-bg] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[--color-border] bg-[--color-surface] p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[--color-primary]">
            <Leaf size={26} className="text-[--color-primary]" />
          </div>
          <p className="font-display text-lg font-bold tracking-wide text-[--color-primary]">MONARKLE</p>
          <p className="text-sm text-[--color-muted]">Admin Console</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <label className="mb-1.5 block text-sm font-medium text-[--color-ink]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ops@monarkle.africa"
            className="mb-4 w-full rounded-lg border border-[--color-border] px-3.5 py-2.5 text-sm outline-none focus:border-[--color-primary]"
          />
          <label className="mb-1.5 block text-sm font-medium text-[--color-ink]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-6 w-full rounded-lg border border-[--color-border] px-3.5 py-2.5 text-sm outline-none focus:border-[--color-primary]"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[--color-primary] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Log in
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[--color-muted]">
          Access restricted to MONARKLE operations staff.
        </p>
      </div>
    </div>
  );
}
