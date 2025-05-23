export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  instructions: string[];
  gifUrl?: string; // Field for exercise animation
  bodyPart?: string; // Added property
  target?: string; // Added property
  equipment?: string; // Added property
  type?: string; // Added property
  id: string; // Added required property
  secondaryMuscles: string[]; // Added required property
  youtubeId?: string; // Added for YouTube videos
  wikiImageUrl?: string; // Added for wiki images
  isMachineExercise?: boolean;
  machineType?: string;
  muscleWikiId?: string;
  displayPreference?: 'video' | 'photo' | 'auto';
}

export interface WorkoutExercisesData {
  isWorkoutPack?: boolean;
  originalWorkouts?: WorkoutData[];
  list?: Exercise[];
  [key: string]: any;
}

export interface WorkoutData {
  id: string;
  title: string;
  type: string;
  description?: string;
  level?: string;
  duration: number;
  calories_burned: number;
  caloriesBurn?: number;
  exercises: Exercise[] | WorkoutExercisesData;
  image?: string;
  user_id?: string;
  created_at?: string;
  date?: string;
  isPack?: boolean;
  packItems?: WorkoutData[];
  name?: string;
  sets?: number;
  reps?: number;
  restTime?: number;
  instructions?: string[];
}

// Add WorkoutDataExtended interface for database operations
export interface WorkoutDataExtended extends Omit<WorkoutData, 'exercises'> {
  exercises?: Exercise[] | WorkoutExercisesData | Json | null;
  // Any additional fields that might come from the database
  [key: string]: any;
}

export interface WorkoutPlan extends Omit<WorkoutData, 'caloriesBurn'> {
  caloriesBurn: number;
}
