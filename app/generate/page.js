"use client";

import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";

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
            }}
          >
            {line.replace(/\*\*/g, "")}
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
            }}
          >
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
          }}
        >
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
    </Box>
  );
}
