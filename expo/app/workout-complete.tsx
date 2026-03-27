import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function WorkoutCompleteScreen() {
  const router = useRouter();
  const { exercises, minutes, workoutName } = useLocalSearchParams();
  const { activeTheme, addWorkoutToHistory } = useApp();
  const isDark = activeTheme === 'dark';

  const getWorkoutDetails = () => {
    const name = String(workoutName || 'Bodyweight');
    if (name === 'The Trio') {
      return {
        name: 'The Trio',
        category: 'Bodyweight',
        backgroundColor: '#9DD4CA',
        imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae',
      };
    } else if (name === 'The Dual') {
      return {
        name: 'The Dual',
        category: 'Bodyweight',
        backgroundColor: '#9DD4CA',
        imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae',
      };
    }
    return {
      name: 'Bodyweight',
      category: 'Bodyweight',
      backgroundColor: '#9DD4CA',
      imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae',
    };
  };

  const handleDone = async () => {
    const details = getWorkoutDetails();
    await addWorkoutToHistory({
      name: details.name,
      category: details.category,
      backgroundColor: details.backgroundColor,
      imageUrl: details.imageUrl,
      duration: `${minutes} min`,
      exerciseCount: Number(exercises),
    });
    router.replace('/');
  };

  return (
    <SafeAreaView 
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} 
      edges={['top', 'bottom']}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          Congrats!
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
          You completed your daily routine.
        </Text>

        <View style={[styles.summaryCard, isDark ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.summaryTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            ROUTINE SUMMARY
          </Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDark ? styles.darkText : styles.lightText]}>
              Exercises
            </Text>
            <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
              {exercises}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDark ? styles.darkText : styles.lightText]}>
              Minutes
            </Text>
            <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
              {minutes}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.doneButton, isDark ? styles.darkButton : styles.lightButton]}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>DONE</Text>
        </Pressable>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 44,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  darkSubtitle: {
    color: '#8E8E93',
  },
  lightSubtitle: {
    color: '#8E8E93',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  summaryLabel: {
    fontSize: 17,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  doneButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#3B7B8F',
  },
  lightButton: {
    backgroundColor: '#3B7B8F',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
