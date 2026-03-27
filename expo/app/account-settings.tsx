import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { activeTheme, userProfile, workoutSettings, updateWorkoutSettings } = useApp();

  const isDark = activeTheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={[styles.backButton, isDark ? styles.darkButton : styles.lightButton]}
            onPress={() => router.back()}
          >
            <ChevronLeft color={isDark ? '#FFFFFF' : '#000000'} size={28} />
          </Pressable>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            Account Settings
          </Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable
            style={[styles.settingCard, isDark ? styles.darkCard : styles.lightCard]}
            onPress={() => router.push('/change-name-email' as any)}
          >
            <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
              Change Name & Email
            </Text>
          </Pressable>

          <Text style={[styles.sectionTitle, isDark ? styles.darkLabel : styles.lightLabel]}>
            Workout Settings
          </Text>

          <View style={[styles.settingCard, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Trailing Rest
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.darkLabel : styles.lightLabel]}>
                  Include rest after final exercise
                </Text>
              </View>
              <Switch
                value={workoutSettings.trailingRest}
                onValueChange={(value) => updateWorkoutSettings({ trailingRest: value })}
                trackColor={{ false: '#767577', true: '#3B7B8F' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <Text style={[styles.accountInfo, isDark ? styles.darkLabel : styles.lightLabel]}>
            Logged in as {userProfile.email}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#1C1C1E',
  },
  lightButton: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
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
    paddingTop: 12,
  },
  settingCard: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  settingText: {
    fontSize: 17,
    fontWeight: '500' as const,
  },
  accountInfo: {
    fontSize: 15,
    textAlign: 'center',
  },
  darkLabel: {
    color: '#8E8E93',
  },
  lightLabel: {
    color: '#8E8E93',
  },
});
