import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getMealPreferences() {
  return "vegan, halal";
}

export async function GET() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          error: "Database configuration missing",
          details: "Supabase credentials not found",
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_CEREBRAS_API_KEY) {
      return NextResponse.json(
        {
          error: "AI configuration missing",
          details: "Cerebras API key not found",
        },
        { status: 500 }
      );
    }

    const { data: metrics, error: fetchError } = await supabase
      .from("healthData")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      return NextResponse.json(
        {
          error: "Database error",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (!metrics || metrics.length === 0) {
      return NextResponse.json(
        {
          error: "Please add your health metrics first",
          redirect: "/healthInput",
        },
        { status: 404 }
      );
    }

    const latestMetrics = metrics[0];
    console.log("Latest metrics:", latestMetrics);

    const mealPreferences = getMealPreferences();

    const client = new Cerebras({
      apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
    });
    const stream = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a precision nutrition AI that creates personalized meal plans. Format responses with clear structure and visual elements. Do not use asterisks in the response."
        },
        {
          role: "user",
          content: `Based on these health metrics, generate a targeted daily meal plan:

Health Data:
- Blood Sugar: ${latestMetrics.bloodSugar || "Unknown"} mg/dL
- Blood Pressure: ${latestMetrics.bloodPressure || "Unknown"} mmHg  
- Weight: ${latestMetrics.weight || "Unknown"} kg
- Heart Rate: ${latestMetrics.heartBeat || "Unknown"} bpm
- Age: ${latestMetrics.Age || "Unknown"} years

Generate a concise meal plan with exactly 4 meals (Breakfast, Lunch, Snacks, Dinner).
For each meal provide:

<span style="color:#ff6b6b"> Breakfast</span>
- Meal: [Single main dish name]
- Calories: [Total calories only]
- Health Benefits: [One specific benefit related to user's health metrics]

<span style="color:#4ecdc4"> Lunch</span>
[Same format as breakfast]

<span style="color:#ffd93d"> Snacks</span>
[Same format as breakfast]

<span style="color:#6c5ce7"> Dinner</span>
[Same format as breakfast]

Keep descriptions brief and focused on the user's health metrics. Ensure the format remains consistent and do not use asterisks in the response and most importantly do not change this format.`
        }
      ],
      model: "llama3.1-8b",
      stream: true
    });

    let mealPlanContent = "";
    for await (const chunk of stream) {
      mealPlanContent += chunk.choices[0]?.delta?.content || "";
    }

    return NextResponse.json(
      {
        mealPlan: mealPlanContent,
        metrics: {
          bloodSugar: latestMetrics.bloodSugar,
          bloodPressure: latestMetrics.bloodPressure,
          weight: latestMetrics.weight,
          timestamp: latestMetrics.created_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        details: err.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
