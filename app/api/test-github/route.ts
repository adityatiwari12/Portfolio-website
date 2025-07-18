import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "No GitHub token found",
    })
  }

  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const user = await response.json()
      return NextResponse.json({
        success: true,
        message: `Token works! Connected as: ${user.login}`,
        user: {
          login: user.login,
          name: user.name,
          public_repos: user.public_repos,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Token is invalid or expired",
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to test token",
    })
  }
}
