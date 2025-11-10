import { Mode } from "../constants/searchConstants";

// Helper function to get mode color with transparency
export const getModeColor = (mode: Mode, opacity: number = 1): string => {
  if (opacity === 1) {
    return mode.color;
  }
  return mode.color + Math.round(opacity * 255).toString(16).padStart(2, "0");
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

