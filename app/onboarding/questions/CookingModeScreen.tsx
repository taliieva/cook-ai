import { OptionCard } from '@/components/onboarding/OptionCard';
import { QuestionContainer } from '@/components/onboarding/QuestionContainer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function CookingModeScreen() {
  const [selectedMode, setSelectedMode] = useState(null);
  const router = useRouter();

  const modes = [
    {
      id: 'standard',
      title: 'Standard',
      description: 'Regular recipes with balanced nutrition',
      icon: '🍽️'
    },
    {
      id: 'diet',
      title: 'Diet',
      description: 'Low-calorie, healthy meal options',
      icon: '🥗'
    },
    {
      id: 'gym',
      title: 'Gym',
      description: 'High-protein meals for fitness goals',
      icon: '💪'
    }
  ];

  const handleNext = () => {
    router.push('/onboarding/questions/AgeScreen');
  };

  return (
    <QuestionContainer
      title="What type of cooking mode do you prefer?"
      progress={40}
      onNext={handleNext}
      isAnswered={selectedMode !== null}
      backgroundImage="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {modes.map((mode) => (
          <OptionCard
            key={mode.id}
            title={mode.title}
            description={mode.description}
            icon={mode.icon}
            isSelected={selectedMode === mode.id}
            onPress={() => setSelectedMode(mode.id)}
          />
        ))}
      </ScrollView>
    </QuestionContainer>
  );
}
