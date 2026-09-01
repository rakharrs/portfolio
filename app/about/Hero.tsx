"use client";
import React from 'react';

// const STATS = [
//   { label: 'Experience', value: '2+ yrs' },
//   { label: 'Focus', value: 'Full-Stack' },
//   { label: 'Base', value: 'Madagascar' },
//   { label: 'Core Stack', value: 'Java / React' },
// ];

const Hero: React.FC = () => {
  return (
    <section id="hero" className="about-section-card">
      {/* <span className="about-eyebrow">// 01 — Profile</span> */}
      <h1 className="about-h1">
        Greetings, Adventurer.
      </h1>
      <span className="about-h1-rule" />
      <p className="about-lede">
        I&apos;m a computer science graduate and code warrior. Curious, autodidact, and passionate
        about technology — I like playing with data and blending clean engineering with cool design
        to build imperfectly cool applications.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
        <button
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="about-btn about-btn-primary"
        >
          View Projects
        </button>
        <button
          onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
          className="about-btn about-btn-secondary"
        >
          Journey
        </button>
      </div>

      {/* <div className="about-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="about-stat-card">
            <div className="about-stat-label">{s.label}</div>
            <div className="about-stat-value">{s.value}</div>
          </div>
        ))}
      </div> */}
    </section>
  );
};

export default Hero;
