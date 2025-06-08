import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, LayoutDashboard } from "lucide-react";

// Carousel content with icons
const carouselContent = [
  {
    title: "Smart Scheduling",
    subtitle: "Say goodbye to appointment conflicts and manual errors.",
    icon: <Clock className="w-20 h-20 mb-6" />,
    color: "from-blue-600 to-indigo-700",
    accent: "bg-blue-400",
  },
  {
    title: "Instant Notifications",
    subtitle: "Keep patients and staff updated in real time.",
    icon: <Check className="w-20 h-20 mb-6" />,
    color: "from-indigo-600 to-blue-700",
    accent: "bg-indigo-400",
  },
  {
    title: "All-in-One Dashboard",
    subtitle: "Manage appointments, patients, and availability seamlessly.",
    icon: <LayoutDashboard className="w-20 h-20 mb-6" />,
    color: "from-indigo-600 to-blue-700",
    accent: "bg-indigo-400",
  },
];

// Animation variants
const containerVariants = {
  initial: {},
  animate: {},
  exit: {},
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -20,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    },
  }),
};

const iconVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0.55, 0.45, 1],
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.4,
    },
  },
};

// Shape animation variants
const shapeVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -10 },
  animate: (i: number) => ({
    opacity: 0.8,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const floatAnimation = {
  initial: {},
  animate: (i: number) => ({
    y: [0, -15, 0],
    x: [0, i % 2 === 0 ? 10 : -10, 0],
    transition: {
      duration: 6,
      delay: i * 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  }),
};

const OnboardingCarousel = () => {
  const [index, setIndex] = useState(0);
  const [isManualChange, setIsManualChange] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isManualChange) {
      const timeout = setTimeout(() => {
        setIsManualChange(false);
      }, 7000);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      if (!isManualChange) {
        setIndex((prev) => (prev + 1) % carouselContent.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isManualChange]);

  // Handle manual navigation
  const handleIndicatorClick = (i: number) => {
    setIndex(i);
    setIsManualChange(true);
  };

  const currentSlide = carouselContent[index];

  return (
    <div
      className={`h-full w-full bg-gradient-to-br ${currentSlide.color} transition-colors duration-700 relative overflow-hidden flex items-center justify-center`}
    >
      {/* Decorative shapes */}
      <AnimatePresence mode="wait">
        <div
          key={`shapes-${index}`}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className={`absolute rounded-full ${currentSlide.accent} bg-opacity-20 backdrop-blur-sm`}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
              }}
              custom={i}
              variants={shapeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="w-full h-full"
                variants={floatAnimation}
                custom={i}
                animate="animate"
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="text-center flex flex-col items-center"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Icon */}
            <motion.div variants={iconVariants} className="text-white mb-6">
              {currentSlide.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl font-bold mb-4 text-white"
              variants={textVariants}
              custom={0}
            >
              {currentSlide.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-xl font-medium max-w-md mx-auto text-white/90"
              variants={textVariants}
              custom={1}
            >
              {currentSlide.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced bottom indicators */}
      <div className="absolute bottom-10 flex gap-3">
        {carouselContent.map((_, i) => (
          <button
            key={i}
            onClick={() => handleIndicatorClick(i)}
            className="group focus:outline-none"
            aria-label={`Go to slide ${i + 1}`}
          >
            <motion.span
              className={`h-2 block transition-all duration-300 relative ${
                i === index ? "w-16 bg-white" : "w-10 bg-white/40"
              } rounded-full overflow-hidden`}
              whileHover={{
                width: "4rem",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {i === index && (
                <motion.span
                  className="absolute inset-0 bg-white opacity-20"
                  animate={{
                    x: ["0%", "100%"],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </motion.span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingCarousel;
