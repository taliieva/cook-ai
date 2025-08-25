import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
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

// Mock dishes data
const dishes = [
  {
    id: 1,
    name: 'Spaghetti Carbonara',
    culture: 'Italian',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    name: 'Chicken Teriyaki',
    culture: 'Japanese',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    name: 'Beef Tacos',
    culture: 'Mexican',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    name: 'Pad Thai',
    culture: 'Thai',
    image: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    name: 'Chicken Curry',
    culture: 'Indian',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    name: 'Caesar Salad',
    culture: 'American',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 7,
    name: 'Ramen Bowl',
    culture: 'Japanese',
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 8,
    name: 'Greek Moussaka',
    culture: 'Greek',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

export default function DishesScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const handleDishPress = (dish: any) => {
    // Navigate to dish detail screen
    router.push(`/main/dishes/${dish.id}` );
  };

  const renderDishCard = (dish: any) => {
    return (
      <TouchableOpacity
        key={dish.id}
        style={styles.dishCard}
        onPress={() => handleDishPress(dish)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: dish.image }}
          style={styles.cardBackground}
          resizeMode="cover"
        >
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.cardGradient}
            locations={[0.6, 1]}
          />
          
          {/* Culture tag - Top right */}
          <View style={styles.cultureContainer}>
            <LinearGradient
              colors={[theme.colors.accent.primary + 'CC', theme.colors.accent.gradientEnd + 'CC']}
              style={styles.cultureTag}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.cultureText}>{dish.culture}</Text>
            </LinearGradient>
          </View>
          
          {/* Dish name - Bottom */}
          <View style={styles.dishNameContainer}>
            <Text style={styles.dishName}>{dish.name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background.primary}
      />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { 
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border 
          }]}
          onPress={handleBack}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={theme.colors.text.primary} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Found Dishes
        </Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Results Count */}
      <View style={styles.resultsSection}>
        <Text style={[styles.resultsText, { color: theme.colors.text.secondary }]}>
          {dishes.length} delicious dishes found
        </Text>
      </View>

      {/* Dishes List */}
      <ScrollView 
        style={styles.dishesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dishesContent}
      >
        {dishes.map((dish) => renderDishCard(dish))}
        
        {/* Bottom padding for last item */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dishesContainer: {
    flex: 1,
  },
  dishesContent: {
    paddingHorizontal: 20,
  },
  dishCard: {
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBackground: {
    flex: 1,
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cultureContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  cultureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cultureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  dishName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bottomPadding: {
    height: 20,
  },
});