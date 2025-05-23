
import React from 'react';
import { useMachineWorkouts } from './hooks/useMachineWorkouts';
import MachineWorkoutList from './MachineWorkoutList';
import { WorkoutData } from '@/types/workout';

interface MachineWorkoutsProps {
  onStartWorkout: (workout: WorkoutData) => void;
}

const MachineWorkouts: React.FC<MachineWorkoutsProps> = ({ onStartWorkout }) => {
  const { workouts, isLoading, loadingError } = useMachineWorkouts();
  
  return (
    <MachineWorkoutList 
      workouts={workouts}
      isLoading={isLoading}
      loadingError={loadingError}
      onStartWorkout={onStartWorkout}
    />
  );
};

export default MachineWorkouts;
