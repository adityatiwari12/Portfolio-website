import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    tokenLength: process.env.GITHUB_TOKEN?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter((key) => key.includes("GITHUB")),
  })
}
