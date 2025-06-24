import { motion } from "framer-motion";
import Image from "next/image";
import {
  FileDown,
  Github,
  Linkedin,
  Mail,
  LucideProps,
  Layers,
} from "lucide-react";
import { event } from "nextjs-google-analytics";

export type SocialLink = {
  icon: React.ElementType<LucideProps>;
  link: string;
  title: string;
};

export const HeroSection = () => {
  const socialLinks: SocialLink[] = [
    {
      icon: Github,
      link: "https://github.com/hemant10yadav",
      title: "GitHub",
    },
    {
      icon: Linkedin,
      link: "https://www.linkedin.com/in/hemantyad",
      title: "Linkedin",
    },
    {
      icon: Mail,
      link: "mailto:hemant.10.yadav@gmail.com",
      title: "Mail",
    },
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
    event("external_links", {
      category: "Portfolio",
      label: key,
      value: 1,
    });
  };

  const getRoundedExperience = (): string => {
    const start = new Date("2021-12-01");
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const rounded = months >= 6 ? `${years}.5` : `${years}`;
    return `${rounded} years`;
  };

  const experience = getRoundedExperience();

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
                  Software Engineer with {experience} of experience building
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
                  onClick={handleResumeDownload}
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
                draggable="false"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
