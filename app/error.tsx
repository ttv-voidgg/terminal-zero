"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-green-400 p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="mb-4">Error details: {error.message}</p>
        <div className="bg-gray-900 p-4 rounded-md mb-4 text-left overflow-auto max-h-[200px]">
          <pre className="text-xs">{error.stack}</pre>
        </div>
        <Button onClick={reset} className="bg-green-900 hover:bg-green-800 text-green-400">
          Try again
        </Button>
      </div>
    </div>
  )
}
