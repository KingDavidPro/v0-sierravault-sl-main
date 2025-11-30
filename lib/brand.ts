// =============================================================================
// SIERRAVAULT BRAND KIT
// =============================================================================
// Colors derived from Sierra Leone flag: Green, White, Blue
// Premium dark theme inspired by Netflix + Calm
// =============================================================================

export const brand = {
  // Primary Colors
  colors: {
    // Core brand colors
    navy: "#0A2A43", // Primary dark background
    navyLight: "#0F3654", // Slightly lighter navy
    navyDark: "#061B2E", // Darker navy for depth

    teal: "#2DC5A0", // Primary accent (from flag green)
    tealLight: "#3DD9B2", // Lighter teal for hover
    tealDark: "#25A386", // Darker teal

    // Sierra Leone flag-inspired gradient
    flagGreen: "#1EB53A", // Flag green
    flagWhite: "#FFFFFF", // Flag white
    flagBlue: "#0072C6", // Flag blue

    // Neutrals
    white: "#FFFFFF",
    offWhite: "#F8FAFC",
    slate: "#64748B",
    slateLight: "#94A3B8",
    slateDark: "#475569",

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    // Blockchain badge
    solana: "#9945FF",
    verified: "#2DC5A0",
  },

  // Typography
  fonts: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },

  // Gradients
  gradients: {
    // Sierra Leone flag gradient
    flag: "linear-gradient(135deg, #1EB53A 0%, #FFFFFF 50%, #0072C6 100%)",
    flagSubtle: "linear-gradient(135deg, rgba(30,181,58,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,114,198,0.1) 100%)",

    // Hero gradient
    hero: "linear-gradient(180deg, #0A2A43 0%, #061B2E 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(10,42,67,0.9) 0%, rgba(6,27,46,0.95) 100%)",

    // Card gradients
    card: "linear-gradient(145deg, rgba(15,54,84,0.5) 0%, rgba(10,42,67,0.8) 100%)",
    cardHover: "linear-gradient(145deg, rgba(45,197,160,0.1) 0%, rgba(15,54,84,0.6) 100%)",

    // Teal accent gradient
    teal: "linear-gradient(135deg, #2DC5A0 0%, #25A386 100%)",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
    xl: "0 20px 25px rgba(0,0,0,0.6)",
    glow: "0 0 20px rgba(45,197,160,0.3)",
    glowStrong: "0 0 40px rgba(45,197,160,0.5)",
  },

  // Border radius
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Mission & Slogan
  mission:
    "Empower every Sierra Leonean with a secure, verifiable digital copy of their most important life documents.",
  slogan: "SierraVault — Your documents. Always safe. Always verifiable.",
  tagline: "Your Documents. Always Safe. Always Verifiable.",
}

// Document type icons mapping
export const documentIcons: Record<string, string> = {
  "Birth Certificate": "file-text",
  Diploma: "graduation-cap",
  "Land Title": "map-pin",
  "NIN Certificate": "id-card",
  "Marriage Certificate": "heart",
  "Academic Transcript": "book-open",
  "Professional License": "award",
  Passport: "plane",
  "Driver License": "car",
  default: "file",
}
