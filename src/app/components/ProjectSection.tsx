import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { event } from "nextjs-google-analytics";

export const ProjectSection = () => {
  const [activeDemoUrl, setActiveDemoUrl] = useState<null | string>(null);

  const projects = [
    {
      title: "E-commerce",
      description:
        "Built a platform that allows users to intuitively browse and purchase products online. Focused on performance, security and scalability to support enterprise-level traffic.",
      githubLink: "https://github.com/hemant10yadav/E-Commerce-website",
      tech: [
        "java.png",
        "spring.png",
        "angular.png",
        "typescript.png",
        "postgres.png",
      ],
    },
    {
      title: "E-store",
      description:
        "Built reactive front-end with React for robust browsing and purchasing. Implemented secure, scalable backend with Node/Express APIs and MongoDB database.",
      githubLink: "https://github.com/hemant10yadav/Sell2U-Node",
      tech: [
        "typescript.png",
        "react.png",
        "node.png",
        "express.png",
        "mongo.png",
      ],
    },
    {
      title: "Book store",
      description:
        "A web application for browsing and searching books using the Google Books API. The application allows users to search for books by title, author, or keywords and provides details such as descriptions, authors, and publication information.",
      githubLink: "https://github.com/hemant10yadav/book-store",
      demoUrl: "https://hemant10yadav.github.io/book-store/",
      tech: ["bootstrap.png", "angular.png", "typescript.png"],
    },
  ];

  const handelExternalLink = (projectName: string) => {
    event("Code views", {
      category: "Portfolio",
      label: projectName,
      value: 1,
    });
  };

  const handleViewVideo = (videoName: string) => {
    event("Video views", {
      category: "Portfolio",
      label: videoName,
      value: 1,
    });
  };

  const handleViewDemoClick = (projectUrl: string, videoTitle: string) => {
    if (activeDemoUrl === projectUrl) {
      setActiveDemoUrl(null);
      return;
    }
    handleViewVideo(videoTitle);
    setActiveDemoUrl(projectUrl);
  };

  return (
    <>
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-center mb-16"
        >
          Projects
        </motion.h2>

        <div
          className="grid md:grid-cols-2 gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>

                <div className="flex gap-4">
                  {project.tech.map((tech, i) => (
                    <Image
                      key={i}
                      src={`/assets/${tech}`}
                      alt={tech}
                      width={32}
                      height={32}
                      className="object-contain"
                      loading="lazy"
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <motion.a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    whileHover={{ x: 5 }}
                    onClick={() => handelExternalLink(project.title)}
                  >
                    View Code <ExternalLink size={16} />
                  </motion.a>
                  {project.demoUrl && (
                    <motion.button
                      onClick={() =>handleViewDemoClick(project.demoUrl, project.title)}
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300"
                      whileHover={{ x: 5 }}
                    >
                      {activeDemoUrl === project.demoUrl
                        ? "Hide Demo"
                        : "Live Demo"}{" "}
                      <Play size={16} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Width Demo Section */}
      {activeDemoUrl && (
        <div className="p-28 mt-8 w-full">
          <div className="relative w-full " style={{ height: "80vh" }}>
            <div className="absolute inset-0">
              <iframe
                src={activeDemoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setActiveDemoUrl(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectSection;
