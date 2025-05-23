
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Layout from '../components/Layout';
import WorkoutHeader from '../components/workouts/WorkoutHeader';
import SearchAndFilter from '../components/workouts/SearchAndFilter';
import WorkoutsList from '../components/workouts/WorkoutsList';
import WorkoutCompleteHandler from '../components/workouts/WorkoutCompleteHandler';
import MachineWorkoutsProvider from '../components/workouts/MachineWorkoutsProvider';
import { WorkoutData } from '@/types/workout';
import { useWorkouts } from '@/hooks/useWorkouts';
import AuthRequiredHandler from '../components/workouts/AuthRequiredHandler';
import { Dumbbell } from 'lucide-react';

const WorkoutsPage = () => {
  const [session, setSession] = useState<any>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutData | null>(null);
  const [machineWorkouts, setMachineWorkouts] = useState<WorkoutData[]>([]);
  
  const {
    loading,
    filteredWorkouts,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    handleDeleteWorkout,
    allWorkouts
  } = useWorkouts(session?.user?.id);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Use authentication handler to manage starting workouts
  const { handleStartWorkout } = AuthRequiredHandler({
    session,
    onStartWorkout: setActiveWorkout
  });

  // Handle when active workout is showing
  if (activeWorkout) {
    return (
      <Layout>
        <div className="pt-12 pb-16 bg-white">
          <WorkoutCompleteHandler
            activeWorkout={activeWorkout}
            session={session}
            onCompleteWorkout={() => setActiveWorkout(null)}
            onCancelWorkout={() => setActiveWorkout(null)}
          />
        </div>
      </Layout>
    );
  }

  // Combine all workouts for display
  const combinedWorkouts = [...filteredWorkouts, ...machineWorkouts.filter(mw => 
    !filteredWorkouts.some(fw => fw.id === mw.id)
  )];

  return (
    <Layout>
      <div className="pt-6 pb-6 bg-gradient-to-br from-purple-500 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-2">
            <Dumbbell className="h-7 w-7 mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Workouts</h1>
          </div>
          <p className="text-base md:text-lg max-w-2xl mb-3">
            Find the perfect workout routine tailored to your fitness goals, including machine-based exercises.
          </p>
          
          {allWorkouts.length > 0 && (
            <div className="mt-4">
              <WorkoutHeader 
                onStartFirstWorkout={(workout) => handleStartWorkout({
                  ...workout,
                  description: workout.description || '',
                  level: workout.level || 'beginner'
                })} 
                firstWorkout={{
                  ...allWorkouts[0],
                  description: allWorkouts[0].description || '',
                  level: allWorkouts[0].level || 'beginner'
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* MachineWorkoutsProvider to fetch and provide machine workouts */}
          <MachineWorkoutsProvider onWorkoutsLoaded={setMachineWorkouts} />
          
          <h2 className="text-2xl font-bold mb-8">All Workouts</h2>
          
          <WorkoutsList 
            workouts={combinedWorkouts}
            onStartWorkout={handleStartWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            userId={session?.user?.id}
            isLoading={loading && machineWorkouts.length === 0}
          />

          <div className="mt-8 text-center">
            <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors">
              View All Workouts
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutsPage;
