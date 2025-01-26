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
    const stream = await client.chat.completions
      .create({
        messages: [
          {
            role: "user",
            content: `You're a virtual nutritionist specializing in personalized, data-driven meal plans. Generate a meal plan tailored to the user's health metrics and preferences.  

**Health Profile:**  
- Blood Sugar: ${latestMetrics.bloodSugar || "Unknown"} mg/dL  
- Blood Pressure: ${latestMetrics.bloodPressure || "Unknown"} mmHg  
- Weight: ${latestMetrics.weight || "Unknown"} kg  
- Heart Rate: ${latestMetrics.heartBeat || "Unknown"} bpm  
- Age: ${latestMetrics.Age || "Unknown"} years  

**Dietary Preferences:** ${mealPreferences || "None"}  

**Output Format (with Styling):**  
1. Use **bold** text for section titles like "Breakfast," "Lunch," etc.  
2. Add color to section titles using HTML spans with style attributes.
3. Use emojis to make the output visually appealing (e.g., 🥗 for Lunch).  
4. Provide a clear **Nutrition Breakdown** and highlight the **Health Benefits** of each meal.

**Example Output Format:**  

<span style='color:orange; font-weight:bold;'>🍳 Breakfast:</span>  
- **Dish Name:** Scrambled eggs  
- **Nutrition Breakdown:** Calories: X kcal, Protein: Y g, Carbs: Z g, Fats: W g.  
- **Health Benefit Highlight:** Briefly mention how this meal supports the user's health metrics.`,
          },
        ],
        model: "llama3.1-8b",
        stream: true,
      })
      .catch((err) => {
        console.error("Cerebras API Error:", err);
        throw new Error("Failed to generate meal plan");
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
