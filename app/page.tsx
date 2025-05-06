import Link from "next/link"
import { ArrowRight, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-green-400">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="h-6 w-6" />
            <span className="font-bold">Terminal Zero</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login" className="text-sm font-medium text-gray-400 transition-colors hover:text-green-400">
                Sign In
              </Link>
              <Button asChild size="sm" className="bg-green-900 hover:bg-green-800 text-green-400">
                <Link href="/register">Register</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-black text-green-400">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Terminal Zero: 60 Levels of Hacking Mastery
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Master programming, cybersecurity, networking, and ethical hacking through 60 progressively
                    challenging levels.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-green-900 hover:bg-green-800 text-green-400">
                    <Link href="/game">
                      Start Hacking <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
                  >
                    <Link href="/leaderboard">View Leaderboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-gray-700 text-gray-400 hover:text-green-400 hover:bg-gray-800 hover:border-green-500"
                  >
                    <Link href="/test">Test Page</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg border border-gray-800 bg-black p-2 shadow-xl">
                  <div className="flex h-6 items-center border-b border-gray-800 px-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-xs text-gray-400">terminal@zero:~</div>
                  </div>
                  <div className="p-2 text-sm text-green-400 font-mono">
                    <p>Welcome to Terminal Zero v1.0</p>
                    <p>Type 'help' to see available commands</p>
                    <p className="flex items-center">
                      <span className="text-blue-400 mr-1">user@terminal-zero:~$</span>
                      <span className="animate-pulse">_</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                Master Real-World Hacking Skills
              </h2>
              <p className="max-w-[85%] leading-normal text-gray-400 sm:text-lg sm:leading-7">
                Learn by doing with our interactive terminal-based challenges. Progress through 60 levels covering
                everything from basic commands to advanced exploits.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 pt-8">
              {[
                { title: "Terminal Basics", levels: "1-10", icon: "Command" },
                { title: "Programming Logic", levels: "11-20", icon: "Code" },
                { title: "Web Hacking", levels: "21-30", icon: "Globe" },
                { title: "Networking", levels: "31-40", icon: "Network" },
                { title: "Cryptography", levels: "41-50", icon: "Lock" },
                { title: "Advanced Exploits", levels: "51-60", icon: "Shield" },
              ].map((track, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2 rounded-lg border border-gray-800 bg-gray-800/30 p-4 shadow-sm"
                >
                  <div className="rounded-full bg-green-900 p-2 text-green-400">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold">{track.title}</h3>
                  <p className="text-sm text-gray-400">Levels {track.levels}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-800 py-6 md:py-0 bg-gray-900">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Terminal Zero. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/about" className="underline underline-offset-4 hover:text-green-400">
              About
            </Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-green-400">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-4 hover:text-green-400">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
