"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"

interface NanoEditorProps {
  initialContent: string
  filename: string
  onSave: (content: string) => void
  onExit: () => void
}

export function NanoEditor({ initialContent, filename, onSave, onExit }: NanoEditorProps) {
  const [lines, setLines] = useState<string[]>(initialContent.split("\n"))
  const [cursorPosition, setCursorPosition] = useState({ row: 0, col: 0 })
  const [modified, setModified] = useState(false)
  const [mode, setMode] = useState<"edit" | "save" | "exit" | "help" | "search">("edit")
  const [searchQuery, setSearchQuery] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const [showCursor, setShowCursor] = useState(true)

  // Blink cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530) // Blink rate

    return () => clearInterval(interval)
  }, [])

  // Ensure cursor position is valid
  useEffect(() => {
    const validRow = Math.min(Math.max(0, cursorPosition.row), lines.length - 1)
    const validCol = Math.min(Math.max(0, cursorPosition.col), (lines[validRow] || "").length)

    if (validRow !== cursorPosition.row || validCol !== cursorPosition.col) {
      setCursorPosition({ row: validRow, col: validCol })
    }
  }, [cursorPosition, lines])

  // Focus the editor on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()

    // Handle Ctrl key combinations
    if (e.ctrlKey) {
      const key = e.key.toLowerCase()

      if (key === "x") {
        // Exit
        if (modified) {
          setMode("exit")
        } else {
          onExit()
        }
        return
      } else if (key === "o") {
        // Write out
        setMode("save")
        return
      } else if (key === "g") {
        // Help
        setMode("help")
        return
      } else if (key === "w") {
        // Search
        setMode("search")
        setSearchQuery("")
        return
      }
    }

    // Handle mode-specific actions
    if (mode === "exit") {
      if (e.key === "y" || e.key === "Y") {
        // Save and exit
        onSave(lines.join("\n"))
        onExit()
        return
      } else if (e.key === "n" || e.key === "N") {
        // Discard changes and exit
        onExit()
        return
      } else if (e.key === "c" || e.key === "C" || e.key === "Escape") {
        // Cancel exit
        setMode("edit")
        return
      }
    } else if (mode === "save") {
      if (e.key === "y" || e.key === "Y" || e.key === "Enter") {
        // Save
        onSave(lines.join("\n"))
        setModified(false)
        setMode("edit")
        return
      } else if (e.key === "c" || e.key === "C" || e.key === "Escape") {
        // Cancel save
        setMode("edit")
        return
      }
    } else if (mode === "help" || mode === "search") {
      // Any key returns to edit mode
      setMode("edit")
      return
    }

    // Handle navigation and editing in edit mode
    if (mode === "edit") {
      const { row, col } = cursorPosition

      if (e.key === "ArrowUp") {
        if (row > 0) {
          setCursorPosition({
            row: row - 1,
            col: Math.min(col, lines[row - 1].length),
          })
        }
      } else if (e.key === "ArrowDown") {
        if (row < lines.length - 1) {
          setCursorPosition({
            row: row + 1,
            col: Math.min(col, lines[row + 1].length),
          })
        }
      } else if (e.key === "ArrowLeft") {
        if (col > 0) {
          setCursorPosition({ row, col: col - 1 })
        } else if (row > 0) {
          // Move to end of previous line
          setCursorPosition({
            row: row - 1,
            col: lines[row - 1].length,
          })
        }
      } else if (e.key === "ArrowRight") {
        if (col < lines[row].length) {
          setCursorPosition({ row, col: col + 1 })
        } else if (row < lines.length - 1) {
          // Move to beginning of next line
          setCursorPosition({ row: row + 1, col: 0 })
        }
      } else if (e.key === "Backspace") {
        if (col > 0) {
          // Delete character in current line
          const newLines = [...lines]
          newLines[row] = lines[row].substring(0, col - 1) + lines[row].substring(col)
          setLines(newLines)
          setCursorPosition({ row, col: col - 1 })
          setModified(true)
        } else if (row > 0) {
          // Join with previous line
          const newLines = [...lines]
          const previousLineLength = newLines[row - 1].length
          newLines[row - 1] = newLines[row - 1] + newLines[row]
          newLines.splice(row, 1)
          setLines(newLines)
          setCursorPosition({ row: row - 1, col: previousLineLength })
          setModified(true)
        }
      } else if (e.key === "Delete") {
        if (col < lines[row].length) {
          // Delete character at cursor
          const newLines = [...lines]
          newLines[row] = lines[row].substring(0, col) + lines[row].substring(col + 1)
          setLines(newLines)
          setModified(true)
        } else if (row < lines.length - 1) {
          // Join with next line
          const newLines = [...lines]
          newLines[row] = newLines[row] + newLines[row + 1]
          newLines.splice(row + 1, 1)
          setLines(newLines)
          setModified(true)
        }
      } else if (e.key === "Enter") {
        // Split line at cursor
        const newLines = [...lines]
        const currentLine = newLines[row]
        newLines[row] = currentLine.substring(0, col)
        newLines.splice(row + 1, 0, currentLine.substring(col))
        setLines(newLines)
        setCursorPosition({ row: row + 1, col: 0 })
        setModified(true)
      } else if (e.key.length === 1) {
        // Insert character at cursor
        const newLines = [...lines]
        newLines[row] = lines[row].substring(0, col) + e.key + lines[row].substring(col)
        setLines(newLines)
        setCursorPosition({ row, col: col + 1 })
        setModified(true)
      }
    }
  }

  // Render the editor
  const renderEditor = () => {
    const { row, col } = cursorPosition

    // Create header
    const editorContent = []
    editorContent.push(`  GNU nano ${filename}${modified ? " (modified)" : ""}`)
    editorContent.push("─".repeat(76))

    // Add line numbers and content
    lines.forEach((line, index) => {
      const lineNum = (index + 1).toString().padStart(2, " ")

      // Highlight the current line
      if (index === row) {
        // Insert cursor at the right position
        const beforeCursor = line.substring(0, col)
        const afterCursor = line.substring(col)

        // Only show the block cursor, not the brackets
        editorContent.push(`${lineNum} ${beforeCursor}${showCursor ? "█" : " "}${afterCursor}`)
      } else {
        editorContent.push(`${lineNum} ${line}`)
      }
    })

    // Add empty line if no content
    if (lines.length === 0) {
      editorContent.push("  ")
    }

    // Add status bar and help
    editorContent.push("─".repeat(76))

    // Different footer based on mode
    if (mode === "save") {
      editorContent.push("File Name to Write: " + filename)
      editorContent.push("^G Get Help    ^C Cancel      ^Y Save")
    } else if (mode === "exit" && modified) {
      editorContent.push('Save modified buffer? (Answering "No" will DISCARD changes) ')
      editorContent.push("^Y Yes         ^N No          ^C Cancel")
    } else if (mode === "help") {
      editorContent.push("^G Help        ^O Write Out   ^W Search      ^K Cut Line    ^J Justify")
      editorContent.push("^X Exit        ^R Read File   ^ Replace     ^U Paste       ^T To Spell")
    } else if (mode === "search") {
      editorContent.push("Search: " + searchQuery)
      editorContent.push("^G Cancel      ^Y Search      ^C Case Sens   ^R Regexp")
    } else {
      // Default mode
      editorContent.push("^G Help        ^O Write Out   ^W Search      ^K Cut Line    ^J Justify")
      editorContent.push("^X Exit        ^R Read File   ^ Replace     ^U Paste       ^T To Spell")
    }

    // Add level-specific hints for script.js
    if (filename === "script.js" && lines.some((line) => line.includes("return a - b"))) {
      editorContent.push("")
      editorContent.push("Hint: The add function has a bug. It should add numbers, not subtract them.")
      editorContent.push("Change 'return a - b;' to 'return a + b;'")
      editorContent.push("Use Ctrl+O to save, then Ctrl+X to exit.")
    }

    return editorContent
  }

  return (
    <div
      ref={editorRef}
      className="whitespace-pre-wrap font-mono text-green-400 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {renderEditor().map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  )
}
