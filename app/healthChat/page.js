"use client";
import { Box, IconButton, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import dynamic from "next/dynamic";
import { AuroraText } from "@/components/ui/aurora-text";
import localFont from "next/font/local";

const customFont = localFont({
  src: "../../public/fonts/AstroSpace-0Wl3o.otf",
  variable: "--font-AstroSpace",
});

const CardioLoad = dynamic(() => import("../../components/cardio"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center"></Box>
  ),
});

export default function HealthChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI health assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false); // Add button loading state

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");

    try {
      const response = await fetch("/api/healthChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleButtonClick = (path) => {
    setButtonLoading(true); // Set button loading state to true
    router.push(path);
  };

  return (
    <div>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={900}
        width={1500}
      />
      <Box
        width="100%"
        height="120vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        overflow="hidden"
        position="relative"
      >
        <div className="text-center mt-14 " >        
        <AuroraText
          className={`${customFont.variable} font-AstroSpace text-4xl font-bold leading-none tracking-tight md:text-9xl flex flex-col   `}
        >
          FitGen
        </AuroraText>
        <Box
          flexGrow={1}
          display="flex"
          paddingTop={"100px"}
          alignItems="center"
          overflow="hidden"
          position="relative"
          zIndex={1}
          sx={{
            boxShadow: "0px 2px 20px #00acc1",
          }}
          >
          <Stack
            marginTop={-12.5}
            direction="column"
            width="1000px"
            height="500px"
            border="2px solid black"
            p={4}
            spacing={1}
          >
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >

<Box
  display="flex"
  justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
>
  <Box
    bgcolor={message.role === "assistant" ? "#00acc1" : "#26a69a"}
    color="white"
    fontFamily={"dynapuff"}
    borderRadius={16}
    p={3}
    maxWidth="65%"
    sx={{
      '& strong': {
        color: '#FFD700', 
        fontSize: '1.1em',
        display: 'block',
        marginBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      },
      '& ul': {
        listStyle: 'none',
        padding: 0,
        margin: 0
      },
      '& li': {
        marginBottom: '12px',
        paddingLeft: '20px',
        position: 'relative',
        '&:before': {
          content: '"•"',
          position: 'absolute',
          left: 0,
          color: '#FFD700'
        }
      }
    }}
    dangerouslySetInnerHTML={{
      __html: message.content.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      )
    }}
  />
</Box>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </Stack>

            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Box>
            )}

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            <Stack direction="row" spacing={2}>
              <TextField
                label="Health Related Queries..."
                fullWidth
                multiline
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0px 2px 20px #00acc1",
                  "& .MuiInputLabel-root": {
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                    fontWeight: "bold",
                  },
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={loading}
                sx={{ color: "#00695c", "&:hover": { color: "#00897b" } }}
                >
                {loading ? (
                  <CardioLoad />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </IconButton>
            </Stack>
          </Stack>
        </Box>
                </div>
        <footer>
          <Box textAlign="center" padding={3} mt={1}>
            <RainbowButton onClick={() => handleButtonClick("/healthInput")}>
              Back to Health Tracker
            </RainbowButton>
            {buttonLoading && (
              <div className="flex justify-center mt-4">
                <CircularProgress />
              </div>
            )}
            <Typography
              variant="body2"
              color="black"
              align="center"
              sx={{ padding: 3, textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              &copy; 2025 FitGen. All rights reserved. <br />
               FitGen AI might give some off responses.
            </Typography>
          </Box>
        </footer>
      </Box>
    </div>
  );
}
