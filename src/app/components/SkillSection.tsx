import { motion } from "framer-motion";
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
    <section className="py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-center mb-16"
        >
          Tech Stack
        </motion.h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {skills.map((skill, index) => (
            <SkillWidget skill={skill} index={index} key={skill.name}/>
          ))}
        </div>
      </div>
    </section>
  );
}
