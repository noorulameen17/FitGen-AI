import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

// Function to get dietary preferences
function getMealPreferences() {
  // This is a placeholder for getting user input. In a real application, you might get this from a database or user input.
  return "vegan, halal"; // Example preferences
}

export async function GET() {
  try {
    const { data: metrics, error: fetchError } = await supabase
      .from("healthData")
      .select("bloodSugar, bloodPressure, weight, Age, heartBeat, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      return NextResponse.json(
        { error: "Error fetching metrics: " + fetchError.message },
        { status: 500 }
      );
    }

    if (!metrics || metrics.length === 0) {
      return NextResponse.json(
        { error: "No health metrics found." },
        { status: 404 }
      );
    }

    const latestMetrics = metrics[0];
    console.log("Latest metrics:", latestMetrics); // Debug log

    const mealPreferences = getMealPreferences(); // Get dietary preferences

    const client = new Cerebras({
      apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
    });
    const stream = await client.chat.completions.create({
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


**Output Format:**  
1. **Breakfast:**  
   - **Dish Name:** Scrambled eggs  
   - **Nutrition Breakdown:** Calories: X kcal, Protein: Y g, Carbs: Z g, Fats: W g.  
   - **Health Benefit Highlight:** Briefly mention how this meal supports the user's health metrics.  
2. **Lunch:**  
   - **Dish Name:** Grilled chicken salad  
   - **Nutrition Breakdown:** Calories: X kcal, Protein: Y g, Carbs: Z g, Fats: W g.  
   - **Health Benefit Highlight:** Briefly mention how this meal supports the user's health metrics.  
3. **Snacks:**  
   - **Dish Name:** Mixed nuts  
   - **Nutrition Breakdown:** Calories: X kcal, Protein: Y g, Carbs: Z g, Fats: W g.  
   - **Health Benefit Highlight:** Briefly mention how this meal supports the user's health metrics.  
4. **Dinner:**  
   - **Dish Name:** Baked salmon with vegetables  
   - **Nutrition Breakdown:** Calories: X kcal, Protein: Y g, Carbs: Z g, Fats: W g.  
   - **Health Benefit Highlight:** Briefly mention how this meal supports the user's health metrics.  

Ensure that the dish names are in **bold** and provide a colorful representation. Include food icons for each meal type (Breakfast, Lunch, Snacks, Dinner) in the response.  
Create a plan that's practical, effective, and easy for the user to follow. Strictly adhere to the format for consistency.`,
        },
      ],
      model: "llama3.1-8b",
      stream: true,
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
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
