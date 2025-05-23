
import React from 'react';
import { Loader2 } from 'lucide-react';
import { WorkoutData } from '@/types/workout';
import MachineWorkoutCard from './MachineWorkoutCard';

interface MachineWorkoutListProps {
  workouts: WorkoutData[];
  isLoading: boolean;
  loadingError: string | null;
  onStartWorkout: (workout: WorkoutData) => void;
}

const MachineWorkoutList: React.FC<MachineWorkoutListProps> = ({
  workouts,
  isLoading,
  loadingError,
  onStartWorkout
}) => {
  return (
    <div className="space-y-4">
      {loadingError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">{loadingError}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mr-2" />
          <p>Loading machine workouts...</p>
        </div>
      ) : workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <MachineWorkoutCard
              key={workout.id}
              workout={workout}
              onStart={onStartWorkout}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No machine workouts available. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default MachineWorkoutList;
