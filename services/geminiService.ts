import { GoogleGenAI, Type } from "@google/genai";
import { AdContent, AdPlatform } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to determine the best model for the task
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const generateAdCopy = async (userPrompt: string): Promise<AdContent> => {
  const systemInstruction = `
    You are an expert marketing copywriter for the AdVantage app.
    Your goal is to generate high-converting ad copy based on a user's short command.
    
    1. Analyze the user's intent to determine the best AdPlatform (Instagram, LinkedIn, Google, or Twitter).
    2. Identify the target audience.
    3. Write a catchy headline, persuasive body text, and a strong Call to Action (CTA) in the SAME LANGUAGE as the user's prompt (e.g., if Portuguese, output Portuguese).
    4. Create a detailed English visual description prompt that can be used by an AI image generator to create a stunning visual for this ad.
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "Catchy ad headline" },
          body: { type: Type.STRING, description: "Main ad copy" },
          cta: { type: Type.STRING, description: "Call to action button text" },
          visualPrompt: { type: Type.STRING, description: "Detailed prompt for image generation (in English)" },
          targetAudience: { type: Type.STRING, description: "Identified target audience" },
          platform: { 
            type: Type.STRING, 
            enum: [AdPlatform.INSTAGRAM, AdPlatform.LINKEDIN, AdPlatform.GOOGLE, AdPlatform.TWITTER],
            description: "Best suited platform" 
          }
        },
        required: ["headline", "body", "cta", "visualPrompt", "targetAudience", "platform"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate ad copy.");
  }

  return JSON.parse(response.text) as AdContent;
};

export const generateAdImage = async (visualPrompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image for generation
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { text: visualPrompt }
      ]
    },
    config: {
      // 1:1 aspect ratio is generally good for social ads
      imageConfig: {
        aspectRatio: "1:1" 
      }
    }
  });

  return extractImageFromResponse(response);
};

export const refineAdImage = async (base64Image: string, instructionPrompt: string): Promise<string> => {
  // Remove header if present to get clean base64
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { 
          inlineData: {
            mimeType: 'image/png',
            data: cleanBase64
          }
        },
        { text: instructionPrompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1" 
      }
    }
  });

  return extractImageFromResponse(response);
}

const extractImageFromResponse = (response: any): string => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No content returned from image generation.");
  }

  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in response.");
}