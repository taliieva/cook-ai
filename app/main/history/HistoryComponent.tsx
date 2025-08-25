import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Mock search history data
const mockSearchHistory = [
  {
    id: 1,
    searchTerms: ['chicken', 'tomato', 'basil'],
    cuisine: 'Italian',
    timestamp: '2024-08-25 14:30',
    resultsCount: 12
  },
  {
    id: 2,
    searchTerms: ['rice', 'soy sauce', 'ginger'],
    cuisine: 'Chinese',
    timestamp: '2024-08-25 10:15',
    resultsCount: 8
  },
  {
    id: 3,
    searchTerms: ['avocado', 'lime', 'cilantro'],
    cuisine: 'Mexican',
    timestamp: '2024-08-24 18:45',
    resultsCount: 15
  },
  {
    id: 4,
    searchTerms: ['salmon', 'lemon', 'dill'],
    cuisine: 'All Countries',
    timestamp: '2024-08-24 12:20',
    resultsCount: 9
  },
  {
    id: 5,
    searchTerms: ['pasta', 'garlic', 'olive oil'],
    cuisine: 'Italian',
    timestamp: '2024-08-23 19:00',
    resultsCount: 21
  },
  {
    id: 6,
    searchTerms: ['beef', 'onion', 'bell pepper'],
    cuisine: 'American',
    timestamp: '2024-08-23 14:30',
    resultsCount: 11
  },
  {
    id: 7,
    searchTerms: ['tofu', 'mushroom', 'soy sauce'],
    cuisine: 'Japanese',
    timestamp: '2024-08-22 16:45',
    resultsCount: 7
  },
  {
    id: 8,
    searchTerms: ['curry', 'coconut milk', 'chilies'],
    cuisine: 'Thai',
    timestamp: '2024-08-22 13:10',
    resultsCount: 13
  },
  {
    id: 9,
    searchTerms: ['cheese', 'bread', 'butter'],
    cuisine: 'French',
    timestamp: '2024-08-21 20:30',
    resultsCount: 6
  },
  {
    id: 10,
    searchTerms: ['spinach', 'paneer', 'garam masala'],
    cuisine: 'Indian',
    timestamp: '2024-08-21 11:15',
    resultsCount: 18
  }
];

