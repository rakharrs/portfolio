"use client";

import React, { useState } from 'react';
import { ImageOff, VideoOff, Play } from 'lucide-react';

interface GalleryImageProps {
  src: string;
  caption: string;
  type?: 'image' | 'video';
  poster?: string;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ src, caption, type = 'image', poster, onClick }) => {
  const [errored, setErrored] = useState(false);

  if (type === 'video') {
    if (!poster || errored) {
      return (
        <div className="about-gallery-item" style={{ cursor: 'default' }}>
          <div className="about-gallery-placeholder">
            <VideoOff size={18} strokeWidth={1.5} />
            <span>{caption}</span>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="about-gallery-item about-gallery-item-video"
        onClick={onClick}
        aria-label={`Play video: ${caption}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt={caption} onError={() => setErrored(true)} loading="lazy" />
        <span className="about-gallery-play">
          <Play size={18} fill="currentColor" />
        </span>
      </button>
    );
  }

  if (errored) {
    return (
      <div className="about-gallery-item" style={{ cursor: 'default' }}>
        <div className="about-gallery-placeholder">
          <ImageOff size={18} strokeWidth={1.5} />
          <span>{caption}</span>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="about-gallery-item" onClick={onClick} aria-label={caption}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption} onError={() => setErrored(true)} loading="lazy" />
    </button>
  );
};

export default GalleryImage;
