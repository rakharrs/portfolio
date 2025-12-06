import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        <div className="flex gap-6 mb-8">
          <a href="#" className="p-3 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
            <Github size={20} />
          </a>
          <a href="#" className="p-3 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
            <Twitter size={20} />
          </a>
          <a href="#" className="p-3 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
            <Linkedin size={20} />
          </a>
          <a href="#" className="p-3 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
            <Mail size={20} />
          </a>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          © <span className='font-departure'>{new Date().getFullYear()} - Rodolphe Yoann.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;