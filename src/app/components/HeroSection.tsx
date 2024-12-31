import { motion } from "framer-motion";
import Image from "next/image";
import {
  FileDown,
  Github,
  Linkedin,
  Instagram,
  Mail,
  LucideProps,
} from "lucide-react";

export type SocialLink = {
  icon: React.ElementType<LucideProps>;
  link: string;
};

export const HeroSection = () => {
  const socialLinks: SocialLink[] = [
    {
      icon: Github,
      link: "https://github.com/hemant10yadav",
    },
    {
      icon: Linkedin,
      link: "https://www.linkedin.com/in/hemantyad",
    },
    {
      icon: Mail,
      link: "mailto:hemant.10.yadav@gmail.com",
    },
    {
      icon: Instagram,
      link: "https://www.instagram.com/h.e.m.a.n.t.10",
    },
  ];

  const domain =
    "https://raw.githubusercontent.com/hemant10yadav/Resources/main/";

  const profilePicUrl = `${domain}hy-min.png`;
  const resumeUrl = `${domain}/Hemant-Software-Developer-Resume.pdf`;

  return (
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

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl text-gray-400 leading-relaxed"
                >
                  Software Engineer with 3 years of experience building
                  scalable, high-performance systems. Passionate about blending
                  intuitive front-end design with robust back-end functionality.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6"
              >
                <a
                  href={resumeUrl}
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
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon; // Dynamically get the icon component
                  return (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
                      whileHover={{ y: -2 }}
                    >
                      <IconComponent size={24} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-96 h-96 hidden md:block"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20" />
              <Image
                src={profilePicUrl}
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
  );
};
