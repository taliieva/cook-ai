import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Mock dish data - in real app, fetch by ID
const dishData = {
  id: 1,
  name: 'Spaghetti Carbonara',
  culture: 'Italian',
  image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  description: 'A classic Roman pasta dish made with eggs, cheese, pancetta, and black pepper. This creamy, rich dish is the perfect comfort food that brings authentic Italian flavors to your table.',
  prepTime: '20 mins',
  servings: '4 people',
  difficulty: 'Medium',
  rating: 4.8,
  ingredients: [
    { name: 'Spaghetti pasta', amount: '400g', icon: '🍝' },
    { name: 'Pancetta or bacon', amount: '150g', icon: '🥓' },
    { name: 'Large eggs', amount: '3 whole + 2 yolks', icon: '🥚' },
    { name: 'Parmesan cheese', amount: '100g grated', icon: '🧀' },
    { name: 'Black pepper', amount: '1 tsp freshly ground', icon: '⚫' },
    { name: 'Garlic cloves', amount: '2 minced', icon: '🧄' },
    { name: 'Salt', amount: 'to taste', icon: '🧂' },
    { name: 'Extra virgin olive oil', amount: '2 tbsp', icon: '🫒' },
  ],
  instructions: [
    'Bring a large pot of salted water to boil and cook spaghetti',
    'Cook pancetta in a large skillet until crispy',
    'Whisk eggs with grated Parmesan and black pepper',
    'Drain pasta and add to pancetta skillet',
    'Remove from heat and slowly add egg mixture while tossing',
    'Serve immediately with extra cheese and pepper'
  ]
};

export default function DishDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleStartCooking = () => {
    // Navigate to cooking instructions or timer
    console.log('Start cooking process');
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
  };

  const renderIngredient = (ingredient: any, index: number) => {
    return (
      <View key={index} style={[styles.ingredientItem, { 
        backgroundColor: theme.colors.background.secondary + '80',
        borderColor: theme.colors.border + '40'
      }]}>
        <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
        <View style={styles.ingredientInfo}>
          <Text style={[styles.ingredientName, { color: theme.colors.text.primary }]}>
            {ingredient.name}
          </Text>
          <Text style={[styles.ingredientAmount, { color: theme.colors.text.secondary }]}>
            {ingredient.amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image with Blur */}
      <ImageBackground
        source={{ uri: dishData.image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Blur Overlay */}
        <MaskedView
          style={styles.maskedBlur}
          maskElement={
            <LinearGradient
              colors={['transparent', 'black', 'black']}
              style={styles.mask}
              locations={[0, 0.3, 1]}
            />
          }
        >
          <BlurView intensity={40} tint="dark" style={styles.blurView} />
        </MaskedView>

        {/* Dark gradient for better readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.darkOverlay}
          locations={[0, 0.5, 1]}
        />

        {/* Content */}
        <SafeAreaView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={handleAddToFavorites}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF3366" : "#FFFFFF"} 
              />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Culture Tag */}
            <View style={styles.cultureContainer}>
              <LinearGradient
                colors={[theme.colors.accent.primary, theme.colors.accent.gradientEnd]}
                style={styles.cultureTag}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.cultureText}>{dishData.culture} Cuisine</Text>
              </LinearGradient>
            </View>

            {/* Dish Name */}
            <Text style={styles.dishName}>{dishData.name}</Text>

            {/* Rating and Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="star" size={16} color="#FFD60A" />
                <Text style={styles.infoText}>{dishData.rating}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{dishData.prepTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{dishData.servings}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="bar-chart-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{dishData.difficulty}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this dish</Text>
              <Text style={styles.description}>{dishData.description}</Text>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.ingredientCount}>({dishData.ingredients.length} items)</Text>
              </View>
              <View style={styles.ingredientsList}>
                {dishData.ingredients.map((ingredient, index) => renderIngredient(ingredient, index))}
              </View>
            </View>

            {/* Start Cooking Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startCookingButton} onPress={handleStartCooking}>
                <LinearGradient
                  colors={[theme.colors.accent.gradientStart, theme.colors.accent.gradientEnd]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Start Cooking</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Bottom Padding */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  maskedBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mask: {
    flex: 1,
  },
  blurView: {
    flex: 1,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cultureContainer: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  cultureTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cultureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dishName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ingredientCount: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
  },
  ingredientIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  startCookingButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  bottomPadding: {
    height: 30,
  },
});