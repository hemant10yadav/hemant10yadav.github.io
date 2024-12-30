import React from 'react';
import { motion } from "framer-motion";
import { Building2, Calendar, MapPin, Circle } from "lucide-react";

const ExperienceSection = () => {
  const experiences = [
    {
      role: "Software Engineer",
      company: "Dimagi",
      period: "Jun 2024 - Present",
      location: "Delhi, India · Remote",
      description: "Digital Solutions for Frontline Work",
      type: "Full-time",
      current: true
    },
    {
      role: "Software Engineer",
      company: "Xcaliber Infotech",
      period: "Sep 2022 - May 2024",
      location: "Pune, Maharashtra, India",
      description: "Led migration to Spring Boot 3.2.5, developed RESTful APIs, and implemented automated systems using CRON jobs",
      skills: ["Spring Boot", "Angular", "Hibernate", "REST APIs", "Amazon S3"],
      type: "Full-time"
    },
    {
      role: "Software Engineer",
      company: "Saral Technologies",
      period: "Dec 2021 - Aug 2022",
      location: "Pune, Maharashtra, India",
      description: "Upgraded platform UI, created reusable Angular components, and improved application performance",
      skills: ["Angular", "Bootstrap 5", "HTML5", "API Integration", "Unit Testing"],
      type: "Full-time"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-center mb-16"
      >
        Professional Journey
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 h-full w-px bg-purple-500/20 transform -translate-x-1/2" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12"
            >
              {/* Timeline node */}
              <div className="absolute left-0 md:left-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1">
                {exp.current ? (
                  <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse" />
                ) : (
                  <div className="w-4 h-4 mt-1 ml-1 bg-white/10 rounded-full" />
                )}
              </div>

              {/* Content layout changes based on even/odd */}
              <div className={`md:text-right ${index % 2 === 0 ? 'md:block' : 'md:hidden'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 md:justify-end text-purple-400">
                    <Building2 size={16} />
                    <span className="font-semibold">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 md:justify-end">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 md:justify-end">
                    <MapPin size={14} />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <div className={index % 2 === 0 ? 'md:hidden' : 'md:block'}>
                <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{exp.role}</h3>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  {exp.skills && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={index % 2 === 0 ? 'md:block' : 'md:hidden'}>
                <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{exp.role}</h3>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  {exp.skills && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`md:text-left ${index % 2 === 0 ? 'md:hidden' : 'md:block'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Building2 size={16} />
                    <span className="font-semibold">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;