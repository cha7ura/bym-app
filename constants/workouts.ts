export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutCategory = 'bodyweight' | 'kettlebell' | 'barbell' | 'jump-rope';

export interface RoutineExercise {
  exerciseId: string;
  duration?: number;
  reps?: number;
  restAfter?: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  rounds: number;
  restBetweenRounds: number;
  restBetweenExercises: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  thumbnailUrl: string;
  imageUrl: string;
  estimatedMinutes: number;
  hasMethods?: boolean;
  routines: WorkoutRoutine[];
}

export interface WorkoutCategoryData {
  id: WorkoutCategory;
  name: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
}

export const WORKOUT_CATEGORIES: WorkoutCategoryData[] = [
  {
    id: 'bodyweight',
    name: 'Bodyweight',
    description: 'No equipment needed. Train anywhere, anytime.',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0q7kiokrkgr5he4s6kcae',
    backgroundColor: '#9DD4CA',
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell',
    description: 'Build strength and endurance with kettlebell workouts.',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6wd0oy3nu3ql6mio5448m',
    backgroundColor: '#B4D99A',
  },
  {
    id: 'barbell',
    name: 'Barbell',
    description: 'Classic strength training with barbells.',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5qrea6ccfu3qhns255dkq',
    backgroundColor: '#9FCDE8',
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    description: 'Cardio and coordination training with jump rope.',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jabpfxof17tftuwdb5mz7',
    backgroundColor: '#FFB4A2',
  },
];

