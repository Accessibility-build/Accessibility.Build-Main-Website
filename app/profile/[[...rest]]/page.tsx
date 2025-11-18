import { UserProfile } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserStats } from '@/lib/credits'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Calendar, 
  Crown,
  Settings,
  Coins
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

// Force dynamic rendering to avoid build-time Clerk initialization issues
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const stats = await getUserStats()

  return (
    <div className="container-wide py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account settings and view your accessibility journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName || 'User'}'s profile`}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">
                      {formatDistanceToNow(user.createdAt!, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Credits</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {stats.currentCredits}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Status</span>
                    <Badge className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">
                      <Settings className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Credits Earned</span>
                  <span className="font-medium">{stats.totalCreditsEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Credits Used</span>
                  <span className="font-medium">{stats.totalCreditsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tools Used</span>
                  <span className="font-medium">{stats.recentUsage.length}+</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clerk Profile Component - No card wrapper to prevent constraints */}
          <div className="lg:col-span-3">
            <div className="bg-background rounded-lg border min-h-[600px]">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">Account Settings</h2>
                <p className="text-muted-foreground mt-1">
                  Manage your personal information, security settings, and connected accounts.
                </p>
              </div>
              <div className="p-6">
                <UserProfile 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      cardBox: "shadow-none border-0 bg-transparent",
                      navbar: "border-b-0",
                      scrollBox: "max-h-none",
                      pageScrollBox: "max-h-none overflow-visible",
                      page: "min-h-0",
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 