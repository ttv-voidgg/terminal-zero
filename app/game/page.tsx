"use client"

import { useState, useEffect } from "react"
import { Terminal } from "@/components/terminal/terminal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { processCommand } from "@/lib/command-processor"
import { getCurrentLevel, getLevelData } from "@/lib/level-service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [levelData, setLevelData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState("Novice")
  const { toast } = useToast()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // In a real app, this would come from the user's saved progress
    const level = getCurrentLevel()
    setCurrentLevel(level)

    const data = getLevelData(level)
    setLevelData(data)

    // Calculate progress (1 out of 60 levels)
    setProgress((level / 60) * 100)

    // Set initial XP (10 per level completed)
    setXp((level - 1) * 10)

    // Set rank based on level
    if (level <= 10) setRank("Novice")
    else if (level <= 20) setRank("Apprentice")
    else if (level <= 30) setRank("Hacker")
    else if (level <= 40) setRank("Cyber Specialist")
    else if (level <= 50) setRank("Master Hacker")
    else setRank("Elite Hacker")

    // In a real app, this would check if the user is logged in
    // For now, we'll assume they are not logged in by default
    setIsLoggedIn(false)
  }, [])

  const handleCommand = async (command: string) => {
    if (!levelData) return "Loading level data..."

    const result = await processCommand(command, currentLevel, levelData)

    // Check if we need to skip to a specific level (moderator command)
    if (result.skipToLevel) {
      const newLevel = result.skipToLevel
      const newXp = (newLevel - 1) * 10

      // Update rank if needed
      let newRank = "Novice"
      if (newLevel <= 10) newRank = "Novice"
      else if (newLevel <= 20) newRank = "Apprentice"
      else if (newLevel <= 30) newRank = "Hacker"
      else if (newLevel <= 40) newRank = "Cyber Specialist"
      else if (newLevel <= 50) newRank = "Master Hacker"
      else newRank = "Elite Hacker"

      setCurrentLevel(newLevel)
      setLevelData(getLevelData(newLevel))
      setProgress((newLevel / 60) * 100)
      setXp(newXp)
      setRank(newRank)

      // Show a toast notification
      toast({
        title: `[MODERATOR] Skipped to Level ${newLevel}`,
        description: `You've been granted moderator access to level ${newLevel}.`,
        duration: 5000,
      })

      return `${result.output}\n\nYou've been granted access to level ${newLevel}.`
    }

    // If the command completes the level, update the level
    if (result.levelCompleted) {
      const newLevel = currentLevel + 1
      const newXp = xp + 10

      // Update rank if needed
      let newRank = rank
      if (newLevel === 11) newRank = "Apprentice"
      else if (newLevel === 21) newRank = "Hacker"
      else if (newLevel === 31) newRank = "Cyber Specialist"
      else if (newLevel === 41) newRank = "Master Hacker"
      else if (newLevel === 51) newRank = "Elite Hacker"

      setCurrentLevel(newLevel)
      setLevelData(getLevelData(newLevel))
      setProgress((newLevel / 60) * 100)
      setXp(newXp)
      setRank(newRank)

      // Show a toast notification
      toast({
        title: `Level ${currentLevel} Completed!`,
        description: `You've earned 10 XP and advanced to level ${newLevel}.`,
        duration: 5000,
      })

      return `${result.output}\n\nYou've completed level ${currentLevel}. Moving to level ${newLevel}.`
    }

    return result.output
  }

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

  if (!levelData) {
    return <div className="flex h-screen items-center justify-center bg-black text-green-400">Loading...</div>
  }

  return (
    <div className="flex h-screen flex-col bg-black text-green-400">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold">Terminal Zero</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-gray-700 text-green-400">
                Level {currentLevel}
              </Badge>
              <div className="flex w-[200px] items-center">
                <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                <span className="ml-2 text-xs text-gray-400">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-gray-800 text-green-400">
              XP: {xp}
            </Badge>
            <Badge className="bg-green-900 text-green-400">Rank: {rank}</Badge>
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
      </header>
      <div className="container flex flex-1 gap-4 py-4">
        <div className="flex w-2/3 flex-col gap-4">
          <Terminal
            onCommand={handleCommand}
            className="h-[calc(100vh-8rem)]"
            welcomeMessage={[
              "Terminal Zero v1.0",
              `Level ${currentLevel}: ${levelData.title}`,
              "",
              levelData.description,
              "",
              "Type 'help' to see available commands for this level.",
            ]}
          />
        </div>
        <div className="flex w-1/3 flex-col gap-4">
          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="text-green-400">
                Level {currentLevel}: {levelData.title}
              </CardTitle>
              <CardDescription className="text-gray-400">Track: {levelData.track}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-300">{levelData.description}</p>
              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-green-400">Objectives:</h4>
                <ul className="list-inside list-disc space-y-1 text-gray-300">
                  {levelData.objectives.map((objective: string, i: number) => (
                    <li key={i}>{objective}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="commands" className="text-gray-300">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger
                value="commands"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
              >
                Commands
              </TabsTrigger>
              <TabsTrigger value="hints" className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400">
                Hints
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400">
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="commands" className="border border-gray-800 rounded-md p-4 min-h-[200px] bg-gray-900">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-2">Available commands for this level:</p>
                <div className="grid grid-cols-2 gap-2">
                  {levelData.commands &&
                    levelData.commands.map((cmd: string, i: number) => (
                      <div key={i} className="p-2 border border-gray-800 rounded bg-gray-800/30">
                        <code className="text-sm font-mono text-green-400">{cmd}</code>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="hints" className="border border-gray-800 rounded-md p-4 min-h-[200px] bg-gray-900">
              <div className="space-y-2">
                {levelData.hints.map((hint: string, i: number) => (
                  <div key={i} className="p-2 border border-gray-800 rounded bg-gray-800/30">
                    <p className="text-sm text-gray-300">{hint}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="border border-gray-800 rounded-md p-4 min-h-[200px] bg-gray-900">
              <textarea
                className="w-full h-[150px] p-2 text-sm bg-gray-800 border border-gray-700 rounded resize-none text-green-400"
                placeholder="Take notes here..."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
