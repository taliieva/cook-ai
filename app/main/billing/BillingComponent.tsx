import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Mock promo codes for testing
const validPromoCodes = {
  SAVE20: { discount: 20, type: "percentage" },
  FIRST50: { discount: 50, type: "percentage" },
  WELCOME: { discount: 5, type: "fixed" },
};

export default function BillingComponent() {
  const theme = useTheme();

  // State management
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [selectedPayment, setSelectedPayment] = useState("apple");

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    holderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Plan pricing
  const plans = {
    monthly: { price: 17.99, label: "Monthly", billing: "/month" },
    yearly: {
      price: 34.99,
      originalPrice: 215.88,
      label: "Annual",
      billing: "/year",
      discount: "84% off",
    },
  };

  // Validate form
  useEffect(() => {
    if (selectedPayment === "apple") {
      setIsFormValid(true);
    } else {
      const { holderName, cardNumber, expiryDate, cvv } = cardDetails;
      const isCardValid =
        holderName.length > 0 &&
        cardNumber.replace(/\s/g, "").length >= 16 &&
        expiryDate.length >= 5 &&
        cvv.length >= 3;
      setIsFormValid(isCardValid);
    }
  }, [selectedPayment, cardDetails]);

  // Handle promo code application
  const handleApplyPromo = () => {
    const promo = validPromoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...promo });
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid promo code");
    }
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    let price = plans[selectedPlan].price;
    if (appliedPromo) {
      if (appliedPromo.type === "percentage") {
        price = price - (price * appliedPromo.discount) / 100;
      } else {
        price = Math.max(0, price - appliedPromo.discount);
      }
    }
    return price.toFixed(2);
  };

  // Format card number
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  // Format expiry date
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Handle card input changes
  const handleCardChange = (field, value) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value.slice(0, 19));
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value.slice(0, 5));
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
  };

  // Handle payment processing
  const handlePayment = () => {
    if (selectedPayment === "apple") {
      Alert.alert(
        "Apple Pay",
        "Apple Pay payment flow would be triggered here"
      );
    } else {
      Alert.alert(
        "Payment",
        `Payment of $${calculateFinalPrice()} processed successfully!`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
            >
              Billing & Payment
            </Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Promo Code Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Promo Code
              </Text>
              <View style={styles.promoContainer}>
                <TextInput
                  style={[
                    styles.promoInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="Enter promo code"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    { backgroundColor: theme.colors.accent.primary },
                  ]}
                  onPress={handleApplyPromo}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>

              {appliedPromo && (
                <View
                  style={[
                    styles.promoSuccess,
                    { backgroundColor: "#4CAF50" + "20" },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={[styles.promoSuccessText, { color: "#4CAF50" }]}>
                    {appliedPromo.type === "percentage"
                      ? `${appliedPromo.discount}% discount applied!`
                      : `$${appliedPromo.discount} discount applied!`}
                  </Text>
                </View>
              )}

              {promoError && (
                <View
                  style={[
                    styles.promoError,
                    { backgroundColor: "#F44336" + "20" },
                  ]}
                >
                  <Ionicons name="close-circle" size={16} color="#F44336" />
                  <Text style={[styles.promoErrorText, { color: "#F44336" }]}>
                    {promoError}
                  </Text>
                </View>
              )}
            </View>

            {/* Subscription Plans */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Choose Your Plan
              </Text>

              <TouchableOpacity
                style={[
                  styles.planOption,
                  {
                    backgroundColor:
                      selectedPlan === "monthly"
                        ? theme.colors.accent.primary + "15"
                        : theme.colors.background.secondary,
                    borderColor:
                      selectedPlan === "monthly"
                        ? theme.colors.accent.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedPlan("monthly")}
              >
                <View style={styles.planHeader}>
                  <View>
                    <Text
                      style={[
                        styles.planTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {plans.monthly.label}
                    </Text>
                    <Text
                      style={[
                        styles.planPrice,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      ${plans.monthly.price}
                      {plans.monthly.billing}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        borderColor:
                          selectedPlan === "monthly"
                            ? theme.colors.accent.primary
                            : theme.colors.border,
                      },
                    ]}
                  >
                    {selectedPlan === "monthly" && (
                      <View
                        style={[
                          styles.radioButtonInner,
                          { backgroundColor: theme.colors.accent.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planOption,
                  {
                    backgroundColor:
                      selectedPlan === "yearly"
                        ? theme.colors.accent.primary + "15"
                        : theme.colors.background.secondary,
                    borderColor:
                      selectedPlan === "yearly"
                        ? theme.colors.accent.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedPlan("yearly")}
              >
                <View style={styles.planHeader}>
                  <View>
                    <Text
                      style={[
                        styles.planTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {plans.yearly.label}
                    </Text>
                    <View style={styles.yearlyPricing}>
                      <Text
                        style={[
                          styles.planPrice,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        ${plans.yearly.price}
                        {plans.yearly.billing}
                      </Text>
                      <Text
                        style={[
                          styles.originalPrice,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        ${plans.yearly.originalPrice}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        borderColor:
                          selectedPlan === "yearly"
                            ? theme.colors.accent.primary
                            : theme.colors.border,
                      },
                    ]}
                  >
                    {selectedPlan === "yearly" && (
                      <View
                        style={[
                          styles.radioButtonInner,
                          { backgroundColor: theme.colors.accent.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>
                <View
                  style={[styles.discountBadge, { backgroundColor: "#4CAF50" }]}
                >
                  <Text style={styles.discountText}>
                    {plans.yearly.discount}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Payment Method
              </Text>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  {
                    backgroundColor:
                      selectedPayment === "apple"
                        ? theme.colors.accent.primary + "15"
                        : theme.colors.background.secondary,
                    borderColor:
                      selectedPayment === "apple"
                        ? theme.colors.accent.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedPayment("apple")}
              >
                <View style={styles.paymentHeader}>
                  <Ionicons
                    name="logo-apple"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.paymentTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Apple Pay
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor:
                        selectedPayment === "apple"
                          ? theme.colors.accent.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  {selectedPayment === "apple" && (
                    <View
                      style={[
                        styles.radioButtonInner,
                        { backgroundColor: theme.colors.accent.primary },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  {
                    backgroundColor:
                      selectedPayment === "card"
                        ? theme.colors.accent.primary + "15"
                        : theme.colors.background.secondary,
                    borderColor:
                      selectedPayment === "card"
                        ? theme.colors.accent.primary
                        : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedPayment("card")}
              >
                <View style={styles.paymentHeader}>
                  <Ionicons
                    name="card"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.paymentTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Credit/Debit Card
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor:
                        selectedPayment === "card"
                          ? theme.colors.accent.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  {selectedPayment === "card" && (
                    <View
                      style={[
                        styles.radioButtonInner,
                        { backgroundColor: theme.colors.accent.primary },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Card Details Form */}
            {selectedPayment === "card" && (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Card Details
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="Cardholder Name"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={cardDetails.holderName}
                  onChangeText={(value) =>
                    handleCardChange("holderName", value)
                  }
                />

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={cardDetails.cardNumber}
                  onChangeText={(value) =>
                    handleCardChange("cardNumber", value)
                  }
                  keyboardType="numeric"
                  maxLength={19}
                />

                <View style={styles.inputRow}>
                  <TextInput
                    style={[
                      styles.inputHalf,
                      {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary,
                      },
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={cardDetails.expiryDate}
                    onChangeText={(value) =>
                      handleCardChange("expiryDate", value)
                    }
                    keyboardType="numeric"
                    maxLength={5}
                  />

                  <TextInput
                    style={[
                      styles.inputHalf,
                      {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary,
                      },
                    ]}
                    placeholder="CVV"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={cardDetails.cvv}
                    onChangeText={(value) => handleCardChange("cvv", value)}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="Billing Address (Optional)"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={cardDetails.billingAddress}
                  onChangeText={(value) =>
                    handleCardChange("billingAddress", value)
                  }
                  multiline
                  numberOfLines={2}
                />
              </View>
            )}

            {/* Price Summary */}
            <View
              style={[
                styles.summarySection,
                { backgroundColor: theme.colors.background.secondary },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {plans[selectedPlan].label} Plan
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  ${plans[selectedPlan].price}
                </Text>
              </View>

              {appliedPromo && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#4CAF50" }]}>
                    Promo Code ({appliedPromo.code})
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
                    -
                    {appliedPromo.type === "percentage"
                      ? `${appliedPromo.discount}%`
                      : `$${appliedPromo.discount}`}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.summaryDivider,
                  { backgroundColor: theme.colors.border },
                ]}
              />

              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    { color: theme.colors.accent.primary },
                  ]}
                >
                  ${calculateFinalPrice()}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Confirm & Pay Button */}
          <View
            style={[
              styles.bottomSection,
              { backgroundColor: theme.colors.background.primary },
            ]}
          >
            <Button
              title={`Confirm & Pay $${calculateFinalPrice()}`}
              onPress={handlePayment}
              style={[
                styles.payButton,
                {
                  backgroundColor: theme.colors.accent.primary,
                  opacity: isFormValid ? 1 : 0.5,
                },
              ]}
              disabled={!isFormValid}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 30, // Add padding to account for footer height
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  promoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  applyButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  promoSuccess: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  promoSuccessText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  promoError: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  promoErrorText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  planOption: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "700",
  },
  yearlyPricing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  summarySection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // Increased from 10 to give more space above footer
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  payButton: {
    width: "100%",
  },
});
