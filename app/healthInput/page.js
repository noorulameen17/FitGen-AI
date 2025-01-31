"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Ripple } from "@/components/ui/ripple";
import { useUser } from "@clerk/nextjs";
import { Alert, CircularProgress, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { cn } from "@/lib/utils";

const ReferenceCard = ({ title, ranges }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md h-fit">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {ranges.map((range, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <p className="text-sm">
              <span
                style={{
                  color: range.color,
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {range.label}
              </span>
              <span className="text-gray-600">{range.value}</span>
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  </motion.div>
);

export default function HealthInput() {
  const { user, isLoaded } = useUser();
  const [healthData, setHealthData] = useState({
    bloodSugar: "",
    bloodPressure: "",
    weight: "",
    Age: "",
    heartBeat: "",
    patientId: "",
    date: "",
    dietaryPreferences: "",
  });

  useEffect(() => {
    if (isLoaded && user?.id) {
      setHealthData((prev) => ({
        ...prev,
        patientId: user.id,
        date: new Date().toISOString().split("T")[0],
      }));
    }
  }, [user, isLoaded]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
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
    if (!user?.id) {
      setError("Please sign in to submit health data");
      return;
    }
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from("healthData")
        .insert([
          {
            ...healthData,
            patientId: healthData.patientId,
          },
        ]);

      if (dbError) {
        setError("Error inserting data: " + dbError.message);
        setSuccess("");
      } else {
        setSuccess("Data successfully inserted!");
        setError("");
        setHealthData((prev) => ({
          ...prev,
          bloodSugar: "",
          bloodPressure: "",
          weight: "",
          Age: "",
          heartBeat: "",
          date: "",
          dietaryPreferences: "",
        }));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleNavigateToMealPlan = () => {
    setLoading(true); // Set loading state to true
    router.push("/generate");
  };

  if (!isLoaded) {
    return (
      <div className="pt-16 flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 text-center">
        <p className="text-red-500">Please sign in to access this page</p>
      </div>
    );
  }

  const referenceData = {
    bloodSugar: [
      {
        label: "Normal",
        value: "Fasting 70–100, Post-meal <140",
        color: "green",
      },
      { label: "Low", value: "<70", color: "orange" },
      { label: "Extreme", value: "Fasting >180, Post-meal >200", color: "red" },
    ],
    bloodPressure: [
      { label: "Normal", value: "90/60 – 120/80", color: "green" },
      { label: "Low", value: "<90/60", color: "orange" },
      { label: "Extreme", value: ">180/120", color: "red" },
    ],
    weight: [
      { label: "Normal", value: "BMI 18.5–24.9", color: "green" },
      { label: "Underweight", value: "BMI <18.5", color: "orange" },
      { label: "Overweight", value: "BMI 25–29.9", color: "blue" },
      { label: "Obesity", value: "BMI ≥30", color: "red" },
    ],
    heartRate: [
      { label: "Normal", value: "60–100 (resting)", color: "green" },
      { label: "Low", value: "<60 (if symptomatic)", color: "orange" },
      { label: "Extreme", value: ">120 (at rest)", color: "red" },
    ],
  };

  const inputHelperText = {
    patientId: "Enter a unique identifier for the patient",
    age: "Patient's age in years",
    date: "Date of health check-up",
    bloodSugar: "Normal range: Fasting 70-100 mg/dL, Post-meal <140 mg/dL",
    bloodPressure:
      "Format: Systolic/Diastolic (e.g., 120/80). Normal range: 90/60 - 120/80",
    heartBeat: "Normal resting heart rate: 60-100 beats per minute",
    weight: "Enter weight in kilograms. BMI will be calculated automatically",
    dietaryPreferences:
      "Optional: Enter any dietary restrictions or preferences",
  };

  return (
    <div className="pt-16 relative">
     
      <Ripple className="absolute inset-0 flex items-center justify-center -z-10" />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Health Tracker
      </h1>
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-600 text-center max-w-lg">
          Enter your health stats below to track your progress and generate a
          personalized meal plan.
        </p>
      </div>
     
      
      <div className="grid grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        <div className="space-y-6">
          <ReferenceCard
            title="Blood Sugar (mg/dL)"
            ranges={referenceData.bloodSugar}
          />
          <ReferenceCard
            title="Blood Pressure (mmHg)"
            ranges={referenceData.bloodPressure}
          />
        </div>

        <div className="col-span-2">
          <Card className="hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md">
            <CardHeader>
              <CardTitle>Enter Your Health Stats</CardTitle>
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
                    disabled
                    helperText={inputHelperText.patientId}
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
                    helperText={inputHelperText.age}
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
                    helperText={inputHelperText.date}
                  />
                </div>
                <div>
                  <TextField
                    label="Blood Sugar (mg/dL)"
                    type="number"
                    fullWidth
                    value={healthData.bloodSugar}
                    onChange={(e) =>
                      setHealthData({
                        ...healthData,
                        bloodSugar: e.target.value,
                      })
                    }
                    required
                    helperText={inputHelperText.bloodSugar}
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
                      setHealthData({
                        ...healthData,
                        heartBeat: e.target.value,
                      })
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
                <RainbowButton type="submit" className="w-full">
                  Submit
                </RainbowButton>
              </form>
            </CardContent>
          </Card>
          <PulsatingButton
            className="mt-7 w-full"
            variant="contained"
            onClick={handleNavigateToMealPlan}
            pulseColor="#007bff"
          >
            Generate Meal Plan
          </PulsatingButton>
          {loading && (
            <div className="flex justify-center mt-4">
              <CircularProgress />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ReferenceCard title="Weight (BMI)" ranges={referenceData.weight} />
          <ReferenceCard
            title="Heart Rate (bpm)"
            ranges={referenceData.heartRate}
          />
        </div>
      </div>
    </div>
  );
}
