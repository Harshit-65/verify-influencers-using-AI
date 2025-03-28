/**
 * Service for interacting with the Google Gemini API
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Send a prompt to Gemini API and get a response
 * 
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<any>} - JSON response from Gemini
 */
export async function queryGemini(prompt) {
  try {
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    
    // Try to parse as JSON
    try {
      // Clean the response - remove any code block markers that might be present
      const cleanedResponse = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini JSON response:', parseError);
      console.debug('Raw Gemini response:', rawResponse);
      return rawResponse; // Return raw text if parsing fails
    }
  } catch (error) {
    console.error('Gemini API request error:', error);
    throw error;
  }
} 