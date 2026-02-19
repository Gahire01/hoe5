// Add a fallback function that returns rule-based answers when Gemini fails
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

export async function getAIResponse(userPrompt: string, chatHistory: any[]) {
  try {
    const ai = getAI();
    if (!ai) return fallbackResponse(userPrompt); // fallback if no API key
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
    // ... same as before
  } catch (error) {
    return fallbackResponse(productName);
  }
}
