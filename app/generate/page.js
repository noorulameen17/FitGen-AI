"use client";

import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdFreeBreakfast, MdLunchDining, MdDinnerDining } from "react-icons/md";
import { FaBowlFood, FaCookieBite } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { WarpBackground } from "@/components/ui/warp-background";

const ChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  maxWidth: "900px",
  width: "100%",
  borderRadius: "24px", 
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)", 
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.4s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    transform: "translateY(-4px)"
  }
}));

const MealSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& ul": {
    paddingLeft: theme.spacing(3),
    marginTop: 0,
    listStyle: "none"
  }
}));

export default function MealPlan() {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false); // Add button loading state

  useEffect(() => {
    const fetchMealPlan = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await axios.get("/api/mealPlan");
        console.log('API Response:', response); 

        
        if (!response?.data) {
          throw new Error('No data received from server');
        }

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        
        if (response.data.redirect) {
          router.push(response.data.redirect);
          return;
        }

        const cleanText = response.data.mealPlan
          .replace(/\\n/g, "\n")
          .replace(/\\\*/g, "*");
        setMealPlan(cleanText);

      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to generate meal plan';
        const errorDetails = err.response?.data?.details || 'No additional details';
        
        console.error('Meal plan generation error:', {
          message: errorMessage,
          details: errorDetails,
          status: err.response?.status
        });
        
        setError(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [router]);

  const renderContent = (text) => {
    if (!text) return null;

    const mealIcons = {
      Breakfast: <MdFreeBreakfast size={24} color="#ff6b6b" />,
      Lunch: <MdLunchDining size={24} color="#4ecdc4" />,
      Snacks: <FaCookieBite size={24} color="#ffd93d" />,
      Dinner: <MdDinnerDining size={24} color="#6c5ce7" />
    };

    return text.split("\n").map((line, index) => {
      // Meal Headers
      if (line.startsWith("<span") && Object.keys(mealIcons).some(meal => line.includes(meal))) {
        const mealType = Object.keys(mealIcons).find(meal => line.includes(meal));
        return (
          <Typography
            key={index}
            variant="h5"
            sx={{
              mt: 4,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: "2rem",
              fontWeight: "bold",
              color: mealType === "Breakfast" ? "#ff6b6b" :
                     mealType === "Lunch" ? "#4ecdc4" :
                     mealType === "Snacks" ? "#ffd93d" : "#6c5ce7"
            }}
          >
            {mealIcons[mealType]}
            {mealType}
          </Typography>
        );
      }

      // Meal Details
      if (line.includes("Meal:") || line.includes("Calories:") || line.includes("Health Benefits:")) {
        const [label, content] = line.split(":");
        return (
          <Typography
            key={index}
            sx={{
              mb: 2,
              pl: 4,
              borderLeft: "3px solid",
              borderColor: label.includes("Meal") ? "#2196f3" :
                          label.includes("Calories") ? "#4caf50" : "#ff9800",
              py: 1,
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "0 8px 8px 0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <strong style={{
              color: label.includes("Meal") ? "#2196f3" :
                     label.includes("Calories") ? "#4caf50" : "#ff9800"
            }}>
              {label}:
            </strong>
            {content}
          </Typography>
        );
      }

      if (line.startsWith("-")) {
        return (
          <Typography
            key={index}
            component="li"
            sx={{
              mb: 1,
              ml: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaBowlFood style={{ marginRight: "8px", color: "blue" }} />
            {line.substring(1).trim()}
          </Typography>
        );
      }

      return (
        <Typography
          key={index}
          sx={{
            mb: 1,
            lineHeight: 1.6,
            display: "flex",
            alignItems: "center",
          }}
        >
       
          {line}
        </Typography>
      );
    });
  };

  const handleButtonClick = (path) => {
    setButtonLoading(true); // Set button loading state to true
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 3,
          pt: "84px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", // Enhanced gradient
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 800,
              background: "linear-gradient(45deg, #0ea5e9, #6366f1)", // Enhanced gradient
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              letterSpacing: "-0.5px",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            Your Personalized Meal Plan
          </Typography>
        </motion.div>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body1" color="text.secondary">
              Generating your personalized meal plan...
            </Typography>
          </Box>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              color="error"
              sx={{ p: 3, bgcolor: "error.light", borderRadius: 2 }}
            >
              {error}
            </Typography>
          </motion.div>
        ) : mealPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WarpBackground>
              <div className="p-6">
                <MealSection>{renderContent(mealPlan)}</MealSection>
              </div>
            </WarpBackground>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "center",
              mt: 4,
              mb: 4,
              "& a": {
                textDecoration: "none",
              },
            }}
          >
            <RainbowButton onClick={() => handleButtonClick("/healthInput")}>
              <motion.span whileHover={{ scale: 1.05 }}>
                Back To Health Input
              </motion.span>
            </RainbowButton>

            <RainbowButton onClick={() => handleButtonClick("/healthChat")}>
              <motion.span whileHover={{ scale: 1.05 }}>
                Chat with FitGen AI
              </motion.span>
            </RainbowButton>
            
            <RainbowButton onClick={() => handleButtonClick("/dashboard")}>
              <motion.span whileHover={{ scale: 1.05 }}>
                Go to Dashboard
              </motion.span>
            </RainbowButton>
          </Box>
          {buttonLoading && (
            <div className="flex justify-center mt-4">
              <CircularProgress />
            </div>
          )}
        </motion.div>
      </Box>
    </motion.div>
  );
}
