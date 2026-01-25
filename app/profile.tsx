import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { appearanceMode, updateAppearance, activeTheme, workoutSettings, updateWorkoutSettings } = useApp();

  const isDark = activeTheme === 'dark';

  const handleAppearanceToggle = () => {
    const modes: ('light' | 'dark' | 'automatic')[] = ['light', 'dark', 'automatic'];
    const currentIndex = modes.indexOf(appearanceMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    updateAppearance(modes[nextIndex]);
  };

  const getAppearanceLabel = () => {
    return appearanceMode.charAt(0).toUpperCase() + appearanceMode.slice(1);
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={[styles.closeButton, isDark ? styles.darkButton : styles.lightButton]}
            onPress={() => router.back()}
          >
            <X color={isDark ? '#FFFFFF' : '#000000'} size={24} />
          </Pressable>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>Profile</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark ? styles.darkLabel : styles.lightLabel]}>
              ACCOUNT
            </Text>
            <Pressable
              style={[styles.settingCard, isDark ? styles.darkCard : styles.lightCard]}
              onPress={() => router.push('/account-settings' as any)}
            >
              <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                Account Settings
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark ? styles.darkLabel : styles.lightLabel]}>
              SETTINGS
            </Text>
            <View style={styles.settingsGroup}>
              <Pressable
                style={[styles.settingCard, styles.topCard, isDark ? styles.darkCard : styles.lightCard]}
                onPress={handleAppearanceToggle}
              >
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Appearance
                </Text>
                <Text style={[styles.settingValue, isDark ? styles.darkValue : styles.lightValue]}>
                  {getAppearanceLabel()}
                </Text>
              </Pressable>
              <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />
              <View style={[styles.settingCard, styles.bottomCard, isDark ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Trailing Rest
                </Text>
                <Switch
                  value={workoutSettings.trailingRest}
                  onValueChange={(value) => updateWorkoutSettings({ trailingRest: value })}
                  trackColor={{ false: isDark ? '#39393D' : '#E5E5EA', true: '#34C759' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
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
  closeButton: {
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
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  darkLabel: {
    color: '#8E8E93',
  },
  lightLabel: {
    color: '#8E8E93',
  },
  settingsGroup: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  topCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomCard: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  divider: {
    height: 1,
    marginLeft: 20,
  },
  darkDivider: {
    backgroundColor: '#38383A',
  },
  lightDivider: {
    backgroundColor: '#E5E5EA',
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
  settingValue: {
    fontSize: 17,
  },
  darkValue: {
    color: '#8E8E93',
  },
  lightValue: {
    color: '#8E8E93',
  },
});
