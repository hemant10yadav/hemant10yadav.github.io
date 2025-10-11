"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { skill } from "../def/types";

export default function SkillSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const skills: skill[] = [
    { name: "JavaScript", icon: "/assets/javascript.png" },
    { name: "Java", icon: "/assets/java.png" },
    { name: "Python", icon: "/assets/python.png" },
    { name: "TypeScript", icon: "/assets/typescript.png" },
    { name: "HTML", icon: "/assets/HTML.png" },
    { name: "CSS", icon: "/assets/css.png" },
    { name: "Bootstrap", icon: "/assets/bootstrap.png" },
    { name: "Tailwind", icon: "/assets/Tailwind.png" },
    { name: "Angular", icon: "/assets/angular.png" },
    { name: "Ionic", icon: "/assets/ionic.png" },
    { name: "Spring Boot", icon: "/assets/spring.png" },
    { name: "React.js", icon: "/assets/react.png" },
    { name: "Node.js", icon: "/assets/node.png" },
    { name: "Express.js", icon: "/assets/express.png" },
    { name: "PostgreSQL", icon: "/assets/postgres.png" },
    { name: "MongoDB", icon: "/assets/mongo.png" },
    { name: "AWS", icon: "/assets/aws.png" },
    { name: "Jira", icon: "/assets/jira.png" },
    { name: "Git", icon: "/assets/git.png" },
  ];

  // Draw animated connecting lines between “related” skills
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.strokeStyle = "rgba(168, 85, 247, 0.20)";
      ctx!.lineWidth = 0.5;

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx!.beginPath();
            ctx!.moveTo(s1.x, s1.y);
            ctx!.lineTo(s2.x, s2.y);
            ctx!.stroke();
          }
        }
      }

      // Move stars
      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0 || s.x > canvas!.width) s.dx *= -1;
        if (s.y < 0 || s.y > canvas!.height) s.dy *= -1;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(236, 72, 153, 0.4)";
        ctx!.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Animated Galaxy Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Foreground Content */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-center mb-16"
        >
          Tech Stack
        </motion.h2>

        {/* Skill Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-10 place-items-center">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="group relative flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                type: "spring",
              }}
              whileHover={{
                scale: 1.2,
                rotate: 5,
                filter: "drop-shadow(0 0 10px rgba(236,72,153,0.7))",
              }}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 2,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={64}
                    height={64}
                    className="rounded-full shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/60 transition-shadow duration-300"
                  />
                </motion.div>
              </div>
              <p className="mt-3 text-sm md:text-base text-gray-300 group-hover:text-pink-400 transition-colors duration-300">
                {skill.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Faint Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.05),transparent_70%)] pointer-events-none" />
    </section>
  );
}
