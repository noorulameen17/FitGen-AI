"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function HealthInput() {
  const [healthData, setHealthData] = useState({
    bloodSugar: "",
    bloodPressure: "",
    weight: "",
    Age: "",
    heartBeat: "",
    patientId: "",
    date: "",
    dietaryPreferences: "", // New field for dietary preferences
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const validateInputs = () => {
    if (!healthData.patientId) return "Patient ID is required.";
    if (!healthData.date) return "Date is required.";
    if (
      !healthData.bloodSugar ||
      isNaN(healthData.bloodSugar) ||
      healthData.bloodSugar <= 0
    ) {
      return "Blood Sugar must be a positive number (e.g., 85 or 120.5).";
    }
    const bpRegex = /^\d+\/\d+$/;
    if (!healthData.bloodPressure || !bpRegex.test(healthData.bloodPressure)) {
      return "Blood Pressure must be in the format Systolic/Diastolic (e.g., 120/80).";
    }
    if (
      !healthData.heartBeat ||
      isNaN(healthData.heartBeat) ||
      healthData.heartBeat <= 0
    ) {
      return "Heart Beat must be a positive number.";
    }
    if (
      !healthData.weight ||
      isNaN(healthData.weight) ||
      healthData.weight <= 0
    ) {
      return "Weight must be a positive number.";
    }
    if (!healthData.Age || isNaN(healthData.Age) || healthData.Age <= 0) {
      return "Age must be a positive number.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    const { data, error } = await supabase
      .from("healthData")
      .insert([healthData]);
    if (error) {
      setError("Error inserting data: " + error.message);
      setSuccess("");
    } else {
      setSuccess("Data successfully inserted!");
      setError("");
      setHealthData({
        bloodSugar: "",
        bloodPressure: "",
        weight: "",
        Age: "",
        heartBeat: "",
        patientId: "",
        date: "",
        dietaryPreferences: "",
      });
    }
  };

  const handleNavigateToMealPlan = () => {
    router.push("/generate");
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-9 mt-8 h-64">
        <Card className="ml-8 hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md w-64 h-64 mt-3">
          <CardHeader>
            <CardTitle>Blood Sugar (mg/dL)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mr-2">
              <strong
                style={{
                  color: "green",
                  display: "block",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                NORMAL
              </strong>
              <span style={{ display: "block", textAlign: "center" }}>
                Fasting 70–140
              </span>
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                Post-meal &lt;140
              </span>
              <strong
                style={{
                  color: "orange",
                  display: "block",
                  textAlign: "center",
                  marginBottom: "4px",
                }}
              >
                LOW
              </strong>
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: "6px",
                }}
              >
                &lt;70
              </span>
              <strong
                style={{
                  color: "red",
                  display: "block",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                EXTREME
              </strong>
              <span style={{ display: "block", textAlign: "center" }}>
                Fasting &gt;180
              </span>
              <span style={{ display: "block", textAlign: "center" }}>
                Post-meal &gt;200
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: "10%" }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Health Input Form
        </h1>
        <Card className="max-w-md mx-auto hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md">
          <CardHeader>
            <CardTitle>Enter Patient Health Data</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <TextField
                  label="Patient ID"
                  fullWidth
                  value={healthData.patientId}
                  onChange={(e) =>
                    setHealthData({ ...healthData, patientId: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={healthData.Age}
                  onChange={(e) =>
                    setHealthData({ ...healthData, Age: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  type="date"
                  fullWidth
                  value={healthData.date}
                  onChange={(e) =>
                    setHealthData({ ...healthData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Blood Sugar (mg/dL)"
                  type="number"
                  fullWidth
                  value={healthData.bloodSugar}
                  onChange={(e) =>
                    setHealthData({ ...healthData, bloodSugar: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Blood Pressure (Systolic/Diastolic)"
                  fullWidth
                  value={healthData.bloodPressure}
                  onChange={(e) =>
                    setHealthData({
                      ...healthData,
                      bloodPressure: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Heart Beat (bpm)"
                  type="number"
                  fullWidth
                  value={healthData.heartBeat}
                  onChange={(e) =>
                    setHealthData({ ...healthData, heartBeat: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  value={healthData.weight}
                  onChange={(e) =>
                    setHealthData({ ...healthData, weight: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <TextField
                  label="Dietary Preferences"
                  fullWidth
                  value={healthData.dietaryPreferences}
                  onChange={(e) =>
                    setHealthData({
                      ...healthData,
                      dietaryPreferences: e.target.value,
                    })
                  }
                  placeholder="e.g., vegan, halal"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          onClick={handleNavigateToMealPlan}
          style={{ display: "block", margin: "20px auto" }}
        >
          Generate Meal Plan
        </Button>
      </div>
    </div>
  );
}