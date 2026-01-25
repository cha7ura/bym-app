import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  backgroundColor: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Barbell',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5qrea6ccfu3qhns255dkq',
    backgroundColor: '#9FCDE8',
  },
  {
    id: '2',
    name: 'Bodyweight',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae',
    backgroundColor: '#9DD4CA',
  },
  {
    id: '3',
    name: 'Kettlebell',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6wd0oy3nu3ql6mio5448m',
    backgroundColor: '#B4D99A',
  },
  {
    id: '4',
    name: 'Jump Rope',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jabpfxof17tftuwdb5mz7',
    backgroundColor: '#B4D99A',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { activeTheme } = useApp();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const isDark = activeTheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <Text style={[styles.dateLabel, isDark ? styles.darkLabel : styles.lightLabel]}>
                {monthDay.toUpperCase()}
              </Text>
              <Text style={[styles.dayName, isDark ? styles.darkText : styles.lightText]}>
                {dayName}
              </Text>
            </View>
            <Pressable
              style={[styles.profileButton, isDark ? styles.darkButton : styles.lightButton]}
              onPress={() => router.push('/profile' as any)}
            >
              <User color={isDark ? '#FFFFFF' : '#000000'} size={28} />
            </Pressable>
          </View>

          <View style={styles.warmUpSection}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              WARM UP
            </Text>
            <Pressable
              style={[styles.warmUpCard, isDark ? styles.darkCard : styles.lightCard]}
              android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
            >
              <View style={[styles.warmUpIconContainer, { backgroundColor: '#FFB4A2' }]}>
                <Image
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae' }}
                  style={styles.warmUpImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.warmUpName, isDark ? styles.darkText : styles.lightText]}>
                Warm Up
              </Text>
            </Pressable>
          </View>

          <View style={styles.categorySection}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              BROWSE BY CATEGORY
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[styles.categoryCard, isDark ? styles.darkCard : styles.lightCard]}
                  android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                  onPress={() => {
                    if (category.name === 'Bodyweight') {
                      router.push({
                        pathname: '/workout-detail' as any,
                        params: { categoryName: category.name }
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      { backgroundColor: category.backgroundColor },
                    ]}
                  >
                    <Image
                      source={{ uri: category.imageUrl }}
                      style={styles.categoryImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.categoryName, isDark ? styles.darkText : styles.lightText]}>
                    {category.name}
                  </Text>
                </Pressable>
              ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  dateContainer: {
    gap: 4,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  darkLabel: {
    color: '#8E8E93',
  },
  lightLabel: {
    color: '#8E8E93',
  },
  dayName: {
    fontSize: 40,
    fontWeight: '700' as const,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  profileButton: {
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
  categorySection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 20,
    letterSpacing: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.4,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  categoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  warmUpSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  warmUpCard: {
    width: '48%',
    aspectRatio: 1.4,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  warmUpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  warmUpImage: {
    width: 80,
    height: 80,
  },
  warmUpName: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});
