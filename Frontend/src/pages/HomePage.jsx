import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const AnimatedShape = ({ delay, size, position, rotation, color }) => (
    <div
      className="absolute rounded-3xl opacity-20"
      style={{
        width: size.width,
        height: size.height,
        background: `linear-gradient(135deg, ${color}40, ${color}20, transparent)`,
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        animation: `shape-morph 12s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: "blur(1px)",
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
      }}
    />
  );

  const FloatingDot = ({ delay, size, position, color }) => (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}60 0%, ${color}30 50%, transparent 100%)`,
        left: position.x,
        top: position.y,
        animation: `dot-float 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: "blur(0.5px)",
      }}
    />
  );

  const WaveElement = ({ delay, position, color }) => (
    <div
      className="absolute opacity-10"
      style={{
        width: "200px",
        height: "100px",
        left: position.x,
        top: position.y,
        background: `linear-gradient(45deg, ${color}40, transparent)`,
        clipPath: "polygon(0% 50%, 15% 40%, 35% 60%, 50% 30%, 70% 55%, 85% 35%, 100% 50%, 100% 100%, 0% 100%)",
        animation: `wave-flow 10s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        @keyframes shape-morph {
          0%, 100% { 
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            transform: rotate(90deg) scale(1.1);
          }
          50% { 
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            transform: rotate(180deg) scale(0.9);
          }
          75% { 
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            transform: rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes dot-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-30px) translateX(20px) scale(1.2);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-15px) scale(0.8);
            opacity: 0.4;
          }
          75% { 
            transform: translateY(-25px) translateX(10px) scale(1.1);
            opacity: 0.7;
          }
        }
        
        @keyframes wave-flow {
          0%, 100% { 
            transform: translateX(0px) scaleY(1);
          }
          50% { 
            transform: translateX(50px) scaleY(1.3);
          }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes mesh-move {
          0%, 100% { 
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% { 
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% { 
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
        
        @keyframes particle-drift {
          0% { 
            transform: translateY(100vh) translateX(-50px) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 1;
          }
          90% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(-100px) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes text-glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(139, 69, 255, 0.5), 0 0 40px rgba(59, 130, 246, 0.3);
          }
          50% { 
            text-shadow: 0 0 30px rgba(139, 69, 255, 0.8), 0 0 60px rgba(59, 130, 246, 0.5);
          }
        }
        
        @keyframes button-ripple {
          0% { 
            transform: scale(0);
            opacity: 1;
          }
          100% { 
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #8B45FF 0%, #3B82F6 50%, #10B981 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hover-lift:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 20px 60px rgba(139, 69, 255, 0.3);
        }
        
        .text-glow {
          animation: text-glow 2s ease-in-out infinite alternate;
        }
        
        .button-modern {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #8B45FF 0%, #3B82F6 100%);
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          box-shadow: 0 10px 30px rgba(139, 69, 255, 0.3);
        }
        
        .button-modern:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px rgba(139, 69, 255, 0.4);
        }
        
        .button-modern:active {
          transform: translateY(-1px) scale(1.02);
        }
        
        .button-modern::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .button-modern:active::before {
          width: 300px;
          height: 300px;
          animation: button-ripple 0.6s ease-out;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .feature-card:hover::before {
          left: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-10px) rotateX(5deg);
          box-shadow: 0 25px 50px rgba(139, 69, 255, 0.2);
          border-color: rgba(139, 69, 255, 0.3);
        }
        
        @media (max-width: 768px) {
          .feature-card:hover {
            transform: translateY(-5px);
          }
        }
        
        .mesh-gradient {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.4;
          background: 
            radial-gradient(circle at 20% 80%, rgba(139, 69, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%);
          animation: mesh-move 20s ease-in-out infinite;
        }
        
        .particle-system {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #8B45FF, #3B82F6);
          border-radius: 50%;
          animation: particle-drift 25s linear infinite;
        }
        
        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 20%; animation-delay: 5s; }
        .particle:nth-child(3) { left: 30%; animation-delay: 10s; }
        .particle:nth-child(4) { left: 40%; animation-delay: 15s; }
        .particle:nth-child(5) { left: 50%; animation-delay: 20s; }
        .particle:nth-child(6) { left: 60%; animation-delay: 2s; }
        .particle:nth-child(7) { left: 70%; animation-delay: 7s; }
        .particle:nth-child(8) { left: 80%; animation-delay: 12s; }
        .particle:nth-child(9) { left: 90%; animation-delay: 17s; }
        .particle:nth-child(10) { left: 95%; animation-delay: 22s; }
      `}</style>

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              #0f0f23 0%, 
              #1a1a2e 15%, 
              #16213e 30%, 
              #0f3460 45%, 
              #1a1a2e 60%, 
              #16213e 75%, 
              #0f0f23 100%
            )
          `,
        }}
      >
        {/* Advanced Mesh Gradient Background */}
        <div className="mesh-gradient" />
        
        {/* Particle System */}
        <div className="particle-system">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Shapes */}
          <AnimatedShape 
            delay={0} 
            size={{width: "300px", height: "200px"}} 
            position={{x: "10%", y: "20%"}} 
            rotation={15}
            color="#8B45FF"
          />
          <AnimatedShape 
            delay={4} 
            size={{width: "250px", height: "300px"}} 
            position={{x: "70%", y: "10%"}} 
            rotation={-20}
            color="#3B82F6"
          />
          <AnimatedShape 
            delay={8} 
            size={{width: "200px", height: "250px"}} 
            position={{x: "60%", y: "60%"}} 
            rotation={10}
            color="#10B981"
          />

          {/* Floating Dots */}
          <FloatingDot delay={0} size="20px" position={{x: "15%", y: "70%"}} color="#8B45FF" />
          <FloatingDot delay={2} size="15px" position={{x: "85%", y: "30%"}} color="#3B82F6" />
          <FloatingDot delay={4} size="25px" position={{x: "25%", y: "40%"}} color="#10B981" />
          <FloatingDot delay={6} size="18px" position={{x: "75%", y: "80%"}} color="#8B45FF" />
          <FloatingDot delay={8} size="12px" position={{x: "45%", y: "15%"}} color="#3B82F6" />

          {/* Wave Elements */}
          <WaveElement delay={0} position={{x: "5%", y: "50%"}} color="#8B45FF" />
          <WaveElement delay={3} position={{x: "75%", y: "25%"}} color="#3B82F6" />
          <WaveElement delay={6} position={{x: "40%", y: "75%"}} color="#10B981" />

          {/* Interactive Grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 69, 255, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 69, 255, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />

          {/* Mouse-following Gradient */}
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(139, 69, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)`,
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              transition: "all 0.3s ease-out",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
          {/* Hero Section */}
          <div
            className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 relative text-glow gradient-text"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
              }}
            >
              Excel Analytics
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">Platform</span>
            </h1>

            <p
              className="text-xl sm:text-2xl lg:text-3xl mb-8 lg:mb-10 font-light text-white/80"
              style={{
                fontFamily: "'Poppins', system-ui, sans-serif",
                fontWeight: "300",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              Transform your data into{" "}
              <span className="gradient-text font-semibold">powerful insights</span>
            </p>

            <p
              className="text-lg sm:text-xl max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 text-white/60 font-light"
              style={{
                fontFamily: "'Poppins', system-ui, sans-serif",
              }}
            >
              Upload, analyze, and visualize your Excel data with cutting-edge AI technology
              and stunning interactive dashboards.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 lg:mb-24 transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <button
              onClick={() => navigate("/login")}
              className="button-modern w-full sm:w-auto"
              style={{
                fontFamily: "'Poppins', system-ui, sans-serif",
                minWidth: "160px",
              }}
            >
              <span className="relative z-10">Get Started</span>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden glass-card hover-lift"
              style={{
                borderColor: "rgba(139, 69, 255, 0.5)",
                color: "#ffffff",
                fontFamily: "'Poppins', system-ui, sans-serif",
                minWidth: "160px",
              }}
            >
              <span className="relative z-10">Learn More</span>
            </button>
          </div>

          {/* Feature Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto transition-all duration-1000 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {[
              {
                icon: "🎨",
                title: "Smart Visualization",
                desc: "AI-powered charts that adapt to your data patterns automatically",
                gradient: "from-purple-500 to-blue-500",
              },
              {
                icon: "🧠",
                title: "Intelligent Analysis",
                desc: "Machine learning insights that reveal hidden trends in your data",
                gradient: "from-blue-500 to-teal-500",
              },
              {
                icon: "⚡",
                title: "Real-time Processing",
                desc: "Lightning-fast data processing with instant visual feedback",
                gradient: "from-teal-500 to-purple-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card text-center group"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  className="text-6xl lg:text-7xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    filter: "drop-shadow(0 8px 20px rgba(139, 69, 255, 0.3))",
                  }}
                >
                  {feature.icon}
                </div>
                
                <h3
                  className="text-2xl lg:text-3xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feature.title}
                </h3>
                
                <p
                  className="text-lg leading-relaxed text-white/70 group-hover:text-white/90 transition-colors duration-300"
                  style={{
                    fontFamily: "'Poppins', system-ui, sans-serif",
                    fontWeight: "300",
                  }}
                >
                  {feature.desc}
                </p>

                {/* Card Accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, #8B45FF, #3B82F6, #10B981)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </>
  );
};

export default HomePage;