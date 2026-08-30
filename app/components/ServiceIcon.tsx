import type { ServiceIcon as ServiceIconName } from "~/data/services";

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<ServiceIconName, React.ReactNode> = {
    search: <><circle cx="10" cy="10" r="5" /><path d="m14 14 5 5M10 7v6M7 10h6" /></>,
    ship: <><path d="M3 15h18l-3 4H6l-3-4Z" /><path d="M6 15V8h12v7M9 8V4h6v4M3 20c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0" /></>,
    handshake: <><path d="m3 12 4-4 4 2 2-2 8 7-4 4-7-5-2 2-5-4Z" /><path d="m11 10 5 4M9 13l5 4M6 8 3-3 5 2" /></>,
    network: <><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><circle cx="12" cy="12" r="2.5" /><path d="m7 12 2.5 0M14 10.5l3-3M14 13.5l3 3" /></>,
    verify: <><path d="M5 3h14v18H5z" /><path d="M8 8h8M8 12h4M8 16l2 2 5-5" /></>,
    industry: <><path d="M3 21V10l6 3V9l6 4V5h6v16H3Z" /><path d="M7 17h2M13 17h2M18 9h3" /></>,
    travel: <><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V4h6v3M4 12h16M9 12v2h6v-2" /></>,
    property: <><path d="m3 11 9-8 9 8v10H3V11Z" /><path d="M9 21v-6h6v6M7 11h2M15 11h2" /></>,
    education: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3 3 9 3 12 0v-5M22 9v7" /></>,
    medical: <><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z" /><path d="M9 12h6" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[name]}</svg>;
}
