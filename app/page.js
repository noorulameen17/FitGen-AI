'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Box } from "@mui/material";
import { Brain, Heart, Activity } from "lucide-react";
import RetroGrid from "@/components/ui/retro-grid";
import { RainbowButton } from "@/components/ui/rainbow-button";
import BlurIn from "@/components/ui/blur-in";
import { TextAnimate } from "@/components/ui/text-animate";
import { motion } from "motion/react";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <Box>
      <Box sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <UserButton redirectUrl="/" />
      </Box>
      <div className="flex flex-col justify-center items-center ">
        <RetroGrid />
        <div className="text-center mb-7">
          <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
            <BlurIn
              word="Welcome To FitGen"
              className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            />
          </motion.div>
          <TextAnimate animation="blurInUp" by="character">
            <p className="text-xl text-gray-600 mb-8">
              Your AI-powered health companion
            </p>
          </TextAnimate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 ">
            <Card className="hover:shadow-lg hover:shadow-purple-500/50 transition-shadow  duration-300 p-6 shadow-md backdrop-blur-md">
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
            </Card>
            <Card className="hover:shadow-lg hover:shadow-red-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Heart className="h-8 w-8 mr-2 text-red-500" /> Holistic
                  Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Track and improve your overall well-being
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hover:shadow-green-500/50 transition-shadow duration-300 p-6 shadow-md backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Activity className="h-8 w-8 mr-2 text-green-500" /> Real-time
                  Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mr-9 mt-1 text-lg">
                  Stay on top of your health metrics
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          {!isSignedIn && (
            <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
              <SignInButton mode="modal">
                <RainbowButton className="mt-8">
                  Sign In to Get Started
                </RainbowButton>
              </SignInButton>
              <Link href="/sign-up" passHref>
                <RainbowButton className="mt-4">
                  Sign Up
                </RainbowButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Box>
  );
}
