import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface WorkoutMethod {
  name: string;
  label: string;
  total_time_minutes: number;
  rounds: number;
  rep_time_seconds: number;
  rest_time_seconds: number;
  exercises?: string[];
  restBetweenSets?: number;
  notes?: string;
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

const soloMethods: WorkoutMethod[] = [
  {
    name: 'Fixed',
    label: 'Method 1',
    total_time_minutes: calculateSoloTime(20, 20, 40),
    rounds: 20,
    rep_time_seconds: 20,
    rest_time_seconds: 40,
  },
  {
    name: 'Incremental',
    label: 'Method 2',
    total_time_minutes: calculateSoloTime(8, 20, 40),
    rounds: 8,
    rep_time_seconds: 20,
    rest_time_seconds: 40,
  },
];

const dualMethods: WorkoutMethod[] = [
  {
    name: 'Standard Rest',
    label: 'Method 1',
    total_time_minutes: calculateMultiExerciseTime(20, 2, 20, 40, 40),
    rounds: 20,
    rep_time_seconds: 20,
    rest_time_seconds: 40,
    restBetweenSets: 40,
    exercises: ['Mountain Climbers', 'Jumping Jacks'],
    notes: 'Perform exercises consecutively with 40 sec rest. Performing both exercises counts as one round. You may take up to 40 sec rest in between rounds.',
  },
  {
    name: 'Minimal Rest',
    label: 'Method 2',
    total_time_minutes: calculateMultiExerciseTime(20, 2, 20, 20, 20),
    rounds: 20,
    rep_time_seconds: 20,
    rest_time_seconds: 20,
    restBetweenSets: 20,
    exercises: ['Mountain Climbers', 'Jumping Jacks'],
    notes: 'Perform exercises consecutively with 20 sec rest. Performing both exercises counts as one round. You may take up to 20 sec rest in between rounds.',
  },
];

export default function WorkoutMethodsScreen() {
  const router = useRouter();
  const { workoutName } = useLocalSearchParams();
  const { activeTheme } = useApp();
  const isDark = activeTheme === 'dark';

  const workoutMethods = workoutName === 'The Dual' ? dualMethods : soloMethods;

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color={isDark ? '#FFFFFF' : '#000000'} size={28} />
        </Pressable>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          {workoutName || 'Workout'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkLabel : styles.lightLabel]}>
            METHODS
          </Text>
          {workoutMethods.map((method, index) => (
            <Pressable
              key={index}
              style={styles.methodCard}
              android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}
              onPress={() => {
                router.push({
                  pathname: '/workout-setup' as any,
                  params: {
                    workoutName: workoutName,
                    methodName: method.name,
                    totalMinutes: method.total_time_minutes.toString(),
                    rounds: method.rounds.toString(),
                  }
                });
              }}
            >
              <View style={[styles.methodIconContainer, isDark ? styles.darkMethodIcon : styles.lightMethodIcon]}>
                <Text style={[styles.methodLabel, isDark ? styles.darkText : styles.lightText]}>
                  {method.label}
                </Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodName, isDark ? styles.darkText : styles.lightText]}>
                  {method.name}
                </Text>
                <Text style={[styles.methodDuration, isDark ? styles.darkLabel : styles.lightLabel]}>
                  {method.total_time_minutes} MINUTES
                </Text>
                {method.exercises ? (
                  <>
                    <Text style={[styles.methodDetails, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {method.exercises.join(' → ')}
                    </Text>
                    <Text style={[styles.methodDetails, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {method.rep_time_seconds}s each • {method.restBetweenSets}s rest between rounds
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.methodDetails, isDark ? styles.darkLabel : styles.lightLabel]}>
                    {method.rounds} rounds • {method.rep_time_seconds}s work • {method.rest_time_seconds}s rest
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    flex: 1,
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
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 16,
    letterSpacing: 1,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  methodIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkMethodIcon: {
    backgroundColor: '#1C1C1E',
  },
  lightMethodIcon: {
    backgroundColor: '#FFFFFF',
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  methodInfo: {
    flex: 1,
    gap: 4,
  },
  methodName: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  methodDuration: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  methodDetails: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
});
