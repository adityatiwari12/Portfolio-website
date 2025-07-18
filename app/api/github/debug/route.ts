import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      return NextResponse.json(
        {
          error: "GitHub token not configured",
          details: "GITHUB_TOKEN environment variable is missing",
        },
        { status: 500 },
      )
    }

    // Test basic authentication
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
    })

    const responseText = await userResponse.text()
    let userData
    try {
      userData = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json(
        {
          error: "Invalid JSON response from GitHub",
          status: userResponse.status,
          response: responseText,
        },
        { status: 500 },
      )
    }

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          error: "GitHub API authentication failed",
          status: userResponse.status,
          message: userData.message || "Unknown error",
          documentation_url: userData.documentation_url,
        },
        { status: userResponse.status },
      )
    }

    // Test repositories endpoint
    const reposResponse = await fetch(`https://api.github.com/users/${userData.login}/repos?sort=updated&per_page=5`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
    })

    const reposData = await reposResponse.json()

    return NextResponse.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
      },
      repositories: {
        status: reposResponse.status,
        count: Array.isArray(reposData) ? reposData.length : 0,
        sample: Array.isArray(reposData)
          ? reposData.slice(0, 2).map((repo) => ({
              name: repo.name,
              private: repo.private,
              fork: repo.fork,
              stars: repo.stargazers_count,
            }))
          : reposData,
      },
      token_info: {
        token_length: token.length,
        token_prefix: token.substring(0, 10) + "...",
        token_valid: userResponse.ok,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
