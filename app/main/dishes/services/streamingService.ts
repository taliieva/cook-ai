/**
 * Streaming Service for Progressive Dish Loading
 * 
 * Handles real-time dish data updates using React Native's DeviceEventEmitter.
 * 
 * CURRENT IMPLEMENTATION: Progressive Reveal Pattern
 * - Fetches all dish data at once from backend (single API call)
 * - Emits dishes one-by-one with 400ms delay for smooth UX
 * - Includes haptic feedback on each dish arrival
 * - This provides excellent perceived performance without backend streaming support
 * 
 * FUTURE: Can be upgraded to true WebSocket/SSE streaming when backend supports it
 * by replacing the fetch() call with a streaming client. The event-based architecture
 * is already in place and would work seamlessly with real streaming.
 */

import { ENV } from '@/config/env';
import { fetchWithAuth } from '@/utils/auth';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

export interface DishData {
  id: string;
  name: string;
  culture: string;
  country: string;
  dishType: string;
  prepTime: string;
  calories: number;
  outdoorCost: number;
  homeCost: number;
  moneySaved: number;
  image: string;
  isLiked: boolean;
  isSaved: boolean;
  shortDescription: string;
  steps: string[];
  videoURL?: string;
  isLoading?: boolean;
}

export interface StreamEvent {
  searchId: string;
  dishIndex?: number;
  data?: Partial<DishData>;
  error?: string;
  errorType?: string;
  status?: number;
  totalDishes?: number;
}

class DishStreamingService {
  private activeSearches: Map<string, boolean> = new Map();

  /**
   * Emit an event using DeviceEventEmitter
   */
  private emit(eventName: string, data: any): void {
    DeviceEventEmitter.emit(eventName, data);
  }

  /**
   * Subscribe to an event
   */
  public on(eventName: string, callback: (data: any) => void): any {
    return DeviceEventEmitter.addListener(eventName, callback);
  }

  /**
   * Unsubscribe from an event (using subscription)
   */
  public off(eventName: string, callback: (data: any) => void): void {
    // DeviceEventEmitter doesn't have removeListener
    // Instead, we remove all listeners for this event and the consumer
    // should store the subscription returned from 'on' and call subscription.remove()
    DeviceEventEmitter.removeAllListeners(eventName);
  }

  /**
   * Start streaming dish data
   * Uses progressive loading to show dishes one by one
   */
  async startStreaming(
    searchId: string,
    ingredients: string[],
    country: string,
    mode: string
  ): Promise<void> {
    if (this.activeSearches.has(searchId)) {
      console.log(`Stream already active for ${searchId}`);
      return;
    }

    this.activeSearches.set(searchId, true);

    try {
      console.log('🚀 Starting dish streaming for:', searchId);

      // Get auth token
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No authentication token');
      }

      const requestBody = {
        ingredients,
        country: this.getCountryNameForAPI(country),
        language: 'en',
        deviceLanguage: 'en-US',
        dietType: mode,
      };

      console.log('📡 Fetching dishes...');

      const response = await fetchWithAuth(
        `${ENV.API_URL}/recipes`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );

      // Handle error responses with proper error messages
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorType = 'NETWORK_ERROR';
        
        try {
          const errorData = await response.json();
          
          // Check for limit-related errors (403 Forbidden)
          if (response.status === 403) {
            errorMessage = errorData.message || errorData.error || 'Access denied';
            errorType = 'LIMIT_EXCEEDED';
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (e) {
          // If can't parse error JSON, use status code message
          console.log('Could not parse error response');
        }

        throw { message: errorMessage, type: errorType, status: response.status };
      }

      const data = await response.json();

      console.log('📦 Received data:', data);

      if (!data.dishData || !data.dishData.DishSuggestions) {
        throw new Error('Invalid response structure from API');
      }

      const dishes = data.dishData.DishSuggestions;
      const actualSearchId = data.searchId || searchId;

      // Emit total count
      this.emit('stream_started', {
        searchId: actualSearchId,
        totalDishes: dishes.length,
      });

      // Progressive reveal: emit dishes one by one with delay
      for (let i = 0; i < dishes.length; i++) {
        if (!this.activeSearches.get(searchId)) {
          console.log('Stream cancelled');
          break;
        }

        // Delay between dishes for progressive reveal (300-500ms feels natural)
        await new Promise(resolve => setTimeout(resolve, 400));

        const dishData = this.transformApiDish(dishes[i], i);

        console.log(`✨ Emitting dish ${i + 1}/${dishes.length}:`, dishData.name);

        // Haptic feedback when dish arrives (feels responsive!)
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
          // Haptics might not be available on all devices/emulators
          console.log('Haptics not available');
        }

        this.emit('dish_data', {
          searchId: actualSearchId,
          dishIndex: i,
          data: dishData,
        });
      }

      // Emit completion with full data for backward compatibility
      this.emit('stream_complete', {
        searchId: actualSearchId,
        fullData: {
          dishData: data.dishData,
          localizedSummary: data.localizedSummary,
          searchId: actualSearchId,
          requestId: data.requestId,
          usageInfo: data.usageInfo,
        },
      });

      console.log('✅ Stream complete');
    } catch (error: any) {
      console.error('❌ Streaming error:', error);
      this.emit('stream_error', {
        searchId,
        error: error.message || 'Failed to load dishes',
        errorType: error.type || 'UNKNOWN_ERROR',
        status: error.status,
      });
    } finally {
      this.activeSearches.delete(searchId);
    }
  }

  /**
   * Transform API dish format to app format
   */
  private transformApiDish(apiDish: any, index: number): DishData {
    return {
      id: apiDish.id || `dish_${Date.now()}_${index}`,
      name: apiDish.DishName || 'Unknown Dish',
      culture: apiDish.CuisineType || 'International',
      country: apiDish.CuisineType || 'International',
      dishType: apiDish.DishType || 'Main Course',
      prepTime: apiDish.EstimatedPortionSize || '30 min',
      calories: apiDish.EstimatedCalories || 0,
      outdoorCost: apiDish.EstimatedOutsideCost || 0,
      homeCost: apiDish.EstimatedHomeCost || 0,
      moneySaved: apiDish.MoneySaved || 0,
      image: apiDish.PictureURL || '',
      isLiked: false,
      isSaved: false,
      shortDescription: apiDish.ShortDescription || '',
      steps: apiDish.Steps || [],
      videoURL: apiDish.VideoURL || '',
      isLoading: false,
    };
  }

  /**
   * Country code to country name mapping for API
   */
  private getCountryNameForAPI(countryCode: string): string {
    const countryMap: { [key: string]: string } = {
      all: 'All Countries',
      az: 'Azerbaijani',
      tr: 'Turkish',
      it: 'Italian',
      cn: 'Chinese',
      mx: 'Mexican',
      jp: 'Japanese',
      fr: 'French',
      in: 'Indian',
      us: 'American',
      th: 'Thai',
    };
    return countryMap[countryCode] || 'All Countries';
  }

  /**
   * Cancel an active stream
   */
  cancelStream(searchId: string): void {
    if (this.activeSearches.has(searchId)) {
      this.activeSearches.delete(searchId);
      console.log(`Stream cancelled for ${searchId}`);
    }
  }

  /**
   * Check if a stream is active
   */
  isStreamActive(searchId: string): boolean {
    return this.activeSearches.has(searchId);
  }
}

// Export singleton instance
export const streamingService = new DishStreamingService();

