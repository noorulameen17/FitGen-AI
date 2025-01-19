
"use client";

import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function SignInPage() {
    const router = useRouter();
    
    const handleSignInSuccess = () => {
        router.push( '/healthInput' );
    }
    
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
          <SignIn signUpUrl="/sign-up" forceRedirectUrl="/healthInput" />
        </motion.div>
      </Box>
    );
}