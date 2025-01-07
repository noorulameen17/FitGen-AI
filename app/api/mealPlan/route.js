import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

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

    const client = new Cerebras({
      apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
    });
    const stream = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Create a meal plan based on these metrics:
      - Blood Sugar: ${latestMetrics.bloodSugar || "Not provided"} mg/dL
      - Blood Pressure: ${latestMetrics.bloodPressure || "Not provided"} mmHg
      - Weight: ${latestMetrics.weight || "Not provided"} kg
      - Heart Beat: ${latestMetrics.heartBeat || "Not provided"} bpm
      - Age: ${latestMetrics.Age || "Not provided"} years

      Format:
      - Breakfast: (calories, protein, carbs, fats)
      - Lunch: (calories, protein, carbs, fats)
      - Dinner: (calories, protein, carbs, fats)
      - Snacks: (calories, protein, carbs, fats)

      Tailor recommendations to the provided metrics.`,
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
