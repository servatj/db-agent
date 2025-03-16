const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get a response from the OpenAI API
 * @param {string} systemPrompt - The system prompt to guide the AI
 * @param {string} userPrompt - The user prompt to get a response for
 * @returns {Promise<string>} - The AI response
 */
async function getCompletion(systemPrompt, userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting completion from OpenAI:', error);
    throw error;
  }
}

module.exports = {
  getCompletion
}; 