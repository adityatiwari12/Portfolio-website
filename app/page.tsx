import type { Metadata } from "next"
import Hero from "@/components/hero"
import About from "@/components/about"
import TechStack from "@/components/tech-stack"
import Experience from "@/components/experience"
import Research from "@/components/research"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import GitHubStats from "@/components/github-stats"

export const metadata: Metadata = {
  title: "Aditya Tiwari | Portfolio",
  description: "Professional portfolio of Aditya Tiwari - Computer Science Student & Tech Enthusiast",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Research />
        <Projects />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
