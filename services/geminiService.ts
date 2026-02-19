
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Lazy initialization of GoogleGenAI to avoid error when API key is missing
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `
You are the "Home of Electronics" Principal Tech Consultant. 
Your tone is sophisticated, expert, and efficient.

Role Responsibilities:
1. Provide deep technical insights on the following inventory: ${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, category: p.category, price: p.price, specs: p.specs })), null, 2)}
2. Explain the benefits of M3 architecture, sensor sizes in cameras, and high-impedance audio.
3. Suggest perfect ecosystem pairings (e.g., matching a MacBook with high-end headphones).
4. Guide the user through the checkout via WhatsApp feature if they seem ready to buy.
5. Currency: Rwandan Franc (Rwf).
6. Location: Around Makuza Peace plaza, Kigali, Rwanda.
7. Payment: Momo Pay, Airtel Money, Cash, Visa/Mastercard.

Style Guide:
- Use bullet points for comparisons.
- Keep responses under 150 words.
- Use bold text for product names.
- Be extremely helpful but maintain a professional distance.
`;

export async function getAIResponse(userPrompt: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Node Failure:", error);
    return "Protocol Error: Unable to sync with the Tech Core. Please retry connection.";
  }
}

export async function getProductSuggestion(productName: string, specs: any) {
  try {
    const ai = getAI();
    const prompt = `As a tech expert, briefly suggest why someone should buy the ${productName} based on these specs: ${JSON.stringify(specs)}. Focus on the "purpose" (e.g., for gaming, professional work, or daily use). Keep it under 40 words.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    return "This device is a top-tier choice for your digital lifestyle.";
  }
}
