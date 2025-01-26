"use client";

import ShimmerButton from "@/components/ui/shimmer-button";
import { SignIn } from "@clerk/nextjs";
import { Box,Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            backgroundSize: "cover",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SignIn
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
            signUpUrl="/sign-up"
            forceRedirectUrl="/healthInput"
          />
        </Box>
      </motion.div>
       
      <Link href="/" passHref>
      <ShimmerButton>
        Back To Home
        </ShimmerButton>
        </Link>
    </Box>
  );
}