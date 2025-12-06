"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { PROJECTS } from './Constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Projects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const currentProject = PROJECTS[activeIndex];

  return (
    <section id="projects" className="relative h-screen w-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black">
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-cover opacity-60"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 container mx-auto px-6 flex items-end md:items-center pb-24 md:pb-0">
            <div className="max-w-2xl text-white z-10 md:ml-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >

                <div className="font-departure flex flex-wrap gap-2 mb-4">
                  {currentProject.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-bold tracking-wider uppercase px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
                  {currentProject.title}
                </h2>

                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                  {currentProject.description}
                </p>

                {/* <div className="font-departure flex gap-4">
                  <a
                    href={currentProject.link}
                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    View Project <ExternalLink size={18} />
                  </a>
                  <a
                    href={currentProject.github}
                    className="px-6 py-3 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    Github <Github size={18} />
                  </a>
                </div> */}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-4 z-20">
        <button
          onClick={prevProject}
          className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={nextProject}
          className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Progress Bar / Dots */}
      <div className="absolute bottom-8 left-6 md:left-auto md:right-[200px] md:bottom-16 flex gap-2 z-20">
        {PROJECTS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1 transition-all duration-300 rounded-full",
              index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;