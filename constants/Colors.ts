export const colors = {
  base: {
    // Blues (Brand) - Updated with your hex codes
    blue50: "#E6F4FF",
    blue100: "#CCE9FF",
    blue200: "#99D3FF",
    blue300: "#66BDFF",
    blue400: "#33A7FF",
    blue500: "#0598CE", // Your primary blue
    blue600: "#047BB8",
    blue700: "#035E91",
    blue800: "#02416A",
    blue900: "#113768", // Your dark blue
    
    // Grays
    gray50: "#FFFFFF",
    gray100: "#F8F8F8",
    gray200: "#E0E0E0",
    gray300: "#B3B3B3",
    gray400: "#6B6B6B",
    gray500: "#2A2A2A",
    gray600: "#1A1A1A",
    gray700: "#0D0D0D",
    
    // Status
    green500: "#4CAF50",
    red500: "#FF4C4C",
  },
  semantic: {
    dark: {
      background: {
        primary: "#113768", // Your dark blue as dark background
        secondary: "#0D0D0D",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#B3B3B3",
      },
      accent: {
        primary: "#0598CE", // Your blue as accent
        gradientStart: "#0598CE",
        gradientEnd: "#33A7FF", // Lighter blue for gradient
      },
      border: "#2A2A2A",
      status: {
        success: "#4CAF50",
        error: "#FF4C4C",
      },
    },
    light: {
      background: {
        primary: "#FFFFFF",
        secondary: "#F8F8F8",
      },
      text: {
        primary: "#113768", // Your dark blue for text
        secondary: "#6B6B6B",
      },
      accent: {
        primary: "#0598CE", // Your blue as primary accent
        gradientStart: "#0598CE",
        gradientEnd: "#33A7FF", // Lighter blue for gradient end
      },
      border: "#E0E0E0",
      status: {
        success: "#2E7D32",
        error: "#D32F2F",
      },
    },
  },
};