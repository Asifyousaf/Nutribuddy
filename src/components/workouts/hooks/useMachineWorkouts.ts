
import { useState, useEffect } from 'react';
import { fetchExercisesFromWger, transformWgerExercise } from '@/services/wgerApiService';
import { getBestExerciseImageUrlSync, getExerciseYoutubeIdSync } from '@/utils/exerciseImageUtils';
import { predefinedMachineWorkouts, dynamicMachineWorkoutTemplates } from '../machineWorkoutData';
import { WorkoutData } from '@/types/workout';
import { Exercise } from '@/types/exercise';
import { batchFetchExerciseVideos } from '@/utils/youtubeApiUtils';

export const useMachineWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>(predefinedMachineWorkouts.map(workout => ({
    ...workout,
    type: 'machine' // Ensure all predefined workouts have the type property
  })) as WorkoutData[]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch machine exercises from API and create workouts
  useEffect(() => {
    const fetchMachineExercises = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Fetch a larger set of exercises to filter through
        const exercises = await fetchExercisesFromWger(2, 100);
        
        if (!exercises || exercises.length === 0) {
          console.log('No exercises found from API');
          setLoadingError('No exercises found from the API');
          setIsLoading(false);
          return;
        }
        
        // Transform and filter for machine exercises
        const machineExercises = exercises
          .map(transformWgerExercise)
          .filter((ex: Exercise) => ex.isMachineExercise);
        
        if (machineExercises.length === 0) {
          console.log('No machine exercises found');
          // Don't set an error here, we'll just use predefined workouts
          setIsLoading(false);
          return;
        }
        
        console.log('Found machine exercises:', machineExercises.length);
        
        // Pre-fetch YouTube videos for exercises
        const videoMap = await batchFetchExerciseVideos(machineExercises);
        console.log('Pre-fetched video IDs:', Object.keys(videoMap).length);
        
        // Create workouts based on templates
        const apiWorkouts = dynamicMachineWorkoutTemplates.map(template => {
          // Filter exercises based on template criteria
          const filteredExercises = machineExercises.filter((ex: Exercise) => {
            const matchesEquipment = template.equipmentKeywords.some(keyword => 
              ex.equipment?.toLowerCase().includes(keyword) || 
              ex.machineType?.toLowerCase().includes(keyword)
            );
            
            const matchesBodyPart = template.bodyPartKeywords.some(keyword =>
              ex.bodyPart?.toLowerCase().includes(keyword) ||
              ex.target?.toLowerCase().includes(keyword)
            );
            
            return matchesEquipment && matchesBodyPart;
          });
          
          // Take a subset of exercises up to maxExercises and add YouTube IDs
          const workoutExercises = filteredExercises
            .slice(0, template.maxExercises)
            .map((ex: Exercise) => {
              // Get YouTube ID from our pre-fetched map or try to get one
              const youtubeId = videoMap[ex.name] || getExerciseYoutubeIdSync({
                name: ex.name,
                equipment: ex.equipment,
                bodyPart: ex.bodyPart,
                target: ex.target
              });
              
              return {
                ...ex,
                sets: 3,
                reps: 12,
                duration: ex.duration || 60,
                restTime: ex.restTime || 60,
                youtubeId: youtubeId || '',
                id: ex.id || `exercise-${Math.random().toString(36).substring(2, 9)}`,
                secondaryMuscles: ex.secondaryMuscles || []
              };
            });
          
          // If we don't have enough exercises, skip this template
          if (workoutExercises.length < 3) {
            return null; // Skip this template as we don't have enough exercises
          }
          
          return {
            ...template,
            exercises: workoutExercises,
            image: getBestExerciseImageUrlSync(workoutExercises[0]),
            type: 'machine' // Ensure type property is added
          };
        }).filter(Boolean) as WorkoutData[]; // Filter out nulls and cast to WorkoutData[]
        
        // Combine with predefined workouts - ensure all have proper type
        if (apiWorkouts && apiWorkouts.length > 0) {
          const predefinedWithType = predefinedMachineWorkouts.map(workout => ({
            ...workout,
            type: 'machine'
          })) as WorkoutData[];
          
          setWorkouts([...predefinedWithType, ...apiWorkouts]);
        }
      } catch (error) {
        console.error('Error fetching machine exercises:', error);
        setLoadingError('Failed to load machine workouts. Using default workouts instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMachineExercises();
  }, []);

  // Process workouts to ensure they have proper images and YouTube IDs
  const processedWorkouts = workouts.map(workout => {
    // Ensure all exercises have YouTube IDs
    if (workout.exercises && Array.isArray(workout.exercises)) {
      const updatedExercises = workout.exercises.map(exercise => {
        if (exercise && !exercise.youtubeId && typeof exercise === 'object') {
          // Try to get a YouTube ID for this exercise
          const youtubeId = getExerciseYoutubeIdSync({
            name: exercise.name,
            equipment: exercise.equipment,
            bodyPart: exercise.bodyPart,
            target: exercise.target
          });
          
          return {
            ...exercise,
            youtubeId: youtubeId || '',
            id: exercise.id || `exercise-${Math.random().toString(36).substring(2, 9)}`,
            secondaryMuscles: exercise.secondaryMuscles || []
          };
        }
        return exercise;
      });
      
      workout = {
        ...workout,
        exercises: updatedExercises
      };
    }
    
    // Get first exercise for thumbnail if not already set
    if (!workout.image && workout.exercises && Array.isArray(workout.exercises) && workout.exercises.length > 0) {
      const firstExercise = workout.exercises[0];
      return {
        ...workout,
        type: workout.type || 'machine', // Ensure type property is set
        image: getBestExerciseImageUrlSync(firstExercise)
      };
    }
    return {
      ...workout,
      type: workout.type || 'machine' // Ensure type property is set
    };
  });

  return {
    workouts: processedWorkouts,
    isLoading,
    loadingError
  };
};

