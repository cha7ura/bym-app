import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Exercise } from '@/constants/exercises';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.90;
const DISMISS_THRESHOLD = 120;

interface ExerciseInfoPanelProps {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface TimelineItemProps {
  text: string;
  isLast: boolean;
}

interface TimelineItemPropsExtended extends TimelineItemProps {
  isDark: boolean;
}

function TimelineItem({ text, isLast, isDark }: TimelineItemPropsExtended) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, isDark && styles.timelineDotDark]} />
        {!isLast && <View style={[styles.timelineLine, isDark && styles.timelineLineDark]} />}
      </View>
      <Text style={[styles.timelineText, isDark && styles.timelineTextDark]}>{text}</Text>
    </View>
  );
}

export default function ExerciseInfoPanel({
  exercise,
  visible,
  onClose,
  isDark,
}: ExerciseInfoPanelProps) {
  const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const closePanel = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: PANEL_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setScrollOffset(0);
    });
  }, [translateY, backdropOpacity, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (scrollOffset <= 0 && gestureState.dy > 10) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        setIsScrolling(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsScrolling(false);
        if (gestureState.dy > DISMISS_THRESHOLD || gestureState.vy > 0.5) {
          closePanel();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 12,
          }).start();
        }
      },
    })
  ).current;

  const openPanel = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  useEffect(() => {
    if (visible) {
      openPanel();
    }
  }, [visible, openPanel]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  if (!visible || !exercise) return null;

  const tips = exercise.tips || [];
  const modifications = exercise.modifications || [];

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={closePanel} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          isDark && styles.panelDark,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable style={styles.closeButton} onPress={closePanel}>
          <View style={styles.closeButtonInner}>
            <X color="#FFFFFF" size={20} strokeWidth={2.5} />
          </View>
        </Pressable>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContentContainer}
          onScroll={handleScroll}
          scrollEnabled={!isScrolling}
        >
          <View style={[styles.imageContainer, isDark && styles.imageContainerDark]}>
            <Image
              source={{ uri: exercise.imageUrl }}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.contentContainer, isDark && styles.contentContainerDark]}>
            <Text style={[styles.exerciseName, isDark && styles.exerciseNameDark]}>{exercise.name}</Text>

            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>INSTRUCTIONS</Text>
            <View style={styles.timelineContainer}>
              {exercise.instructions.map((instruction, index) => (
                <TimelineItem
                  key={`instruction-${index}`}
                  text={instruction}
                  isLast={index === exercise.instructions.length - 1}
                  isDark={isDark}
                />
              ))}
            </View>

            {tips.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>TIPS</Text>
                <View style={styles.timelineContainer}>
                  {tips.map((tip, index) => (
                    <TimelineItem
                      key={`tip-${index}`}
                      text={tip}
                      isLast={index === tips.length - 1}
                      isDark={isDark}
                    />
                  ))}
                </View>
              </>
            )}

            {modifications.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>MODIFICATIONS</Text>
                <View style={styles.timelineContainer}>
                  {modifications.map((mod, index) => (
                    <TimelineItem
                      key={`mod-${index}`}
                      text={mod}
                      isLast={index === modifications.length - 1}
                      isDark={isDark}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  backdropPressable: {
    flex: 1,
  },
  panel: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    height: PANEL_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 24,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    zIndex: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(142, 142, 147, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 50,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F5F5F7',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  exerciseName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#000000',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    marginBottom: 16,
    marginTop: 8,
    color: '#B5A48B',
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D4C8B8',
    backgroundColor: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8E0D5',
    minHeight: 40,
  },
  timelineText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#3C3C3C',
    paddingBottom: 16,
    marginLeft: 8,
  },
  panelDark: {
    backgroundColor: '#1C1C1E',
  },
  imageContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  contentContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  exerciseNameDark: {
    color: '#FFFFFF',
  },
  sectionTitleDark: {
    color: '#A89880',
  },
  timelineDotDark: {
    borderColor: '#5A5A5E',
    backgroundColor: '#1C1C1E',
  },
  timelineLineDark: {
    backgroundColor: '#3A3A3C',
  },
  timelineTextDark: {
    color: '#E5E5E7',
  },
});
