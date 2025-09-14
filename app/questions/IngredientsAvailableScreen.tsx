import { OptionCard } from '@/components/onboarding/OptionCard';
import { QuestionContainer } from '@/components/onboarding/QuestionContainer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function IngredientsAvailableScreen() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const router = useRouter();

  const ingredientCategories = [
    {
      id: 'basic-pantry',
      title: 'Basic Pantry Items',
      description: 'Rice, pasta, flour, oils, spices',
      icon: '🥫'
    },
    {
      id: 'fresh-vegetables',
      title: 'Fresh Vegetables',
      description: 'Onions, garlic, tomatoes, leafy greens',
      icon: '🥬'
    },
    {
      id: 'meat-poultry',
      title: 'Meat & Poultry',
      description: 'Chicken, beef, pork, fish',
      icon: '🍖'
    },
    {
      id: 'dairy-eggs',
      title: 'Dairy & Eggs',
      description: 'Milk, cheese, butter, eggs',
      icon: '🥚'
    },
    {
      id: 'fruits',
      title: 'Fresh Fruits',
      description: 'Seasonal fruits and berries',
      icon: '🍎'
    },
    {
      id: 'frozen-items',
      title: 'Frozen Items',
      description: 'Frozen vegetables, fruits, prepared foods',
      icon: '🧊'
    }
  ];

  const handleIngredientToggle = (ingredientId) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientId) 
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleNext = () => {
    // Complete onboarding - navigate to main app
    router.push('/onboarding/ai-intro');
  };

  return (
    <QuestionContainer
      title="What ingredients do you have at home?"
      progress={100}
      onNext={handleNext}
      isAnswered={selectedIngredients.length > 0}
      backgroundImage="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {ingredientCategories.map((category) => (
          <OptionCard
            key={category.id}
            title={category.title}
            description={category.description}
            icon={category.icon}
            isSelected={selectedIngredients.includes(category.id)}
            onPress={() => handleIngredientToggle(category.id)}
          />
        ))}
      </ScrollView>
    </QuestionContainer>
  );
}