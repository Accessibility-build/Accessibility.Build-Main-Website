import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getUserStats } from "@/lib/credits";
import { type CreditTransaction, type ToolUsage } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Activity,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  ShoppingCart,
  RefreshCw,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let stats;
  let hasError = false;

  try {
    stats = await getUserStats();
  } catch (error) {
    console.error("Dashboard error:", error);
    hasError = true;
    // Provide fallback data
    stats = {
      currentCredits: 0,
      totalCreditsEarned: 0,
      totalCreditsUsed: 0,
      recentTransactions: [],
      recentUsage: [],
      user: null,
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container-wide py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome back, {user.firstName || "there"}! 👋
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Manage your credits and track your accessibility tool usage.
                </p>
              </div>
            </div>

            {hasError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Unable to load some data</span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  Some dashboard information may be unavailable. Please try
                  refreshing the page.
                </p>
              </div>
            )}
          </div>

          {/* Credit Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Credits
                </CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stats.currentCredits}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Available for use
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Total Earned
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stats.totalCreditsEarned}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lifetime credits earned
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Total Used
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stats.totalCreditsUsed}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lifetime credits used
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Credits Section */}
          <Card className="mb-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Need More Credits?
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Purchase credit packages to continue using our premium
                accessibility tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Starter */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-800/50 h-full">
                  {/* Spacer to align with 'Popular' badge column */}
                  <div className="h-6 mb-2" aria-hidden="true"></div>
                  <div className="flex flex-col h-full items-center text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white min-h-[28px] mb-2">
                      Starter Pack
                    </h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white min-h-[40px] mb-2">
                      50 Credits
                    </div>
                    <div className="text-xl text-slate-600 dark:text-slate-400 min-h-[28px] mb-4">
                      $4.99
                    </div>
                    <div className="mb-1 w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pro (featured) */}
                <div className="border-2 border-blue-600 dark:border-blue-500 rounded-xl p-6 bg-blue-50 dark:bg-blue-900/20 h-full">
                  <div className="flex justify-center mb-2">
                    <Badge className="bg-blue-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  <div className="flex flex-col h-full items-center text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white min-h-[28px] mb-2">
                      Pro Pack
                    </h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white min-h-[40px] mb-2">
                      200 Credits
                    </div>
                    <div className="text-xl text-slate-600 dark:text-slate-400 min-h-[28px] mb-4">
                      $14.99
                    </div>
                    <div className="mb-1 w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Business */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-800/50 h-full">
                  {/* Spacer to align with 'Popular' badge column */}
                  <div className="h-6 mb-2" aria-hidden="true"></div>
                  <div className="flex flex-col h-full items-center text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white min-h-[28px] mb-2">
                      Business Pack
                    </h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white min-h-[40px] mb-2">
                      500 Credits
                    </div>
                    <div className="text-xl text-slate-600 dark:text-slate-400 min-h-[28px] mb-4">
                      $29.99
                    </div>
                    <div className="mb-1 w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enterprise */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-800/50 h-full">
                  {/* Spacer to align with 'Popular' badge column */}
                  <div className="h-6 mb-2" aria-hidden="true"></div>
                  <div className="flex flex-col h-full items-center text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white min-h-[28px] mb-2">
                      Enterprise Pack
                    </h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white min-h-[40px] mb-2">
                      Custom
                    </div>
                    <div className="text-xl text-slate-600 dark:text-slate-400 min-h-[28px] mb-4">
                      Contact sales
                    </div>
                    <div className="w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Tabs */}
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Credit History
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Tool Usage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Your credit transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentTransactions.map(
                      (transaction: CreditTransaction) => (
                        <div
                          key={transaction.id}
                          className="
      flex items-center justify-between p-4
      border border-slate-200 dark:border-slate-700 rounded-xl
      hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors
      min-w-0
      max-[320px]:flex-col max-[320px]:items-start max-[320px]:gap-3
    "
                        >
                          {/* left area: icon + title/time */}
                          <div className="flex items-center gap-4 min-w-0 w-full">
                            <div
                              className={`flex-shrink-0 p-3 rounded-xl
          ${
            transaction.type === "usage"
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : transaction.type === "bonus"
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          }`}
                            >
                              {transaction.type === "usage" ? (
                                <ArrowDownRight className="h-5 w-5 max-[320px]:h-4 max-[320px]:w-4" />
                              ) : transaction.type === "bonus" ? (
                                <Gift className="h-5 w-5 max-[320px]:h-4 max-[320px]:w-4" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 max-[320px]:h-4 max-[320px]:w-4" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-900 dark:text-white truncate">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
                                {formatDistanceToNow(transaction.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>

                          {/* right area: amount + balance */}
                          <div
                            className="ml-4 text-right flex-shrink-0
                    max-[320px]:ml-0 max-[320px]:w-full max-[320px]:text-left max-[320px]:mt-1"
                          >
                            <p
                              className={`font-semibold text-lg ${
                                transaction.amount > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Balance: {transaction.balanceAfter}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Tool Usage History
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Track your accessibility tool usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentUsage.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Activity className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
                        No tool usage yet
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
                        Start using our accessibility tools to see your history
                        here.
                      </p>
                      <Link href="/tools">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Explore Tools
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentUsage.map((usage: ToolUsage) => (
                        <div
                          key={usage.id}
                          className={`
      p-4 border rounded-xl transition-colors
      hover:bg-slate-50 dark:hover:bg-slate-800/50
      border-slate-200 dark:border-slate-700
      min-w-0
      /* xs-xs2 → full column stacked */
      flex flex-col items-start gap-2

      /* xs3 */
      xs3:!flex-row xs3:gap-4

      /* md+ */
      md:!flex-row md:items-center md:justify-between md:gap-4
    `}
                        >
                          {/* ICON */}
                          <div className="flex-shrink-0">
                            <div
                              className="
        p-3 rounded-xl 
        bg-blue-100 dark:bg-blue-900/30 
        text-blue-600 dark:text-blue-400
      "
                            >
                              <Activity className="h-5 w-5" />
                            </div>
                          </div>

                          {/* RIGHT CONTENT BLOCK */}
                          <div className="flex-1 min-w-0 mt-3 xs3:mt-0 xs3:ml-2 md:ml-2">
                            {/* ROW 1 — Heading + Credits */}
                            <div
                              className={`
          flex items-start justify-between gap-2

          /* stack on xs & xs2 */
          xs:flex-col xs:items-start
          xs2:flex-col xs2:items-start

          /* row layout on xs3 & md+ */
          xs3:!flex-row xs3:items-center xs3:gap-4
          md:!flex-row md:items-center
        `}
                            >
                              <p className="font-medium text-slate-900 dark:text-white break-words capitalize">
                                {usage.tool.replace("_", " ")}
                              </p>

                              <p className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                {usage.creditsUsed} credit
                                {usage.creditsUsed !== 1 ? "s" : ""}
                              </p>
                            </div>

                            {/* ROW 2 — Time + Success Badge */}
                            <div
                              className={`
          flex items-center justify-between gap-3 mt-2

          /* stacked on xs & xs2 */
          xs:flex-col xs:items-start
          xs2:flex-col xs2:items-start

          /* row layout on xs3 & md+ */
          xs3:!flex-row xs3:items-center
          md:!flex-row md:items-center
      `}
                            >
                              {/* TIME */}
                              <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-normal">
                                {formatDistanceToNow(usage.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>

                              {/* SUCCESS / FAILURE BADGE */}
                              <Badge
                                variant={
                                  usage.success ? "default" : "destructive"
                                }
                                className={`
            text-xs px-3 py-1 whitespace-nowrap
            ${
              usage.success
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : ""
            }
          `}
                              >
                                {usage.success ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1 inline" />
                                    Success
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1 inline" />
                                    Failed
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
