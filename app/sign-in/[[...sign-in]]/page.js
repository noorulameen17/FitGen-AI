"use client";

import { RainbowButton } from "@/components/ui/rainbow-button";
import { SignIn } from "@clerk/nextjs";
import { Box} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";


export default function SignInPage() {
  return (
    <div>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-10px",
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
      </Box>

        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-65px",
          
        }}
      >
        <Link href="/" passHref>
          <RainbowButton>Back To Home</RainbowButton>
        </Link>
        </Box>
    </div>
  );
}