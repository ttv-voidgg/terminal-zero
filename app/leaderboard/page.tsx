"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, Clock, Award, Medal } from "lucide-react"
import { getAllUsers } from "@/lib/auth-service"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  level: number
  xp: number
  completedLevels: number[]
}

interface LeaderboardUser {
  rank: number
  username: string
  level: number
  xp: number
  badges: number
  fastestLevel: string
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([])
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardUser[]>([])
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)

        // In a real app, this would check if the user is logged in
        // For now, we'll assume they are not logged in by default
        setIsLoggedIn(false)

        // Sort users by XP for global leaderboard
        const sortedUsers = [...allUsers].sort((a, b) => b.xp - a.xp)

        // Create global leaderboard
        const global = sortedUsers.map((user, index) => ({
          rank: index + 1,
          username: user.username,
          level: user.level,
          xp: user.xp,
          badges: Math.floor(user.level / 5), // Mock badge count
          fastestLevel: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`, // Mock fastest level
        }))
        setGlobalLeaderboard(global)

        // Create monthly leaderboard (subset of global with different order)
        const monthly = [...global]
          .sort((a, b) => (a.level === b.level ? b.xp - a.xp : b.level - a.level))
          .slice(0, 10)
          .map((user, index) => ({ ...user, rank: index + 1 }))
        setMonthlyLeaderboard(monthly)

        // Create friends leaderboard (just a few users)
        const friends = global
          .filter(
            (user) =>
              user.username === "hackmaster" || user.username === "cyberNinja" || user.username === "c0d3br34k3r",
          )
          .sort((a, b) => b.xp - a.xp)
          .map((user, index) => ({ ...user, rank: index + 1 }))
        setFriendsLeaderboard(friends)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Filter global leaderboard based on search query
    const filtered = globalLeaderboard.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filtered.length > 0) {
      setGlobalLeaderboard(filtered)
    } else {
      // If no results, show a message or reset
      setGlobalLeaderboard([])
    }
  }

  const resetSearch = () => {
    setSearchQuery("")
    // Re-fetch or reset to original data
    const sortedUsers = [...users].sort((a, b) => b.xp - a.xp)
    const global = sortedUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.level,
      xp: user.xp,
      badges: Math.floor(user.level / 5),
      fastestLevel: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
    }))
    setGlobalLeaderboard(global)
  }

  const handleSignInOut = () => {
    if (isLoggedIn) {
      // In a real app, this would call a logout function
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      setIsLoggedIn(false)
    }
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex justify-center items-center">
        <div className="container">Loading leaderboard data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-gray-400">See how you rank against other hackers</p>
          </div>
          <div className="flex w-full items-center space-x-2 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search hackers..."
                className="pl-8 bg-gray-900 border-gray-700 text-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSearch}
              className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={resetSearch}
                className="text-gray-400 hover:text-green-400 hover:bg-gray-800"
              >
                Reset
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-green-400 hover:bg-gray-800">
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignInOut}
              className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 text-gray-300">
          <CardHeader>
            <CardTitle className="text-green-400">Hacker Rankings</CardTitle>
            <CardDescription className="text-gray-400">See who's leading the Terminal Zero challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="global" className="text-gray-300">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger
                  value="global"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
                >
                  Global
                </TabsTrigger>
                <TabsTrigger
                  value="friends"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
                >
                  Friends
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
                >
                  Monthly
                </TabsTrigger>
              </TabsList>

              <TabsContent value="global" className="mt-4">
                {globalLeaderboard.length > 0 ? (
                  <LeaderboardTable data={globalLeaderboard} />
                ) : (
                  <div className="text-center py-8 text-gray-300">
                    <p>No results found for "{searchQuery}"</p>
                    <Button variant="link" onClick={resetSearch} className="text-green-400 hover:text-green-300">
                      Reset search
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="friends" className="mt-4">
                <LeaderboardTable data={friendsLeaderboard} />
              </TabsContent>

              <TabsContent value="monthly" className="mt-4">
                <LeaderboardTable data={monthlyLeaderboard} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Top Level Reached</CardTitle>
              <Trophy className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Level {Math.max(...users.map((u) => u.level))}</div>
              <p className="text-xs text-gray-400">
                by {users.find((u) => u.level === Math.max(...users.map((u) => u.level)))?.username} (2 weeks ago)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Fastest Level Completion</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">1m 45s</div>
              <p className="text-xs text-gray-400">Level 12 by cyberNinja (3 days ago)</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Most Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {Math.max(...globalLeaderboard.map((u) => u.badges))} Badges
              </div>
              <p className="text-xs text-gray-400">
                by{" "}
                {
                  globalLeaderboard.find((u) => u.badges === Math.max(...globalLeaderboard.map((u) => u.badges)))
                    ?.username
                }{" "}
                (Global #
                {globalLeaderboard.findIndex((u) => u.badges === Math.max(...globalLeaderboard.map((u) => u.badges))) +
                  1}
                )
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LeaderboardTable({ data }: { data: any[] }) {
  return (
    <div className="rounded-md border border-gray-800">
      <div className="grid grid-cols-12 gap-2 border-b border-gray-800 bg-gray-800/50 p-4 text-sm font-medium">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Hacker</div>
        <div className="col-span-2 text-right">Level</div>
        <div className="col-span-2 text-right">XP</div>
        <div className="col-span-2 text-right">Badges</div>
        <div className="col-span-1 text-right">Best</div>
      </div>
      <div className="divide-y divide-gray-800">
        {data.map((user, i) => (
          <div
            key={i}
            className={`grid grid-cols-12 items-center gap-2 p-4 ${
              user.username === "hackmaster" ? "bg-green-900/10" : ""
            }`}
          >
            <div className="col-span-1 flex items-center">
              {user.rank <= 3 ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/20">
                  <Medal
                    className={`h-3 w-3 ${
                      user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-amber-600"
                    }`}
                  />
                </div>
              ) : (
                <span className="text-sm font-medium">{user.rank}</span>
              )}
            </div>
            <div className="col-span-4 flex items-center space-x-2">
              <span className="font-medium">{user.username}</span>
              {user.username === "hackmaster" && (
                <Badge variant="outline" className="ml-2 text-xs border-green-800 bg-green-900/20 text-green-400">
                  You
                </Badge>
              )}
            </div>
            <div className="col-span-2 text-right">{user.level}</div>
            <div className="col-span-2 text-right">{user.xp.toLocaleString()}</div>
            <div className="col-span-2 text-right">{user.badges}</div>
            <div className="col-span-1 text-right text-sm">{user.fastestLevel}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
