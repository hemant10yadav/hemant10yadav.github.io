"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SkillWidget } from "./SkillWidget";
import { skill } from "../def/types";

export default function SkillSection() {
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

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative">
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
              whileHover={{ scale: 1.15, rotate: 3 }}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
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
                    className="rounded-full shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300"
                  />
                </motion.div>
              </div>
              <p className="mt-3 text-sm md:text-base text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                {skill.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
