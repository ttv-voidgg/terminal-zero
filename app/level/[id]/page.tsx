"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, TerminalIcon, BookOpen, Target, Award } from "lucide-react"
import { getLevelData } from "@/lib/level-service"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function LevelPage() {
  const params = useParams()
  const router = useRouter()
  const [levelData, setLevelData] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would check if the user is logged in
    // For now, we'll assume they are not logged in by default
    setIsLoggedIn(false)

    const levelId = Number.parseInt(params.id as string, 10)
    if (isNaN(levelId)) {
      router.push("/game")
      return
    }

    const data = getLevelData(levelId)
    if (!data) {
      router.push("/game")
      return
    }

    setLevelData(data)
  }, [params.id, router])

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

  const levelId = Number.parseInt(params.id as string, 10)
  const prevLevel = levelId > 1 ? levelId - 1 : null
  const nextLevel = levelId < 60 ? levelId + 1 : null

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/game")}
              className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Terminal
            </Button>
            <h1 className="text-2xl font-bold">
              Level {levelData.id}: {levelData.title}
            </h1>
            <Badge variant="outline" className="border-gray-700 text-green-400">
              Track: {levelData.track}
            </Badge>
          </div>
          <div className="flex space-x-2">
            {prevLevel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/level/${prevLevel}`)}
                className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Level
              </Button>
            )}
            {nextLevel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/level/${nextLevel}`)}
                className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
              >
                Next Level
                <ArrowRight className="ml-2 h-4 w-4" />
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <BookOpen className="mr-2 h-5 w-5" />
                Level Description
              </CardTitle>
              <CardDescription className="text-gray-400">What you need to accomplish</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{levelData.description}</p>
              <div className="mb-4">
                <h4 className="mb-2 font-semibold flex items-center text-green-400">
                  <Target className="mr-2 h-4 w-4" />
                  Objectives:
                </h4>
                <ul className="list-inside list-disc space-y-1">
                  {levelData.objectives.map((objective: string, i: number) => (
                    <li key={i}>{objective}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold flex items-center text-green-400">
                  <Award className="mr-2 h-4 w-4" />
                  Success Condition:
                </h4>
                <p>{levelData.successCondition}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/game")}
                className="w-full bg-green-900 hover:bg-green-800 text-green-400"
              >
                <TerminalIcon className="mr-2 h-4 w-4" />
                Start Level in Terminal
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="text-green-400">Hints & Resources</CardTitle>
              <CardDescription className="text-gray-400">Need help? Check these hints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-green-400">Hints:</h4>
                <div className="space-y-2">
                  {levelData.hints.map((hint: string, i: number) => (
                    <div key={i} className="rounded border border-gray-800 bg-gray-800/30 p-2">
                      <p className="text-sm">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-green-400">Available Commands:</h4>
                <div className="flex flex-wrap gap-2">
                  {levelData.commands &&
                    levelData.commands.map((cmd: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-gray-800 text-green-400">
                        {cmd}
                      </Badge>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-green-400">Learning Resources:</h4>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <a href="#" className="text-green-400 underline">
                      {levelData.track} Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-green-400 underline">
                      Command Reference
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="bg-gray-900 border-gray-800 text-gray-300">
            <CardHeader>
              <CardTitle className="text-green-400">Track Progress</CardTitle>
              <CardDescription className="text-gray-400">Your journey through {levelData.track}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-900 text-green-400">
                      Level {levelData.id % 10 === 0 ? 10 : levelData.id % 10} of 10
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-400">
                      {Math.floor(((levelData.id % 10 === 0 ? 10 : levelData.id % 10) / 10) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                  <div
                    style={{ width: `${Math.floor(((levelData.id % 10 === 0 ? 10 : levelData.id % 10) / 10) * 100)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const levelNum = Math.floor((levelData.id - 1) / 10) * 10 + i + 1
                  const isCurrentLevel = levelNum === levelData.id
                  const isCompleted = levelNum < levelData.id

                  return (
                    <Button
                      key={i}
                      variant={isCurrentLevel ? "default" : isCompleted ? "outline" : "ghost"}
                      className={`h-10 w-10 p-0 ${
                        isCurrentLevel
                          ? "bg-green-900 text-green-400"
                          : isCompleted
                            ? "bg-green-900/20 border-gray-700 text-green-400"
                            : "text-gray-400 hover:text-green-400 hover:bg-gray-800"
                      }`}
                      onClick={() => router.push(`/level/${levelNum}`)}
                    >
                      {levelNum}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
