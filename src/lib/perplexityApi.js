/**
 * Service for interacting with the Perplexity API
 */

/**
 * Send a prompt to Perplexity API and get a response
 * 
 * @param {string} prompt - The prompt to send to Perplexity
 * @returns {Promise<any>} - JSON response from Perplexity
 */
export async function queryPerplexity(prompt) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-medium-online',
        messages: [
          { 
            role: 'system', 
            content: 'You are a scientific research assistant that returns accurate, concise responses in JSON format exactly matching the requested structure.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing Perplexity JSON response:', parseError);
      console.debug('Raw content:', content);
      return content; // Return raw content if parsing fails
    }
  } catch (error) {
    console.error('Perplexity API request error:', error);
    throw error;
  }
} 