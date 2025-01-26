
import { NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

export async function POST(req) {
  try {
    if (!process.env.NEXT_PUBLIC_CEREBRAS_API_KEY) {
      return NextResponse.json({ 
        error: "AI configuration missing",
        details: "Cerebras API key not found"
      }, { status: 500 });
    }

    const { query } = await req.json();
    
    const client = new Cerebras({
      apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
    });

    const stream = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable health assistant that provides accurate, evidence-based health information and advice. Always provide balanced, well-researched responses while noting that users should consult healthcare professionals for personalized medical advice."
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "llama3.1-8b",
      stream: true,
    });

    let responseContent = "";
    for await (const chunk of stream) {
      responseContent += chunk.choices[0]?.delta?.content || "";
    }

    return NextResponse.json({ response: responseContent });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "Failed to process request",
      details: error.message 
    }, { status: 500 });
  }
}