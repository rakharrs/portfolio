import "./legacy.css";
import Experience from "./Experience";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Projects from "./Projects";


export default function AboutPage() {
  return (
    <main className="about-page min-h-screen">
      <Navbar />
      <div className="about-main">
        <Hero />
        <Projects />
        <Experience />
      </div>
      <Footer />
    </main>
  );
}
