"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Trophy, Terminal } from "lucide-react"
import { getAllTracks, getLevelsByTrack } from "@/lib/level-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mock user data - in a real app, this would come from a database
const userData = {
  username: "hackmaster",
  level: 15,
  xp: 140,
  rank: "Apprentice",
  completedLevels: Array.from({ length: 14 }, (_, i) => i + 1),
  badges: [
    { name: "First Steps", description: "Complete your first level", icon: "Award" },
    { name: "Terminal Novice", description: "Complete all levels in Terminal Basics", icon: "Terminal" },
    { name: "Quick Learner", description: "Complete a level in under 5 minutes", icon: "Clock" },
  ],
  stats: {
    totalTime: "8h 45m",
    averageTime: "35m",
    fastestLevel: "Level 7 (4m 30s)",
    totalCommands: 187,
  },
  achievements: [
    { name: "Terminal Master", description: "Complete all levels in Terminal Basics", progress: 100 },
    { name: "Programming Novice", description: "Complete 5 levels in Programming Logic", progress: 40 },
    { name: "Command Master", description: "Use 100 different commands", progress: 65 },
    { name: "Speed Hacker", description: "Complete a level in under 3 minutes", progress: 80 },
  ],
  recentActivity: [
    { action: "Completed Level 14", time: "2 hours ago" },
    { action: "Earned Badge: Quick Learner", time: "1 day ago" },
    { action: "Completed Level 13", time: "1 day ago" },
    { action: "Completed Level 12", time: "2 days ago" },
    { action: "Completed Level 11", time: "2 days ago" },
    { action: "Earned Badge: Terminal Novice", time: "3 days ago" },
    { action: "Completed Level 10", time: "3 days ago" },
  ],
}

export default function ProfilePage() {
  const [progress, setProgress] = useState(0)
  const [trackProgress, setTrackProgress] = useState<any[]>([])
  const [tracks, setTracks] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would check if the user is logged in
    // For now, we'll assume they are not logged in by default
    setIsLoggedIn(false)

    // Calculate overall progress (completed levels / total levels)
    setProgress((userData.completedLevels.length / 60) * 100)

    // Get all tracks
    const allTracks = getAllTracks()
    setTracks(allTracks)

    // Calculate progress for each track
    const trackProgressData = allTracks.map((track) => {
      const levelsInTrack = getLevelsByTrack(track)
      const completedLevelsInTrack = levelsInTrack.filter((level) => userData.completedLevels.includes(level.id))

      return {
        name: track,
        progress: (completedLevelsInTrack.length / levelsInTrack.length) * 100,
        completed: completedLevelsInTrack.length,
        total: levelsInTrack.length,
      }
    })

    setTrackProgress(trackProgressData)
  }, [])

  const handleSignInOut = () => {
    if (isLoggedIn) {
      // In a real app, this would call a logout function
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      setIsLoggedIn(false)
      router.push("/login")
    } else {
      // If not logged in, redirect to login page
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hacker Profile</h1>
            <p className="text-gray-400">Track your progress and achievements</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 border-gray-700 text-green-400">
                Level {userData.level}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-gray-800 text-green-400">
                XP: {userData.xp}
              </Badge>
              <Badge className="px-3 py-1 bg-green-900 text-green-400">Rank: {userData.rank}</Badge>
            </div>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-400">Overall Progress</CardTitle>
                <CardDescription className="text-gray-400">Your journey through Terminal Zero</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-400">{Math.round(progress)}%</span>
                <span className="text-sm text-gray-400">({userData.completedLevels.length}/60 levels)</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
              <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs text-gray-400">
                {tracks.map((track, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`h-1 w-full ${
                        i < Math.ceil(userData.level / 10)
                          ? "bg-green-500"
                          : i === Math.floor(userData.level / 10)
                            ? "bg-green-500/50"
                            : "bg-gray-800"
                      }`}
                    ></div>
                    <span className="mt-1">{track.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-2 bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="text-green-400">Learning Tracks</CardTitle>
              <CardDescription className="text-gray-400">Your progress through each skill track</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackProgress.map((track, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-400">{track.name}</span>
                      <span className="text-xs text-gray-400">
                        {track.completed}/{track.total} levels
                      </span>
                    </div>
                    <Progress value={track.progress} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="text-green-400">Statistics</CardTitle>
              <CardDescription className="text-gray-400">Your hacking metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-400">Total Time</span>
                  </div>
                  <span>{userData.stats.totalTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-400">Average Time per Level</span>
                  </div>
                  <span>{userData.stats.averageTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-400">Fastest Level</span>
                  </div>
                  <span>{userData.stats.fastestLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-400">Commands Used</span>
                  </div>
                  <span>{userData.stats.totalCommands}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="achievements" className="col-span-full md:col-span-2 lg:col-span-2">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
              >
                Badges
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
              >
                Recent Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="achievements"
              className="border border-gray-800 rounded-md p-4 bg-gray-900 text-gray-300"
            >
              <div className="space-y-4">
                {userData.achievements.map((achievement, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-400">{achievement.name}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                      <span className="text-sm text-green-400">{achievement.progress}%</span>
                    </div>
                    <Progress
                      value={achievement.progress}
                      className="h-2 bg-gray-800"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="badges" className="border border-gray-800 rounded-md p-4 bg-gray-900 text-gray-300">
              <div className="grid gap-4 md:grid-cols-2">
                {userData.badges.map((badge, i) => (
                  <div key={i} className="flex items-center space-x-4 rounded-lg border border-gray-800 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20">
                      <Award className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-400">{badge.name}</h4>
                      <p className="text-xs text-gray-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
                {/* Placeholder for locked badges */}
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 rounded-lg border border-gray-800 border-dashed p-3 opacity-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                      <Award className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-400">Locked Badge</h4>
                      <p className="text-xs text-gray-500">Keep hacking to unlock</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="activity" className="border border-gray-800 rounded-md p-4 bg-gray-900 text-gray-300">
              <div className="space-y-4">
                {userData.recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-green-400">{activity.action}</span>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
