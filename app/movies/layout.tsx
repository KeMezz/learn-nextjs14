import type { ReactNode } from "react";

// Never prerender outage UI or persist it in the full-route cache.
export const dynamic = "force-dynamic";

export default function MoviesLayout({ children }: { children: ReactNode }) {
  return children;
}
