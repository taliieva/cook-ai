import { OptionCard } from '@/components/onboarding/OptionCard';
import { QuestionContainer } from '@/components/onboarding/QuestionContainer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function CookingExperienceScreen() {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const router = useRouter();

  const experiences = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'I\'m just starting my cooking journey',
      icon: '🌱'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'I can cook basic meals confidently',
      icon: '👨‍🍳'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'I love experimenting with complex recipes',
      icon: '⭐'
    },
    {
      id: 'expert',
      title: 'Expert',
      description: 'I can cook almost anything from scratch',
      icon: '🏆'
    }
  ];

  const handleNext = () => {
    // Store the selected experience
    router.push('/onboarding/questions/CookingModeScreen');
  };

  return (
    <QuestionContainer
      title="What's your cooking experience?"
      progress={20}
      onNext={handleNext}
      isAnswered={selectedExperience !== null}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {experiences.map((experience) => (
          <OptionCard
            key={experience.id}
            title={experience.title}
            description={experience.description}
            icon={experience.icon}
            isSelected={selectedExperience === experience.id}
            onPress={() => setSelectedExperience(experience.id)}
          />
        ))}
      </ScrollView>
    </QuestionContainer>
  );
}