import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function LibraryScreen() {
  const router = useRouter();
  const { activeTheme, favorites, workoutHistory } = useApp();
  const isDark = activeTheme === 'dark';

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const recentHistory = workoutHistory.slice(0, 5);

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
              My Library
            </Text>
          </View>

          {favorites.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
                MY FAVORITES
              </Text>
              
              <View style={styles.favoritesGrid}>
                {favorites.map((workout) => (
                  <Pressable
                    key={workout.id}
                    style={[styles.favoriteCard, isDark ? styles.darkCard : styles.lightCard]}
                    android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                    onPress={() => {
                      const originalName = workout.originalName || workout.name;
                      const methodName = workout.methodName || 'Default';
                      
                      router.push({
                        pathname: '/workout-setup' as any,
                        params: {
                          workoutName: originalName,
                          methodName: methodName,
                          totalMinutes: workout.duration?.replace(/[^0-9]/g, '') || '10',
                        }
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.favoriteIconContainer,
                        { backgroundColor: workout.backgroundColor || '#9DD4CA' },
                      ]}
                    >
                      <Image
                        source={{ uri: workout.imageUrl || 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae' }}
                        style={styles.favoriteImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.favoriteName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
                      {workout.name}
                    </Text>
                    <View style={styles.favoriteMeta}>
                      <Text style={styles.favoriteDuration}>
                        {workout.duration?.toUpperCase() || '8 MINUTES'}
                      </Text>
                      <Heart color="#E53935" size={14} fill="#E53935" />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              MY HISTORY
            </Text>

            {workoutHistory.length === 0 ? (
              <View style={[styles.emptyState, isDark ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.emptyText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                  No workout history yet
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {recentHistory.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.historyItem}
                    android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}
                    onPress={() => {
                      if (item.name === 'The Solo' || item.name === 'The Dual') {
                        router.push({
                          pathname: '/workout-methods' as any,
                          params: { workoutName: item.name }
                        });
                      } else {
                        router.push({
                          pathname: '/workout-setup' as any,
                          params: {
                            workoutName: item.name,
                            methodName: 'Default',
                            totalMinutes: '10',
                          }
                        });
                      }
                    }}
                  >
                    <View style={styles.historyImageContainer}>
                      <Image
                        source={{ uri: item.imageUrl || 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae' }}
                        style={styles.historyImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={[styles.historyName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={[styles.historyTime, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                        {getRelativeTime(new Date(item.completedAt)).toUpperCase()}
                      </Text>
                    </View>
                  </Pressable>
                ))}
                
                {workoutHistory.length > 5 && (
                  <Pressable 
                    style={[styles.viewMoreButton, isDark ? styles.darkViewMore : styles.lightViewMore]}
                    onPress={() => router.push('/library/history' as any)}
                  >
                    <Text style={[styles.viewMoreText, isDark ? styles.darkText : styles.lightText]}>
                      View More
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  darkSubtext: {
    color: '#8E8E93',
  },
  lightSubtext: {
    color: '#8E8E93',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 1,
    marginBottom: 20,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favoriteCard: {
    width: '48%',
    aspectRatio: 1.1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  favoriteIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  favoriteImage: {
    width: 70,
    height: 70,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  favoriteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteDuration: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: '#E53935',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  historyImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
  historyInfo: {
    flex: 1,
    gap: 4,
  },
  historyName: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  historyTime: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  viewMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 8,
    borderWidth: 1,
  },
  darkViewMore: {
    borderColor: '#3A3A3C',
  },
  lightViewMore: {
    borderColor: '#E5E5EA',
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
});
