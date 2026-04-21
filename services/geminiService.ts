import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "../constants";
import { supabase } from "../supabase";

let aiInstance: GoogleGenerativeAI | null = null;

function getAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set. Using fallback responses.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  return aiInstance;
}

const productIndex = PRODUCTS.reduce((acc, p) => {
  acc[p.name.toLowerCase()] = p;
  return acc;
}, {} as Record<string, typeof PRODUCTS[0]>);

type StoreProduct = {
  name: string;
  price: number;
  category: string;
  specs?: Record<string, string>;
};

let storeCache: StoreProduct[] | null = null;
let storeCacheAt = 0;

async function getStoreProducts(): Promise<StoreProduct[]> {
  if (storeCache && Date.now() - storeCacheAt < 2 * 60 * 1000) return storeCache;
  const { data, error } = await supabase
    .from("products")
    .select("name, price, category, specs")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error || !data) return PRODUCTS;
  storeCache = data as StoreProduct[];
  storeCacheAt = Date.now();
  return storeCache;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function matchProducts(prompt: string, list: StoreProduct[]): StoreProduct[] {
  const q = normalize(prompt);
  const isIphoneLike = q.includes("iphone") || q.includes("iphoe") || q.includes("ipone") || q.includes("iph");
  return list.filter((p) => {
    const name = normalize(p.name);
    const cat = normalize(p.category || "");
    if (isIphoneLike && name.includes("iphone")) return true;
    return q.split(" ").some((w) => w.length > 2 && (name.includes(w) || cat.includes(w)));
  }).slice(0, 3);
}

function buildStoreAnswer(userPrompt: string, list: StoreProduct[]): string {
  const lower = normalize(userPrompt);
  const matches = matchProducts(userPrompt, list);
  if (matches.length > 0) {
    const items = matches
      .map((p) => `- ${p.name} — ${Number(p.price).toLocaleString()} Rwf`)
      .join("\n");
    return `I am Home of Electronics Assistant. I can help you choose the best device.\n\nGreat choice. Based on our store catalog, we currently have:\n${items}\n\nTell me your budget and what you use it for (camera, gaming, business, battery), and I will recommend the best one for you.`;
  }
  if (lower.includes("payment") || lower.includes("pay")) {
    return "I am Home of Electronics Assistant. We accept MOMO Pay, Airtel Money, Visa, Mastercard, and cash.";
  }
  if (lower.includes("top up") || lower.includes("trade")) {
    return "I am Home of Electronics Assistant. You can send a trade-in request from the Top-Up page with your phone model and images.";
  }
  if (lower.includes("delivery")) {
    return "I am Home of Electronics Assistant. Delivery is same-day in Kigali and 2-3 days nationwide.";
  }
  if (lower.includes("discount") || lower.includes("deal") || lower.includes("best price")) {
    return "I am Home of Electronics Assistant. Yes, you can request a discount. Share the exact model you want and your budget, and I will help prepare the best offer request for you.";
  }
  if (lower.includes("camera price") || lower.includes("outside") || lower.includes("market price")) {
    return "I am Home of Electronics Assistant. I can give guidance based on our store catalog and general market estimates. For exact outside-market live prices, verify with current listings. Tell me the exact camera model and I will guide you.";
  }
  if (lower === "camera" || lower.includes("need camera")) {
    return "I am Home of Electronics Assistant. I can help you choose a camera based on your budget and use case (photos, video, vlogging, professional work). Tell me your budget and I will suggest the best available option.";
  }
  return "I am Home of Electronics Assistant. I can help you make the best buying decision. Ask me about phone models, prices, camera quality, battery, or performance.";
}

export async function getAIResponse(userPrompt: string, chatHistory: any[]) {
  try {
    const storeProducts = await getStoreProducts();
    const ai = getAI();
    if (!ai) return buildStoreAnswer(userPrompt, storeProducts);
    
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const SYSTEM_PROMPT = `You are Home of Electronics Assistant for a premium electronics store in Kigali.
Help customers choose phones, laptops, audio gear, watches, cameras, and accessories.
Use concise and friendly answers. Start naturally with helpful guidance, not generic text.
When users ask for a model, check the provided product list and mention matching items with price in Rwf.
If exact model is unavailable, suggest closest alternatives from the list.
If exact specs are unknown, say so clearly.
Mention WhatsApp orders at +250 780 615 795 when useful.
Keep answers practical and sales-assistant style.`;
    
    // Convert chat history to Gemini format
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));
    
    const catalogContext = storeProducts
      .slice(0, 25)
      .map((p) => `${p.name} | ${Number(p.price).toLocaleString()} Rwf | ${p.category}`)
      .join("\n");
    const promptWithContext = `${SYSTEM_PROMPT}

Store products list:
${catalogContext}

Customer question: ${userPrompt}`;

    const result = await model.generateContent({
      contents: [
        ...contents,
        { role: "user", parts: [{ text: promptWithContext }] }
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300,
      },
    });
    
    const response = await result.response;
    return response.text() || buildStoreAnswer(userPrompt, storeProducts);
  } catch (error) {
    console.error("Gemini AI error:", error);
    const fallbackProducts = storeCache ?? PRODUCTS;
    return buildStoreAnswer(userPrompt, fallbackProducts);
  }
}

export async function getProductSuggestion(productName: string, specs: any) {
  try {
    const ai = getAI();
    if (!ai) return buildStoreAnswer(productName, PRODUCTS);
    
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Briefly suggest why someone should buy ${productName} with specs ${JSON.stringify(specs)}. Under 40 words. Friendly and practical.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || buildStoreAnswer(productName, PRODUCTS);
  } catch (error) {
    console.error("Gemini Suggestion error:", error);
    return buildStoreAnswer(productName, PRODUCTS);
  }
}
