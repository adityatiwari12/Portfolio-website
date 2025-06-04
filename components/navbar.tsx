"use client"

import { useState, useEffect } from "react"
import { Menu, X, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ResumePreviewModal from "./resume-preview-modal"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  // Direct download link for Google Drive file
  const resumeDownloadUrl = "https://drive.google.com/uc?export=download&id=1uVHFS_uwAdEtPMGBr2myxVGH-f29HKn3"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Skills", href: "tech-stack" },
    { name: "Experience", href: "experience" },
    { name: "Research", href: "research" },
    { name: "Projects", href: "projects" },
    { name: "Contact", href: "contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="text-2xl font-bold text-primary">
            Aditya <span className="text-blue-600">Tiwari</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href={resumeDownloadUrl} download="AdityaTiwari-Resume.pdf">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </a>
              </Button>
              <Button variant="outline" onClick={() => setIsResumeModalOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                View CV
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={resumeDownloadUrl} download="AdityaTiwari-Resume.pdf">
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </a>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsResumeModalOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View CV
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      <ResumePreviewModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </header>
  )
}
