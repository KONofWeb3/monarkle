// Minimal inline icon set (replaces lucide-react to avoid its React 19 / Vite 8
// dev-bundling incompatibility observed in this environment). Stroke-based,
// 24x24 viewBox, currentColor — drop-in visually similar to Lucide's style.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(paths: React.ReactNode) {
  return function Icon({ size = 18, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const LayoutDashboard = base(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>
);

export const Package = base(
  <>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </>
);

export const Users = base(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const FileBarChart = base(
  <>
    <path d="M15 3v4a1 1 0 0 0 1 1h4" />
    <path d="M18 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M8 18v-3" />
    <path d="M12 18v-6" />
    <path d="M16 18v-2" />
  </>
);

export const Leaf = base(
  <path d="M11 20A7 7 0 0 1 4 13c0-4 3-7.75 8-11 5 3.25 8 7 8 11a7 7 0 0 1-7 7c-1 0-2-.2-3-.5M11 20c-1-3 0-8 4-11" />
);

export const LogOut = base(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <path d="M21 12H9" />
  </>
);

export const TrendingUp = base(
  <>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </>
);

export const TrendingDown = base(
  <>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </>
);

export const Search = base(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const ShieldCheck = base(
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const ShieldOff = base(
  <>
    <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18" />
    <path d="M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </>
);

export const Download = base(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <path d="M12 15V3" />
  </>
);

export const FileText = base(
  <>
    <path d="M15 3v4a1 1 0 0 0 1 1h4" />
    <path d="M18 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
  </>
);

export const Plus = base(<path d="M12 5v14M5 12h14" />);

export const Recycle = base(
  <>
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
    <path d="m14 16-3 3 3 3" />
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12 3a1.784 1.784 0 0 1 1.545.88l3.943 6.843" />
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
  </>
);

export const Sparkles = base(
  <path d="M9.94 2.81a1 1 0 0 1 1.87 0l1.06 2.83a3 3 0 0 0 1.79 1.79l2.83 1.06a1 1 0 0 1 0 1.87l-2.83 1.06a3 3 0 0 0-1.79 1.79l-1.06 2.83a1 1 0 0 1-1.87 0l-1.06-2.83a3 3 0 0 0-1.79-1.79L4.26 10.4a1 1 0 0 1 0-1.87l2.83-1.06a3 3 0 0 0 1.79-1.79Z" />
);
