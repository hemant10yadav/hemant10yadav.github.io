"use client";

import { motion } from "framer-motion";
import { MessageForm } from "./MessageForm";

type Props = {
  onClose: () => void;
};

export const MessageModal = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-[420px] max-w-[90vw] rounded-2xl
                   bg-gradient-to-b from-gray-900 to-gray-950
                   border border-white/10 shadow-xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">Let’s Connect ✨</h3>
        <p className="text-gray-400 mb-6">
          Drop a message — I’ll get back to you.
        </p>

        <MessageForm />
      </motion.div>
    </div>
  );
};
