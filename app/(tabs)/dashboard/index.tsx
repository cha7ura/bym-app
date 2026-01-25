import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { Flame, Trophy, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

type TabType = 'stats' | 'history';

export default function DashboardScreen() {
  const router = useRouter();
  const { activeTheme, workoutHistory, getStreakData } = useApp();
  const isDark = activeTheme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const streakData = getStreakData();

  const now = new Date();
  const isCurrentMonth = currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear();

  const earliestWorkoutMonth = useMemo(() => {
    if (workoutHistory.length === 0) return null;
    const dates = workoutHistory.map(w => new Date(w.completedAt));
    const earliest = dates.reduce((min, d) => d < min ? d : min, dates[0]);
    return new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  }, [workoutHistory]);

  const canGoToPrevMonth = useMemo(() => {
    if (!earliestWorkoutMonth) return false;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth >= earliestWorkoutMonth;
  }, [currentMonth, earliestWorkoutMonth]);

  const getLastWorkoutText = () => {
    if (workoutHistory.length === 0) return 'No workouts yet';
    const lastWorkout = new Date(workoutHistory[0].completedAt);
    const now = new Date();
    const diffMs = now.getTime() - lastWorkout.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const workoutDays = new Set<number>();
    workoutHistory.forEach(workout => {
      const date = new Date(workout.completedAt);
      if (date.getMonth() === month && date.getFullYear() === year) {
        workoutDays.add(date.getDate());
      }
    });

    return { daysInMonth, startDayOfWeek, workoutDays };
  }, [currentMonth, workoutHistory]);

  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [];
    const { daysInMonth, startDayOfWeek, workoutDays } = calendarData;

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasWorkout = workoutDays.has(day);
      const isToday = 
        day === new Date().getDate() && 
        currentMonth.getMonth() === new Date().getMonth() &&
        currentMonth.getFullYear() === new Date().getFullYear();

      days.push(
        <View key={day} style={styles.calendarDay}>
          <View style={[
            styles.dayCircle,
            hasWorkout && styles.workoutDay,
            isToday && !hasWorkout && (isDark ? styles.todayDark : styles.todayLight),
          ]}>
            <Text style={[
              styles.dayText,
              isDark ? styles.darkText : styles.lightText,
              hasWorkout && styles.workoutDayText,
            ]}>
              {day}
            </Text>
          </View>
        </View>
      );
    }

    return days;
  };

  const filteredHistory = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return workoutHistory.filter(workout => {
      const date = new Date(workout.completedAt);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [currentMonth, workoutHistory]);

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            Dashboard
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <View style={[styles.tabBar, isDark ? styles.darkTabBar : styles.lightTabBar]}>
            <Pressable
              style={[styles.tab, activeTab === 'stats' && (isDark ? styles.activeTabDark : styles.activeTabLight)]}
              onPress={() => setActiveTab('stats')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'stats' 
                  ? (isDark ? styles.activeTabTextDark : styles.activeTabTextLight)
                  : (isDark ? styles.inactiveTabTextDark : styles.inactiveTabTextLight)
              ]}>
                Stats
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'history' && (isDark ? styles.activeTabDark : styles.activeTabLight)]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'history' 
                  ? (isDark ? styles.activeTabTextDark : styles.activeTabTextLight)
                  : (isDark ? styles.inactiveTabTextDark : styles.inactiveTabTextLight)
              ]}>
                History
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeTab === 'stats' ? (
            <View style={styles.statsContainer}>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}>
                  <Flame color="#FF6B35" size={28} />
                  <Text style={[styles.statValue, isDark ? styles.darkText : styles.lightText]}>
                    {streakData.currentStreak}
                  </Text>
                  <Text style={[styles.statLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                    Active Streak
                  </Text>
                </View>
                <View style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}>
                  <Trophy color="#FFD700" size={28} />
                  <Text style={[styles.statValue, isDark ? styles.darkText : styles.lightText]}>
                    {streakData.longestStreak}
                  </Text>
                  <Text style={[styles.statLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                    Longest Streak
                  </Text>
                </View>
                <View style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}>
                  <Calendar color="#4CAF50" size={28} />
                  <Text style={[styles.statValue, isDark ? styles.darkText : styles.lightText]}>
                    {streakData.totalDays}
                  </Text>
                  <Text style={[styles.statLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                    Days Completed
                  </Text>
                </View>
                <View style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}>
                  <Clock color="#2196F3" size={28} />
                  <Text style={[styles.statValue, isDark ? styles.darkText : styles.lightText]}>
                    {getLastWorkoutText()}
                  </Text>
                  <Text style={[styles.statLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                    Last Workout
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.historyContainer}>
              <View style={[styles.calendarCard, isDark ? styles.darkCard : styles.lightCard]}>
                <View style={styles.calendarHeader}>
                  <Pressable 
                    onPress={canGoToPrevMonth ? goToPrevMonth : undefined} 
                    style={[styles.monthButton, !canGoToPrevMonth && styles.disabledButton]}
                    disabled={!canGoToPrevMonth}
                  >
                    <ChevronLeft color={canGoToPrevMonth ? (isDark ? '#FFFFFF' : '#000000') : (isDark ? '#3A3A3C' : '#C7C7CC')} size={24} />
                  </Pressable>
                  <Text style={[styles.monthTitle, isDark ? styles.darkText : styles.lightText]}>
                    {monthYear}
                  </Text>
                  <Pressable 
                    onPress={!isCurrentMonth ? goToNextMonth : undefined} 
                    style={[styles.monthButton, isCurrentMonth && styles.disabledButton]}
                    disabled={isCurrentMonth}
                  >
                    <ChevronRight color={!isCurrentMonth ? (isDark ? '#FFFFFF' : '#000000') : (isDark ? '#3A3A3C' : '#C7C7CC')} size={24} />
                  </Pressable>
                </View>
                <View style={styles.weekDaysRow}>
                  {weekDays.map(day => (
                    <Text key={day} style={[styles.weekDayText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.calendarGrid}>
                  {renderCalendarDays()}
                </View>
              </View>

              <View style={styles.historySection}>
                <Text style={[styles.historySectionTitle, isDark ? styles.darkText : styles.lightText]}>
                  Workouts in {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                </Text>
                {filteredHistory.length === 0 ? (
                  <View style={[styles.emptyHistory, isDark ? styles.darkCard : styles.lightCard]}>
                    <Text style={[styles.emptyText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                      No workouts this month
                    </Text>
                  </View>
                ) : (
                  <View style={styles.historyListContainer}>
                    {filteredHistory.map((item, index) => (
                      <Pressable
                        key={item.id}
                        style={styles.historyItemRow}
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
                        <View style={styles.historyItemInfo}>
                          <Text style={[styles.historyItemName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={[styles.historyItemTime, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                            {new Date(item.completedAt).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            }).toUpperCase()}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  tabContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  darkTabBar: {
    backgroundColor: '#1C1C1E',
  },
  lightTabBar: {
    backgroundColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabDark: {
    backgroundColor: '#3A3A3C',
  },
  activeTabLight: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  activeTabTextDark: {
    color: '#FFFFFF',
  },
  activeTabTextLight: {
    color: '#000000',
  },
  inactiveTabTextDark: {
    color: '#8E8E93',
  },
  inactiveTabTextLight: {
    color: '#636366',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    paddingTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
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
  historyContainer: {
    paddingTop: 8,
    gap: 24,
  },
  calendarCard: {
    borderRadius: 16,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDay: {
    backgroundColor: '#4CAF50',
  },
  todayDark: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  todayLight: {
    borderWidth: 1,
    borderColor: '#000000',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  workoutDayText: {
    color: '#FFFFFF',
  },
  historySection: {
    gap: 12,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  emptyHistory: {
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
  historyListContainer: {
    gap: 16,
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  historyImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  historyImage: {
    width: 60,
    height: 60,
  },
  historyItemInfo: {
    flex: 1,
    gap: 4,
  },
  historyItemName: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  historyItemTime: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
