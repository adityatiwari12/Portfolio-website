"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Building } from "lucide-react"

export default function Experience() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const experiences = [
    {
      title: "Vice Chair",
      organization: "IEEE Student Branch, AITR",
      type: "Full-time",
      duration: "Jan 2025 - Present",
      location: "Indore, India",
      description:
        "Leading IEEE community initiatives, organizing technical workshops, hackathons, and fostering innovation among members. Assisting the Chair in overseeing branch operations and managing subcommittees for strategic growth.",
      skills: ["Board Administration", "Committee Management", "Leadership", "Event Management"],
      color: "bg-blue-600",
    },
    {
      title: "Campus Ambassador",
      organization: "GeeksforGeeks",
      type: "Full-time",
      duration: "Dec 2024 - Present",
      location: "Remote",
      description:
        "Representing GeeksforGeeks brand on campus, organizing coding challenges, workshops, and webinars. Bridging the gap between students and coding opportunities while promoting technical learning resources.",
      skills: ["Event Management", "Community Building", "Technical Training"],
      color: "bg-green-600",
    },
    {
      title: "International Service Director (ISD)",
      organization: "Rotaract Club of Acropolis Royals",
      type: "Internship",
      duration: "Aug 2024 - Present",
      location: "Indore, India",
      description:
        "Fostering international collaborations, organizing cultural exchanges, and leading service projects. Coordinating letterhead and flag exchanges while building global connections with Rotaract clubs worldwide.",
      skills: ["Networking", "Team Management", "International Relations", "Project Management"],
      color: "bg-purple-600",
    },
    {
      title: "Frontend Developer",
      organization: "Fast and Right Services",
      type: "Internship",
      duration: "Aug 2024 - Sep 2024",
      location: "Indore, India (Remote)",
      description:
        "Developed responsive web interfaces using React.js, HTML, CSS, and JavaScript. Collaborated with design team to transform wireframes into functional interfaces with cross-browser compatibility.",
      skills: ["Front-End Development", "Web Design", "React.js"],
      color: "bg-orange-600",
    },
  ]

  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Experience
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Journey</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="relative mb-8 md:ml-16"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-20 top-6 w-4 h-4 ${experience.color} rounded-full hidden md:block`}
                ></div>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{experience.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{experience.organization}</span>
                          <Badge variant="outline" className="ml-2">
                            {experience.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{experience.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
