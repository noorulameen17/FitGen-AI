"use client";

import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";
import { MdFreeBreakfast, MdLunchDining, MdDinnerDining } from "react-icons/md";
import { FaBowlFood, FaUtensils, FaCookieBite } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { motion } from "framer-motion";
import ShineBorder from "@/components/ui/shine-border";
import { RainbowButton } from "@/components/ui/rainbow-button";

const ChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  maxWidth: "900px",
  width: "100%",
  borderRadius: "24px", // Increased border radius
  backgroundColor: "rgba(255, 255, 255, 0.9)", // Added transparency
  backdropFilter: "blur(10px)", // Added blur effect
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)", // Enhanced shadow
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

    return text.split("\n").map((line, index) => {
      
      if (line.startsWith("**") && 
          (line.includes("Breakfast:") || line.includes("Lunch:") || 
           line.includes("Dinner:") || line.includes("Snacks:"))) {
        return (
          <Typography
            key={index}
            variant="h5"
            className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]"
            sx={{
              mt: 4,
              mb: 2,
              fontSize: "2.5rem", // Equivalent to text-4xl
            }}
          >
            {line.replace(/\*\*/g, "")}
          </Typography>
        );
      }

      // Sub-headers and content
      if (line.includes("Dish Name:") || 
          line.includes("Nutrition Breakdown:") || 
          line.includes("Health Benefit Highlight:")) {
        const [header, ...content] = line.substring(1).trim().split(":");
        return (
          <Typography
            key={index}
            component="li"
            sx={{
              mb: 2,
              ml: 3,
              padding: "8px 16px",
              borderLeft: "3px solid",
              borderColor: 
                header.includes("Dish Name") ? "success.main" :
                header.includes("Nutrition") ? "info.main" : "warning.main",
              backgroundColor: "rgba(0,0,0,0.02)",
              borderRadius: "4px"
            }}
          >
            <span style={{ 
              fontWeight: 700,
              color: header.includes("Dish Name") ? "#2e7d32" :
                     header.includes("Nutrition") ? "#0288d1" : "#ed6c02"
            }}>
              {header}:
            </span>
            <span style={{ color: "#424242" }}>{content.join(":")}</span>
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
          <FaUtensils style={{ marginRight: "8px", color: "red" }} />
          {line}
        </Typography>
      );
    });
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
            <ShineBorder
              borderRadius={20}
              borderWidth={2}
              duration={10}
              color={["#0ea5e9", "#6366f1"]}
              className="w-full max-w-[900px] bg-white dark:bg-black"
            >
              <div className="p-6">
                <MealSection>{renderContent(mealPlan)}</MealSection>
              </div>
            </ShineBorder>
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
            <Link href="/healthInput" passHref>
              <RainbowButton>
                <motion.span whileHover={{ scale: 1.05 }}>
                  Back To Health Input
                </motion.span>
              </RainbowButton>
            </Link>

            <Link href="/healthChat" passHref>
              <RainbowButton>
                <motion.span whileHover={{ scale: 1.05 }}>
                  Chat with FitGen AI
                </motion.span>
              </RainbowButton>
            </Link>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
}
