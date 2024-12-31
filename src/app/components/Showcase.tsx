import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Maximize2, Monitor, Smartphone, Github, ExternalLink } from 'lucide-react';

type ShowcaseItem = {
  id: string;
  title: string;
  videoUrl: string;
  type: 'desktop' | 'mobile';
};

const Showcase = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const showcaseItems: ShowcaseItem[] = [
    {
      id: '2',
      title: 'Book Store',
      videoUrl: 'https://github.com/hemant10yadav/Resources/raw/main/BookStore.mp4',
      type: 'desktop'
    },
    {
      id: '3',
      title: 'Mobile Banking App',
      videoUrl: 'https://github.com/hemant10yadav/Resources/raw/main/studyAbroad.mp4',
      type: 'mobile'
    },
  ];

  return (
    <div className="py-16 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
      
      <div className="mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Portfolio
          </span>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showcaseItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              className="group relative bg-gradient-to-br from-purple-900/10 to-gray-900/20 rounded-3xl border border-purple-500/10 overflow-hidden backdrop-blur-sm"
            >
              <div className="p-6 flex flex-col md:flex-row gap-6 h-full">
                <div className={`relative ${item.type === 'mobile' ? 'w-48 mx-auto md:mx-0' : 'w-full md:w-2/3'}`}>
                  <div className={`relative ${item.type === 'mobile' ? 'pt-[216.5%]' : 'pt-[75%]'}`}>
                    <div className={`absolute inset-0 ${item.type === 'mobile' ? 'p-2' : ''} overflow-hidden rounded-2xl`}>
                      <motion.div
                        animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                      >
                        <video
                          src={item.videoUrl}
                          className="w-full h-full"
                          autoPlay
                          muted={isMuted}
                          loop
                          playsInline
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between md:w-1/3 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {item.type === 'desktop' ? (
                        <Monitor size={18} className="text-purple-400" />
                      ) : (
                        <Smartphone size={18} className="text-purple-400" />
                      )}
                      <span className="text-sm text-gray-400 font-medium">
                        {item.type === 'desktop' ? 'Web Application' : 'Mobile Application'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['React', 'TypeScript', 'Tailwind'].map((tech, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                      <Github size={20} className="text-purple-400" />
                    </button>
                    <button className="p-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                      <ExternalLink size={20} className="text-purple-400" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors ml-auto"
                    >
                      {isMuted ? <VolumeX size={20} className="text-purple-400" /> : <Volume2 size={20} className="text-purple-400" />}
                    </button>
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

export default Showcase;