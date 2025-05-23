
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sample fitness YouTube videos for post enrichment - known to be working and embeddable
const fitnessYouTubeVideos = [
  { id: "IODxDxX7oi4", title: "Perfect Push Up Form" },
  { id: "gsNoPYwWXeE", title: "Proper Squat Technique" },
  { id: "ytGaGIn3SjE", title: "Deadlift Tutorial" },
  { id: "rT7DgCr-3pg", title: "Bench Press Guide" },
  { id: "eGo4IYlbE5g", title: "Pull Up Progression" },
  { id: "QOVaHwm-Q6U", title: "Lunge Variations" },
  { id: "ykJmrZ5v0Oo", title: "Bicep Curl Form" },
  { id: "nRiJVZDpdL0", title: "Tricep Extensions" },
  { id: "qEwKCR5JCog", title: "Shoulder Press Technique" },
  { id: "ba8tr1NzwXU", title: "Perfect Push-ups" },
  { id: "CsPAsICeRsM", title: "How To Improve Squat Form" },
  { id: "hZb6jTbCLeE", title: "How to Do Mountain Climbers" },
  { id: "-BzNffL_6YE", title: "STOP Doing Russian Twists Like This!" },
  { id: "TU8QYVW0gDU", title: "How To Do A Perfect Burpee" },
  { id: "2W4ZNSwoW_4", title: "How To Do Jumping Jacks Properly" },
  { id: "UBMk30rjy0o", title: "20 Minute Full Body Workout - No Equipment Needed" },
  { id: "oAPCPjnU1wA", title: "30 Minute Full Body Workout" },
  { id: "gC_L9qAHVJ8", title: "20 Min Full Body Workout for Beginners" },
  { id: "sKHz-V1n6KA", title: "30 Min Full Body Home Workout" }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client with Deno.env
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    console.log("Community posts function invoked");
    
    const { action, post } = await req.json();
    console.log(`Action requested: ${action}`);

    // Handle different actions
    if (action === "list") {
      console.log("Listing posts");
      // Try to fetch posts directly from the database
      try {
        const { data, error } = await supabaseClient
          .from('posts')
          .select('*, profiles:user_id(full_name, avatar_url, username)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Enrich posts with fitness YouTube videos if they don't have images
        const enrichedPosts = (data || []).map(post => {
          if (!post.image_url && !post.video_id) {
            // Add a random fitness video to posts without images or videos
            const randomVideo = fitnessYouTubeVideos[Math.floor(Math.random() * fitnessYouTubeVideos.length)];
            return {
              ...post,
              video_id: randomVideo.id,
              video_title: randomVideo.title
            };
          }
          return post;
        });

        return new Response(JSON.stringify(enrichedPosts || []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error(`Error listing posts: ${JSON.stringify(error, null, 2)}`);
        throw error;
      }
    } else if (action === "create") {
      console.log("Creating post", post);
      
      // Get authenticated user
      const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
      
      if (authError || !session) {
        throw new Error("Authentication required to create posts");
      }
      
      // Add user_id to post data
      const postData = {
        ...post,
        user_id: session.user.id
      };
      
      // Add a fitness video to post if no image and it mentions workout/fitness
      if (!postData.image_url && 
          (postData.content?.toLowerCase().includes('workout') || 
           postData.content?.toLowerCase().includes('exercise') ||
           postData.content?.toLowerCase().includes('fitness'))) {
        
        // Select a video that's relevant to the content if possible
        let selectedVideo = null;
        const content = postData.content.toLowerCase();
        
        if (content.includes('push') || content.includes('chest')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('push'));
        } else if (content.includes('squat') || content.includes('legs')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('squat'));
        } else if (content.includes('deadlift') || content.includes('back')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('deadlift'));
        } else if (content.includes('bench') || content.includes('chest')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('bench'));
        } else if (content.includes('pull up') || content.includes('back')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('pull up'));
        } else if (content.includes('beginner')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('beginner'));
        } else if (content.includes('full body')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('full body'));
        } else if (content.includes('home')) {
          selectedVideo = fitnessYouTubeVideos.find(v => v.title.toLowerCase().includes('home'));
        }
        
        // If no specific match, use a random video
        if (!selectedVideo) {
          selectedVideo = fitnessYouTubeVideos[Math.floor(Math.random() * fitnessYouTubeVideos.length)];
        }
        
        postData.video_id = selectedVideo.id;
        postData.video_title = selectedVideo.title;
      }
      
      // Insert the post
      const { data, error } = await supabaseClient
        .from('posts')
        .insert(postData)
        .select('*')
        .single();
        
      if (error) throw error;
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (action === "like") {
      // Handle like action
      if (!post || !post.id) {
        throw new Error("Post ID required to like a post");
      }

      // Update the post likes count
      const { data, error } = await supabaseClient
        .rpc('increment_likes', { post_id: post.id });

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ success: true, message: "Like updated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error(`Function error: ${error}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