export const WORKOUTS: Record<string, Workout> = {
  'the-solo': {
    id: 'the-solo',
    name: 'The Solo',
    description: 'A single-exercise focused workout. Perfect for mastering one movement at a time.',
    category: 'bodyweight',
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    estimatedMinutes: 20,
    hasMethods: true,
    routines: [
      {
        id: 'solo-incremental',
        name: 'Incremental',
        description: 'Gradually build intensity with increasing rounds.',
        exercises: [
          { exerciseId: 'mountain-climbers', duration: 20 },
        ],
        rounds: 20,
        restBetweenRounds: 40,
        restBetweenExercises: 0,
      },
      {
        id: 'solo-minimal-rest',
        name: 'Minimal Rest',
        description: 'Challenge yourself with shorter rest periods.',
        exercises: [
          { exerciseId: 'mountain-climbers', duration: 20 },
        ],
        rounds: 8,
        restBetweenRounds: 20,
        restBetweenExercises: 0,
      },
    ],
  },
  'the-dual': {
    id: 'the-dual',
    name: 'The Dual',
    description: 'Two exercises per round for a balanced workout.',
    category: 'bodyweight',
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800',
    estimatedMinutes: 40,
    hasMethods: true,
    routines: [
      {
        id: 'dual-incremental',
        name: 'Incremental',
        description: 'Build endurance with two alternating exercises.',
        exercises: [
          { exerciseId: 'mountain-climbers', duration: 20 },
          { exerciseId: 'jumping-jacks', duration: 20 },
        ],
        rounds: 20,
        restBetweenRounds: 40,
        restBetweenExercises: 40,
      },
      {
        id: 'dual-minimal-rest',
        name: 'Minimal Rest',
        description: 'High intensity with minimal breaks.',
        exercises: [
          { exerciseId: 'mountain-climbers', duration: 20 },
          { exerciseId: 'jumping-jacks', duration: 20 },
        ],
        rounds: 20,
        restBetweenRounds: 20,
        restBetweenExercises: 20,
      },
    ],
  },
  'the-trio': {
    id: 'the-trio',
    name: 'The Trio',
    description: 'Three exercises per round for a complete bodyweight circuit.',
    category: 'bodyweight',
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    estimatedMinutes: 10,
    hasMethods: false,
    routines: [
      {
        id: 'trio-default',
        name: 'Default',
        description: 'Three challenging exercises in rotation.',
        exercises: [
          { exerciseId: 'burpees', duration: 20 },
          { exerciseId: 'jumping-jacks', duration: 20 },
          { exerciseId: 'plank-march', duration: 20 },
        ],
        rounds: 5,
        restBetweenRounds: 20,
        restBetweenExercises: 20,
      },
    ],
  },
  'the-quad': {
    id: 'the-quad',
    name: 'The Quad',
    description: 'Four exercises per round for a full-body challenge.',
    category: 'bodyweight',
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800',
    estimatedMinutes: 15,
    hasMethods: false,
    routines: [
      {
        id: 'quad-default',
        name: 'Default',
        description: 'Four exercises targeting the whole body.',
        exercises: [
          { exerciseId: 'burpees', duration: 20 },
          { exerciseId: 'high-knees', duration: 20 },
          { exerciseId: 'squat-jumps', duration: 20 },
          { exerciseId: 'plank-march', duration: 20 },
        ],
        rounds: 4,
        restBetweenRounds: 30,
        restBetweenExercises: 15,
      },
    ],
  },
  'bear-crawl-walk': {
    id: 'bear-crawl-walk',
    name: 'Bear Crawl & Walk',
    description: 'A mobility-focused workout combining bear crawls with walking exercises.',
    category: 'bodyweight',
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    estimatedMinutes: 10,
    hasMethods: false,
    routines: [
      {
        id: 'bear-crawl-default',
        name: 'Default',
        exercises: [
          { exerciseId: 'mountain-climbers', duration: 30 },
          { exerciseId: 'plank-march', duration: 30 },
        ],
        rounds: 4,
        restBetweenRounds: 30,
        restBetweenExercises: 15,
      },
    ],
  },
  'ladder-burpees': {
    id: 'ladder-burpees',
    name: 'Ladder Burpees',
    description: 'Progressive burpee workout with increasing reps each round.',
    category: 'bodyweight',
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    estimatedMinutes: 12,
    hasMethods: false,
    routines: [
      {
        id: 'ladder-burpees-default',
        name: 'Default',
        exercises: [
          { exerciseId: 'burpees', duration: 30 },
        ],
        rounds: 6,
        restBetweenRounds: 30,
        restBetweenExercises: 0,
      },
    ],
  },
  'kettlebell-foundation': {
    id: 'kettlebell-foundation',
    name: 'Kettlebell Foundation',
    description: 'Essential kettlebell movements for building a strong foundation.',
    category: 'kettlebell',
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800',
    estimatedMinutes: 20,
    hasMethods: false,
    routines: [
      {
        id: 'kb-foundation-default',
        name: 'Default',
        exercises: [
          { exerciseId: 'kettlebell-swing', reps: 15 },
          { exerciseId: 'goblet-squat', reps: 12 },
        ],
        rounds: 5,
        restBetweenRounds: 60,
        restBetweenExercises: 30,
      },
    ],
  },
  'kettlebell-power': {
    id: 'kettlebell-power',
    name: 'Kettlebell Power',
    description: 'High-intensity kettlebell workout for building explosive power.',
    category: 'kettlebell',
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=200',
    imageUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800',
    estimatedMinutes: 25,
    hasMethods: false,
    routines: [
      {
        id: 'kb-power-default',
        name: 'Default',
        exercises: [
          { exerciseId: 'kettlebell-swing', reps: 20 },
          { exerciseId: 'goblet-squat', reps: 15 },
          { exerciseId: 'burpees', duration: 30 },
        ],
        rounds: 4,
        restBetweenRounds: 45,
        restBetweenExercises: 20,
      },
    ],
  },
};

export const getWorkoutsByCategory = (category: WorkoutCategory): Workout[] => {
  return Object.values(WORKOUTS).filter(w => w.category === category);
};

export const getWorkoutsByDifficulty = (difficulty: WorkoutDifficulty): Workout[] => {
  return Object.values(WORKOUTS).filter(w => w.difficulty === difficulty);
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return WORKOUTS[id];
};

export const getCategoryData = (category: WorkoutCategory): WorkoutCategoryData | undefined => {
  return WORKOUT_CATEGORIES.find(c => c.id === category);
};

export const getWorkoutRoutine = (workoutId: string, routineName: string): WorkoutRoutine | undefined => {
  const workout = WORKOUTS[workoutId];
  if (!workout) return undefined;
  return workout.routines.find(r => r.name === routineName);
};

export const calculateWorkoutDuration = (routine: WorkoutRoutine): number => {
  let totalSeconds = 0;
  
  routine.exercises.forEach((ex, index) => {
    if (ex.duration) {
      totalSeconds += ex.duration;
    } else if (ex.reps) {
      totalSeconds += ex.reps * 3;
    }
    
    if (index < routine.exercises.length - 1) {
      totalSeconds += routine.restBetweenExercises;
    }
  });
  
  const roundTime = totalSeconds;
  const totalTime = (roundTime * routine.rounds) + (routine.restBetweenRounds * (routine.rounds - 1));
  
  return Math.ceil(totalTime / 60);
};
