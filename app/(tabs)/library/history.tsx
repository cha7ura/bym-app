import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { activeTheme, workoutHistory } = useApp();
  const isDark = activeTheme === 'dark';

  const groupedHistory = workoutHistory.reduce((groups, item) => {
    const date = new Date(item.completedAt);
    const dateKey = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {} as Record<string, typeof workoutHistory>);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft color={isDark ? '#0A84FF' : '#007AFF'} size={28} />
          </Pressable>
          <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
            Recent History
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {Object.keys(groupedHistory).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                No workout history yet
              </Text>
            </View>
          ) : (
            Object.entries(groupedHistory).map(([date, items]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={[styles.dateHeader, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                  {date}
                </Text>
                <View style={[styles.itemsContainer, isDark ? styles.darkCard : styles.lightCard]}>
                  {items.map((item, index) => (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.historyItem,
                        index < items.length - 1 && styles.historyItemBorder,
                        index < items.length - 1 && (isDark ? styles.darkBorder : styles.lightBorder),
                      ]}
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
                      <View style={[styles.historyImageContainer, { backgroundColor: item.backgroundColor || '#9DD4CA' }]}>
                        <Image
                          source={{ uri: item.imageUrl || 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae' }}
                          style={styles.historyImage}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={[styles.historyTime, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                          {formatTime(item.completedAt)}
                        </Text>
                      </View>
                      <ChevronRight color={isDark ? '#636366' : '#8E8E93'} size={20} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  darkHeader: {
    borderBottomColor: '#38383A',
  },
  lightHeader: {
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  itemsContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  historyItemBorder: {
    borderBottomWidth: 0.5,
  },
  darkBorder: {
    borderBottomColor: '#38383A',
  },
  lightBorder: {
    borderBottomColor: '#E5E5EA',
  },
  historyImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  historyImage: {
    width: 36,
    height: 36,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  historyTime: {
    fontSize: 13,
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
    color: '#636366',
  },
});
