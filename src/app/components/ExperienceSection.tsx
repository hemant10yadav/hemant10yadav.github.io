import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  CircleDot,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const ExperienceSection = () => {
  const experiences = [
    {
      role: "Software Engineer",
      company: "Dimagi Inc.",
      url: "https://dimagi.com/",
      location: "Delhi, India",
      type: "Full-time",
      skills: ["Python", "Django", "Docker", "AWS", "PostgreSQL"],
      current: true,
    },
    {
      role: "Software Engineer",
      company: "Xcaliber Infotech Pvt. Ltd.",
      url: "https://xcaliberinfotech.com/",
      location: "Pune, India",
      skills: ["Spring Boot", "Angular", "Hibernate", "REST APIs", "Amazon S3"],
      type: "Full-time",
    },
    {
      role: "Software Engineer",
      company: "Saral Technologies",
      location: "Pune, India",
      url: "https://saral.io/",
      skills: [
        "Angular",
        "Bootstrap 5",
        "HTML5",
        "API Integration",
        "Unit Testing",
      ],
      type: "Full-time",
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>
      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-purple-500/10 mb-6">
            <span className="px-4 py-1 text-sm font-medium text-purple-400 rounded-full">
              Career Journey
            </span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Professional Timeline
          </h2>
        </motion.div>

        <div className="relative">
          {/* Main timeline connector */}
          <div className="absolute left-[28px] md:left-[50%] top-0 h-full w-px bg-gradient-to-b from-purple-500/50 via-purple-400/30 to-transparent" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative mb-20 last:mb-0"
            >
              {/* Timeline node */}
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2">
                <div
                  className={`w-16 h-16 rounded-2xl rotate-45 flex items-center justify-center
                  ${
                    exp.current
                      ? "bg-purple-500/20 ring-2 ring-purple-500"
                      : "bg-gray-800 ring-2 ring-gray-700"
                  }`}
                >
                  <CircleDot
                    size={20}
                    className={`-rotate-45 ${
                      exp.current ? "text-purple-400" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Content card */}
              <div
                className={`ml-24 md:ml-0 md:w-[calc(50%-60px)] 
                ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
              >
                <div className="relative group">
                  {/* Connecting line */}
                  <div
                    className="hidden md:block absolute top-8 w-8 h-px bg-gradient-to-r from-purple-500/50 to-transparent
                    ${index % 2 === 0 ? '-right-8' : '-left-8'}"
                  />

                  <div
                    className="backdrop-blur-sm rounded-2xl p-8 bg-white/[0.02] border border-white/5
                    hover:bg-white/[0.05] transition-all duration-500 group-hover:shadow-xl
                    group-hover:shadow-purple-500/10"
                  >
                    {exp.current && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-sm text-purple-400 font-medium">
                          Present
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-2 items-center"
                            href={exp.url}
                          >
                            {exp.company} <ExternalLink size={16} />{" "}
                          </a>
                        </h3>
                        <div className="flex flex-wrap gap-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-purple-400" />
                            <span>{exp.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-purple-400" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 text-sm font-medium rounded-lg
                            bg-purple-500/10 text-purple-300 border border-purple-500/20
                            hover:bg-purple-500/20 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connection arrow for non-last items */}
                  {index < experiences.length - 1 && (
                    <div className="hidden md:block absolute -bottom-14 left-1/2 transform -translate-x-1/2">
                      <ArrowRight
                        size={20}
                        className="text-purple-500/30 rotate-90"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
