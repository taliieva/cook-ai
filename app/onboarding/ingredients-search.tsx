import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IngredientsSearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('history');

  const handleAddIngredient = () => {
    if (searchText.trim() && !ingredients.includes(searchText.trim())) {
      setIngredients([...ingredients, searchText.trim()]);
      setSearchText('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleFindDishes = () => {
    router.push('/dishes' as any);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Handle navigation based on tab
    switch(tab) {
      case 'history':
        // Navigate to history or show history content
        break;
      case 'billing':
        // Navigate to billing
        break;
      case 'settings':
        // Navigate to settings
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background.primary}
      />
      
      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { 
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border 
        }]}>
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
            onChangeText={setSearchText}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={theme.colors.accent.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Ingredients List */}
      <ScrollView style={styles.ingredientsSection} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Your Ingredients ({ingredients.length})
        </Text>
        
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={[styles.ingredientTag, { 
              backgroundColor: theme.colors.accent.primary + '20',
              borderColor: theme.colors.accent.primary 
            }]}>
              <Text style={[styles.ingredientText, { color: theme.colors.accent.primary }]}>
                {ingredient}
              </Text>
              <TouchableOpacity 
                onPress={() => handleRemoveIngredient(ingredient)}
                style={styles.removeButton}
              >
                <Ionicons 
                  name="close-circle" 
                  size={18} 
                  color={theme.colors.accent.primary} 
                />
              </TouchableOpacity>
            </View>
          ))}
          
          {ingredients.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons 
                name="restaurant-outline" 
                size={48} 
                color={theme.colors.text.secondary} 
              />
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                Add ingredients to find amazing dishes!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Find Dishes Button */}
      <View style={styles.buttonSection}>
        <Button
          title="Find Dishes"
          onPress={handleFindDishes}
          style={{
            ...styles.findButton,
            opacity: ingredients.length > 0 ? 1 : 0.5
          }}
          disabled={ingredients.length === 0}
        />
      </View>

      {/* Bottom Toolbar */}
      <View style={[styles.bottomToolbar, { 
        backgroundColor: theme.colors.background.secondary,
        borderTopColor: theme.colors.border 
      }]}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('history')}
        >
          <Ionicons 
            name={activeTab === 'history' ? 'time' : 'time-outline'} 
            size={24} 
            color={activeTab === 'history' ? theme.colors.accent.primary : theme.colors.text.secondary} 
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'history' ? theme.colors.accent.primary : theme.colors.text.secondary }
          ]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('billing')}
        >
          <Ionicons 
            name={activeTab === 'billing' ? 'card' : 'card-outline'} 
            size={24} 
            color={activeTab === 'billing' ? theme.colors.accent.primary : theme.colors.text.secondary} 
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'billing' ? theme.colors.accent.primary : theme.colors.text.secondary }
          ]}>
            Billing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('settings')}
        >
          <Ionicons 
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
            size={24} 
            color={activeTab === 'settings' ? theme.colors.accent.primary : theme.colors.text.secondary} 
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'settings' ? theme.colors.accent.primary : theme.colors.text.secondary }
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '400',
  },
  addButton: {
    marginLeft: 10,
  },
  ingredientsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ingredientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.7,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  findButton: {
    width: '100%',
  },
  bottomToolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});