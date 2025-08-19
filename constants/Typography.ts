export const typography = {
  fontFamily: "'Inter', sans-serif",
  dark: {
    heading: {
      h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, color: "#FFFFFF" },
      h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, color: "#FFFFFF" },
      h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, color: "#FFFFFF" },
    },
    body: {
      large: { fontSize: 18, fontWeight: '400' as const, lineHeight: 26, color: "#B3B3B3" },
      medium: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: "#B3B3B3" },
      small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: "#B3B3B3" },
    },
    button: {
      primary: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, color: "#FFFFFF" },
    },
  },
  light: {
    heading: {
      h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, color: "#1A1A1A" },
      h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, color: "#1A1A1A" },
      h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, color: "#1A1A1A" },
    },
    body: {
      large: { fontSize: 18, fontWeight: '400' as const, lineHeight: 26, color: "#6B6B6B" },
      medium: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: "#6B6B6B" },
      small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: "#6B6B6B" },
    },
    button: {
      primary: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, color: "#FFFFFF" },
    },
  },
};