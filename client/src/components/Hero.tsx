import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "./AuthForm";
import OnboardingCarousel from "./OnboardingCarousel";

const carouselTexts = [
  {
    title: "Smart Scheduling",
    subtitle: "Say goodbye to appointment conflicts and manual errors.",
  },
  {
    title: "Instant Notifications",
    subtitle: "Keep patients and staff updated in real time.",
  },
  {
    title: "All-in-One Dashboard",
    subtitle: "Manage appointments, patients, and availability seamlessly.",
  },
];

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <main className="flex flex-1">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6">
          {/* Replace with AuthForm if needed */}
          <AuthForm />
        </div>

        {/* Right Side */}

        <div className="hidden md:block w-1/2 overflow-hidden rounded-l-3xl">
          <OnboardingCarousel />
        </div>
      </main>
    </div>
  );
};

export default Hero;
