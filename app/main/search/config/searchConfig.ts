// Search configuration constants

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

// Helper function to get mode color with transparency
export const getModeColor = (mode: any, opacity: number = 1) => {
  return opacity === 1
    ? mode.color
    : mode.color +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0");
};

// Country code to country name mapping for API
export const getCountryNameForAPI = (countryCode: string): string => {
  const countryMap: { [key: string]: string } = {
    all: "All Countries",
    az: "Azərbaycan",
    tr: "Türkiye",
    it: "Italy",
    cn: "China",
    mx: "Mexico",
    jp: "Japan",
    fr: "France",
    in: "India",
    us: "United States",
    th: "Thailand",
  };
  return countryMap[countryCode] || "All Countries";
};

export type Country = typeof countries[0];
export type Mode = typeof modes[0];

