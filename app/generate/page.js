"use client";

import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";
import { MdFreeBreakfast, MdLunchDining, MdDinnerDining } from "react-icons/md";
import { FaBowlFood, FaUtensils, FaCookieBite } from "react-icons/fa6";

const ChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  maxWidth: "800px",
  width: "100%",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}));

const MealSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& ul": {
    paddingLeft: theme.spacing(3),
    marginTop: 0,
  },
}));

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchMealPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/mealPlan");
      console.log("API Response:", response.data); // Debug log
      const cleanText = response.data.mealPlan
        .replace(/\\n/g, "\n")
        .replace(/\\\*/g, "*");
      setMealPlan(cleanText);
    } catch (err) {
      console.error("Error fetching meal plan:", err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchMealPlan();
}, []);

  const renderContent = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, index) => {
      let IconComponent;
      if (line.startsWith("**Breakfast:**")) {
        IconComponent = MdFreeBreakfast;
      } else if (line.startsWith("**Lunch:**")) {
        IconComponent = MdLunchDining;
      } else if (line.startsWith("**Snacks:**")) {
        IconComponent = FaBowlFood;
      } else if (line.startsWith("**Dinner:**")) {
        IconComponent = MdDinnerDining;
      } else {
        IconComponent = FaUtensils;
      }

      if (line.startsWith("**")) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{
              mt: 2,
              mb: 1,
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconComponent style={{ marginRight: "8px", color: "green" }} />
            {line.replace(/\*\*/g, "")}
          </Typography>
        );
      }

      if (line.startsWith("**")) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{
              mt: 2,
              mb: 1,
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconComponent style={{ marginRight: "8px", color: "green" }} />
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {line.replace(/\*\*/g, "")}
            </span>
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
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Your Personalized Meal Plan
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : mealPlan ? (
        <ChatContainer>
          <MealSection>{renderContent(mealPlan)}</MealSection>
        </ChatContainer>
      ) : null}
  <Link href="/healthInput" passHref>
    <ShimmerButton>
      Back To Health Input
   </ShimmerButton>
  </Link>
    </Box>
  );
}
