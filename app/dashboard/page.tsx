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

// Force dynamic rendering to avoid build-time Clerk initialization issues
export const dynamic = 'force-dynamic'
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Buy Credits Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Need More Credits?</h3>
                    <p className="text-blue-100 text-sm">Buy exactly what you need</p>
                  </div>
                </div>
                <p className="text-blue-50 mb-6">
                  Choose any amount from 100 to 50,000 credits with automatic volume discounts up to 20% off. Credits never expire!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    asChild 
                    className="bg-white text-blue-600 hover:bg-blue-50 flex-1"
                    size="lg"
                  >
                    <Link href="/pricing" className="flex items-center justify-center gap-2">
                      <Crown className="h-4 w-4" />
                      Buy Credits
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Purchase History Card */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    <Calendar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Purchase History</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">View all transactions</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Access your complete purchase history, download invoices, and track your credit usage over time.
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <Link href="/purchases" className="flex items-center justify-center gap-2">
                    View History
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

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
                  {stats.recentTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Coins className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
                        No transactions yet
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        Your first transaction will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentTransactions.map(
                        (transaction: CreditTransaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  transaction.type === "usage"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    : transaction.type === "bonus"
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {transaction.type === "usage" ? (
                                  <ArrowDownRight className="h-5 w-5" />
                                ) : transaction.type === "bonus" ? (
                                  <Gift className="h-5 w-5" />
                                ) : (
                                  <ArrowUpRight className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {transaction.description}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {formatDistanceToNow(transaction.createdAt, {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
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
                  )}
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
                          className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white capitalize">
                                {usage.tool.replace("_", " ")}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {formatDistanceToNow(usage.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {usage.creditsUsed} credit
                                {usage.creditsUsed !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <Badge
                              variant={
                                usage.success ? "default" : "destructive"
                              }
                              className={
                                usage.success
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : ""
                              }
                            >
                              {usage.success ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Success
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </>
                              )}
                            </Badge>
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
