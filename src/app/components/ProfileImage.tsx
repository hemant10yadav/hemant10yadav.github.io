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
      </motion.div>
    </div>
  );
};
