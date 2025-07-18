"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Star, GitFork, GitCommit, ExternalLink, AlertCircle, Activity, Code2, Settings } from "lucide-react"

interface Repository {
  id: number
  name: string
  description: string
  language: string
  stars: number
  forks: number
  url: string
  updatedAt: string
  private?: boolean
  fork?: boolean
}

interface Commit {
  sha: string
  message: string
  date: string
  repo: string
  repoUrl: string
  commitUrl: string
}

interface Contributions {
  year: number
  totalContributions: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  totalReviews: number
}

export default function GitHubStats() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [contributions, setContributions] = useState<Contributions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenMissing, setTokenMissing] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    fetchGitHubData()
  }, [])

  const fetchGitHubData = async () => {
    setLoading(true)
    setError(null)
    setTokenMissing(false)

    try {
      const [reposRes, commitsRes, contributionsRes] = await Promise.allSettled([
        fetch("/api/github/repos"),
        fetch("/api/github/commits"),
        fetch("/api/github/contributions"),
      ])

      let hasData = false
      let isTokenMissing = false

      // Handle repositories
      if (reposRes.status === "fulfilled") {
        if (reposRes.value.ok) {
          const reposData = await reposRes.value.json()
          if (Array.isArray(reposData) && reposData.length > 0) {
            setRepos(reposData)
            hasData = true
          }
        } else {
          const errorData = await reposRes.value.json()
          console.error("Repos API error:", errorData)
          if (errorData.error === "GitHub token not configured") {
            isTokenMissing = true
          }
        }
      }

      // Handle commits
      if (commitsRes.status === "fulfilled") {
        if (commitsRes.value.ok) {
          const commitsData = await commitsRes.value.json()
          if (Array.isArray(commitsData) && commitsData.length > 0) {
            setCommits(commitsData)
            hasData = true
          }
        } else {
          const errorData = await commitsRes.value.json()
          console.error("Commits API error:", errorData)
          if (errorData.error === "GitHub token not configured") {
            isTokenMissing = true
          }
        }
      }

      // Handle contributions
      if (contributionsRes.status === "fulfilled") {
        if (contributionsRes.value.ok) {
          const contributionsData = await contributionsRes.value.json()
          setContributions(contributionsData)
          hasData = true
        } else {
          const errorData = await contributionsRes.value.json()
          console.error("Contributions API error:", errorData)
          if (errorData.error === "GitHub token not configured") {
            isTokenMissing = true
          }
        }
      }

      if (isTokenMissing) {
        setTokenMissing(true)
        setError("GitHub integration is not configured. Please set up your GitHub token to display live data.")
      } else if (!hasData) {
        setError("Failed to load GitHub data. Please try again later.")
      }
    } catch (err) {
      setError("Failed to load GitHub data. Please check your network connection and try again.")
      console.error("GitHub API error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      React: "bg-cyan-500",
      HTML: "bg-orange-500",
      CSS: "bg-blue-400",
      default: "bg-gray-500",
    }
    return colors[language] || colors.default
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return formatDate(dateString)
    }
  }

  // Show fallback content when token is missing
  if (tokenMissing) {
    return (
      <section id="github" className="py-20">
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
              GitHub Activity
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Code & Contributions</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <Alert className="mb-8">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  GitHub integration is not configured. Live data will be available once the GitHub token is set up.
                </span>
              </div>
            </AlertDescription>
          </Alert>

          {/* Static fallback content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeIn}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Featured Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Static project cards */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-blue-600 hover:text-blue-800">
                            <a
                              href="https://github.com/adityatiwari12/Portfolio-website"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              Portfolio-website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Personal portfolio website built with Next.js and Tailwind CSS
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>TypeScript</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>-</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>-</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-blue-600 hover:text-blue-800">
                            <a
                              href="https://github.com/JayeshMalviya1/AvashanAi"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              AvashanAi
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          AI-powered Lost & Found Human Identification System
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Python</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>-</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>-</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={fadeIn}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCommit className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">Live commit data will appear here</p>
                    <p className="text-sm">once GitHub integration is configured</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={fadeIn}
            className="text-center mt-8"
          >
            <Button variant="outline" asChild>
              <a href="https://github.com/adityatiwari12" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View Full Profile
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="github" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              GitHub Activity
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Code & Contributions</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="github" className="py-20">
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
            GitHub Activity
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Code & Contributions</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        {error && !tokenMissing && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Contributions Overview */}
        {contributions && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeIn}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {contributions.year} Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{contributions.totalContributions}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{contributions.totalCommits}</div>
                    <div className="text-sm text-muted-foreground">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{contributions.totalPRs}</div>
                    <div className="text-sm text-muted-foreground">Pull Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{contributions.totalIssues}</div>
                    <div className="text-sm text-muted-foreground">Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repositories */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Top Repositories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {repos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.map((repo) => (
                      <Card key={repo.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-blue-600 hover:text-blue-800">
                              <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                {repo.name}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </h4>
                            {repo.private && (
                              <Badge variant="secondary" className="text-xs">
                                Private
                              </Badge>
                            )}
                            {repo.fork && (
                              <Badge variant="outline" className="text-xs">
                                Fork
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {repo.description || "No description available"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                              {repo.language && (
                                <div className="flex items-center gap-1">
                                  <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                                  <span>{repo.language}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>{repo.stars}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                <span>{repo.forks}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No repositories found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Commits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeIn}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Recent Commits
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commits.length > 0 ? (
                  <div className="space-y-4">
                    {commits.slice(0, 8).map((commit, index) => (
                      <div key={`${commit.sha}-${index}`} className="border-l-2 border-blue-600 pl-4 pb-4">
                        <div className="flex items-start justify-between mb-1">
                          <a
                            href={commit.commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 hover:text-blue-800"
                          >
                            {commit.sha}
                          </a>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(commit.date)}</span>
                        </div>
                        <p className="text-sm mb-1 line-clamp-2">{commit.message}</p>
                        <a
                          href={commit.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-blue-600"
                        >
                          {commit.repo}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent commits found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={fadeIn}
          className="text-center mt-8"
        >
          <Button variant="outline" asChild>
            <a href="https://github.com/adityatiwari12" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View Full Profile
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
