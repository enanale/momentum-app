import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {VertexAI} from "@google-cloud/vertexai";

// Initialize Vertex AI
const vertexAi = new VertexAI({
  project: process.env.GCLOUD_PROJECT || 'momentum-app-65c5d',
  location: "us-central1",
});

const model = "gemini-2.0-flash-001";

const generativeModel = vertexAi.getGenerativeModel({
  model: model,
  generationConfig: {
    "maxOutputTokens": 256,
    "temperature": 0.8,
    "topP": 0.95,
  },
});

interface RequestData {
  title: string;
  description?: string;
}

export const getAiSuggestions = onCall<RequestData>(async (request) => {
  logger.info("getAiSuggestions called", {data: request.data});

  const {title, description} = request.data;

  if (!title) {
    throw new HttpsError(
      "invalid-argument",
      'The function must be called with a "title" argument.',
    );
  }

  const prompt = `
    A user is feeling stuck on a task. Help them break it down into a tiny, concrete, physical first step.

    Task Title: "${title}"
    Additional Context: ${description || "None"}

    Based on this, suggest exactly three distinct, small, physical next actions a person could take in the next 5-15 minutes.
    Return the suggestions as a JSON array of strings, like this: ["suggestion 1", "suggestion 2", "suggestion 3"]
    The suggestions should be concise and start with an action verb.
    Do not include any other text, just the JSON array.
  `;

  try {
    const resp = await generativeModel.generateContent(prompt);
    const content = resp.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      logger.error("No content returned from Gemini API");
      throw new HttpsError("internal", "Failed to get suggestions.");
    }

    logger.info("Raw response from Gemini", {content});

    // The model sometimes returns the JSON wrapped in markdown (`json...`).
    // We need to extract the raw JSON array string before parsing.
    const startIndex = content.indexOf('[');
    const endIndex = content.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
      logger.error("Could not find JSON array in the response from Gemini.", {content});
      throw new HttpsError("internal", "Failed to parse suggestions from AI response.");
    }

    const jsonString = content.substring(startIndex, endIndex + 1);
    logger.info("Attempting to parse cleaned JSON string", {jsonString});
    const suggestions = JSON.parse(jsonString);

    if (!Array.isArray(suggestions)) {
      throw new Error("Response is not a JSON array.");
    }

    return {suggestions};
  } catch (error) {
    logger.error("Error calling Gemini API", {error});
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "An unexpected error occurred.");
  }
});
