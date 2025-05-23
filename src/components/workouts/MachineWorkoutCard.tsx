
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { WorkoutData } from '@/types/workout';

interface MachineWorkoutCardProps {
  workout: WorkoutData;
  onStart: (workout: WorkoutData) => void;
}

const MachineWorkoutCard: React.FC<MachineWorkoutCardProps> = ({ workout, onStart }) => {
  return (
    <Card key={workout.id} className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img 
          src={workout.image || 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif'} 
          alt={`${workout.title} thumbnail`} 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif';
          }}
        />
      </div>
      <CardHeader>
        <CardTitle>{workout.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-3">{workout.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{workout.level?.charAt(0).toUpperCase() + workout.level?.slice(1) || 'Beginner'}</span>
          <span>{workout.duration} min</span>
          <span>{workout.calories_burned} cal</span>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Equipment:</h4>
          <ul className="text-sm text-gray-600">
            {Array.isArray(workout.exercises) && Array.from(new Set(workout.exercises.map((e: any) => 
              e.machineType || e.equipment || e.name.split(' ')[0]))).map((equipment: string, i: number) => (
              <li key={i}>• {equipment}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onStart(workout)}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Start Workout <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MachineWorkoutCard;
