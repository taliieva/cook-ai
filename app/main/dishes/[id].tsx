import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

// Define types for our dish data
interface DishDetail {
  id: number;
  name: string;
  culture: string;
  image: string;
  description: string;
  prepTime: string;
  servings: string;
  difficulty: string;
  rating: number;
  calories: number;
  outdoorCost: number;
  homeCost: number;
  moneySaved: number;
  shortDescription: string;
  steps: string[];
  dishType: string;
}

interface Ingredient {
  name: string;
  amount: string;
  icon: string;
}

export default function DishDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [dishData, setDishData] = useState<DishDetail | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    // Parse the dish data from navigation params
    parseDishData();
  }, []);

  const parseDishData = () => {
    try {
      console.log("Received dish params:", params);
      
      if (params.dishData) {
        const parsedDish = JSON.parse(params.dishData as string);
        console.log("Parsed dish:", parsedDish);
        
        setDishData(parsedDish);
        
        // Generate ingredients from steps or create default ones
        const generatedIngredients = generateIngredientsFromSteps(parsedDish.steps || []);
        setIngredients(generatedIngredients);
      }
    } catch (error) {
      console.error("Error parsing dish data:", error);
      // Set fallback data if parsing fails
      setFallbackData();
    }
  };

  const setFallbackData = () => {
    setDishData({
      id: 1,
      name: 'Delicious Recipe',
      culture: 'International',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'A wonderful dish made with fresh ingredients and love.',
      prepTime: '25 min',
      servings: '4 people',
      difficulty: 'Medium',
      rating: 4.5,
      calories: 350,
      outdoorCost: 15,
      homeCost: 6,
      moneySaved: 9,
      shortDescription: 'Quick and easy recipe',
      steps: ['Prepare ingredients', 'Cook and serve'],
      dishType: 'Main Course'
    });
    setIngredients([
      { name: 'Fresh ingredients', amount: 'as needed', icon: '🥗' }
    ]);
  };

  const generateIngredientsFromSteps = (steps: string[]): Ingredient[] => {
    // This is a simple approach - in a real app, ingredients should come from the API
    const commonIngredients = [
      { keywords: ['tomato', 'tomatoes'], icon: '🍅' },
      { keywords: ['egg', 'eggs'], icon: '🥚' },
      { keywords: ['cheese'], icon: '🧀' },
      { keywords: ['onion', 'onions'], icon: '🧅' },
      { keywords: ['garlic'], icon: '🧄' },
      { keywords: ['pepper', 'black pepper'], icon: '🌶️' },
      { keywords: ['salt'], icon: '🧂' },
      { keywords: ['oil', 'olive oil'], icon: '🫒' },
      { keywords: ['butter'], icon: '🧈' },
      { keywords: ['pasta', 'spaghetti'], icon: '🍝' },
      { keywords: ['rice'], icon: '🍚' },
      { keywords: ['chicken'], icon: '🐔' },
      { keywords: ['beef'], icon: '🥩' },
      { keywords: ['fish'], icon: '🐟' },
      { keywords: ['milk'], icon: '🥛' },
      { keywords: ['flour'], icon: '🌾' },
      { keywords: ['sugar'], icon: '🍯' },
      { keywords: ['lemon'], icon: '🍋' },
      { keywords: ['herb', 'herbs', 'parsley', 'basil'], icon: '🌿' },
      { keywords: ['spice', 'spices'], icon: '🧄' }
    ];

    const foundIngredients: Ingredient[] = [];
    const stepsText = steps.join(' ').toLowerCase();

    commonIngredients.forEach(ingredient => {
      const found = ingredient.keywords.some(keyword => 
        stepsText.includes(keyword.toLowerCase())
      );
      
      if (found) {
        const matchedKeyword = ingredient.keywords.find(keyword => 
          stepsText.includes(keyword.toLowerCase())
        );
        foundIngredients.push({
          name: matchedKeyword || ingredient.keywords[0],
          amount: 'as needed',
          icon: ingredient.icon
        });
      }
    });

    // If no ingredients found, add some defaults
    if (foundIngredients.length === 0) {
      foundIngredients.push(
        { name: 'Main ingredients', amount: 'as needed', icon: '🥘' },
        { name: 'Seasonings', amount: 'to taste', icon: '🧂' },
        { name: 'Fresh herbs', amount: 'optional', icon: '🌿' }
      );
    }

    return foundIngredients;
  };

  const getDifficultyFromSteps = (steps: string[]): string => {
    const stepCount = steps.length;
    if (stepCount <= 3) return 'Easy';
    if (stepCount <= 5) return 'Medium';
    return 'Hard';
  };

  const getServingsEstimate = (culture: string): string => {
    // Simple estimation based on culture
    const servingMap: { [key: string]: string } = {
      'Italian': '4 people',
      'Chinese': '3-4 people',
      'Indian': '4-5 people',
      'Mexican': '4 people',
      'American': '2-3 people',
      'Japanese': '2 people',
      'Thai': '3 people',
      'French': '4 people'
    };
    return servingMap[culture] || '3-4 people';
  };

  const generateRating = (culture: string, dishType: string): number => {
    // Generate a realistic rating based on cuisine popularity
    const baseRating = 4.2;
    const cultureBonus: { [key: string]: number } = {
      'Italian': 0.4,
      'Japanese': 0.3,
      'French': 0.3,
      'Indian': 0.2,
      'Mexican': 0.2,
      'Chinese': 0.1,
      'American': 0.0,
      'Thai': 0.3
    };
    
    const typeBonus: { [key: string]: number } = {
      'Breakfast': 0.1,
      'Main Course': 0.2,
      'Dessert': 0.3,
      'Appetizer': 0.1
    };

    const rating = baseRating + 
      (cultureBonus[culture] || 0) + 
      (typeBonus[dishType] || 0) + 
      (Math.random() * 0.3);
    
    return Math.min(5.0, Math.round(rating * 10) / 10);
  };

  const handleBack = () => {
    router.back();
  };

  const handleStartCooking = () => {
    // Navigate to cooking instructions or timer
    console.log('Start cooking process');
    // In a real app, you might navigate to a step-by-step cooking guide
    // router.push(`/main/cooking/${dishData?.id}`);
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to user preferences/backend
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites:`, dishData?.name);
  };

  const renderIngredient = (ingredient: Ingredient, index: number) => {
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

  const renderInstructions = () => {
    if (!dishData?.steps || dishData.steps.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.description}>
            Detailed cooking instructions will be available when you start cooking.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {dishData.steps.map((step, index) => (
          <View key={index} style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: '#FFFFFF' }]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Don't render until we have dish data
  if (!dishData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            Loading dish details...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const displayRating = generateRating(dishData.culture, dishData.dishType);
  const displayServings = getServingsEstimate(dishData.culture);
  const displayDifficulty = getDifficultyFromSteps(dishData.steps);

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
                <Text style={styles.infoText}>{displayRating}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{dishData.prepTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{displayServings}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="bar-chart-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>{displayDifficulty}</Text>
              </View>
            </View>

            {/* Calories and Cost Info */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={styles.statText}>{dishData.calories} cal</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="storefront-outline" size={16} color="#FF6B6B" />
                <Text style={styles.statText}>${dishData.outdoorCost} out</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="home-outline" size={16} color="#4ECDC4" />
                <Text style={styles.statText}>${dishData.homeCost} home</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-down" size={16} color="#4ECDC4" />
                <Text style={styles.statText}>Save ${dishData.moneySaved}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this dish</Text>
              <Text style={styles.description}>
                {dishData.shortDescription || dishData.description || 
                 `This delicious ${dishData.culture.toLowerCase()} ${dishData.dishType.toLowerCase()} is perfect for any occasion. Made with fresh ingredients and traditional techniques, it brings authentic flavors to your table.`}
              </Text>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.ingredientCount}>({ingredients.length} items)</Text>
              </View>
              <View style={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => renderIngredient(ingredient, index))}
              </View>
            </View>

            {/* Instructions */}
            {renderInstructions()}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
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
    marginBottom: 15,
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
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
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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