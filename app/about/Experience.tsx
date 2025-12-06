"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { EXPERIENCE } from './Constants';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-secondary/5 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Journey</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-lg">
            My professional path and educational background.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2 ml-8 md:ml-0" />

          {EXPERIENCE.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center justify-between mb-12 md:mb-24 last:mb-0 ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Spacer for desktop alignment */}
                <div className="hidden md:block w-5/12" />

                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-16 md:w-12 h-16 md:h-12 flex items-center justify-center bg-background border-4 border-secondary rounded-full z-10 ml-0 md:ml-0 shadow-lg">
                   {item.type === 'work' ? (
                     <Briefcase className="w-5 h-5 text-primary" />
                   ) : (
                     <GraduationCap className="w-5 h-5 text-primary" />
                   )}
                </div>

                {/* Content Card */}
                <div className="w-full md:w-5/12 pl-20 md:pl-0">
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    {/* Decorative gradient blob */}
                    <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                    
                    <div className="flex items-center gap-2 text-sm text-primary font-bold mb-2 uppercase tracking-wider">
                      <Calendar size={14} />
                      {item.period}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{item.role}</h3>
                    <h4 className="text-muted-foreground font-medium mb-4">{item.company}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 bg-background rounded-md border border-border/50 text-foreground/80">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;