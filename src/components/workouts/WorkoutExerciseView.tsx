
import React from 'react';
import { Exercise } from '@/types/exercise';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pause, Play } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import ExerciseInstructions from './ExerciseInstructions';
import ExerciseDemonstration from './ExerciseDemonstration';

interface WorkoutExerciseViewProps {
  exercise: Exercise;
  currentSet: number;
  totalSets: number;
  remainingSeconds: number;
  isRest: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onComplete: () => void;
  nextExercises?: Exercise[];
}

const WorkoutExerciseView: React.FC<WorkoutExerciseViewProps> = ({
  exercise,
  currentSet,
  totalSets,
  remainingSeconds,
  isRest,
  isPaused,
  onTogglePause,
  onComplete,
  nextExercises = []
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <ExerciseDemonstration 
            exercise={exercise}
            isRest={isRest}
            currentSet={currentSet}
            totalSets={totalSets}
          />
        </div>
        
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{isRest ? 'Rest' : exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {!isRest && (
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Set</span>
                    <span className="font-semibold">{currentSet} / {totalSets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reps</span>
                    <span className="font-semibold">{exercise.reps}</span>
                  </div>
                  {exercise.machineType && (
                    <div className="flex justify-between text-sm">
                      <span>Machine Type</span>
                      <span className="font-semibold">{exercise.machineType}</span>
                    </div>
                  )}
                </div>
              )}
              
              <TimerDisplay 
                remainingSeconds={remainingSeconds} 
                isPaused={isPaused}
                isRest={isRest}
              />
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={onTogglePause} 
                  variant="outline" 
                  className="flex-1"
                >
                  {isPaused ? <Play className="mr-1 h-4 w-4" /> : <Pause className="mr-1 h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button 
                  onClick={onComplete} 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isRest ? 'Skip Rest' : currentSet < totalSets ? 'Next Set' : 'Complete'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Next up exercises section */}
          {nextExercises && nextExercises.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Coming Up Next</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {nextExercises.map((nextEx, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded overflow-hidden mr-2 flex-shrink-0">
                        {nextEx.gifUrl && (
                          <img 
                            src={nextEx.gifUrl} 
                            alt={nextEx.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium truncate">{nextEx.name}</p>
                        <p className="text-xs text-gray-500">{nextEx.sets} sets × {nextEx.reps} reps</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {!isRest && (
        <ExerciseInstructions exercise={exercise} />
      )}
    </div>
  );
};

export default WorkoutExerciseView;
