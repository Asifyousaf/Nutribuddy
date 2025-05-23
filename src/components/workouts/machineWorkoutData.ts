
import { WorkoutData } from '@/types/workout';

// Predefined machine workouts for immediate display
export const predefinedMachineWorkouts = [
  {
    id: 'machine-1',
    title: 'Cardio Machine Circuit',
    description: 'A complete cardio workout using various fitness machines',
    duration: 30,
    level: 'beginner',
    calories_burned: 350,
    type: 'machine', // Added required type property
    exercises: [
      {
        name: 'Treadmill Run',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Treadmill',
        youtubeId: 'tRd1e7RpHwQ',
        instructions: ['Start with a 5-minute warm-up at a moderate pace', 'Increase speed for 30 seconds, then recover at moderate pace for 90 seconds', 'Repeat intervals 5 times', 'End with a 1-minute cooldown']
      },
      {
        name: 'Elliptical Trainer',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Elliptical',
        youtubeId: 'xQNX4zvx_HE',
        instructions: ['Maintain a moderate resistance level', 'Focus on pushing and pulling with both arms and legs', 'Keep your core engaged throughout the movement', 'Try to maintain a steady rhythm']
      },
      {
        name: 'Stationary Bike',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Exercise bike',
        youtubeId: 'MXrkeZvt2nQ',
        instructions: ['Start with moderate resistance', 'Increase resistance for 30 seconds, then decrease for 90 seconds of recovery', 'Repeat intervals 5 times', 'Maintain proper posture throughout']
      },
      {
        name: 'Rowing Machine',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Rowing machine',
        youtubeId: '1W_mP_ufb3M',
        instructions: ['Begin with proper form: legs bent, back straight, arms extended', 'Push with legs first, then pull with arms, finish by leaning back slightly', 'Return to starting position by extending arms, leaning forward, then bending knees', 'Maintain a steady rhythm and controlled breathing']
      }
    ]
  },
  {
    id: 'machine-2',
    title: 'Resistance Machine Full Body',
    description: 'Complete full body workout using weight machines',
    duration: 45,
    level: 'intermediate',
    calories_burned: 400,
    type: 'machine', // Added required type property
    exercises: [
      {
        name: 'Leg Press Machine',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        isMachineExercise: true,
        machineType: 'Leg press',
        youtubeId: 'IZxyjW7MPJQ',
        instructions: ['Adjust the seat so your knees are at 90 degrees when in starting position', 'Place feet shoulder-width apart on the platform', 'Push the platform away until legs are extended but not locked', 'Slowly return to starting position']
      },
      {
        name: 'Chest Press Machine',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        isMachineExercise: true,
        machineType: 'Chest press',
        youtubeId: 'xUm0BiZCWlQ',
        instructions: ['Adjust seat height so handles are at chest level', 'Grasp handles with a full grip', 'Push forward until arms are extended but not locked', 'Slowly return to starting position']
      },
      {
        name: 'Lat Pulldown Machine',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        isMachineExercise: true,
        machineType: 'Lat pulldown',
        youtubeId: 'CAwf7n6Luuc',
        instructions: ['Adjust thigh pad for stability', 'Grasp the bar with hands wider than shoulder width', 'Pull the bar down to chest level while keeping back straight', 'Slowly return to starting position with controlled movement']
      },
      {
        name: 'Seated Cable Row',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: 'GZbfZ033f74',
        instructions: ['Sit with knees slightly bent, grasp cable attachment', 'Keep back straight and pull the handle toward your lower abdomen', 'Squeeze shoulder blades together at the end of the movement', 'Slowly extend arms back to starting position']
      },
      {
        name: 'Leg Extension Machine',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        isMachineExercise: true,
        machineType: 'Leg extension',
        youtubeId: 'YyvSfVjQeL0',
        instructions: ['Sit on the machine with back against pad', 'Adjust the pad so it rests on top of your lower shin', 'Extend legs until knees are straight but not locked', 'Slowly lower weight back to starting position']
      }
    ]
  },
  {
    id: 'machine-3',
    title: 'Cable Machine Workout',
    description: 'Multi-joint functional exercises using cable machines',
    duration: 40,
    level: 'advanced',
    calories_burned: 450,
    type: 'machine', // Added required type property
    exercises: [
      {
        name: 'Cable Chest Fly',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: 'WEM9FCIPlxQ',
        instructions: ['Stand in the center of the cable machine with feet shoulder-width apart', 'Hold cable handles with arms extended to sides', 'Bring handles together in front of chest with a slight bend in elbows', 'Slowly return to starting position']
      },
      {
        name: 'Cable Tricep Pushdown',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: '2-LAMcpzODU',
        instructions: ['Stand facing the cable machine with feet shoulder-width apart', 'Grasp the rope attachment with palms facing each other', 'Keep elbows close to body and push down until arms are fully extended', 'Slowly return to starting position']
      },
      {
        name: 'Cable Bicep Curl',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: 'NFzTWp2qpiE',
        instructions: ['Stand facing the cable machine with feet shoulder-width apart', 'Grasp the handle with palms facing up', 'Keep elbows close to sides and curl up toward chest', 'Slowly lower to starting position']
      },
      {
        name: 'Cable Pull Through',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: 'J9KaUQsAyVM',
        instructions: ['Stand facing away from the cable machine with feet shoulder-width apart', 'Bend forward and grasp the rope attachment between legs', 'Keeping back straight, thrust hips forward until standing upright', 'Slowly return to starting position']
      },
      {
        name: 'Cable Wood Chop',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        isMachineExercise: true,
        machineType: 'Cable',
        youtubeId: 'J56VM_RTImQ',
        instructions: ['Stand with side to the cable machine', 'Grasp handle with both hands above shoulder', 'Pull diagonally across body toward opposite knee', 'Control the return to starting position', 'Complete all reps, then switch sides']
      }
    ]
  }
];

// Dynamic machine workouts that will be fetched from API
export const dynamicMachineWorkoutTemplates = [
  {
    id: 'upper-body-machines',
    title: 'Upper Body Machine Circuit',
    description: 'Target all upper body muscles using gym machines',
    duration: 50,
    level: 'intermediate',
    calories_burned: 380,
    type: 'machine', // Added required type property
    equipmentKeywords: ['machine', 'cable', 'press', 'pulldown', 'fly'],
    bodyPartKeywords: ['chest', 'back', 'shoulders', 'arms'],
    maxExercises: 6
  },
  {
    id: 'lower-body-machines',
    title: 'Lower Body Machine Strength',
    description: 'Build lower body strength with gym machines',
    duration: 45,
    level: 'intermediate',
    calories_burned: 420,
    type: 'machine', // Added required type property
    equipmentKeywords: ['machine', 'press', 'extension', 'curl', 'abductor', 'adductor'],
    bodyPartKeywords: ['legs', 'quads', 'hamstrings', 'glutes', 'calves'],
    maxExercises: 5
  },
  {
    id: 'full-body-machine-circuit',
    title: 'Full Body Machine Circuit',
    description: 'Efficient full body workout using various machines',
    duration: 60,
    level: 'beginner',
    calories_burned: 450,
    type: 'machine', // Added required type property
    equipmentKeywords: ['machine', 'cable', 'press', 'pulldown', 'extension'],
    bodyPartKeywords: ['chest', 'back', 'legs', 'shoulders', 'arms'],
    maxExercises: 8
  }
];
