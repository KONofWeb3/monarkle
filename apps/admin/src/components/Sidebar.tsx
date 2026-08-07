import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, FileBarChart, Leaf, LogOut } from './icons';
import { useAppState } from '../data/AppContext';

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/pickups', label: 'Pickups', icon: Package },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/reports', label: 'ESG Reports', icon: FileBarChart },
];

export default function Sidebar() {
  const { signOut, adminName } = useAppState();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[--color-border] bg-[--color-surface]">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[--color-primary]">
          <Leaf size={18} className="text-[--color-primary]" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-[--color-primary]">MONARKLE</p>
          <p className="text-xs text-[--color-muted]">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[--color-primary-light] text-[--color-primary]'
                  : 'text-[--color-body] hover:bg-[--color-bg]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[--color-border] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[--color-primary] text-sm font-medium text-white">
            {adminName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[--color-ink]">{adminName}</p>
            <p className="text-xs text-[--color-muted]">Operations</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-md p-2 text-[--color-muted] hover:bg-[--color-danger-bg] hover:text-[--color-danger]"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
