"use client";

import { motion } from "framer-motion";
import {
  FileDown,
  Github,
  Linkedin,
  Mail,
  LucideProps,
  Layers,
} from "lucide-react";
import { event } from "nextjs-google-analytics";
import { TypeAnimation } from "react-type-animation";
import { ProfileImage } from "./ProfileImage";

export type SocialLink = {
  icon: React.ElementType<LucideProps>;
  link: string;
  title: string;
};

export const HeroSection = () => {
  const socialLinks: SocialLink[] = [
    { icon: Github, link: "https://github.com/hemant10yadav", title: "GitHub" },
    {
      icon: Linkedin,
      link: "https://www.linkedin.com/in/hemantyad",
      title: "Linkedin",
    },
    { icon: Mail, link: "mailto:hemant.10.yadav@gmail.com", title: "Mail" },
    {
      icon: Layers,
      link: "https://stackoverflow.com/users/20470646/hemant-singh-yadav",
      title: "Stackoverflow",
    },
  ];

  const domain =
    "https://raw.githubusercontent.com/hemant10yadav/Resources/main/";
  const profilePicUrl = `${domain}hy-min.png`;
  const resumeUrl = `${domain}/Hemant-Software-Developer-Resume.pdf`;

  const handleResumeDownload = () => {
    event("resume_download", {
      category: "Portfolio",
      label: "Resume Downloads",
      value: 1,
    });
  };

  const handelExternalLink = (linkClicked: string) => {
    const key = `${linkClicked} visits`;
    event("external_links", { category: "Portfolio", label: key, value: 1 });
  };

  // --------------------------
  // Experience calculation
  // --------------------------
  const getRoundedExperience = (): string => {
    const start = new Date("2021-12-01");
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }

    return months >= 6 ? `${years}.5 years` : `${years} years`;
  };
  const experience = getRoundedExperience();

  return (
    <div>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      <section
        id="about"
        className="min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="container mx-auto px-6 py-16 relative">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Text Section */}
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
                  Hi, I&apos;m
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

                <TypeAnimation
                  sequence={[
                    "Software Engineer 💻",
                    2000,
                    "Python & Java Developer </>",
                    2000,
                    "Automation Enthusiast 🤖",
                    2000,
                    "AI Explorer 🚀",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="block text-2xl text-purple-400 font-medium mt-2"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl text-gray-400 leading-relaxed"
                >
                  Software Engineer with {experience} of experience building
                  scalable, high-performance systems. Passionate about blending
                  intuitive front-end design with robust back-end functionality.
                </motion.p>
              </div>

              {/* Resume Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6"
              >
                <a
                  href={resumeUrl}
                  onClick={handleResumeDownload}
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 rounded-lg transition-all hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-400/50"
                >
                  <FileDown size={20} />
                  Resume
                </a>
              </motion.div>

              {/* Social Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6"
              >
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      onClick={() => handelExternalLink(social.title)}
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
                      whileHover={{ y: -2 }}
                      title={social.title}
                    >
                      <IconComponent size={24} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Profile Image Section */}
            <div className="relative w-96 h-96 cursor-grab hidden md:block">
              <ProfileImage profilePicUrl={profilePicUrl} />
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.3, 1, 0.3, 1], y: [8, -4, 8] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-purple-400/80"
          >
            ↓ Scroll
          </motion.div>
        </div>
      </section>
    </div>
  );
};
