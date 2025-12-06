import Experience from "./Experience";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Projects from "./Projects";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </main>
  );
}
