import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ExcelAnalyticsLanding = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: "📤",
      title: "Upload Excel Files",
      description: "Drag & drop Excel files instantly",
    },
    {
      icon: "📊",
      title: "Visualize Data",
      description: "Create stunning charts automatically",
    },
    {
      icon: "⚙️",
      title: "Dynamic Axes",
      description: "Customize your data views",
    },
    {
      icon: "🧠",
      title: "AI Insights",
      description: "Get intelligent recommendations",
    },
    {
      icon: "🕓",
      title: "History Tracking",
      description: "Track all your analysis sessions",
    },
    {
      icon: "📥",
      title: "Export Charts",
      description: "Save in multiple formats",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const scaleHover = {
    scale: 1.05,
    y: -5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  const tapEffect = {
    scale: 0.95,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f2341] to-[#091c2b] text-white overflow-hidden">
      {/* Floating Bubbles - color changed to cyan */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-green-400"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚀 Powerful Features
          </motion.h2>
          <motion.p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Everything you need to transform your Excel data into actionable
            insights
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#112240] rounded-2xl p-6 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 border border-[#1e2a47]"
              whileHover={scaleHover}
              whileTap={tapEffect}
            >
              <div className="bg-green-500 bg-opacity-20 text-4xl rounded-full w-20 h-20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default ExcelAnalyticsLanding;
