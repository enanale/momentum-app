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
  prompt: string;
}

export const getAiSuggestions = onCall<RequestData>(async (request) => {
  logger.info("getAiSuggestions called with new prompt", {data: request.data});

  const {prompt} = request.data;

  if (!prompt) {
    throw new HttpsError(
      "invalid-argument",
      'The function must be called with a "prompt" argument.',
    );
  }

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
