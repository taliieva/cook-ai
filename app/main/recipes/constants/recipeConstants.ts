// Country color mapping
export const countryColors: { [key: string]: string } = {
  Italian: "#009246",
  Thai: "#ED1C24",
  Indian: "#FF9933",
  Greek: "#0D5EAF",
  Mexican: "#006847",
  Japanese: "#BC002D",
  American: "#B22234",
  Turkish: "#DC143C",
  French: "#0055A4",
  Azərbaycan: "#0098C3",
  Türkiye: "#E30A17",
};

// Difficulty colors
export const difficultyColors = {
  Easy: "#4CAF50",
  Medium: "#FF9800",
  Hard: "#F44336",
};

export type DifficultyLevel = keyof typeof difficultyColors;

