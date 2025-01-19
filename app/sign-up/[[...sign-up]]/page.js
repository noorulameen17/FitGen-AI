
"use client";

import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function SignUpPage() {
    
    return (
        <Box
        sx={{
        width: "100%",
        height: "98vh",
        display: "flex",
        alignItems: "center",
                justifyContent: "center"
            } }>
             <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
                <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/healthInput" />;
            </motion.div>
      </Box>
    );
}