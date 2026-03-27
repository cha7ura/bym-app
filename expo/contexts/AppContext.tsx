import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';

export type AppearanceMode = 'light' | 'dark' | 'automatic';

interface UserProfile {
  name: string;
  email: string;
}

export interface FavoriteWorkout {
  id: string;
  name: string;
  duration: string;
  category?: string;
  imageUrl?: string;
  backgroundColor?: string;
  originalName?: string;
  methodName?: string;
}

export interface WorkoutHistoryItem {
  id: string;
  name: string;
  completedAt: string;
  category?: string;
  imageUrl?: string;
  backgroundColor?: string;
  duration?: string;
  exerciseCount?: number;
}

interface WorkoutSettings {
  trailingRest: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export const [AppContext, useApp] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>('automatic');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    email: 'user@example.com',
  });
  const [favorites, setFavorites] = useState<FavoriteWorkout[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>([]);
  const [workoutSettings, setWorkoutSettings] = useState<WorkoutSettings>({
    trailingRest: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedAppearance, savedProfile, savedFavorites, savedWorkoutSettings, savedHistory] = await Promise.all([
        AsyncStorage.getItem('appearance'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('workoutSettings'),
        AsyncStorage.getItem('workoutHistory'),
      ]);

      if (savedAppearance) {
        setAppearanceMode(savedAppearance as AppearanceMode);
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedWorkoutSettings) {
        setWorkoutSettings(JSON.parse(savedWorkoutSettings));
      }
      if (savedHistory) {
        setWorkoutHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppearance = async (mode: AppearanceMode) => {
    setAppearanceMode(mode);
    try {
      await AsyncStorage.setItem('appearance', mode);
    } catch (error) {
      console.error('Failed to save appearance:', error);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const addToFavorites = async (workout: FavoriteWorkout) => {
    const updated = [...favorites, workout];
    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const removeFromFavorites = async (workoutId: string) => {
    const updated = favorites.filter(f => f.id !== workoutId);
    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const isFavorite = (workoutId: string) => {
    return favorites.some(f => f.id === workoutId);
  };

  const updateWorkoutSettings = async (settings: Partial<WorkoutSettings>) => {
    const updated = { ...workoutSettings, ...settings };
    setWorkoutSettings(updated);
    try {
      await AsyncStorage.setItem('workoutSettings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save workout settings:', error);
    }
  };

  const addWorkoutToHistory = async (workout: Omit<WorkoutHistoryItem, 'id' | 'completedAt'>) => {
    const newItem: WorkoutHistoryItem = {
      ...workout,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...workoutHistory];
    setWorkoutHistory(updated);
    try {
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save workout history:', error);
    }
  };

  const getStreakData = useCallback((): StreakData => {
    if (workoutHistory.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
    }

    const workoutDates = new Set<string>();
    workoutHistory.forEach(workout => {
      const date = new Date(workout.completedAt);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      workoutDates.add(dateKey);
    });

    const totalDays = workoutDates.size;

    const sortedDates = Array.from(workoutDates)
      .map(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month, day);
      })
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sortedDates.length > 0) {
      const mostRecent = sortedDates[0];
      mostRecent.setHours(0, 0, 0, 0);
      
      if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const current = sortedDates[i - 1];
          const previous = sortedDates[i];
          const diffDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const current = sortedDates[i - 1];
      const previous = sortedDates[i];
      const diffDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { currentStreak, longestStreak, totalDays };
  }, [workoutHistory]);

  const activeTheme = appearanceMode === 'automatic' ? systemColorScheme || 'dark' : appearanceMode;

  return {
    appearanceMode,
    updateAppearance,
    userProfile,
    updateUserProfile,
    activeTheme,
    isLoading,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    workoutSettings,
    updateWorkoutSettings,
    workoutHistory,
    addWorkoutToHistory,
    getStreakData,
  };
});
