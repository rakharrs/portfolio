"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Atom, Coffee, Database, Terminal, ArrowDown } from 'lucide-react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 md:pt-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 grid-bg" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-none">
              Greetings <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black">Adventurer,</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              I&apos;m a computer science student and a code warrior. Curious, autodidact, and passionate about technology, 
              I love playing with data &
              blending cool design implementation with engineering to build 
              imperfectly cool applications.
            </p>

            {/* CTA Buttons */}
            <div className="font-departure flex flex-wrap gap-4">
              <button 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-lg shadow-black/5"
              >
                This portfolio is still in progress
                {/* <ArrowDown size={18} className="group-hover:translate-x-1 transition-transform" /> */}
              </button>
              <button 
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-background border border-border text-foreground rounded-full font-bold hover:bg-secondary transition-colors"
              >
                About Me
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Image & Floating Icons */}
        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end mt-12 md:mt-0">
        {/*
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
          >
            
            <div className="absolute inset-0 bg-gray-100 rounded-[2.5rem] rotate-3 overflow-hidden border border-white shadow-2xl">
                <Image 
                  src="/images/portrait.jpg" 
                  alt="Developer Portrait" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  fill
                />
            </div>
            
            
            <div className="absolute inset-0 border-2 border-gray-200 rounded-[2.5rem] -rotate-3 -z-10 bg-white/50" />

            <motion.div 
              className="absolute -top-8 -left-8 md:-left-12 p-4 bg-white rounded-2xl shadow-xl border border-gray-100/50"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              title="React"
            >
              <Atom size={42} className="text-gray-400" strokeWidth={1.5} />
            </motion.div>

            
            <motion.div 
              className="absolute top-1/2 -right-8 md:-right-12 p-4 bg-white rounded-2xl shadow-xl border border-gray-100/50"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
              title="Java"
            >
              <Coffee size={42} className="text-gray-400" strokeWidth={1.5} />
            </motion.div>

            
            <motion.div 
              className="absolute -bottom-8 left-8 md:left-12 p-4 bg-white rounded-2xl shadow-xl border border-gray-100/50"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              title="Backend & Data"
            >
              <Database size={36} className="text-gray-400" strokeWidth={1.5} />
            </motion.div>

            
             <motion.div 
              className="absolute top-0 right-4 md:right-0 p-3 bg-white rounded-xl shadow-lg border border-gray-100/50"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
              title="Python & Scripting"
            >
              <Terminal size={32} className="text-gray-400" strokeWidth={1.5} />
            </motion.div>

          </motion.div>
         */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-300 pointer-events-none"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;