
// Service for interacting with the Wger API
const API_BASE_URL = 'https://wger.de/api/v2';
const API_KEY = 'f10575f7561d090a008fe15f94f83d408afefce0'; // This should ideally be in an env variable

export const fetchExercisesFromWger = async (language = 2, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise/?language=${language}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const fetchExerciseImagesFromWger = async () => {
  try {
    // Fetch all exercise images with a higher limit to ensure we get all available images
    const response = await fetch(
      `${API_BASE_URL}/exerciseimage/?limit=300`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise images');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching exercise images:', error);
    throw error;
  }
};

export const fetchExerciseImageFromWger = async (exerciseId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exerciseimage/?exercise=${exerciseId}`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise image');
    }
    
    const data = await response.json();
    // Return the first image URL if available, otherwise null
    return data.results.length > 0 ? data.results[0].image : null;
  } catch (error) {
    console.error(`Error fetching image for exercise ${exerciseId}:`, error);
    return null;
  }
};

export const fetchCategoriesFromWger = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercisecategory/`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchMusclesFromWger = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/muscle/`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch muscles');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching muscles:', error);
    throw error;
  }
};

export const fetchEquipmentFromWger = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/equipment/`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

// Helper function to convert Wger exercise to our Exercise format
export const transformWgerExercise = (wgerExercise: any) => {
  const {
    id,
    name,
    description,
    category,
    muscles,
    muscles_secondary,
    equipment
  } = wgerExercise;

  // Determine if it's a machine exercise based on equipment
  const equipmentList = equipment || [];
  const isMachineExercise = equipmentList.some((item: any) => {
    const equipName = item.name?.toLowerCase() || '';
    return equipName.includes('machine') || 
      equipName.includes('cable') || 
      equipName.includes('treadmill') ||
      equipName.includes('bike') ||
      equipName.includes('elliptical');
  });
  
  // Extract machine type if applicable
  let machineType = '';
  if (isMachineExercise && equipmentList.length > 0) {
    machineType = equipmentList[0].name || '';
  }

  // Extract instructions from description
  const instructions = description
    ? description
        .split(/\r\n|\r|\n/)
        .filter((line: string) => line.trim().length > 0)
    : [];

  return {
    id: String(id),
    name,
    bodyPart: category?.name || '',
    target: muscles && muscles.length > 0 ? muscles[0].name : '',
    equipment: equipmentList.length > 0 ? equipmentList[0].name : '',
    secondaryMuscles: muscles_secondary?.map((m: any) => m.name) || [],
    instructions,
    isMachineExercise,
    machineType,
    sets: 3,
    reps: 12,
    duration: 60,
    restTime: 60
  };
};
