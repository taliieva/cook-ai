import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { countries, Country } from "../constants/searchConstants";

const { height } = Dimensions.get("window");
const BOTTOM_SAFE_AREA = Platform.OS === 'ios' ? 34 : 20;

interface CountrySelectorProps {
  visible: boolean;
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
  theme: any;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  visible,
  selectedCountry,
  onSelect,
  onClose,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.countrySelector,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.countrySelectorHeader}>
            <Text
              style={[
                styles.countrySelectorTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Select Cuisine
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countryList}>
            {countries.map((country, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.countryItem,
                  {
                    backgroundColor:
                      selectedCountry.code === country.code
                        ? theme.colors.accent.primary + "15"
                        : "transparent",
                  },
                ]}
                onPress={() => onSelect(country)}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text
                  style={[
                    styles.countryName,
                    {
                      color:
                        selectedCountry.code === country.code
                          ? theme.colors.accent.primary
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {country.name}
                </Text>
                {selectedCountry.code === country.code && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.accent.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 9999,
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9998,
  },
  countrySelector: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: height * 0.7,
    minHeight: 400,
    marginBottom: BOTTOM_SAFE_AREA,
    zIndex: 10000,
    elevation: 20,
  },
  countrySelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    minHeight: 60,
  },
  countrySelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  countryList: {
    maxHeight: height * 0.7 - 60 - BOTTOM_SAFE_AREA,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
});
