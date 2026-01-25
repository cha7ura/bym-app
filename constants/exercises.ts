export interface Exercise {
  id: string;
  name: string;
  emoji: string;
  description: string;
  thumbnailUrl: string;
  imageUrl: string;
  gifUrl?: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips?: string[];
  modifications?: string[];
  defaultDuration?: number;
  defaultReps?: number;
}

export const EXERCISES: Record<string, Exercise> = {
  'mountain-climbers': {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    emoji: '🧗',
    description: 'A full-body cardio exercise that builds core strength and endurance while elevating your heart rate.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDN4NnRyMWs0Z2VvYnB0MTNkOHF4N2U0cWJ0dGVjN3VqYjQ1OWVwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif',
    muscleGroups: ['core', 'shoulders', 'legs', 'cardio'],
    difficulty: 'beginner',
    instructions: [
      'Start in a high plank position with your hands directly under your shoulders.',
      'Keep your core tight and your body in a straight line from head to heels.',
      'Drive one knee toward your chest, then quickly switch legs.',
      'Continue alternating legs at a quick pace, as if running in place.',
      'Keep your hips level and avoid bouncing your body up and down.',
    ],
    tips: [
      'Keep your head and shoulders relaxed.',
      'Engage your core throughout the movement.',
      'Breathe steadily - exhale as you drive each knee forward.',
    ],
    modifications: [
      'Slow down the pace for a lower intensity option.',
      'Step your feet instead of jumping for a gentler variation.',
      'Place hands on an elevated surface to reduce difficulty.',
    ],
    defaultDuration: 20,
  },
  'jumping-jacks': {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    emoji: '🤸',
    description: 'A classic cardio exercise that works the whole body and improves cardiovascular fitness.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWVvdnRqNGZqMzVqYnN5dWNiZHVjNDN6c2V2NWVhbXU2OGF0ZWZjZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKFe8xHMzUoNqg0/giphy.gif',
    muscleGroups: ['legs', 'shoulders', 'cardio'],
    difficulty: 'beginner',
    instructions: [
      'Stand upright with your legs together and arms at your sides.',
      'Bend your knees slightly and jump into the air.',
      'As you jump, spread your legs shoulder-width apart and stretch your arms out and over your head.',
      'Jump back to the starting position with your legs together and arms at your sides.',
      'Repeat at a steady, rhythmic pace.',
    ],
    tips: [
      'Land softly on the balls of your feet.',
      'Keep your knees slightly bent to absorb impact.',
      'Maintain a consistent rhythm throughout.',
    ],
    modifications: [
      'Step side to side instead of jumping for low impact.',
      'Reduce arm movement if you have shoulder issues.',
      'Half jacks - only raise arms to shoulder height.',
    ],
    defaultDuration: 20,
  },
  'burpees': {
    id: 'burpees',
    name: 'Burpees',
    emoji: '💪',
    description: 'A high-intensity full-body exercise that combines strength training with cardio for maximum calorie burn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnN5dW5iY2VjNnFkcWxjdGZqYnE5YzN6ZGFyaHJxbzRqOWV1NHV4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/23hPPMRgPxbNBlPQe3/giphy.gif',
    muscleGroups: ['full-body', 'chest', 'core', 'legs', 'cardio'],
    difficulty: 'intermediate',
    instructions: [
      'Start standing with your feet shoulder-width apart.',
      'Lower into a squat position and place your hands on the floor.',
      'Kick your feet back into a plank position while keeping your arms extended.',
      'Perform a push-up (optional), then jump your feet back toward your hands.',
      'Explosively jump up with your arms reaching overhead.',
      'Land softly and immediately begin the next repetition.',
    ],
    tips: [
      'Keep your core engaged throughout.',
      'Maintain a steady breathing pattern.',
      'Focus on form over speed when starting out.',
    ],
    modifications: [
      'Skip the push-up for a simpler version.',
      'Step back instead of jumping for lower impact.',
      'Remove the jump at the end for less intensity.',
    ],
    defaultDuration: 20,
  },
  'plank-march': {
    id: 'plank-march',
    name: 'Plank March',
    emoji: '🚶',
    description: 'A core-strengthening exercise that challenges stability while working the shoulders and arms.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['core', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    instructions: [
      'Start in a high plank position with your hands directly under your shoulders.',
      'Keep your core engaged and your body in a straight line.',
      'Lift one hand off the ground and touch your opposite shoulder.',
      'Return your hand to the starting position.',
      'Repeat with the other hand, alternating sides.',
      'Keep your hips stable and avoid rotating your body.',
    ],
    tips: [
      'Focus on keeping your hips level.',
      'Move slowly and with control.',
      'Widen your feet for more stability.',
    ],
    modifications: [
      'Drop to your knees for an easier variation.',
      'Simply hold the plank without the march.',
      'Touch your hip instead of opposite shoulder.',
    ],
    defaultDuration: 20,
  },
  'high-knees': {
    id: 'high-knees',
    name: 'High Knees',
    emoji: '🏃',
    description: 'A cardio exercise that strengthens your legs while improving coordination and getting your heart pumping.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['legs', 'core', 'cardio'],
    difficulty: 'beginner',
    instructions: [
      'Stand with your feet hip-width apart.',
      'Lift one knee toward your chest as high as comfortable.',
      'Quickly switch legs, bringing the other knee up.',
      'Pump your arms in rhythm with your legs.',
      'Continue alternating at a running pace.',
    ],
    tips: [
      'Land on the balls of your feet.',
      'Keep your chest up and core engaged.',
      'Aim to get your knees to hip height.',
    ],
    modifications: [
      'March in place instead of running.',
      'Hold onto a wall for balance support.',
      'Reduce the pace for lower intensity.',
    ],
    defaultDuration: 20,
  },
  'squat-jumps': {
    id: 'squat-jumps',
    name: 'Squat Jumps',
    emoji: '🦵',
    description: 'An explosive plyometric exercise that builds lower body power and burns calories.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['legs', 'glutes', 'cardio'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower into a squat position, keeping your weight in your heels.',
      'Explosively jump up, extending your legs fully.',
      'Land softly and immediately lower back into the squat.',
      'Repeat for the desired number of reps.',
    ],
    tips: [
      'Land softly with bent knees.',
      'Keep your knees tracking over your toes.',
      'Swing your arms for momentum.',
    ],
    modifications: [
      'Do regular squats without the jump.',
      'Add a small hop instead of a full jump.',
      'Hold weights for added resistance.',
    ],
    defaultDuration: 20,
  },
  'push-ups': {
    id: 'push-ups',
    name: 'Push-Ups',
    emoji: '💪',
    description: 'The classic upper body exercise that builds chest, shoulder, and tricep strength.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    difficulty: 'beginner',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Keep your body in a straight line from head to heels.',
      'Lower your chest toward the floor by bending your elbows.',
      'Push back up to the starting position.',
      'Keep your core engaged throughout the movement.',
    ],
    tips: [
      'Keep your elbows at a 45-degree angle.',
      'Don\'t let your hips sag or pike up.',
      'Fully extend your arms at the top.',
    ],
    modifications: [
      'Do knee push-ups for easier variation.',
      'Incline push-ups with hands on elevated surface.',
      'Decline push-ups for more difficulty.',
    ],
    defaultReps: 10,
  },
  'lunges': {
    id: 'lunges',
    name: 'Lunges',
    emoji: '🦿',
    description: 'A lower body exercise that targets quads, hamstrings, and glutes while improving balance.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['legs', 'glutes', 'core'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet hip-width apart.',
      'Step forward with one leg, lowering your hips.',
      'Both knees should bend to about 90 degrees.',
      'Push back to the starting position.',
      'Alternate legs or complete all reps on one side.',
    ],
    tips: [
      'Keep your front knee over your ankle.',
      'Keep your torso upright.',
      'Don\'t let your back knee touch the ground.',
    ],
    modifications: [
      'Hold onto something for balance.',
      'Do reverse lunges instead.',
      'Add weights for more challenge.',
    ],
    defaultReps: 10,
  },
  'plank': {
    id: 'plank',
    name: 'Plank',
    emoji: '🧘',
    description: 'An isometric core exercise that builds stability and strengthens the entire midsection.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['core', 'shoulders', 'back'],
    difficulty: 'beginner',
    instructions: [
      'Start on your forearms and toes.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core and glutes.',
      'Hold the position for the desired time.',
      'Don\'t let your hips drop or pike up.',
    ],
    tips: [
      'Look at the floor to keep your neck neutral.',
      'Breathe steadily throughout.',
      'Squeeze your glutes for stability.',
    ],
    modifications: [
      'Drop to your knees for easier version.',
      'Do high plank on hands instead of forearms.',
      'Add leg lifts for more challenge.',
    ],
    defaultDuration: 30,
  },
  'bicycle-crunches': {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    emoji: '🚴',
    description: 'A dynamic core exercise that targets the abs and obliques through a twisting motion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ctdvuel9senhh3bkig9kb',
    muscleGroups: ['core', 'obliques'],
    difficulty: 'beginner',
    instructions: [
      'Lie on your back with hands behind your head.',
      'Lift your shoulders off the ground.',
      'Bring one knee toward your chest while extending the other leg.',
      'Twist to bring your opposite elbow toward the bent knee.',
      'Alternate sides in a pedaling motion.',
    ],
    tips: [
      'Don\'t pull on your neck.',
      'Keep your lower back pressed into the floor.',
      'Move with control, not speed.',
    ],
    modifications: [
      'Keep feet on the floor and just do the twist.',
      'Don\'t fully extend the leg.',
      'Slow down the movement.',
    ],
    defaultDuration: 20,
  },
  'kettlebell-swing': {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    emoji: '🏋️',
    description: 'A powerful hip-hinge movement that builds posterior chain strength and cardiovascular endurance.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6wd0oy3nu3ql6mio5448m',
    muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet slightly wider than hip-width apart.',
      'Hold the kettlebell with both hands, arms extended.',
      'Hinge at the hips, swinging the kettlebell between your legs.',
      'Drive your hips forward explosively to swing the kettlebell up.',
      'Let the kettlebell swing to chest height, then control it back down.',
    ],
    tips: [
      'Power comes from the hips, not the arms.',
      'Keep your core engaged throughout.',
      'Don\'t squat - this is a hip hinge movement.',
    ],
    modifications: [
      'Use a lighter weight to learn the movement.',
      'Do kettlebell deadlifts first to learn hip hinge.',
      'Single-arm swings for variety.',
    ],
    defaultReps: 15,
  },
  'goblet-squat': {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    emoji: '🏆',
    description: 'A kettlebell squat variation that builds leg strength while improving squat form.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6wd0oy3nu3ql6mio5448m',
    muscleGroups: ['legs', 'glutes', 'core'],
    difficulty: 'beginner',
    instructions: [
      'Hold the kettlebell at chest level with both hands.',
      'Stand with feet slightly wider than shoulder-width.',
      'Squat down, keeping your chest up and elbows inside your knees.',
      'Lower until your thighs are parallel to the ground or below.',
      'Push through your heels to stand back up.',
    ],
    tips: [
      'Keep the weight close to your chest.',
      'Push your knees out as you descend.',
      'Keep your back straight throughout.',
    ],
    modifications: [
      'Use a lighter weight or no weight.',
      'Squat to a box or chair.',
      'Add a pause at the bottom.',
    ],
    defaultReps: 12,
  },
};

export const getExerciseByName = (name: string): Exercise | undefined => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
  return EXERCISES[normalizedName];
};

export const getExerciseByEmoji = (emoji: string): Exercise | undefined => {
  return Object.values(EXERCISES).find(ex => ex.emoji === emoji);
};

export const getExercisesByDifficulty = (difficulty: Exercise['difficulty']): Exercise[] => {
  return Object.values(EXERCISES).filter(ex => ex.difficulty === difficulty);
};

export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return Object.values(EXERCISES).filter(ex => ex.muscleGroups.includes(muscleGroup));
};
