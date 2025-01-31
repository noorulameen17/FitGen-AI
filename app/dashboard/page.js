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
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [metrics, setMetrics] = useState([]);
  const [uniquePatients, setUniquePatients] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [buttonLoading, setButtonLoading] = useState(false); 

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!isLoaded) return; 
        if (!user?.id) {
          setError("Please sign in to view your dashboard");
          setLoading(false);
          return;
        }

        console.log('Fetching metrics for user:', user.id);
        const { data, error: dbError } = await supabase
          .from("healthData")
          .select("*")
          .eq('patientId', user.id)
          .order("created_at", { ascending: false });

        if (dbError) {
          console.error('Database error:', dbError);
          setError(dbError.message);
          return;
        }

        console.log('Fetched data:', data);
        setMetrics(data || []);
        const uniquePatientIds = new Set(data?.map((m) => m.patientId) || []);
        setUniquePatients(uniquePatientIds.size);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user, isLoaded]); 

  const calculateHealthScore = (bloodSugar, bloodPressure, weight) => {
    let score = 100;


    if (bloodSugar > 140) score -= 20;
    else if (bloodSugar > 120) score -= 10;

    const [systolic, diastolic] = bloodPressure.split("/").map(Number);
    if (systolic > 140 || diastolic > 90) score -= 20;
    else if (systolic > 120 || diastolic > 80) score -= 10;

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
    id: m.id, 
    patientId: m.patientId,
    healthScore: calculateHealthScore(m.bloodSugar, m.bloodPressure, m.weight),
    bloodSugar: m.bloodSugar,
    bp: m.bloodPressure,
    weight: m.weight,
    lastCheckup: formatDate(m.created_at),
  }));

  const handleButtonClick = (path) => {
    setButtonLoading(true);
    router.push(path);
  };

  return (
    <div className="pt-16">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.4}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Patient Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : metrics.length === 0 ? (
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-4">No health records found.</p>
          <Link href="/healthInput" passHref>
            <ShimmerButton onClick={() => setButtonLoading(true)}>
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Add Health Data
              {buttonLoading && (
                <CircularProgress size={20} className="ml-2" />
              )}
            </ShimmerButton>
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ marginLeft: "12px", marginRight: "10px" }}
        >
          {patients.map((patient, index) => (
            <motion.div
              key={`${patient.id}-${index}`}
              whileHover={{ scale: 1.05 }}
              className={`hover:shadow-lg transition-shadow duration-300 ${getCardShadowClass(
                index
              )}`}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Patient {patient.patientId}</CardTitle>
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
            </motion.div>
          ))}
        </div>
      )}
      <Link href="/healthInput" passHref>
        <div className="flex justify-center mt-3 pb-5">
          <ShimmerButton onClick={() => setButtonLoading(true)}>
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ marginRight: "10px", marginBottom: "2px" }}
            />
            Enter Health Data
            {buttonLoading && (
              <CircularProgress size={20} className="ml-2" />
            )}
          </ShimmerButton>
        </div>
      </Link>
    </div>
  );
}