"use client";
import { Box } from "@mui/material";
import { cardio } from "ldrs";
import { useEffect, useState } from "react";

const cardioLoad= () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      cardio.register();
    }
  }, []);

  if (!isClient) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ marginTop: "-25px" }}
    >
      <l-cardio size="50" stroke="4" speed="2" color="black"></l-cardio>
    </Box>
  );
};

export default cardioLoad;
