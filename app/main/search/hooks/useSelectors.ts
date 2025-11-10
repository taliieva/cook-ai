import { useState } from "react";
import { Country, Mode, countries, modes } from "../constants/searchConstants";

export const useSelectors = (
  initialCountry: Country = countries[0],
  initialMode: Mode = modes[0]
) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);
  const [selectedMode, setSelectedMode] = useState<Mode>(initialMode);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
  };

  const handleModeSelect = (mode: Mode, userPlan: string, onUpgrade: () => void) => {
    if (mode.isPro && userPlan === "free") {
      setShowModeSelector(false);
      onUpgrade();
      return;
    }
    setSelectedMode(mode);
    setShowModeSelector(false);
  };

  return {
    selectedCountry,
    setSelectedCountry,
    selectedMode,
    setSelectedMode,
    showCountrySelector,
    setShowCountrySelector,
    showModeSelector,
    setShowModeSelector,
    handleCountrySelect,
    handleModeSelect,
  };
};

