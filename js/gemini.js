/**
 * gemini.js
 * This module provides a simple, reusable function to communicate with the 
 * Google Gemini API. It encapsulates the fetch call and error handling.
 */

/**
 * Sends a prompt to the Gemini API and returns the text response.
 * @param {string} prompt The question or prompt to send to the AI.
 * @returns {Promise<string>} A promise that resolves to the AI's text response.
 */
async function askGemini(prompt) {
    // Check if the API key has been set in config.js
    if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        return "<strong>ERROR:</strong> Gemini API key not found. Please obtain a free key from Google AI Studio and add it to the `js/config.js` file.";
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.5,
            "topP": 0.95,
            "topK": 64,
            "maxOutputTokens": 8192,
            "responseMimeType": "text/plain",
        },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return `<strong>ERROR:</strong> The API returned an error. Status: ${response.status}. Check the developer console for details.`;
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
             return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Invalid response structure from API:", data);
            return "<strong>ERROR:</strong> Received an unexpected or empty response format from the API.";
        }
       
    } catch (error) {
        console.error("Network or fetch error:", error);
        return "<strong>ERROR:</strong> Could not connect to the Gemini API. Check your network connection and the developer console.";
    }
}