import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, MoreVertical, ChevronLeft, ChevronRight, Pause, Play, Check, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import ExerciseInfoPanel from '@/components/ExerciseInfoPanel';
import { EXERCISES, Exercise } from '@/constants/exercises';

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const { methodName, restTime, workTime, rounds, workoutName } = useLocalSearchParams();
  const { activeTheme, workoutSettings } = useApp();
  const isDark = activeTheme === 'dark';

  const isDual = workoutName === 'The Dual';
  const isTrio = workoutName === 'The Trio';
  const exerciseCount = isTrio ? 3 : (isDual ? 2 : 1);
  const totalRounds = isTrio
    ? (Number(rounds) || 5)
    : (isDual 
      ? (methodName === 'Standard Rest' ? 5 : 8)
      : (methodName === 'Fixed' ? 20 : (Number(rounds) || 8)));
  const workSeconds = Number(workTime) || 20;
  const restSeconds = Number(restTime) || 40;

  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(workSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [showNextPreview, setShowNextPreview] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const animationRef = useRef<any>(null);

  const animateProgress = useCallback((duration: number) => {
    progressAnim.setValue(0);
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: (duration + 1) * 1000,
      useNativeDriver: false,
    });
    animationRef.current.start();
  }, [progressAnim]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      progressAnim.stopAnimation();
    }
  }, [progressAnim]);

  const resumeAnimation = useCallback((remainingTime: number) => {
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: (remainingTime + 1) * 1000,
      useNativeDriver: false,
    });
    animationRef.current.start();
  }, [progressAnim]);

  const completeWorkout = useCallback(() => {
    // Calculate total time using the formula:
    // roundTime = exerciseTime + (exercisesPerRound - 1) * restBetweenExercises
    // totalTime = rounds * roundTime + (rounds - 1 + trailingRest) * restBetweenRounds
    const exerciseTimePerRound = exerciseCount * workSeconds;
    const restBetweenExercisesInRound = (exerciseCount - 1) * restSeconds;
    const roundTime = exerciseTimePerRound + restBetweenExercisesInRound;
    const trailingRestValue = workoutSettings.trailingRest ? 1 : 0;
    const totalTimeSeconds = (totalRounds * roundTime) + ((totalRounds - 1 + trailingRestValue) * restSeconds);
    const totalMinutes = Math.ceil(totalTimeSeconds / 60);
    
    router.replace({
      pathname: '/workout-complete' as any,
      params: {
        exercises: exerciseCount,
        minutes: totalMinutes,
        workoutName: workoutName || 'Bodyweight',
      }
    });
  }, [totalRounds, workSeconds, restSeconds, router, exerciseCount, workoutSettings.trailingRest, workoutName]);

  const startWorkPhase = useCallback(() => {
    setIsWorkPhase(true);
    setCurrentExercise(1);
    setTimeRemaining(workSeconds);
    animateProgress(workSeconds);
  }, [workSeconds, animateProgress]);

  const handlePhaseComplete = useCallback(() => {
    if (isWorkPhase) {
      const isFinalExercise = currentRound === totalRounds && 
        ((isDual || isTrio) ? currentExercise === exerciseCount : true);
      
      if (isFinalExercise && !workoutSettings.trailingRest) {
        completeWorkout();
      } else {
        setIsWorkPhase(false);
        setTimeRemaining(restSeconds);
        animateProgress(restSeconds);
      }
    } else {
      if ((isDual || isTrio) && currentExercise < exerciseCount) {
        setCurrentExercise(currentExercise + 1);
        setIsWorkPhase(true);
        setTimeRemaining(workSeconds);
        animateProgress(workSeconds);
      } else {
        if (currentRound < totalRounds) {
          setCurrentRound(currentRound + 1);
          setCurrentExercise(1);
          setIsWorkPhase(true);
          setTimeRemaining(workSeconds);
          animateProgress(workSeconds);
        } else {
          completeWorkout();
        }
      }
    }
  }, [isWorkPhase, restSeconds, currentRound, totalRounds, workSeconds, animateProgress, completeWorkout, isDual, isTrio, currentExercise, exerciseCount, workoutSettings.trailingRest]);

  useEffect(() => {
    if (isCountingDown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setShowStart(true);
        setTimeout(() => {
          setShowStart(false);
          setIsCountingDown(false);
          startWorkPhase();
        }, 1000);
      }
    }
  }, [countdown, isCountingDown, startWorkPhase]);

  useEffect(() => {
    if (!isCountingDown && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowNextPreview(false);
            handlePhaseComplete();
            return isWorkPhase ? restSeconds : workSeconds;
          }
          
          const isLastEvent = workoutSettings.trailingRest
            ? ((isDual || isTrio)
              ? (currentRound === totalRounds && currentExercise === exerciseCount && !isWorkPhase)
              : (currentRound === totalRounds && !isWorkPhase))
            : ((isDual || isTrio)
              ? (currentRound === totalRounds && currentExercise === exerciseCount && isWorkPhase)
              : (currentRound === totalRounds && isWorkPhase));
          if (prev <= 5 && !isLastEvent) {
            setShowNextPreview(true);
          } else {
            setShowNextPreview(false);
          }
          
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCountingDown, isPaused, handlePhaseComplete, isWorkPhase, restSeconds, workSeconds, currentRound, totalRounds, isDual, isTrio, currentExercise, exerciseCount, workoutSettings.trailingRest]);

  const skipToPrevious = () => {
    if (!isWorkPhase) {
      setIsWorkPhase(true);
      setTimeRemaining(workSeconds);
      animateProgress(workSeconds);
    } else {
      if ((isDual || isTrio) && currentExercise > 1) {
        setCurrentExercise(currentExercise - 1);
        setIsWorkPhase(false);
        setTimeRemaining(restSeconds);
        animateProgress(restSeconds);
      } else if (currentRound > 1) {
        setCurrentRound(currentRound - 1);
        if (isDual || isTrio) {
          setCurrentExercise(exerciseCount);
          setIsWorkPhase(false);
          setTimeRemaining(restSeconds);
          animateProgress(restSeconds);
        } else {
          setIsWorkPhase(false);
          setTimeRemaining(restSeconds);
          animateProgress(restSeconds);
        }
      }
    }
  };

  const skipToNext = () => {
    if (isWorkPhase) {
      const isFinalExercise = currentRound === totalRounds && 
        ((isDual || isTrio) ? currentExercise === exerciseCount : true);
      
      if (isFinalExercise && !workoutSettings.trailingRest) {
        completeWorkout();
      } else {
        setIsWorkPhase(false);
        setTimeRemaining(restSeconds);
        animateProgress(restSeconds);
      }
    } else {
      if ((isDual || isTrio) && currentExercise < exerciseCount) {
        setCurrentExercise(currentExercise + 1);
        setIsWorkPhase(true);
        setTimeRemaining(workSeconds);
        animateProgress(workSeconds);
      } else {
        if (currentRound < totalRounds) {
          setCurrentRound(currentRound + 1);
          setCurrentExercise(1);
          setIsWorkPhase(true);
          setTimeRemaining(workSeconds);
          animateProgress(workSeconds);
        } else {
          completeWorkout();
        }
      }
    }
  };

  const togglePause = () => {
    if (!isPaused) {
      pauseAnimation();
    } else {
      resumeAnimation(timeRemaining);
    }
    setIsPaused(!isPaused);
  };

  const getCurrentExerciseKey = () => {
    if (isTrio) {
      if (currentExercise === 1) return 'burpees';
      if (currentExercise === 2) return 'jumping-jacks';
      return 'plank-march';
    }
    if (isDual) {
      return currentExercise === 1 ? 'mountain-climbers' : 'jumping-jacks';
    }
    return 'jumping-jacks';
  };

  const openExerciseInfo = () => {
    if (!isWorkPhase) return;
    const exerciseKey = getCurrentExerciseKey();
    const exercise = EXERCISES[exerciseKey];
    if (exercise) {
      setSelectedExercise(exercise);
      setShowInfoPanel(true);
      if (!isCountingDown && !showStart && !isPaused) {
        pauseAnimation();
        setIsPaused(true);
      }
    }
  };

  const handleCloseInfoPanel = () => {
    setShowInfoPanel(false);
    if (!isCountingDown && !showStart && isPaused) {
      resumeAnimation(timeRemaining);
      setIsPaused(false);
    }
  };

  const circumference = 2 * Math.PI * 150;
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <SafeAreaView 
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} 
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color={isDark ? '#FFFFFF' : '#000000'} size={28} />
        </Pressable>
        <Text style={[styles.roundText, isDark ? styles.darkText : styles.lightText]}>
          {currentRound} of {totalRounds}
        </Text>
        <Pressable style={styles.moreButton}>
          <MoreVertical color={isDark ? '#FFFFFF' : '#000000'} size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {(isDual || isTrio) && (
          <View style={[styles.exerciseCounter, isDark ? styles.darkPreview : styles.lightPreview]}>
            <Text style={[styles.exerciseCounterText, isDark ? styles.darkText : styles.lightText]}>
              {currentExercise}/{exerciseCount}
            </Text>
          </View>
        )}
        
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <View style={styles.progressRing}>
              <Svg width="340" height="340" style={styles.progressSvg}>
                <Circle
                  cx="170"
                  cy="170"
                  r="150"
                  stroke={isDark ? '#2C2C2E' : '#D1D1D6'}
                  strokeWidth="12"
                  fill="none"
                />
                {!isCountingDown && Platform.OS === 'web' ? (
                  <Circle
                    cx="170"
                    cy="170"
                    r="150"
                    stroke={isDark ? '#4A4A4A' : '#8E8E93'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="170, 170"
                  />
                ) : !isCountingDown ? (
                  <AnimatedCircle
                    cx="170"
                    cy="170"
                    r="150"
                    stroke={isDark ? '#4A4A4A' : '#8E8E93'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset as any}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="170, 170"
                  />
                ) : null}
              </Svg>
            </View>
            
            <View style={[styles.exerciseCircle, isDark ? styles.darkCircle : styles.lightCircle]}>
              <Text style={styles.exerciseEmoji}>
                {isWorkPhase 
                  ? (isTrio 
                    ? (currentExercise === 1 ? '💪' : (currentExercise === 2 ? '🤸' : '🚶'))
                    : (isDual && currentExercise === 1 ? '🧗' : '🤸'))
                  : '😌'}
              </Text>
              {isCountingDown && countdown > 0 && (
                <View style={styles.countdownOverlay}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              )}
              {showStart && (
                <View style={styles.countdownOverlay}>
                  <Text style={styles.startText}>START</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.exerciseNameRow}>
            <View style={styles.infoButtonContainer} />
            <Text style={[styles.exerciseName, isDark ? styles.darkText : styles.lightText]}>
              {isWorkPhase 
                ? (isTrio 
                  ? (currentExercise === 1 ? 'Burpees' : (currentExercise === 2 ? 'Jumping Jacks' : 'Plank March'))
                  : (isDual && currentExercise === 1 ? 'Mountain Climbers' : 'Jumping Jacks'))
                : 'Rest'}
            </Text>
            <View style={styles.infoButtonContainer}>
              {isWorkPhase && (
                <Pressable 
                  style={styles.infoButton} 
                  onPress={openExerciseInfo}
                >
                  <Info color={isDark ? '#8E8E93' : '#8E8E93'} size={22} />
                </Pressable>
              )}
            </View>
          </View>

          <Text style={[styles.timer, isDark ? styles.darkTimer : styles.lightTimer]}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
        </View>

        {showNextPreview && (
          <View style={[styles.nextPreview, isDark ? styles.darkPreview : styles.lightPreview]}>
            <View style={[styles.nextPreviewImage, isDark ? styles.darkCircle : styles.lightCircle]}>
              <Text style={styles.nextPreviewEmoji}>
                {isWorkPhase 
                  ? '😌' 
                  : (isTrio 
                    ? (currentExercise === 1 ? '🤸' : (currentExercise === 2 ? '🚶' : '💪'))
                    : (isDual && currentExercise === 1 ? '🤸' : '🧗'))}
              </Text>
            </View>
            <Text style={[styles.nextPreviewText, isDark ? styles.darkText : styles.lightText]}>Up Next</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable 
          style={[styles.controlButton, isDark ? styles.darkControl : styles.lightControl]}
          onPress={skipToPrevious}
          disabled={isCountingDown}
        >
          <ChevronLeft color={isDark ? '#FFFFFF' : '#000000'} size={32} opacity={isCountingDown ? 0.3 : 1} />
        </Pressable>

        <Pressable 
          style={[styles.controlButton, styles.playButton, isDark ? styles.darkControl : styles.lightControl]}
          onPress={togglePause}
          disabled={isCountingDown}
        >
          {isPaused ? (
            <Play color={isDark ? '#FFFFFF' : '#000000'} size={40} fill={isDark ? '#FFFFFF' : '#000000'} opacity={isCountingDown ? 0.3 : 1} />
          ) : (
            <Pause color={isDark ? '#FFFFFF' : '#000000'} size={40} fill={isDark ? '#FFFFFF' : '#000000'} opacity={isCountingDown ? 0.3 : 1} />
          )}
        </Pressable>

        <Pressable 
          style={[styles.controlButton, isDark ? styles.darkControl : styles.lightControl]}
          onPress={skipToNext}
          disabled={isCountingDown}
        >
          {(() => {
            const isFinalRound = currentRound === totalRounds;
            const isFinalExercise = (isDual || isTrio) ? currentExercise === exerciseCount : true;
            const showCheck = workoutSettings.trailingRest
              ? (isFinalRound && !isWorkPhase && isFinalExercise)
              : (isFinalRound && isWorkPhase && isFinalExercise);
            
            return showCheck ? (
              <Check color={isDark ? '#FFFFFF' : '#000000'} size={32} opacity={isCountingDown ? 0.3 : 1} />
            ) : (
              <ChevronRight color={isDark ? '#FFFFFF' : '#000000'} size={32} opacity={isCountingDown ? 0.3 : 1} />
            );
          })()}
        </Pressable>
      </View>
    <ExerciseInfoPanel
        exercise={selectedExercise}
        visible={showInfoPanel}
        onClose={handleCloseInfoPanel}
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
  roundText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCounter: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  imageSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative' as const,
    width: 280,
    height: 280,
  },
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  progressRing: {
    position: 'absolute' as const,
    top: -30,
    left: -30,
    width: 340,
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSvg: {
    position: 'absolute' as const,
  },
  exerciseCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  },
  darkCircle: {
    backgroundColor: '#1A5A5A',
  },
  lightCircle: {
    backgroundColor: '#3B7B8F',
  },
  exerciseEmoji: {
    fontSize: 120,
  },
  countdownOverlay: {
    position: 'absolute' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  startText: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  roundOverlay: {
    position: 'absolute' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundOverlayText: {
    fontSize: 80,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 40,
    width: '100%',
  },
  infoButtonContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonDisabled: {
    opacity: 0.5,
  },
  timer: {
    fontSize: 56,
    fontWeight: '300' as const,
    marginTop: 8,
  },
  darkTimer: {
    color: '#8E8E93',
  },
  lightTimer: {
    color: '#8E8E93',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingBottom: 40,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkControl: {
    backgroundColor: '#1C1C1E',
  },
  lightControl: {
    backgroundColor: '#FFFFFF',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nextPreview: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  darkPreview: {
    backgroundColor: '#1C1C1E',
  },
  lightPreview: {
    backgroundColor: '#FFFFFF',
  },
  nextPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextPreviewEmoji: {
    fontSize: 40,
  },
  nextPreviewText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  exerciseCounterText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
