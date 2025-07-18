import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN

    // Better token validation
    if (!token || token.trim() === "") {
      console.error(
        "GitHub token missing. Available env vars:",
        Object.keys(process.env).filter((key) => key.includes("GITHUB")),
      )
      return NextResponse.json(
        {
          error: "GitHub token not configured",
          details: "GITHUB_TOKEN environment variable is missing or empty",
          availableEnvVars: Object.keys(process.env).filter((key) => key.includes("GITHUB")),
        },
        { status: 500 },
      )
    }

    console.log("Token found, length:", token.length)

    // First get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
    })

    if (!userResponse.ok) {
      const errorData = await userResponse.json()
      console.error("GitHub user API error:", errorData)
      return NextResponse.json(
        {
          error: "GitHub authentication failed",
          details: errorData.message,
          status: userResponse.status,
        },
        { status: userResponse.status },
      )
    }

    const userData = await userResponse.json()
    const username = userData.login

    console.log(`Fetching repos for user: ${username}`)

    // Try both user repos and authenticated user repos
    const endpoints = [
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&type=owner`,
      `https://api.github.com/user/repos?sort=updated&per_page=10&type=owner&affiliation=owner`,
    ]

    let repos = []
    let lastError = null

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Portfolio-App",
          },
        })

        if (response.ok) {
          repos = await response.json()
          console.log(`Found ${repos.length} repos from ${endpoint}`)
          break
        } else {
          const errorData = await response.json()
          lastError = errorData
          console.error(`Error from ${endpoint}:`, errorData)
        }
      } catch (error) {
        console.error(`Network error for ${endpoint}:`, error)
        lastError = error
      }
    }

    if (!Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json(
        {
          error: "No repositories found",
          details: lastError,
          username: username,
          public_repos: userData.public_repos,
        },
        { status: 404 },
      )
    }

    // Filter and format the data - include forks and private repos for debugging
    const formattedRepos = repos
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updatedAt: repo.updated_at,
        private: repo.private,
        fork: repo.fork,
        owner: repo.owner.login,
      }))
      .slice(0, 6)

    console.log(`Returning ${formattedRepos.length} formatted repos`)

    return NextResponse.json(formattedRepos)
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch repositories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
