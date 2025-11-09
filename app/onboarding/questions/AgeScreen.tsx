import { OptionCard } from '@/components/onboarding/OptionCard';
import { QuestionContainer } from '@/components/onboarding/QuestionContainer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function AgeScreen() {
  const [selectedAge, setSelectedAge] = useState(null);
  const router = useRouter();

  const ageRanges = [
    {
      id: 'teen',
      title: '13-17',
      description: 'Teenager',
      icon: '🧒'
    },
    {
      id: 'young-adult',
      title: '18-25',
      description: 'Young Adult',
      icon: '👨‍💼'
    },
    {
      id: 'adult',
      title: '26-35',
      description: 'Adult',
      icon: '👩‍💻'
    },
    {
      id: 'mature-adult',
      title: '36-50',
      description: 'Mature Adult',
      icon: '👨‍👩‍👧'
    },
    {
      id: 'senior',
      title: '50+',
      description: 'Senior',
      icon: '👴'
    }
  ];

  const handleNext = () => {
    router.push('/onboarding/questions/CuisinePreferenceScreen');
  };

  return (
    <QuestionContainer
      title="What's your age group?"
      progress={60}
      onNext={handleNext}
      isAnswered={selectedAge !== null}
      backgroundImage="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {ageRanges.map((age) => (
          <OptionCard
            key={age.id}
            title={age.title}
            description={age.description}
            icon={age.icon}
            isSelected={selectedAge === age.id}
            onPress={() => setSelectedAge(age.id)}
          />
        ))}
      </ScrollView>
    </QuestionContainer>
  );
}