import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  theme: any;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.confirmationOverlay}>
        <View
          style={[
            styles.confirmationModal,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.confirmationHeader}>
            <Text
              style={[
                styles.confirmationTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Delete Account
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmationContent}>
            <Ionicons
              name="warning-outline"
              size={48}
              color="#FF4444"
              style={styles.warningIcon}
            />
            <Text
              style={[
                styles.confirmationMessage,
                { color: theme.colors.text.primary },
              ]}
            >
              Are you sure?
            </Text>
            <Text
              style={[
                styles.confirmationSubMessage,
                { color: theme.colors.text.secondary },
              ]}
            >
              This action cannot be undone and all your data will be permanently
              lost.
            </Text>
          </View>

          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: theme.colors.background.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onConfirm}
            >
              <Text style={styles.deleteButtonText}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  confirmationModal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  confirmationContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  warningIcon: {
    marginBottom: 16,
  },
  confirmationMessage: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  confirmationSubMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF4444",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