export default function HistoryComponent({ userPlan, onSearchAgain, onUpgrade }) {
  const theme = useTheme();
  const FREE_PLAN_LIMIT = 5;
  
  // Get visible history based on plan
  const getVisibleHistory = () => {
    if (userPlan === 'pro') {
      return mockSearchHistory;
    }
    return mockSearchHistory.slice(0, FREE_PLAN_LIMIT);
  };

  const hasMoreHistory = mockSearchHistory.length > FREE_PLAN_LIMIT;
  const visibleHistory = getVisibleHistory();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return `${days} days ago`;
    }
  };

  const HistoryItem = ({ item, isBlurred = false }) => (
    <TouchableOpacity 
      style={[styles.historyItem, { 
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.border,
        opacity: isBlurred ? 0.4 : 1
      }]}
      onPress={() => !isBlurred && onSearchAgain(item.searchTerms, item.cuisine)}
      disabled={isBlurred}
    >
      <View style={styles.historyHeader}>
        <View style={styles.historyMeta}>
          <Text style={[styles.cuisineText, { color: theme.colors.accent.primary }]}>
            {item.cuisine}
          </Text>
          <Text style={[styles.timestampText, { color: theme.colors.text.secondary }]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        <View style={styles.resultsCount}>
          <Ionicons name="restaurant" size={14} color={theme.colors.text.secondary} />
          <Text style={[styles.resultsText, { color: theme.colors.text.secondary }]}>
            {item.resultsCount} recipes
          </Text>
        </View>
      </View>
      
      <View style={styles.ingredientsContainer}>
        {item.searchTerms.map((term, index) => (
          <View 
            key={index} 
            style={[styles.ingredientChip, { 
              backgroundColor: theme.colors.accent.primary + '15',
              borderColor: theme.colors.accent.primary + '30'
            }]}
          >
            <Text style={[styles.ingredientText, { color: theme.colors.accent.primary }]}>
              {term}
            </Text>
          </View>
        ))}
      </View>
      
      {!isBlurred && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSearchAgain(item.searchTerms, item.cuisine)}
          >
            <Ionicons name="search" size={16} color={theme.colors.accent.primary} />
            <Text style={[styles.actionText, { color: theme.colors.accent.primary }]}>
              Search Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const UpgradePrompt = () => (
    <View style={[styles.upgradePrompt, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.upgradeContent}>
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed" size={32} color={theme.colors.accent.primary} />
        </View>
        
        <Text style={[styles.upgradeTitle, { color: theme.colors.text.primary }]}>
          Unlock Full Search History
        </Text>
        
        <Text style={[styles.upgradeDescription, { color: theme.colors.text.secondary }]}>
          Upgrade to Pro to unlock full search history and access all your previous searches.
        </Text>
        
        <Button
          title="Upgrade to Pro"
          onPress={onUpgrade}
          style={styles.upgradeButton}
        />
        
        <Text style={[styles.upgradeSubtext, { color: theme.colors.text.secondary }]}>
          {mockSearchHistory.length - FREE_PLAN_LIMIT} more searches available
        </Text>
      </View>
    </View>
  );

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Search History
        </Text>
      </View>

      {/* Plan Badge */}
      <View style={styles.planBadgeContainer}>
        <View style={[styles.planBadge, { 
          backgroundColor: userPlan === 'pro' ? theme.colors.accent.primary + '20' : theme.colors.text.secondary + '20'
        }]}>
          <Text style={[styles.planBadgeText, { 
            color: userPlan === 'pro' ? theme.colors.accent.primary : theme.colors.text.secondary 
          }]}>
            {userPlan === 'pro' ? '✨ Pro Plan' : '🆓 Free Plan'}
          </Text>
        </View>
      </View>

      {/* History Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
              {userPlan === 'pro' ? mockSearchHistory.length : FREE_PLAN_LIMIT}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              {userPlan === 'pro' ? 'Total Searches' : 'Recent Searches'}
            </Text>
          </View>
          
          <View style={[styles.statItem, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
              {Array.from(new Set(mockSearchHistory.map(item => item.cuisine))).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Cuisines Explored
            </Text>
          </View>
        </View>

        {/* History List */}
        <View style={styles.historyList}>
          {visibleHistory.length > 0 ? (
            <>
              {visibleHistory.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
              
              {/* Show blurred items and upgrade prompt for free users */}
              {userPlan === 'free' && hasMoreHistory && (
                <View style={styles.lockedSection}>
                  {/* Blurred preview items */}
                  {mockSearchHistory.slice(FREE_PLAN_LIMIT, FREE_PLAN_LIMIT + 2).map((item) => (
                    <HistoryItem key={`blurred-${item.id}`} item={item} isBlurred={true} />
                  ))}
                  
                  {/* Upgrade Prompt */}
                  <UpgradePrompt />
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={64} color={theme.colors.text.secondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
                No Search History
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.colors.text.secondary }]}>
                Your search history will appear here once you start searching for recipes.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  planBadgeContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30, // Add padding to account for footer height
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  historyList: {
    paddingBottom: 50, // Increased from 20 to provide more space above footer
  },
  historyItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyMeta: {
    flex: 1,
  },
  cuisineText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '400',
  },
  resultsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  ingredientChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  ingredientText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lockedSection: {
    position: 'relative',
  },
  upgradePrompt: {
    borderRadius: 12,
    padding: 24,
    marginTop: 8,
    alignItems: 'center',
  },
  upgradeContent: {
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: 16,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 12,
  },
  upgradeSubtext: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});