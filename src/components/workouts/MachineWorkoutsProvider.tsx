
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getBestExerciseImageUrlSync } from '@/utils/exerciseImageUtils';
import { fetchExercisesFromWger, transformWgerExercise } from '@/services/wgerApiService';
import { Exercise } from '@/types/exercise';
import { WorkoutData } from '@/types/workout';

// Import predefined workouts from MachineWorkouts
import { predefinedMachineWorkouts, dynamicMachineWorkoutTemplates } from './machineWorkoutData';

interface MachineWorkoutsProviderProps {
  onWorkoutsLoaded: (workouts: WorkoutData[]) => void;
  children?: React.ReactNode;
}

const MachineWorkoutsProvider: React.FC<MachineWorkoutsProviderProps> = ({ 
  onWorkoutsLoaded,
  children 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch machine exercises from API and create workouts
  useEffect(() => {
    const fetchMachineExercises = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Start with predefined workouts
        const allWorkouts = predefinedMachineWorkouts as unknown as WorkoutData[];
        
        // Prepare workouts with images
        const workoutsWithImages = allWorkouts.map(workout => {
          // Get first exercise for thumbnail if not already set
          if (!workout.image && workout.exercises && workout.exercises.length > 0) {
            const firstExercise = workout.exercises[0];
            return {
              ...workout,
              image: getBestExerciseImageUrlSync(firstExercise)
            };
          }
          return workout;
        });
        
        // Notify parent component of the workouts
        onWorkoutsLoaded(workoutsWithImages);
        
        // Now try to fetch additional workouts from API
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
          setIsLoading(false);
          return;
        }
        
        console.log('Found machine exercises:', machineExercises.length);
        
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
          
          // Take a subset of exercises up to maxExercises
          const workoutExercises = filteredExercises
            .slice(0, template.maxExercises)
            .map((ex: Exercise) => ({
              ...ex,
              sets: 3,
              reps: 12,
              duration: ex.duration || 60,
              restTime: ex.restTime || 60
            }));
          
          // If we don't have enough exercises, skip this template
          if (workoutExercises.length < 3) {
            return null; 
          }
          
          return {
            ...template,
            exercises: workoutExercises,
            image: getBestExerciseImageUrlSync(workoutExercises[0]),
            type: 'machine' // Ensure type property is added
          };
        }).filter(Boolean) as unknown as WorkoutData[]; // Cast filtered results to WorkoutData[]
        
        // Combine with predefined workouts
        if (apiWorkouts && apiWorkouts.length > 0) {
          const allApiWorkouts = [...allWorkouts, ...apiWorkouts];
          
          // Notify parent component of the updated workouts
          onWorkoutsLoaded(allApiWorkouts);
        }
      } catch (error) {
        console.error('Error fetching machine exercises:', error);
        setLoadingError('Failed to load additional machine workouts.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMachineExercises();
  }, [onWorkoutsLoaded]);
  
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 text-purple-600 animate-spin mr-2" />
          <p>Loading additional workouts...</p>
        </div>
      )}
      
      {loadingError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-sm">
          <p className="text-yellow-700">{loadingError}</p>
        </div>
      )}
      
      {children}
    </>
  );
};

export default MachineWorkoutsProvider;
