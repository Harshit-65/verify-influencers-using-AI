import { YoutubeTranscript } from "youtube-transcript";

/**
 * Extracts the video ID from a YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
function extractVideoId(url) {
  if (!url) return null;
  
  // Regular expression to match YouTube video IDs from various URL formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

/**
 * Fetches transcript from a YouTube video
 * @param {string} url - YouTube URL
 * @returns {Promise<string>} - Combined transcript text
 */
export async function getYoutubeTranscript(url) {
  try {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      throw new Error("Invalid YouTube URL or could not extract video ID");
    }

    // Try to fetch the transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript available for this video");
    }
    
    // Combine transcript segments into a single text
    return transcript.map(item => item.text).join(" ");
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    throw error;
  }
}

// import { YoutubeTranscript } from "youtube-transcript";

// let transcript = await YoutubeTranscript.fetchTranscript(
//   "https://www.youtube.com/watch?v=208SF_RRA44"
// );

// const fullText = transcript.map((item) => item.text).join(" ");
// console.log("Full transcript text:", fullText);
