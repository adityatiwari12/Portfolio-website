"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Calendar } from "lucide-react"

export default function Research() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const research = [
    {
      title: "Integrating Renewable Energy into ASIC-based Crypto Mining",
      journal: "TechRxiV",
      date: "October 2024",
      description:
        "This research presents a novel integrated framework incorporating renewable energy converters into ASIC-based cryptocurrency mining hardware. The proposed methodology aims to significantly ameliorate the environmental footprint of mining operations through reduced energy consumption from non-renewable sources.",
      keyFindings: [
        "37% reduction in carbon emissions",
        "Enhanced sustainability metrics",
        "Maintained computational efficiency",
        "Economic viability demonstrated",
      ],
      tags: ["Renewable Energy", "ASIC", "Cryptocurrency", "Sustainability"],
      link: "https://www.techrxiv.org/users/924946/articles/1296710-integrating-renewable-energy-converters-into-asic-based-cryptocurrency-mining-a-sustainable-paradigm-for-enhanced-energy-efficiency-and-reduced-environmental-impact?commit=cb7a4a75ba3e63d157989ec65268236c9b66a596",
      color: "bg-green-600",
    },
    {
      title: "K-dimensional Trees for Efficient Face Detection: Reducing Time Complexity from O(n) to O(log n)",
      journal: "TechRxiV",
      date: "May 2025",
      description:
        "This paper proposes an optimized approach leveraging K-dimensional trees to accelerate the matching phase in face detection pipelines. We demonstrate how K-d trees can reduce computational complexity for nearest neighbor searches in facial feature spaces.",
      keyFindings: [
        "85% reduction in search time",
        "O(log n) time complexity achieved",
        "Maintained accuracy levels",
        "Real-time application ready",
      ],
      tags: ["Computer Vision", "K-d Trees", "Face Detection", "Algorithms"],
      link: "https://doi.org/10.36227/techrxiv.174803737.71813266/v1",
      color: "bg-blue-600",
    },
  ]

  return (
    <section id="research" className="py-20">
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
            Research Work
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Published Research</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {research.map((paper, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={fadeIn}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${paper.color} p-3 rounded-full`}>
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 leading-tight">{paper.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{paper.date}</span>
                        </div>
                        <Badge variant="outline">{paper.journal}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{paper.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Findings:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {paper.keyFindings.map((finding, findingIndex) => (
                        <li key={findingIndex}>{finding}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {paper.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild className="w-full">
                    <a href={paper.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Full Paper
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
