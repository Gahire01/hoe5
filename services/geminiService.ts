import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set. Using fallback responses.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const productIndex = PRODUCTS.reduce((acc, p) => {
  acc[p.name.toLowerCase()] = p;
  return acc;
}, {} as Record<string, typeof PRODUCTS[0]>);

function fallbackResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();
  for (const [name, product] of Object.entries(productIndex)) {
    if (lower.includes(name)) {
      return `${product.name} is ${product.price.toLocaleString()} Rwf. ${product.specs ? 'Specs: ' + Object.entries(product.specs).map(([k,v]) => `${k}:${v}`).join(', ') : ''}`;
    }
  }
  if (lower.includes('iphone')) return "iPhone 15 Pro Max is 1,399,000 Rwf with A17 Pro chip and titanium body.";
  if (lower.includes('macbook')) return "MacBook Pro M3 Max starts at 2,499,000 Rwf with 14‑core CPU.";
  if (lower.includes('payment') || lower.includes('pay')) return "We accept MOMO Pay, Airtel Money, Visa, Mastercard, and cash.";
  if (lower.includes('compare')) return "Use the compare icon on product cards to compare up to 3 items.";
  if (lower.includes('top up') || lower.includes('trade')) return "You can request a top‑up via the 'REQUEST TOP-UP' button.";
  return "I'm your Tech Architect. How can I assist you today?";
}

export async function getAIResponse(userPrompt: string, chatHistory: any[]) {
  try {
    const ai = getAI();
    if (!ai) return fallbackResponse(userPrompt);
    
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert chat history to Gemini format
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });
    
    const response = await result.response;
    return response.text() || fallbackResponse(userPrompt);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return fallbackResponse(userPrompt);
  }
}

export async function getProductSuggestion(productName: string, specs: any) {
  try {
    const ai = getAI();
    if (!ai) return fallbackResponse(productName);
    
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Briefly suggest why someone should buy ${productName} with specs ${JSON.stringify(specs)}. Under 40 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || fallbackResponse(productName);
  } catch (error) {
    console.error("Gemini Suggestion error:", error);
    return fallbackResponse(productName);
  }
}
