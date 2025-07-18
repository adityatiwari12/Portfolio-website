import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token || token.trim() === "") {
      console.error("GitHub token missing for contributions endpoint")
      return NextResponse.json(
        {
          error: "GitHub token not configured",
          details: "GITHUB_TOKEN environment variable is missing or empty",
        },
        { status: 500 },
      )
    }

    const currentYear = new Date().getFullYear()
    const query = `
      query($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `

    // Get username first
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

    const variables = {
      userName: username,
      from: `${currentYear}-01-01T00:00:00Z`,
      to: `${currentYear}-12-31T23:59:59Z`,
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Portfolio-App",
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "GitHub GraphQL API failed",
          details: errorData.message || `HTTP ${response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (data.errors) {
      return NextResponse.json(
        {
          error: "GraphQL query failed",
          details: data.errors.map((e: any) => e.message).join(", "),
        },
        { status: 400 },
      )
    }

    const contributions = data.data.user.contributionsCollection

    return NextResponse.json({
      year: currentYear,
      totalContributions: contributions.contributionCalendar.totalContributions,
      totalCommits: contributions.totalCommitContributions,
      totalIssues: contributions.totalIssueContributions,
      totalPRs: contributions.totalPullRequestContributions,
      totalReviews: contributions.totalPullRequestReviewContributions,
      calendar: contributions.contributionCalendar.weeks,
    })
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch contributions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
