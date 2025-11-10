import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Country } from "../constants/searchConstants";

interface SearchInputProps {
  searchText: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onAddIngredient: () => void;
  selectedCountry: Country;
  onCountryPress: () => void;
  theme: any;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchText,
  onChangeText,
  onSubmit,
  onAddIngredient,
  selectedCountry,
  onCountryPress,
  theme,
}) => {
  return (
    <View style={styles.searchSection}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Enter ingredients..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchText}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.countryButton, { borderColor: theme.colors.border }]}
          onPress={onCountryPress}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
        {searchText.length > 0 && (
          <TouchableOpacity onPress={onAddIngredient} style={styles.addButton}>
            <Ionicons
              name="add-circle"
              size={24}
              color={theme.colors.accent.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 8,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  addButton: {
    marginLeft: 5,
  },
});

