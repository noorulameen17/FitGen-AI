"use client";

import { AuroraText } from "@/components/ui/aurora-text";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlipText } from "@/components/ui/flip-text";
import { MorphingText } from "@/components/ui/morphing-text";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import RetroGrid from "@/components/ui/retro-grid";
import { useAuth } from "@clerk/nextjs";
import { Box, CircularProgress } from "@mui/material"; // Import CircularProgress
import { Activity, Brain, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const customFont = localFont({
  src: "../public/fonts/AstroSpace-0Wl3o.otf",
  variable: "--font-AstroSpace",
});
const geargrindFont = localFont({
  src: "../public/fonts/Geargrind-zrOZl.otf",
  variable: "--font-Geargrind",
});

const Fortuner = localFont({
  src: "../public/fonts/FortuneMounerRegular-JpB6B.otf",
  variable: "--font-Fortuner",
});

const TypeLight = localFont({
  src: "../public/fonts/TypeLightSans-JpB5o.otf",
  variable: "--font-TypeLight",
});

const texts = ["Welcome", "To"];

export default function Home() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [buttonLoading, setButtonLoading] = useState(false); // Add button loading state
  const router = useRouter(); // Initialize useRouter

  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };

    if (router?.events) {
      router.events.on("routeChangeStart", handleRouteChange);
      router.events.on("routeChangeComplete", () => setLoading(false));
      router.events.on("routeChangeError", () => setLoading(false));

      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.off("routeChangeComplete", () => setLoading(false));
        router.events.off("routeChangeError", () => setLoading(false));
      };
    }
  }, [router]);

  if (!mounted) {
    return <div className="min-h-screen"></div>;
  }

  const handleButtonClick = () => {
    setButtonLoading(true); 
    
  };

  return (
    <Box className="min-h-screen ">
      <div
        className={`${customFont.variable} font-Geargrind text-center pt-20`}
      >
        <MorphingText
          texts={texts}
          className={`${Fortuner.variable} -mb-3 font-Fortuner text-9sm md:text-9xl bg-gradient-to-r from-black via-black to-sky-200 bg-clip-text text-transparent`}
        />

        <div className="flex flex-col justify-center items-center mb-10">
          <RetroGrid className={"-mt-60 "} />

          <AuroraText
            className={`${customFont.variable}  font-AstroSpace text-4xl font-bold leading-none tracking-tight md:text-9xl flex flex-col mb-1`}
          >
            FitGen
          </AuroraText>

          <FlipText
            className={`${TypeLight.variable} font-TypeLight text-2xl tracking-[-0.20em] text-gray-600 md:text-1xl`}
            word="Your AI-Powered Health Companion"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
            >
              <NeonGradientCard
                neonColors={{
                  firstColor: "rgba(147, 51, 254, 0.4)",
                  secondColor: "rgba(192, 142, 252, 0.4)",
                }}
                className="max-w-sm items-center justify-center bg-slate-50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Brain className="h-8 w-8 mr-2 text-purple-500 dark:text-pink-500" />
                    AI-Powered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Leverage AI for personalized health insights
                  </CardDescription>
                </CardContent>
              </NeonGradientCard>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
            >
              <NeonGradientCard
                neonColors={{
                  firstColor: "rgba(239, 68, 68, 0.4)",
                  secondColor: "rgba(248, 113, 113, 0.4)",
                }}
                className="max-w-sm items-center justify-center bg-white"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Heart className="h-8 w-8 mr-2 text-red-500" />
                    Holistic Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Track and improve your overall well-being
                  </CardDescription>
                </CardContent>
              </NeonGradientCard>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0 },
              }}
            >
              <NeonGradientCard
                neonColors={{
                  firstColor: "rgba(34, 197, 94, 0.4)",
                  secondColor: "rgba(134, 239, 172, 0.4)",
                }}
                className="max-w-sm items-center justify-center bg-white"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="h-8 w-8 mr-2 text-green-500" />
                    Real-time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Stay on top of your health metrics
                  </CardDescription>
                </CardContent>
              </NeonGradientCard>
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
            <Link href="/sign-up" passHref>
              <RainbowButton className="mt-4" onClick={handleButtonClick}>
                Get Started
              </RainbowButton>
            </Link>
          </motion.div>

          {buttonLoading && (
            <div className="flex justify-center mt-4">
              <CircularProgress />
            </div>
          )}

          {loading && (
            <div className="flex justify-center mt-4">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
