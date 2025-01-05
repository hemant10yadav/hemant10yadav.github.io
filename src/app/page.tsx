"use client";

import SkillSection from "./components/SkillSection";
import { ProjectSection } from "./components/ProjectSection";
import ExperienceSection from "./components/ExperienceSection";
import { NavBar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import Showcase from "./components/Showcase";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent">
        <GoogleAnalytics trackPageViews />
        <NavBar />
        <main className="pt-20">
          <HeroSection />
          <ExperienceSection />
          <section id="skills">
            <SkillSection />
          </section>
          <section id="projects">
            <ProjectSection />
          </section>
          <section className="mt-8">
            <Showcase />
          </section>
        </main>
      </div>
    </div>
  );
}
