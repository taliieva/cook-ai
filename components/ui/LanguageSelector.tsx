import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Language {
  code: string;
  // name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'az',  flag: '🇦🇿' },
  { code: 'en',  flag: '🇬🇧' },
  { code: 'ru', flag: '🇷🇺' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.selector, { 
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border
        }]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.flag}>{currentLanguage?.flag}</Text>
        {/* <Text style={[styles.languageText, { color: theme.colors.text.primary }]}>
          {currentLanguage?.name}
        </Text> */}
        {/* <Text style={[styles.arrow, { color: theme.colors.text.secondary }]}>▼</Text>  */}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={[styles.dropdown, { 
              backgroundColor: theme.colors.background.primary,
              borderColor: theme.colors.border
            }]}>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      { borderBottomColor: theme.colors.border },
                      selectedLanguage === item.code && { 
                        backgroundColor: theme.baseColors.blue500 
                      }
                    ]}
                    onPress={() => handleLanguageSelect(item.code)}
                  >
                    <Text style={styles.flag}>{item.flag}</Text>
                    {/* <Text style={[
                      styles.languageText,
                      { color: theme.colors.text.primary },
                      selectedLanguage === item.code && { 
                        color: theme.colors.accent.primary,
                        fontWeight: '600'
                      }
                    ]}>
                      {item.name}
                    </Text> */}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 40,
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  arrow: {
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60, // Adjust based on your header height
    right: 20, // Same padding as your top section
    zIndex: 1000,
  },
  dropdown: {
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 120,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
});