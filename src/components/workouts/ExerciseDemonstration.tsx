
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Exercise } from '@/types/exercise';
import { verifyYouTubeVideo, getVerifiedYouTubeId } from '@/utils/youtubeApiUtils';

interface ExerciseDemonstrationProps {
  exercise: Exercise;
  isRest: boolean;
  currentSet?: number;
  totalSets?: number;
  isLoading?: boolean;
  onImageError?: () => void;
  compact?: boolean;
}

const ExerciseDemonstration: React.FC<ExerciseDemonstrationProps> = ({ 
  exercise, 
  isRest,
  currentSet = 1,
  totalSets = 3,
  isLoading = false,
  onImageError,
  compact = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(exercise?.youtubeId || null);
  
  const exerciseName = exercise?.name || 'Exercise';
  const imageUrl = exercise?.gifUrl || '';
  
  // Verify YouTube ID on mount and when it changes
  useEffect(() => {
    if (exercise?.youtubeId) {
      setYoutubeId(exercise.youtubeId);
      setVideoLoading(true);
      setVideoError(false);
      
      // Verify the YouTube ID is valid
      verifyYouTubeVideo(exercise.youtubeId).then(isValid => {
        if (!isValid) {
          console.log(`YouTube video ID ${exercise.youtubeId} for ${exerciseName} is invalid. Finding alternative...`);
          setVideoError(true);
          
          // Try to get a verified YouTube ID
          getVerifiedYouTubeId(exerciseName).then(newId => {
            if (newId) {
              console.log(`Found alternative YouTube ID ${newId} for ${exerciseName}`);
              setYoutubeId(newId);
              setVideoError(false);
            } else {
              setYoutubeId(null);
              setVideoError(true);
            }
          });
        }
      });
    } else {
      // If no YouTube ID provided, try to find one
      getVerifiedYouTubeId(exerciseName).then(newId => {
        if (newId) {
          console.log(`Found YouTube ID ${newId} for ${exerciseName}`);
          setYoutubeId(newId);
        }
      });
    }
  }, [exercise?.youtubeId, exerciseName]);
  
  useEffect(() => {
    // Reset states when imageUrl changes
    if (imageUrl) {
      setImgError(false);
      setIsInitialLoad(true);
    }
    if (youtubeId) {
      setVideoLoading(true);
    }
  }, [imageUrl, youtubeId]);
  
  // Preload image to reduce flicker
  useEffect(() => {
    if (imageUrl && !youtubeId) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setIsInitialLoad(false);
      img.onerror = () => {
        setImgError(true);
        setIsInitialLoad(false);
        if (onImageError) {
          onImageError();
        }
      };
    }
  }, [imageUrl, youtubeId, onImageError]);
  
  const handleImageError = () => {
    if (!imgError) {
      console.log('Image error occurred for:', exerciseName);
      setImgError(true);
      if (onImageError) {
        onImageError();
      }
    }
  };
  
  const handleVideoLoad = () => {
    setVideoLoading(false);
  };
  
  const handleVideoError = () => {
    console.log('Video error occurred for:', exerciseName);
    setVideoError(true);
    
    // Try to get a verified YouTube ID as fallback
    getVerifiedYouTubeId(exerciseName).then(newId => {
      if (newId && newId !== youtubeId) {
        console.log(`Found fallback YouTube ID ${newId} for ${exerciseName}`);
        setYoutubeId(newId);
      } else {
        setYoutubeId(null);
      }
    });
  };
  
  const renderContent = () => {
    if (youtubeId && !videoError) {
      return (
        <div className="relative w-full pb-[56.25%]">
          {videoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-sm text-gray-600">Loading video...</span>
            </div>
          )}
          <iframe 
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}?controls=1&modestbranding=1&rel=0`}
            title={`${exerciseName} demonstration`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
          ></iframe>
        </div>
      );
    }
    
    if (isLoading || isInitialLoad) {
      return (
        <div className="w-full aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Loading exercise demonstration...</span>
          </div>
        </div>
      );
    }

    // For rest periods, display the rest image with special styling
    if (isRest) {
      return (
        <div className="w-full aspect-video flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg relative">
          <img 
            src={imageUrl || "https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif"}
            alt="Rest period" 
            className="w-full h-full object-cover" 
            loading="eager"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center p-4 bg-white/90 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-blue-700">Rest Time</h3>
              <p className="text-gray-700">Take a moment to recover</p>
            </div>
          </div>
        </div>
      );
    }

    if (imgError) {
      return (
        <div className="w-full aspect-video flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <p className="text-gray-500">No demonstration available for {exerciseName}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full aspect-video flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
        <img 
          src={imageUrl}
          alt={`${exerciseName} demonstration`} 
          className="max-w-full h-auto object-contain" 
          loading="eager"
          onError={handleImageError}
        />
      </div>
    );
  };
  
  return (
    <div className={`overflow-hidden rounded-lg bg-white ${compact ? 'min-h-[200px]' : ''}`}>
      <div className="relative bg-gray-100">
        {renderContent()}
        
        {!compact && !isRest && (
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium truncate">{exerciseName}</h3>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                Set {currentSet} of {totalSets}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDemonstration;
