import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="about-footer">
      <div className="about-footer-links">
        <a
          target="_blank"
          href="https://github.com/rakharrs"
          className="about-footer-icon"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/rodolphe-yoann-rakoto-harisoa-a751b5314/"
          className="about-footer-icon"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a href="mailto:rodyox.yoann@gmail.com" className="about-footer-icon" aria-label="Email">
          <Mail size={18} />
        </a>
      </div>
      <p style={{ fontSize: 13 }}>
        © <span className="about-brand-seq">{new Date().getFullYear()} — Rodolphe Yoann</span>
      </p>
    </footer>
  );
};

export default Footer;
