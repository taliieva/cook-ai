import { OptionCard } from '@/components/onboarding/OptionCard';
import { QuestionContainer } from '@/components/onboarding/QuestionContainer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function CuisinePreferenceScreen() {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const router = useRouter();

  const cuisines = [
    {
      id: 'italian',
      title: 'Italian',
      description: 'Pasta, pizza, risotto',
      icon: '🇮🇹'
    },
    {
      id: 'asian',
      title: 'Asian',
      description: 'Chinese, Japanese, Thai',
      icon: '🥢'
    },
    {
      id: 'mexican',
      title: 'Mexican',
      description: 'Tacos, burritos, enchiladas',
      icon: '🌮'
    },
    {
      id: 'mediterranean',
      title: 'Mediterranean',
      description: 'Greek, Turkish, Middle Eastern',
      icon: '🫒'
    },
    {
      id: 'american',
      title: 'American',
      description: 'Burgers, BBQ, comfort food',
      icon: '🍔'
    },
    {
      id: 'indian',
      title: 'Indian',
      description: 'Curry, spices, traditional dishes',
      icon: '🍛'
    }
  ];

  const handleCuisineToggle = (cuisineId) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisineId) 
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const handleNext = () => {
    router.push('/questions/IngredientsAvailableScreen');
  };

  return (
    <QuestionContainer
      title="Which cuisines do you prefer?"
      progress={80}
      onNext={handleNext}
      isAnswered={selectedCuisines.length > 0}
      backgroundImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {cuisines.map((cuisine) => (
          <OptionCard
            key={cuisine.id}
            title={cuisine.title}
            description={cuisine.description}
            icon={cuisine.icon}
            isSelected={selectedCuisines.includes(cuisine.id)}
            onPress={() => handleCuisineToggle(cuisine.id)}
          />
        ))}
      </ScrollView>
    </QuestionContainer>
  );
}
