"use client";

import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function SignUpPage() {
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: "89vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "25px",
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
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
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
          </Box>
        </motion.div>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-5px",
          
        }}
      >
        <Link href="/" passHref>
          <RainbowButton className="shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            Back To Home
          </RainbowButton>
        </Link>
      </Box>
    </div>
  );
}