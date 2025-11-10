// Countries data with flags
export const countries = [
  { name: "All Countries", flag: "🌍", code: "all" },
  { name: "Azərbaycan", flag: "🇦🇿", code: "az" },
  { name: "Türkiye", flag: "🇹🇷", code: "tr" },
  { name: "Italian", flag: "🇮🇹", code: "it" },
  { name: "Chinese", flag: "🇨🇳", code: "cn" },
  { name: "Mexican", flag: "🇲🇽", code: "mx" },
  { name: "Japanese", flag: "🇯🇵", code: "jp" },
  { name: "French", flag: "🇫🇷", code: "fr" },
  { name: "Indian", flag: "🇮🇳", code: "in" },
  { name: "American", flag: "🇺🇸", code: "us" },
  { name: "Thai", flag: "🇹🇭", code: "th" },
];

// Modes data with icons and colors
export const modes = [
  {
    name: "Standard",
    icon: "restaurant-outline",
    code: "standard",
    isPro: false,
    color: "#FF8C00",
  },
  {
    name: "Gym",
    icon: "fitness-outline",
    code: "gym",
    isPro: false,
    color: "#FF4444",
  },
  {
    name: "Diet",
    icon: "leaf-outline",
    code: "diet",
    isPro: false,
    color: "#4CAF50",
  },
  {
    name: "Vegan",
    icon: "flower-outline",
    code: "vegan",
    isPro: true,
    color: "#8BC34A",
  },
  {
    name: "Vegetarian",
    icon: "nutrition-outline",
    code: "vegetarian",
    isPro: true,
    color: "#4CAF50",
  },
];

export type Country = typeof countries[number];
export type Mode = typeof modes[number];

