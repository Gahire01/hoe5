import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
    return null;
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

// Fallback responses when AI is unavailable
function fallbackResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();
  if (lower.includes('iphone') || lower.includes('apple')) {
    return "iPhone 15 Pro Max features a titanium body and A17 Pro chip – perfect for pro users.";
  }
  if (lower.includes('macbook') || lower.includes('laptop')) {
    return "The MacBook Pro M3 Max offers incredible performance for video editing and development.";
  }
  if (lower.includes('headphone') || lower.includes('audio')) {
    return "Sony WH-1000XM5 are industry leaders in noise cancellation – ideal for travel.";
  }
  if (lower.includes('compare') || lower.includes('versus')) {
    return "You can compare up to 3 products using the comparison tool. Click the 'compare' icon on any product card.";
  }
  if (lower.includes('payment') || lower.includes('pay')) {
    return "We accept MOMO Pay, Airtel Money, Visa, Mastercard, and cash on delivery.";
  }
  return "I'm your Tech Architect. How can I assist you today?";
}

export async function getAIResponse(userPrompt: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = getAI();
    if (!ai) return fallbackResponse(userPrompt);
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
    return fallbackResponse(userPrompt);
  }
}

export async function getProductSuggestion(productName: string, specs: any) {
  try {
    const ai = getAI();
    if (!ai) return fallbackResponse(`suggest ${productName}`);
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
    return fallbackResponse(productName);
  }
}
