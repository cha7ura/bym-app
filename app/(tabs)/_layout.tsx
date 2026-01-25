import { Tabs } from 'expo-router';
import { Home, Library, BarChart3 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function TabLayout() {
  const { activeTheme } = useApp();
  const isDark = activeTheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderTopColor: isDark ? '#1C1C1E' : '#E5E5EA',
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#000000',
        tabBarInactiveTintColor: isDark ? '#636366' : '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'My Library',
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
