
const YOUTUBE_API_KEY = 'AIzaSyASn_PHG4VCpNEMGGhrKEgzvP8_Vi8sZ5o';

/**
 * Fetches YouTube videos based on search query
 * @param query Search term
 * @param maxResults Maximum number of results to return
 * @returns Promise with search results
 */
export const searchYouTubeVideos = async (query: string, maxResults: number = 5) => {
  try {
    console.log(`Searching YouTube for: "${query}" (max results: ${maxResults})`);
    
    // Updated to include videoEmbeddable=true parameter
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.items?.length || 0} videos for query "${query}"`);
    
    // Filter videos to ensure they're embeddable and not live broadcasts
    const filteredItems = data.items.filter((item: any) => 
      item.snippet.liveBroadcastContent === 'none'
    );
    
    return filteredItems.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

/**
 * Gets a YouTube video ID for a specific exercise
 * @param exerciseInfo Exercise information
 * @returns Promise with YouTube video ID
 */
export const getExerciseYouTubeVideo = async (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): Promise<string | null> => {
  try {
    // Construct a specific query for better results
    let query = exerciseInfo.name;
    if (exerciseInfo.equipment && exerciseInfo.equipment !== 'body weight') {
      query += ` ${exerciseInfo.equipment}`;
    }
    if (exerciseInfo.target) {
      query += ` ${exerciseInfo.target} muscle`;
    }
    query += ' exercise proper form';
    
    console.log(`Searching for exercise video with query: "${query}"`);
    // Increased to try to find at least one good video
    const videos = await searchYouTubeVideos(query, 3);
    
    if (videos.length > 0) {
      console.log(`Found video ID ${videos[0].id} for exercise ${exerciseInfo.name}`);
      return videos[0].id;
    } else {
      console.log(`No videos found for exercise ${exerciseInfo.name}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting exercise YouTube video:', error);
    return null;
  }
};

/**
 * Batch pre-fetch YouTube videos for multiple exercises
 * @param exercises List of exercises
 * @returns Promise with mapping of exercise name to YouTube ID
 */
export const batchFetchExerciseVideos = async (exercises: any[]): Promise<{[key: string]: string}> => {
  console.log(`Batch fetching videos for ${exercises.length} exercises`);
  const videoMap: {[key: string]: string} = {};
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);
    const promises = batch.map(exercise => 
      getExerciseYouTubeVideo(exercise)
        .then(videoId => {
          if (videoId) {
            videoMap[exercise.name] = videoId;
          }
        })
    );
    
    // Wait for batch to complete
    await Promise.all(promises);
    console.log(`Completed batch ${Math.floor(i/batchSize) + 1}, found ${Object.keys(videoMap).length} videos so far`);
    
    // Add small delay between batches to avoid rate limiting
    if (i + batchSize < exercises.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Completed batch fetch, found ${Object.keys(videoMap).length} videos total`);
  return videoMap;
};

/**
 * Searches YouTube for workout videos based on a query
 * @param query Search query
 * @returns Promise with search results
 */
export const searchWorkoutVideos = async (query: string): Promise<any[]> => {
  try {
    const searchQuery = `${query} workout fitness exercise`;
    console.log(`Searching for workout videos with query: "${searchQuery}"`);
    
    // Use the updated search function that ensures videos are embeddable
    const videos = await searchYouTubeVideos(searchQuery, 8);
    return videos;
  } catch (error) {
    console.error('Error searching workout videos:', error);
    return [];
  }
};

/**
 * Verifies if a YouTube video ID is valid and embeddable
 * @param videoId The YouTube video ID to verify
 * @returns Promise with boolean indicating if video is valid
 */
export const verifyYouTubeVideo = async (videoId: string): Promise<boolean> => {
  if (!videoId) return false;
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if video exists and is embeddable
    if (data.items && data.items.length > 0) {
      return data.items[0].status.embeddable === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying YouTube video:', error);
    return false;
  }
};

/**
 * Gets popular workout videos for different categories
 * @returns Promise with popular workout videos by category
 */
export const getPopularWorkoutVideos = async (): Promise<{[key: string]: any[]}> => {
  const categories = [
    {name: 'HIIT', query: 'HIIT workout'},
    {name: 'Strength', query: 'strength training workout'},
    {name: 'Cardio', query: 'cardio workout'},
    {name: 'Yoga', query: 'yoga fitness'}
  ];
  
  const results: {[key: string]: any[]} = {};
  
  for (const category of categories) {
    try {
      const videos = await searchYouTubeVideos(category.query, 3);
      results[category.name] = videos;
    } catch (error) {
      console.error(`Error fetching ${category.name} videos:`, error);
      results[category.name] = [];
    }
    
    // Add small delay between categories to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};

// A set of proven working YouTube video IDs for exercises as fallbacks
export const fallbackExerciseVideos = {
  'push up': 'IODxDxX7oi4',
  'squat': 'gsNoPYwWXeE',
  'plank': 'pSHjTRCQxIw',
  'deadlift': 'ytGaGIn3SjE',
  'bench press': 'rT7DgCr-3pg',
  'pull up': 'eGo4IYlbE5g',
  'lunge': 'QOVaHwm-Q6U',
  'bicep curl': 'ykJmrZ5v0Oo',
  'tricep extension': 'nRiJVZDpdL0',
  'shoulder press': 'qEwKCR5JCog',
  'leg press': 'IZxQVV3E7nE',
  'lat pulldown': 'CAwf7n6Luuc',
  'crunches': 'Xyd_fa5zoEU',
  'mountain climber': 'hZb6jTbCLeE',
  'jumping jacks': '2W4ZNSwoW_4',
  'russian twist': '-BzNffL_6YE',
  'burpee': 'TU8QYVW0gDU',
  'push ups': 'ba8tr1NzwXU',
  'air squats': 'CsPAsICeRsM',
  'general workout': 'UBMk30rjy0o',
  'full body': 'oAPCPjnU1wA',
  'beginner workout': 'gC_L9qAHVJ8',
  'home workout': 'sKHz-V1n6KA'
};

/**
 * Gets a verified YouTube video ID, with fallbacks
 * @param exerciseName The name of the exercise
 * @returns A verified YouTube video ID or null
 */
export const getVerifiedYouTubeId = async (exerciseName: string): Promise<string | null> => {
  const normalizedName = exerciseName.toLowerCase();
  
  // First check our fallback list
  for (const [key, videoId] of Object.entries(fallbackExerciseVideos)) {
    if (normalizedName.includes(key)) {
      const isValid = await verifyYouTubeVideo(videoId);
      if (isValid) return videoId;
    }
  }
  
  // If no match or invalid, use a general workout video as ultimate fallback
  return fallbackExerciseVideos['general workout'];
};
