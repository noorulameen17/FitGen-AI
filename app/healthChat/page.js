"use client";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { BorderBeam } from "@/components/ui/border-beam";

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

  return (
    <Box className="pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            maxWidth: "1000px",
            margin: "0 auto",
            height: "calc(100vh - 150px)",
            display: "flex",
            flexDirection: "column",
            position: "relative", // Ensure the parent container is positioned relative
          }}
        >
          <BorderBeam
            size={300}
            duration={15}
            anchor={90}
            borderWidth={2}
            colorFrom="#0ea5e9"
            colorTo="#6366f1"
            className="absolute inset-0"
          />
          <div className="relative z-10 w-full h-full bg-white dark:bg-black rounded-xl p-6">
            <Stack
              direction="column"
              spacing={2}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                borderRadius: 2,
                p: 2,
              }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    display="flex"
                    justifyContent={
                      msg.role === "assistant" ? "flex-start" : "flex-end"
                    }
                  >
                    <Box
                      sx={{
                        bgcolor:
                          msg.role === "assistant"
                            ? "rgba(14, 165, 233, 0.9)"
                            : "rgba(99, 102, 241, 0.9)",
                        color: "white",
                        borderRadius: 3,
                        p: 2,
                        maxWidth: "70%",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography>{msg.content}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </Stack>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask your health-related question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                    },
                  }}
                />
                <IconButton
                  onClick={sendMessage}
                  disabled={loading}
                  sx={{
                    bgcolor: "rgba(14, 165, 233, 0.9)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      bgcolor: "rgba(14, 165, 233, 0.7)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </motion.div>
                </IconButton>
              </Stack>
            </form>
          </div>
        </Box>
      </motion.div>
    </Box>
  );
}