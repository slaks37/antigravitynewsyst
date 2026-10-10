/**
 * NewSystem Official Brand Tokens & Design System Specification
 * Reference: 08_Brand_Identity_and_Design_System & Master PRD v1.0
 */

export const BRAND_TOKENS = {
  name: "NewSystem",
  tagline: "One System. Every Process. Smarter Business.",
  category: "AI-Powered Business & Manufacturing Operating System",
  positioning:
    "NewSystem is a unified enterprise platform designed to connect manufacturing operations, people, customers, finance, documents, automation, and business intelligence within one intelligent operating system.",
  market:
    "Indonesian manufacturing companies, from small factories that rely on manual processes to large, multi-company and multi-plant manufacturers.",
  initialFocus: "General Manufacturing",
  
  colors: {
    navy: {
      DEFAULT: "#0B1730",
      900: "#070F20",
      800: "#0B1730",
      700: "#132347",
      600: "#1D3261",
    },
    blue: {
      DEFAULT: "#005BFF",
      hover: "#004FD6",
      light: "#EBF3FF",
    },
    cyan: {
      DEFAULT: "#12C9F5",
      light: "#E3FAFF",
    },
    indigo: {
      DEFAULT: "#6366F1",
      light: "#EEF2FF",
    },
    background: "#F8FAFC",
    surface: "#FFFFFF",
    primaryText: "#111827",
    secondaryText: "#64748B",
    border: "#E2E8F0",
  },

  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    scale: {
      display: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight",
      h1: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug",
      h2: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug",
      h3: "text-xl sm:text-2xl font-semibold tracking-tight",
      h4: "text-lg sm:text-xl font-semibold",
      bodyLarge: "text-lg sm:text-xl text-slate-600 leading-relaxed",
      body: "text-base text-slate-600 leading-relaxed",
      bodySmall: "text-sm text-slate-500 leading-normal",
      caption: "text-xs text-slate-400 font-medium tracking-wide uppercase",
      button: "text-sm font-semibold tracking-wide",
    },
  },

  assets: {
    logoLightSvg: "/brand/logo-horizontal-light.svg",
    logoDarkSvg: "/brand/logo-horizontal-dark.svg",
    logoMarkSvg: "/brand/logo-mark.svg",
    logoLightPng: "/brand/logo-horizontal-light.png",
    logoDarkPng: "/brand/logo-horizontal-dark.png",
    logoTaglinePng: "/brand/logo-with-tagline.png",
    appIconPng: "/brand/app-icon.png",
    systemArchitecturePng: "/brand/system-architecture.png",
  },
} as const;
