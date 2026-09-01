"use client";

import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { EXPERIENCE } from './Constants';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'work' | 'education';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work' },
  { id: 'education', label: 'Education' },
];

const Experience: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = EXPERIENCE.filter((item) => filter === 'all' || item.type === filter);

  return (
    <section id="experience" className="about-section-card">
      {/* <span className="about-eyebrow">// 03 — Journey</span> */}
      <h2 className="about-h2">Experience &amp; Education</h2>

      <div className="about-tabs" role="tablist">
        {FILTERS.map((f) => {
          const count = f.id === 'all' ? EXPERIENCE.length : EXPERIENCE.filter((item) => item.type === f.id).length;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn('about-tab-button', filter === f.id && 'active')}
            >
              {f.label}
              <span className="about-tab-count">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="about-exp-list">
        {visible.map((item) => (
          <div key={item.id} className={cn('about-exp-card', item.type === 'education' && 'education')}>
            <div className="about-exp-top">
              <div>
                <div className="about-exp-role" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.type === 'work' ? (
                    ""
                  ) : (
                    <GraduationCap size={16} className="text-[#a3a3a1]" />
                  )}
                  {item.role}
                </div>
                <div className="about-exp-company">{item.company}</div>
              </div>
              <span className="about-exp-period">{item.period}</span>
            </div>

            <p className="about-exp-desc">{item.description}</p>
            <br/>

            {item.skills.length > 0 && (
              <div className="about-tag-row">
                {item.skills.map((skill) => (
                  <span key={skill} className="about-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
