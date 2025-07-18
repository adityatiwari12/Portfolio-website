"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Lightbulb, Users } from "lucide-react"

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
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
            About Me
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who I Am</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold mb-4">Innovation & Leadership</h3>
            <p className="text-muted-foreground mb-6">
              I am Aditya Tiwari, a third-year B.Tech student passionate about innovation, sustainability, and leadership. My academic journey focuses on leveraging technology to drive impactful change.
            </p>
            <p className="text-muted-foreground mb-6">
              My interests span technology, literature, and the arts. I actively participate in multiple college clubs,
              including anchoring, programming, and public speaking, which enhance my creativity and teamwork skills.
              Alongside academics, I am sharpening my technical expertise in DSA and web development to build a robust
              foundation for my career in technology.
            </p>
            <p className="text-muted-foreground">
              Driven by curiosity and a growth mindset, I aim to solve real-world challenges through sustainable
              innovations while inspiring those around me to pursue excellence. Let's connect and collaborate to create
              a brighter, more sustainable future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600/10 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Academic Excellence</h4>
                      <p className="text-muted-foreground">
                        Pursuing B.Tech in CSIT from Acropolis Institute of Technology and Research (2023-2027) with
                        focus on cutting-edge technologies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600/10 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Innovation Focus</h4>
                      <p className="text-muted-foreground">
                        Passionate about AI, sustainable technology, and creating solutions that make a positive impact
                        on society and the environment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Leadership & Community</h4>
                      <p className="text-muted-foreground">
                        Active leader in IEEE, Rotaract, and GeeksforGeeks communities, fostering collaboration and
                        technical excellence among peers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
