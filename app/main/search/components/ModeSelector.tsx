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
import { modes, Mode } from "../constants/searchConstants";
import { getModeColor } from "../utils/searchUtils";

const { height } = Dimensions.get("window");
const BOTTOM_SAFE_AREA = Platform.OS === 'ios' ? 34 : 20;

interface ModeSelectorProps {
  visible: boolean;
  selectedMode: Mode;
  userPlan: string;
  onSelect: (mode: Mode) => void;
  onClose: () => void;
  theme: any;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  visible,
  selectedMode,
  userPlan,
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
            styles.modeSelectorModal,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.modeSelectorHeader}>
            <Text
              style={[
                styles.modeSelectorTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Select Mode
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modeList}>
            {modes.map((mode, index) => {
              const isDisabled = mode.isPro && userPlan === "free";
              const isSelected = selectedMode.code === mode.code;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modeItem,
                    {
                      backgroundColor: isSelected
                        ? getModeColor(mode, 0.15)
                        : "transparent",
                      opacity: isDisabled ? 0.6 : 1,
                    },
                  ]}
                  onPress={() => onSelect(mode)}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={24}
                    color={mode.color}
                  />
                  <View style={styles.modeContent}>
                    <Text style={[styles.modeName, { color: mode.color }]}>
                      {mode.name}
                    </Text>
                    {mode.isPro && (
                      <View
                        style={[
                          styles.proBadge,
                          { backgroundColor: mode.color },
                        ]}
                      >
                        <Text style={styles.proText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={mode.color} />
                  )}
                  {isDisabled && (
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
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
  modeSelectorModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: height * 0.5,
    minHeight: 300,
    marginBottom: BOTTOM_SAFE_AREA,
    zIndex: 10000,
    elevation: 20,
  },
  modeSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    minHeight: 60,
  },
  modeSelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modeList: {
    maxHeight: height * 0.5 - 60 - BOTTOM_SAFE_AREA,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  modeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  proText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});

