import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function ChangeNameEmailScreen() {
  const router = useRouter();
  const { activeTheme, userProfile, updateUserProfile } = useApp();
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  const isDark = activeTheme === 'dark';

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    await updateUserProfile({ name: name.trim(), email: email.trim() });
    Alert.alert('Success', 'Your information has been updated', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

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
            Change Name & Email
          </Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            />
            <TextInput
              style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Pressable style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </View>
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
    paddingTop: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    fontSize: 17,
  },
  darkInput: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600' as const,
  },
});
