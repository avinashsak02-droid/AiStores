// Small helpers so every page reads tool data the same (safe) way.
// Older tools in the database may not have a creator name, so we fall back gracefully.

export const getCreator = (tool) => tool.creator || tool.sellerName || 'Independent creator'

export const getPrice = (tool) => tool.price || 'Free'

// "Free" is shown in black; anything else (Paid, Freemium…) is highlighted in wine red.
export const isFree = (tool) => getPrice(tool).trim().toLowerCase() === 'free'