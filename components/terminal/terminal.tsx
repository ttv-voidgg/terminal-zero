"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TerminalProps {
  initialCommands?: string[]
  prompt?: string
  className?: string
  onCommand: (command: string) => Promise<string>
  welcomeMessage?: string[]
}

export function Terminal({
  initialCommands = [],
  prompt = "user@terminal-zero:~$",
  className,
  onCommand,
  welcomeMessage = ["Welcome to Terminal Zero v1.0", "Type 'help' to see available commands"],
}: TerminalProps) {
  const [history, setHistory] = useState<Array<{ type: "input" | "output"; content: string }>>([
    ...welcomeMessage.map((line) => ({ type: "output" as const, content: line })),
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Simple editor state
  const [editMode, setEditMode] = useState(false)
  const [editingFile, setEditingFile] = useState("")
  const [fileContent, setFileContent] = useState<string[]>([])
  const [currentEditLine, setCurrentEditLine] = useState(-1)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isProcessing) return

    const command = input.trim()
    setHistory((prev) => [...prev, { type: "input", content: command }])

    // Add command to history
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    setInput("")

    // Special handling for clear command
    if (command.toLowerCase() === "clear") {
      clearTerminal()
      return
    }

    // Handle edit mode
    if (editMode) {
      // Add the edit> prompt only to the current input line, not to the output
      setHistory((prev) => [...prev, { type: "input", content: command }])

      // Check for special commands in edit mode
      if (command.toLowerCase() === "save") {
        setIsProcessing(true)
        try {
          // Join the file content and send it to the backend
          const content = fileContent.join("\n")
          const output = await onCommand(`save ${editingFile} ${btoa(content)}`)
          setHistory((prev) => [...prev, { type: "output", content: output }])

          // Exit edit mode
          setEditMode(false)
          setEditingFile("")
          setFileContent([])
          setCurrentEditLine(-1)
        } catch (error) {
          setHistory((prev) => [
            ...prev,
            { type: "output", content: `Error saving file: ${(error as Error).message || "Unknown error"}` },
          ])
        } finally {
          setIsProcessing(false)
        }
        return
      } else if (command.toLowerCase() === "exit") {
        // Exit edit mode without saving
        setHistory((prev) => [...prev, { type: "output", content: `Exited editor without saving changes.` }])
        setEditMode(false)
        setEditingFile("")
        setFileContent([])
        setCurrentEditLine(-1)
        return
      } else if (command.toLowerCase() === "list") {
        // List the current file content
        let output = `Current content of ${editingFile}:\n`
        fileContent.forEach((line, index) => {
          output += `${index + 1}: ${line}\n`
        })
        setHistory((prev) => [...prev, { type: "output", content: output }])
        return
      } else if (command.toLowerCase().startsWith("edit:")) {
        // Edit a specific line
        try {
          const parts = command.split(":")
          if (parts.length >= 2) {
            const lineNum = Number.parseInt(parts[1], 10)
            if (isNaN(lineNum) || lineNum < 1 || lineNum > fileContent.length) {
              setHistory((prev) => [
                ...prev,
                { type: "output", content: `Invalid line number. Use a number between 1 and ${fileContent.length}.` },
              ])
              return
            }

            // If there's content after the second colon, use it as the new line content
            if (parts.length > 2) {
              const newContent = parts.slice(2).join(":")
              const newFileContent = [...fileContent]
              newFileContent[lineNum - 1] = newContent
              setFileContent(newFileContent)
              setHistory((prev) => [...prev, { type: "output", content: `Line ${lineNum} updated.` }])
            } else {
              // Just show the current line content
              setHistory((prev) => [
                ...prev,
                { type: "output", content: `Line ${lineNum}: ${fileContent[lineNum - 1]}` },
              ])
              setCurrentEditLine(lineNum)
            }
          }
        } catch (error) {
          setHistory((prev) => [
            ...prev,
            { type: "output", content: `Error editing line: ${(error as Error).message || "Unknown error"}` },
          ])
        }
        return
      } else if (currentEditLine > 0) {
        // If we're editing a specific line, update it with the current input
        const newFileContent = [...fileContent]
        newFileContent[currentEditLine - 1] = command
        setFileContent(newFileContent)
        setHistory((prev) => [...prev, { type: "output", content: `Line ${currentEditLine} updated.` }])
        setCurrentEditLine(-1)
        return
      }
    }

    // Check for edit command
    if (command.startsWith("edit ") || command.startsWith("sudo edit ")) {
      const parts = command.split(" ")
      const filename = parts[command.startsWith("sudo") ? 2 : 1]

      setIsProcessing(true)
      try {
        // Get the initial content from the backend
        const result = await onCommand(`cat ${filename}`)

        // Split the content into lines
        const lines = result.split("\n")

        // Enter edit mode
        setEditMode(true)
        setEditingFile(filename)
        setFileContent(lines)

        // Show instructions with lime-green text
        const instructions = [
          `<span style="color: lime;">Editing ${filename}. Available commands:</span>`,
          `<span style="color: lime;">- edit:N:content - Edit line N with new content</span>`,
          `<span style="color: lime;">- edit:N - Show line N for editing</span>`,
          `<span style="color: lime;">- list - Show all lines with numbers</span>`,
          `<span style="color: lime;">- save - Save changes and exit</span>`,
          `<span style="color: lime;">- exit - Exit without saving</span>`,
        ].join("\n")

        setHistory((prev) => [...prev, { type: "output", content: instructions }])

        // Show the file content
        let contentDisplay = `Current content of ${filename}:\n`
        lines.forEach((line, index) => {
          contentDisplay += `${index + 1}: ${line}\n`
        })
        setHistory((prev) => [...prev, { type: "output", content: contentDisplay }])
      } catch (error) {
        setHistory((prev) => [
          ...prev,
          { type: "output", content: `Error opening file: ${(error as Error).message || "Unknown error"}` },
        ])
        setEditMode(false)
      } finally {
        setIsProcessing(false)
      }
      return
    }

    setIsProcessing(true)

    try {
      const output = await onCommand(command)
      setHistory((prev) => [...prev, { type: "output", content: output }])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setHistory((prev) => [...prev, { type: "output", content: `Error: ${errorMessage}` }])
    } finally {
      setIsProcessing(false)
      // Focus the input after command processing is complete
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  const clearTerminal = () => {
    // Reset history to just the welcome message
    setHistory([...welcomeMessage.map((line) => ({ type: "output" as const, content: line }))])
    // Refocus the input after clearing
    inputRef.current?.focus()
  }

  // Handle keyboard shortcuts for command history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Keep focus on the input element
  useEffect(() => {
    // Initial focus
    inputRef.current?.focus()

    // Handle clicks inside the terminal to maintain focus
    const handleTerminalClick = (e: MouseEvent) => {
      if (terminalRef.current?.contains(e.target as Node)) {
        inputRef.current?.focus()
      }
    }

    // Handle global clicks to refocus if clicked elsewhere and then back on terminal
    const handleGlobalClick = (e: MouseEvent) => {
      if (terminalRef.current?.contains(e.target as Node)) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener("click", handleGlobalClick)
    terminalRef.current?.addEventListener("click", handleTerminalClick)

    return () => {
      document.removeEventListener("click", handleGlobalClick)
      terminalRef.current?.removeEventListener("click", handleTerminalClick)
    }
  }, [])

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border bg-black font-mono text-sm text-green-400 shadow-lg",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex h-6 items-center justify-between border-b border-gray-800 bg-gray-900 px-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400">terminal@zero</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 rounded-full text-gray-400 hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation()
            clearTerminal()
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear terminal</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 p-3 terminal-scrollbar" ref={terminalRef}>
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.type === "input" ? (
              <div className="flex">
                <span className="mr-2 text-blue-400">{editMode ? "edit>" : prompt}</span>
                <span>{entry.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: entry.content }} />
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <span className="mr-2 text-blue-400">{editMode ? "edit>" : prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400"
            autoFocus
            disabled={isProcessing}
          />
        </form>
      </ScrollArea>
    </div>
  )
}
