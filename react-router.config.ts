import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Generate deploy-ready HTML for every public language route. The Netlify
  // adapter still supplies SSR for routes added later.
  prerender: ["/", "/en", "/tr"],
} satisfies Config;
