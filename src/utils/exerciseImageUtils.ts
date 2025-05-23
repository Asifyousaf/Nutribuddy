
import { Exercise } from '@/types/exercise';
import { getExerciseYouTubeVideo, fallbackExerciseVideos, verifyYouTubeVideo } from './youtubeApiUtils';

// Cache for YouTube video IDs
const youtubeCache: {[key: string]: string} = {
  // Pre-load with our verified fallback videos
  ...fallbackExerciseVideos
};

// Function to get the best image URL for an exercise
export const getBestExerciseImageUrlSync = (exercise: Exercise | any): string => {
  if (!exercise) return '';
  
  // Prioritize MuscleWiki images if available
  if (exercise.muscleWikiId) {
    return `https://musclewiki.com/media/uploads/${exercise.muscleWikiId}-300.jpg`;
  }
  
  // Use the provided gifUrl if available
  if (exercise.gifUrl) {
    return exercise.gifUrl;
  }
  
  // Fallback to a default image or empty string
  return "https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif";
};

export const getExerciseYoutubeId = async (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): Promise<string | null> => {
  if (!exerciseInfo?.name) return null;
  
  const key = exerciseInfo.name.toLowerCase();
  
  // Check cache first
  if (youtubeCache[key]) {
    console.log(`Using cached YouTube ID for ${exerciseInfo.name}: ${youtubeCache[key]}`);
    // Verify the cached ID is still valid
    const isValid = await verifyYouTubeVideo(youtubeCache[key]);
    if (isValid) {
      return youtubeCache[key];
    } else {
      console.log(`Cached YouTube ID for ${exerciseInfo.name} is no longer valid`);
      delete youtubeCache[key];
    }
  }
  
  try {
    // Get video from YouTube API
    const videoId = await getExerciseYouTubeVideo(exerciseInfo);
    
    if (videoId) {
      // Update cache for future use
      youtubeCache[key] = videoId;
      return videoId;
    }
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
  }
  
  // Fallback to known exercises - check partial matches
  for (const [exercise, videoId] of Object.entries(fallbackExerciseVideos)) {
    if (key.includes(exercise)) {
      youtubeCache[key] = videoId;
      return videoId;
    }
  }
  
  // Ultimate fallback
  if (key.includes('cardio') || key.includes('run')) {
    return fallbackExerciseVideos['general workout'];
  } else if (key.includes('strength')) {
    return fallbackExerciseVideos['full body']; 
  } else {
    return fallbackExerciseVideos['home workout'];
  }
};

// Synchronous version for components that can't use async/await
export const getExerciseYoutubeIdSync = (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): string | null => {
  if (!exerciseInfo?.name) return null;
  
  const key = exerciseInfo.name.toLowerCase();
  
  // Check cache first
  if (youtubeCache[key]) {
    return youtubeCache[key];
  }
  
  // Check for partial matches in our fallbacks
  for (const [exerciseName, videoId] of Object.entries(fallbackExerciseVideos)) {
    if (key.includes(exerciseName)) {
      youtubeCache[key] = videoId;
      return videoId;
    }
  }
  
  // If no match, trigger async fetch for next time
  getExerciseYoutubeId(exerciseInfo).then(videoId => {
    if (videoId) {
      youtubeCache[key] = videoId;
    }
  });
  
  // Return a relevant fallback while the async fetch happens
  if (key.includes('cardio') || key.includes('run')) {
    return fallbackExerciseVideos['general workout'];
  } else if (key.includes('strength')) {
    return fallbackExerciseVideos['full body']; 
  } else {
    return fallbackExerciseVideos['home workout'];
  }
};
