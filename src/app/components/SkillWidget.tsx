import { motion } from "framer-motion";
import Image from "next/image";
import { FunctionComponent } from "react";

type Props = {
  skill: skill
  index: number;
};

export const SkillWidget: FunctionComponent<Props> = ({ skill, index }) => {
  return (
    <>
      <motion.div
        key={skill.name}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex flex-col items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={skill.icon}
          alt={skill.name}
          width={48}
          height={48}
          className="object-contain"
        />
        <span className="text-sm text-gray-400">{skill.name}</span>
      </motion.div>
    </>
  );
};
