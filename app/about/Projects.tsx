"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X, ArrowLeft, ArrowRight, VideoOff } from 'lucide-react';
import { PROJECTS, Project, ProjectMedia } from './Constants';
import GalleryImage from './GalleryImage';

const Projects: React.FC = () => {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [lightbox, setLightbox] = useState<{ project: Project; media: ProjectMedia } | null>(null);
  const [videoError, setVideoError] = useState(false);

  const openLightbox = (project: Project, media: ProjectMedia) => {
    setVideoError(false);
    setLightbox({ project, media });
  };

  const project = PROJECTS[index];

  const go = (dir: number) => {
    setIndex(([current]) => {
      const next = (current + dir + PROJECTS.length) % PROJECTS.length;
      return [next, dir];
    });
  };

  const goTo = (target: number) => {
    setIndex(([current]) => [target, target > current ? 1 : -1]);
  };

  return (
    <section id="projects" className="about-section-card">
      {/* <span className="about-eyebrow">// 02 — Projects</span> */}
      <h2 className="about-h2">Projects I worked on</h2>
      <p className="about-lede" style={{ marginBottom: 20 }}>
        A mix of academic experiments and professional builds — from low-level rendering to
        production web platforms.
      </p>

      <div className="about-carousel">
        <div className="about-carousel-viewport">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.article
              key={project.id}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="about-project-card"
            >
              <div className="about-project-header">
                <div>
                  <div className="about-project-title">{project.title}</div>
                  <div className="about-project-meta">{project.role}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span className="about-badge">{project.category}</span>
                  <span className="about-project-meta">{project.period}</span>
                </div>
              </div>

              <div className="about-gallery">
                {project.media.map((item, i) => (
                  <GalleryImage
                    key={i}
                    src={item.src}
                    caption={item.caption}
                    type={item.type}
                    poster={item.poster}
                    onClick={() => openLightbox(project, item)}
                  />
                ))}
              </div>

              <div className="about-project-body">
                <p className="about-project-desc">{project.description}</p>

                <div className="about-tag-row">
                  {project.stack.map((tag) => (
                    <span key={tag} className="about-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {(project.link || project.github) && (
                  <div className="about-project-links">
                    {project.link && (
                      <a href={project.link} className="about-btn about-btn-secondary about-btn-sm">
                        <ExternalLink size={14} /> View
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} className="about-btn about-btn-secondary about-btn-sm">
                        <Github size={14} /> Source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="about-carousel-controls">
          <span className="about-carousel-counter">
            <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(PROJECTS.length).padStart(2, '0')}
          </span>

          <div className="about-carousel-dots">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${p.title}`}
                className={`about-carousel-dot${i === index ? ' active' : ''}`}
              />
            ))}
          </div>

          <div className="about-carousel-arrows">
            <button type="button" onClick={() => go(-1)} className="about-carousel-arrow" aria-label="Previous project">
              <ArrowLeft size={16} />
            </button>
            <button type="button" onClick={() => go(1)} className="about-carousel-arrow" aria-label="Next project">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="about-lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="about-lightbox-frame"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.media.type === 'video' ? (
                videoError ? (
                  <div className="about-lightbox-video-fallback">
                    <VideoOff size={28} strokeWidth={1.5} />
                    <p>
                      Video not available yet — drop the file at <code>{lightbox.media.src}</code>
                    </p>
                  </div>
                ) : (
                  <video
                    key={lightbox.media.src}
                    src={lightbox.media.src}
                    poster={lightbox.media.poster}
                    controls
                    autoPlay
                    onError={() => setVideoError(true)}
                    className="about-lightbox-video"
                  />
                )
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lightbox.media.src} alt={lightbox.media.caption} className="about-lightbox-img" />
              )}
              <div className="about-lightbox-caption">
                <span>
                  {lightbox.project.title} — {lightbox.media.caption}
                </span>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="about-btn about-btn-secondary about-btn-sm"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
