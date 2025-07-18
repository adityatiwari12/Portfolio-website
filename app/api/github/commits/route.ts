import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token || token.trim() === "") {
      console.error("GitHub token missing for commits endpoint")
      return NextResponse.json(
        {
          error: "GitHub token not configured",
          details: "GITHUB_TOKEN environment variable is missing or empty",
        },
        { status: 500 },
      )
    }

    // Get user info first
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
    })

    if (!userResponse.ok) {
      const errorData = await userResponse.json()
      return NextResponse.json(
        {
          error: "GitHub authentication failed",
          details: errorData.message,
        },
        { status: userResponse.status },
      )
    }

    const userData = await userResponse.json()
    const username = userData.login

    console.log(`Fetching commits for user: ${username}`)

    // Get user's repositories first
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Portfolio-App",
        },
      },
    )

    if (!reposResponse.ok) {
      const errorData = await reposResponse.json()
      return NextResponse.json(
        {
          error: "Failed to fetch repositories for commits",
          details: errorData.message,
        },
        { status: reposResponse.status },
      )
    }

    const repos = await reposResponse.json()
    console.log(`Found ${repos.length} repos to check for commits`)

    if (!Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json(
        {
          error: "No repositories found to fetch commits from",
          username: username,
        },
        { status: 404 },
      )
    }

    const recentCommits = []

    // Get commits from the most recently updated repositories
    for (const repo of repos.slice(0, 5)) {
      try {
        console.log(`Checking commits for repo: ${repo.name}`)

        // Try different approaches to get commits
        const commitEndpoints = [
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=3`,
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`,
        ]

        for (const endpoint of commitEndpoints) {
          try {
            const commitsResponse = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Portfolio-App",
              },
            })

            if (commitsResponse.ok) {
              const commits = await commitsResponse.json()
              console.log(`Found ${commits.length} commits in ${repo.name}`)

              commits.forEach((commit: any) => {
                // Only include commits by the authenticated user
                if (commit.author && commit.author.login === username) {
                  recentCommits.push({
                    sha: commit.sha.substring(0, 7),
                    message: commit.commit.message.split("\n")[0], // First line only
                    date: commit.commit.author.date,
                    repo: repo.name,
                    repoUrl: repo.html_url,
                    commitUrl: commit.html_url,
                  })
                }
              })
              break // Success, no need to try other endpoints
            } else {
              const errorData = await commitsResponse.json()
              console.error(`Error fetching commits from ${endpoint}:`, errorData)
            }
          } catch (error) {
            console.error(`Network error fetching commits from ${endpoint}:`, error)
          }
        }
      } catch (error) {
        console.error(`Error processing repo ${repo.name}:`, error)
      }
    }

    console.log(`Total commits found: ${recentCommits.length}`)

    // Sort by date and limit to 10 most recent
    recentCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(recentCommits.slice(0, 10))
  } catch (error) {
    console.error("Error fetching GitHub commits:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch commits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
