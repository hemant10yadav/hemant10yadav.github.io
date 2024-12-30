"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  FileDown,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SkillSection from "./components/SkillSection";
import { ProjectSection } from "./components/ProjectSection";
import ExperienceSection from "./components/ExperienceSection";

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-lg z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              HSY
            </motion.div>
            <div className="flex gap-8">
              {["about", "skills", "projects"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className={`capitalize ${
                    activeSection === item ? "text-purple-400" : "text-gray-400"
                  } hover:text-purple-400 transition-colors`}
                  onClick={() => setActiveSection(item)}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          </div>
          <section
            id="about"
            className="min-h-screen flex items-center relative overflow-hidden"
          >
            <div className="container mx-auto px-6 py-16">
              <div className="flex flex-col md:flex-row items-center gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 space-y-8"
                >
                  <div className="space-y-4">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium"
                    >
                      Hi, I'm
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-7xl font-bold"
                    >
                      <span className="block">Hemant</span>
                      <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Singh Yadav
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl text-gray-400 leading-relaxed"
                    >
                      Software Engineer with 3 years of experience in crafting
                      robust and scalable software systems. Bridging the gap
                      between front-end aesthetics and back-end functionality is
                      my forte.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6"
                  >
                    <a
                      href="https://raw.githubusercontent.com/hemant10yadav/Resources/main/Hemant-Software-Developer-Resume.pdf"
                      download
                      className="flex items-center gap-2 px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <FileDown size={20} />
                      Resume
                    </a>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6"
                  >
                    {[
                      {
                        icon: <Github size={24} />,
                        link: "https://github.com/hemant10yadav",
                      },
                      {
                        icon: <Linkedin size={24} />,
                        link: "https://www.linkedin.com/in/hemantyad",
                      },
                      {
                        icon: <Instagram size={24} />,
                        link: "https://www.instagram.com/h.e.m.a.n.t.10",
                      },
                      {
                        icon: <Mail size={24} />,
                        link: "mailto:hemant.10.yadav@gmail.com",
                      },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
                        whileHover={{ y: -2 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-96 h-96"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20" />
                  <Image
                    src="https://raw.githubusercontent.com/hemant10yadav/Resources/main/hemant-dp.gif"
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-purple-500/20"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </section>
        </div>
        <ExperienceSection />

        {/* Skills Section */}
        <section id="skills">
          <SkillSection />
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32">
          <ProjectSection />
        </section>
      </main>
    </div>
  );
}
