"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProfileImageProps {
  profilePicUrl: string;
  size?: number;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  profilePicUrl,
  size = 384,
}) => {
  const profileControls = useAnimation();
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  // Generate particles once
  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, () => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      }))
    );
  }, []);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get user's timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get current hour in user's timezone
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      hour12: false,
      timeZone: tz,
    };
    const hourStr = new Intl.DateTimeFormat("en-US", options).format(now);
    const hour = parseInt(hourStr, 10);

    // Determine greeting
    let greet = "Hello!";
    if (hour >= 5 && hour < 12) greet = "Good morning! ☀️";
    else if (hour >= 12 && hour < 17) greet = "Good afternoon! 🌤️";
    else if (hour >= 17 && hour < 21) greet = "Good evening! 🌆";
    else greet = "Good night! 🌙";

    setGreeting(greet);

    // Hide greeting after 4 seconds
    const timer = setTimeout(() => setGreeting(""), 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Draggable container for image + halo */}
      <motion.div
        className="relative cursor-grab w-full h-full"
        drag
        dragElastic={0.3}
        dragMomentum={false}
        whileTap={{ cursor: "grabbing" }}
        animate={profileControls}
        onDragEnd={() => {
          profileControls.start({
            x: 0,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 },
          });
        }}
      >
        {/* Halo - moves with image */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl opacity-10 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #a855f7, #ec4899, #f43f5e)",
            zIndex: 0,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.03 }}
          transition={{
            duration: 3, // slower for subtle breathing
            repeat: Infinity,
            repeatType: "mirror", // smooth back and forth
            ease: "easeInOut",
          }}
        />

        {/* Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            style={{ top: `${p.y}%`, left: `${p.x}%` }}
            animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Profile Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/20 z-10">
          <Image
            src={profilePicUrl}
            alt="Profile"
            fill
            className="object-cover"
            priority
            draggable={false}
          />
        </div>

        {/* Greeting Tooltip */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.8,
            }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-purple-600/90 text-white px-5 py-3 rounded-2xl shadow-xl text-sm z-30 pointer-events-none
                    backdrop-blur-sm border border-white/20
                    before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
                    before:w-0 before:h-0
                    before:border-t-8 before:border-t-purple-600/90 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-0"
          >
            {greeting}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
