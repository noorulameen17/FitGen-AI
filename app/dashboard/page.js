"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShimmerButton from "@/components/ui/shimmer-button";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress } from "@mui/material";
import { BarChart, Calendar, Droplet, Weight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser(); 
  const [metrics, setMetrics] = useState([]);
  const [uniquePatients, setUniquePatients] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from("healthData")
        .select("bloodSugar, bloodPressure, weight, created_at, patientId")
        .eq("patientId", user.id) // Filter by the current user's ID
        .order("created_at", { ascending: false });
      if (error) return console.error("Error fetching metrics:", error.message);
      setMetrics(data);

      // Calculate unique patients
      const uniquePatientIds = new Set(data.map((m) => m.patientId));
      setUniquePatients(uniquePatientIds.size);
    };

    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const calculateHealthScore = (bloodSugar, bloodPressure, weight) => {
    let score = 100;

    // Blood sugar logic
    if (bloodSugar > 140) score -= 20;
    else if (bloodSugar > 120) score -= 10;

    // Blood pressure logic
    const [systolic, diastolic] = bloodPressure.split("/").map(Number);
    if (systolic > 140 || diastolic > 90) score -= 20;
    else if (systolic > 120 || diastolic > 80) score -= 10;

    // Weight logic
    if (weight > 100) score -= 20;
    else if (weight > 80) score -= 10;

    return score;
  };

  const getProgressColor = (score) => {
    if (score > 80) return "green";
    if (score > 60) return "yellow";
    return "red";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCardShadowClass = (index) => {
    const shadowClasses = [
      "hover:shadow-red-500/50",
      "hover:shadow-green-500/50",
      "hover:shadow-blue-500/50",
      "hover:shadow-purple-500/50",
      "hover:shadow-orange-500/50",
      "hover:shadow-teal-500/50",
      "hover:shadow-pink-500/50",
      "hover:shadow-yellow-500/50",
    ];
    return shadowClasses[index % shadowClasses.length];
  };

  const patients = metrics.map((m) => ({
    id: m.patientId,
    name: `Patient ${m.patientId}`,
    healthScore: calculateHealthScore(m.bloodSugar, m.bloodPressure, m.weight),
    bloodSugar: m.bloodSugar,
    bp: m.bloodPressure,
    weight: m.weight,
    lastCheckup: formatDate(m.created_at),
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Patient Dashboard
      </h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{ marginLeft: "12px", marginRight: "10px" }}
      >
        {patients.map((patient, index) => (
          <Card
            key={patient.id}
            className={`hover:shadow-lg transition-shadow duration-300 ${getCardShadowClass(index)}`}
          >
            <CardHeader>
              <CardTitle>{patient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Health Score:</span>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={patient.healthScore}
                      style={{ color: getProgressColor(patient.healthScore) }}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <span>{patient.healthScore}</span>
                    </Box>
                  </Box>
                </div>
                <div className="flex items-center">
                  <Droplet className="h-5 w-5 mr-2 text-red-500" />
                  <span className="font-medium">Blood Sugar:</span>
                  <span className="ml-2">{patient.bloodSugar} mg/dL</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-green-500" />
                  <span className="font-medium">Blood Pressure:</span>
                  <span className="ml-2">{patient.bp} mmHg</span>
                </div>
                <div className="flex items-center">
                  <Weight className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">Weight:</span>
                  <span className="ml-2">{patient.weight} kg</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="font-medium">Last Check-up:</span>
                  <span className="ml-2">{patient.lastCheckup}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link href="/healthInput" passHref>
        <div className="flex justify-center mt-3 pb-5">
          <ShimmerButton>
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ marginRight: "10px", marginBottom: "2px" }}
            />
            New Patient
          </ShimmerButton>
        </div>
      </Link>
    </div>
  );
}