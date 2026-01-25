import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, MoreVertical, Minus, Plus } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import ExerciseInfoPanel from '@/components/ExerciseInfoPanel';
import { EXERCISES, Exercise } from '@/constants/exercises';

export default function WorkoutSetupScreen() {
  const router = useRouter();
  const { workoutName, methodName } = useLocalSearchParams();
  const { activeTheme, addToFavorites, removeFromFavorites, isFavorite } = useApp();
  const isDark = activeTheme === 'dark';

  const isMinimalRest = methodName === 'Minimal Rest';
  const isTrioWorkout = workoutName === 'The Trio';
  
  const [restTime, setRestTime] = useState(isTrioWorkout ? 20 : (isMinimalRest ? 20 : 40));
  const [workTime, setWorkTime] = useState(20);
  const [rounds, setRounds] = useState(isTrioWorkout ? 5 : 8);
  const [restBetweenSets, setRestBetweenSets] = useState(isTrioWorkout ? 20 : (isMinimalRest ? 20 : 40));
  const trailingRest = true;
  
  const isDualWorkout = workoutName === 'The Dual';
  
  const calculateTotalTime = () => {
    const exercisesPerRound = isTrioWorkout ? 3 : isDualWorkout ? 2 : 1;
    const exerciseTime = exercisesPerRound * workTime;
    const restBetweenExercises = exercisesPerRound > 1 ? restBetweenSets : 0;
    const restBetweenRounds = Math.max(0, restTime);
    const trailingRestFlag = trailingRest ? 1 : 0;
    
    const roundTime = exerciseTime + (exercisesPerRound - 1) * restBetweenExercises;
    const totalSeconds = rounds * roundTime + (rounds - 1 + trailingRestFlag) * restBetweenRounds;
    
    return Math.ceil(totalSeconds / 60);
  };
  
  const dynamicTotalMinutes = calculateTotalTime();
  
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  const workoutId = `${workoutName}-${methodName}`;
  const isFav = isFavorite(workoutId);

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(workoutId);
    } else {
      addToFavorites({
        id: workoutId,
        name: `${workoutName}${methodName !== 'Default' ? ` - ${methodName}` : ''}`,
        duration: dynamicTotalMinutes.toString(),
        originalName: workoutName as string,
        methodName: methodName as string,
      });
    }
  };

  const openExerciseInfo = (exerciseKey: string) => {
    const exercise = EXERCISES[exerciseKey];
    if (exercise) {
      setSelectedExercise(exercise);
      setShowInfoPanel(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <ArrowLeft color={isDark ? '#FFFFFF' : '#000000'} size={28} />
        </Pressable>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          {workoutName || 'Workout'}{isTrioWorkout ? '' : ` - ${methodName}`}
        </Text>
        <Pressable style={styles.moreButton}>
          <MoreVertical color={isDark ? '#FFFFFF' : '#000000'} size={28} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.durationContainer}>
            <Text style={[styles.duration, isDark ? styles.darkText : styles.lightText]}>
              {dynamicTotalMinutes} MINUTES
            </Text>
            <Pressable style={styles.heartButton} onPress={toggleFavorite}>
              <Heart 
                color={isFav ? '#FF3B30' : (isDark ? '#FFFFFF' : '#000000')} 
                size={24} 
                fill={isFav ? '#FF3B30' : 'none'}
              />
            </Pressable>
          </View>

          <View style={styles.exercisesList}>
            {(methodName === 'Incremental' || isTrioWorkout) && (
              <>
                <View style={styles.exerciseItem}>
                  <View style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}>
                    <Text style={[styles.exerciseEmoji]}>🔢</Text>
                  </View>
                  
                  <View style={styles.exerciseDetails}>
                    <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                      Rounds
                    </Text>
                  </View>
                  
                  <View style={styles.timerControls}>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setRounds(prev => Math.max(isTrioWorkout ? 5 : 8, prev - 1))}
                    >
                      <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                    <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {rounds}
                    </Text>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setRounds(prev => Math.min(isTrioWorkout ? 50 : 20, prev + 1))}
                    >
                      <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                  </View>
                </View>
              </>
            )}

            <View style={styles.exerciseItem}>
              <View style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}>
                <Text style={[styles.exerciseEmoji]}>⏱️</Text>
              </View>
              
              <View style={styles.exerciseDetails}>
                <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                  Rest between rounds
                </Text>
              </View>
              
              <View style={styles.timerControls}>
                <Pressable 
                  style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                  onPress={() => setRestTime(prev => Math.max(0, prev - 5))}
                >
                  <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                </Pressable>
                <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                  {formatTime(restTime)}
                </Text>
                <Pressable 
                  style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                  onPress={() => setRestTime(prev => prev + 5)}
                >
                  <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                </Pressable>
              </View>
            </View>
            
            {(isDualWorkout || isTrioWorkout) && (
              <View style={styles.exerciseItem}>
                <View style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}>
                  <Text style={[styles.exerciseEmoji]}>⏸️</Text>
                </View>
                
                <View style={styles.exerciseDetails}>
                  <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                    Rest between sets
                  </Text>
                </View>
                
                <View style={styles.timerControls}>
                  <Pressable 
                    style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                    onPress={() => setRestBetweenSets(prev => Math.max(0, prev - 5))}
                  >
                    <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                  </Pressable>
                  <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                    {formatTime(restBetweenSets)}
                  </Text>
                  <Pressable 
                    style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                    onPress={() => setRestBetweenSets(prev => prev + 5)}
                  >
                    <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                  </Pressable>
                </View>
              </View>
            )}
            
            <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />
            
            <View style={styles.exerciseItem}>
              <Pressable 
                style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}
                onPress={() => openExerciseInfo(isTrioWorkout ? 'burpees' : 'mountain-climbers')}
              >
                <Text style={[styles.exerciseEmoji]}>{isTrioWorkout ? '💪' : '🧗'}</Text>
              </Pressable>
              
              <View style={styles.exerciseDetails}>
                <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                  {isTrioWorkout ? 'Burpees' : 'Mountain Climbers'}
                </Text>
              </View>
              
              <View style={styles.timerControls}>
                <Pressable 
                  style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                  onPress={() => setWorkTime(prev => Math.max(5, prev - 5))}
                >
                  <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                </Pressable>
                <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                  {formatTime(workTime)}
                </Text>
                <Pressable 
                  style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                  onPress={() => setWorkTime(prev => prev + 5)}
                >
                  <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                </Pressable>
              </View>
            </View>
            
            {isDualWorkout && (
              <View style={styles.exerciseItem}>
                <Pressable 
                  style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}
                  onPress={() => openExerciseInfo('jumping-jacks')}
                >
                  <Text style={[styles.exerciseEmoji]}>🤸</Text>
                </Pressable>
                
                <View style={styles.exerciseDetails}>
                  <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                    Jumping Jacks
                  </Text>
                </View>
                
                <View style={styles.timerControls}>
                  <Pressable 
                    style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                    onPress={() => setWorkTime(prev => Math.max(5, prev - 5))}
                  >
                    <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                  </Pressable>
                  <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                    {formatTime(workTime)}
                  </Text>
                  <Pressable 
                    style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                    onPress={() => setWorkTime(prev => prev + 5)}
                  >
                    <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                  </Pressable>
                </View>
              </View>
            )}
            
            {isTrioWorkout && (
              <>
                <View style={styles.exerciseItem}>
                  <Pressable 
                    style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}
                    onPress={() => openExerciseInfo('jumping-jacks')}
                  >
                    <Text style={[styles.exerciseEmoji]}>🤸</Text>
                  </Pressable>
                  
                  <View style={styles.exerciseDetails}>
                    <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                      Jumping Jacks
                    </Text>
                  </View>
                  
                  <View style={styles.timerControls}>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setWorkTime(prev => Math.max(5, prev - 5))}
                    >
                      <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                    <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {formatTime(workTime)}
                    </Text>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setWorkTime(prev => prev + 5)}
                    >
                      <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                  </View>
                </View>
                
                <View style={styles.exerciseItem}>
                  <Pressable 
                    style={[styles.exerciseImageContainer, isDark ? styles.darkExerciseIcon : styles.lightExerciseIcon]}
                    onPress={() => openExerciseInfo('plank-march')}
                  >
                    <Text style={[styles.exerciseEmoji]}>🚶</Text>
                  </Pressable>
                  
                  <View style={styles.exerciseDetails}>
                    <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
                      Plank March
                    </Text>
                  </View>
                  
                  <View style={styles.timerControls}>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setWorkTime(prev => Math.max(5, prev - 5))}
                    >
                      <Minus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                    <Text style={[styles.exerciseTimer, isDark ? styles.darkLabel : styles.lightLabel]}>
                      {formatTime(workTime)}
                    </Text>
                    <Pressable 
                      style={[styles.timerButton, isDark ? styles.darkTimerButton : styles.lightTimerButton]}
                      onPress={() => setWorkTime(prev => prev + 5)}
                    >
                      <Plus color={isDark ? '#FFFFFF' : '#000000'} size={18} />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Pressable 
          style={styles.startButton}
          onPress={() => router.push({
            pathname: '/workout-session' as any,
            params: {
              workoutName: workoutName as string,
              methodName: methodName as string,
              totalMinutes: dynamicTotalMinutes.toString(),
              restTime: restTime.toString(),
              workTime: workTime.toString(),
              rounds: rounds.toString(),
              restBetweenSets: restBetweenSets.toString(),
            }
          })}
        >
          <Text style={styles.startButtonText}>START</Text>
        </Pressable>
      </View>
    <ExerciseInfoPanel
        exercise={selectedExercise}
        visible={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    flex: 1,
    textAlign: 'center',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative' as const,
  },
  duration: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute' as const,
    right: 0,
    top: -10,
  },

  exercisesList: {
    gap: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exerciseImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkExerciseIcon: {
    backgroundColor: '#1C1C1E',
  },
  lightExerciseIcon: {
    backgroundColor: '#FFFFFF',
  },
  exerciseEmoji: {
    fontSize: 30,
  },
  exerciseDetails: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  exerciseTimer: {
    fontSize: 15,
    fontWeight: '500' as const,
    minWidth: 45,
    textAlign: 'center' as const,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkTimerButton: {
    backgroundColor: '#3A3A3C',
  },
  lightTimerButton: {
    backgroundColor: '#E5E5EA',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  darkDivider: {
    backgroundColor: '#2C2C2E',
  },
  lightDivider: {
    backgroundColor: '#E5E5EA',
  },
  bottomButtons: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  startButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
