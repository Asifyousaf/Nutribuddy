
export interface Exercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  type?: string;
  wikiImageUrl?: string;  // Added for Wiki API images
  youtubeId?: string;     // Added for YouTube videos
  displayPreference?: 'video' | 'photo' | 'auto';  // Added for display preference
  isMachineExercise?: boolean; // Added to identify machine exercises
  machineType?: string; // Type of machine (treadmill, cable machine, etc)
  muscleWikiId?: string; // ID for MuscleWiki API
}
