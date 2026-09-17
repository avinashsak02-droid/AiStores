// Shared category metadata used across the marketplace, cards and detail pages.
// Each category has a signature color and a glyph so the UI feels cohesive
// without relying on generic AI gradients.

export const CATEGORY_META = {
  Video: { color: "#e0564d", glyph: "▶" },
  Image: { color: "#2f8f6b", glyph: "◆" },
  Writing: { color: "#2740e6", glyph: "✎" },
  Coding: { color: "#0f7fa6", glyph: "{ }" },
  Music: { color: "#d9822b", glyph: "♪" },
  SEO: { color: "#7a8b1f", glyph: "↗" },
  Design: { color: "#c2497e", glyph: "✦" },
  Other: { color: "#6b675d", glyph: "○" },
}

const FALLBACK = { color: "#6b675d", glyph: "○" }

export function categoryMeta(category) {
  return CATEGORY_META[category] || FALLBACK
}

// Returns inline styles for a soft tinted "chip" surface for a given category.
export function categoryTint(category) {
  const { color } = categoryMeta(category)
  return {
    color,
    background: `${color}14`,
    borderColor: `${color}33`,
  }
}

export const BROWSE_CATEGORIES = [
  "All",
  "Video",
  "Image",
  "Writing",
  "Coding",
  "Music",
  "SEO",
  "Design",
  "Other",
]

// Categories a creator can assign when publishing (no "All" option).
export const SELLER_CATEGORIES = BROWSE_CATEGORIES.slice(1)
