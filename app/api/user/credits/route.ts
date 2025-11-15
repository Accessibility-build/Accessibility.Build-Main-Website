import { NextResponse } from "next/server"
import { currentUser } from '@clerk/nextjs/server'
import { getUserStats } from '@/lib/credits'
import { errorLogger } from "@/lib/error-logger"

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ 
        error: "Authentication required" 
      }, { status: 401 })
    }

    // Get user's credit stats
    const stats = await getUserStats(user.id)
    
    return NextResponse.json({
      currentCredits: stats.currentCredits,
      totalCreditsEarned: stats.totalCreditsEarned,
      totalCreditsUsed: stats.totalCreditsUsed
    })

  } catch (error) {
    console.error("Error fetching user credits:", error)
    
    errorLogger.logMajorError("Failed to fetch user credits", {
      component: "user-credits-api",
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json({ 
      error: "Failed to fetch credits" 
    }, { status: 500 })
  }
} 