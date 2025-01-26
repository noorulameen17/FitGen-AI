"use client";

import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function SignUpPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: {
                backgroundColor: "#00695c",
                "&:hover": {
                  backgroundColor: "#00897b",
                },
              },
            },
          }}
          signInUrl="/sign-in"
          fallbackRedirectUrl="/healthInput"
        />
      </motion.div>

      <Link href="/" passHref>
        <ShimmerButton className="-mt-10">Back To Home</ShimmerButton>
      </Link>
      
    </Box>
  );
}