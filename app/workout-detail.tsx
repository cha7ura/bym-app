import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Exercise {
  id: string;
  name: string;
  imageUrl: string;
  hasMethods?: boolean;
  methodsData?: {
    times: number[];
  };
}

interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

const calculateSoloTime = (rounds: number, repTime: number, restTime: number, trailingRest: boolean = true) => {
  let total = (repTime + restTime) * rounds;
  if (trailingRest) {
    total -= restTime;
  }
  return Math.ceil(total / 60);
};

const calculateMultiExerciseTime = (
  rounds: number, 
  exerciseCount: number, 
  repTime: number, 
  restBetweenSets: number, 
  restBetweenRounds: number,
  trailingRest: boolean = true
) => {
  const perRound = (exerciseCount * repTime) + ((exerciseCount - 1) * restBetweenSets) + restBetweenRounds;
  let total = rounds * perRound;
  if (trailingRest) {
    total -= restBetweenRounds;
  }
  return Math.ceil(total / 60);
};

const soloMethodTimes = [
  calculateSoloTime(20, 20, 40),
  calculateSoloTime(8, 20, 40),
];

const dualMethodTimes = [
  calculateMultiExerciseTime(20, 2, 20, 40, 40),
  calculateMultiExerciseTime(20, 2, 20, 20, 20),
];

const getTimeDisplay = (exercise: Exercise): string => {
  if (exercise.methodsData && exercise.methodsData.times.length > 0) {
    const times = exercise.methodsData.times;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    if (minTime === maxTime) {
      return `${minTime} MINUTES`;
    }
    return `${minTime}-${maxTime} MINUTES`;
  }
  return '10 MINUTES';
};

const bodyweightWorkouts: WorkoutSection[] = [
  {
    title: 'ANYONE',
    exercises: [
      {
        id: '1',
        name: 'Bear Crawl & Walk',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      },
      {
        id: '2',
        name: 'Ladder Burpees',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      },
    ],
  },
  {
    title: 'BEGINNER',
    exercises: [
      {
        id: '3',
        name: 'The Solo',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        hasMethods: true,
        methodsData: { times: soloMethodTimes },
      },
      {
        id: '4',
        name: 'The Dual',
        imageUrl: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=400',
        hasMethods: true,
        methodsData: { times: dualMethodTimes },
      },
    ],
  },
  {
    title: 'INTERMEDIATE',
    exercises: [
      {
        id: '5',
        name: 'The Trio',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400',
      },
      {
        id: '6',
        name: 'The Quad',
        imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400',
      },
    ],
  },
];

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { categoryName } = useLocalSearchParams();
  const { activeTheme } = useApp();
  const isDark = activeTheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={isDark ? '#FFFFFF' : '#000000'} size={28} />
          </Pressable>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {categoryName || 'Bodyweight'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {bodyweightWorkouts.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, isDark ? styles.darkLabel : styles.lightLabel]}>
                {section.title}
              </Text>
              {section.exercises.map((exercise) => (
                <Pressable
                  key={exercise.id}
                  style={styles.exerciseCard}
                  android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}
                  onPress={() => {
                    if (exercise.name === 'The Solo' || exercise.name === 'The Dual') {
                      router.push({
                        pathname: '/workout-methods' as any,
                        params: { workoutName: exercise.name }
                      });
                    } else if (exercise.name === 'The Trio') {
                      router.push({
                        pathname: '/workout-setup' as any,
                        params: {
                          workoutName: exercise.name,
                          methodName: 'Default',
                          totalMinutes: '10',
                        }
                      });
                    }
                  }}
                >
                  <View style={styles.exerciseImageContainer}>
                    <Image
                      source={{ uri: exercise.imageUrl }}
                      style={styles.exerciseImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                      {exercise.name}
                    </Text>
                    <Text style={[styles.exerciseDuration, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {getTimeDisplay(exercise)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  placeholder: {
    width: 48,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  darkLabel: {
    color: '#8E8E93',
  },
  lightLabel: {
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 16,
    letterSpacing: 1,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  exerciseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  exerciseDuration: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
