// This file handles the processing of commands entered in the terminal

import { getLevelFileSystem } from "./level-service"

interface CommandResult {
  output: string
  levelCompleted: boolean
  skipToLevel?: number // Add this to allow skipping to a specific level
}

// Store user's current state
const userState = {
  currentDirectory: "/",
  environmentVariables: {},
  fileContents: {}, // Store edited file contents
  commandHistory: [],
  // Track extracted files for level 5
  extractedFiles: {} as Record<string, string>,
  // Track level-specific state
  levelState: {
    // Level 3: Track if permissions have been changed
    3: {
      permissionsChanged: false,
    },
    // Level 4: Track if script has been made executable
    4: {
      scriptExecutable: false,
    },
    // Level 5: Track if archive has been extracted
    5: {
      archiveExtracted: false,
    },
    // Level 6: Track if file has been found
    6: {
      fileFound: false,
    },
    // Level 8: Track if ls has been run
    8: {
      lsRun: false,
    },
    // Level 10: Track if script has been edited
    10: {
      scriptEdited: false,
    },
    // Level 12: Track if data.json has been viewed
    12: {
      dataJsonViewed: false,
    },
    // Level 13: Track if text.txt has been viewed
    13: {
      textFileViewed: false,
    },
  },
}

export async function processCommand(command: string, level: number, levelData: any): Promise<CommandResult> {
  try {
    // Add command to history
    userState.commandHistory.push(command)

    // Check if the command contains a pipe
    if (command.includes("|")) {
      return handlePipedCommand(command, level, levelData)
    }

    // Split the command into parts
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Special hidden moderator command to skip levels
    if (cmd === "mod_skip" || cmd === "!skip") {
      const targetLevel = Number.parseInt(args[0], 10)
      if (!isNaN(targetLevel) && targetLevel > 0 && targetLevel <= 60) {
        return {
          output: `[MODERATOR COMMAND] Skipping to level ${targetLevel}...`,
          levelCompleted: true,
          skipToLevel: targetLevel, // Add the target level to skip to
        }
      } else {
        return {
          output: `[MODERATOR COMMAND] Invalid level number. Usage: mod_skip [level_number] or !skip [level_number]`,
          levelCompleted: false,
        }
      }
    }

    // Get the file system for this level
    const fileSystem = getLevelFileSystem(level)

    // Common commands available across all levels
    switch (cmd) {
      // Handle save command (special command from the frontend)
      case "save":
        if (args.length >= 2) {
          const filename = args[0]
          const contentBase64 = args.slice(1).join(" ")

          try {
            // Decode the base64 content
            const content = atob(contentBase64)

            // Save the content
            userState.fileContents[filename] = content

            // Check if this completes level 10
            if (level === 10 && filename === "script.js" && content.includes("return a + b")) {
              userState.levelState[10].scriptEdited = true
              return {
                output: `File ${filename} saved successfully.`,
                levelCompleted: false,
              }
            }

            return {
              output: `File ${filename} saved successfully.`,
              levelCompleted: false,
            }
          } catch (error) {
            return {
              output: `Error saving file: ${error}`,
              levelCompleted: false,
            }
          }
        }
        return {
          output: "Invalid save command format",
          levelCompleted: false,
        }

      case "help":
        return {
          output: getHelpText(level, levelData, command),
          levelCompleted: false,
        }

      case "ls":
        // Track that ls has been run for level 8
        if (level === 8) {
          userState.levelState[8].lsRun = true
        }
        return handleLsCommand(args, fileSystem, level)

      case "cat":
        return handleCatCommand(args, fileSystem, level, levelData)

      case "echo":
        return {
          output: args.join(" "),
          levelCompleted: false,
        }

      case "clear":
        // The actual clearing is handled by the Terminal component
        return {
          output: "Terminal cleared",
          levelCompleted: false,
        }

      case "./script.sh":
        if (level === 4) {
          // Check if script has been made executable
          if (!userState.levelState[4].scriptExecutable) {
            return {
              output: "Permission denied: script.sh is not executable. Use 'chmod +x script.sh' to make it executable.",
              levelCompleted: false,
            }
          }
          return {
            output:
              "Hello, world!\nThis is a bash script.\nSecret code: ex3cut4bl3\n\nGreat job! You've successfully made the script executable and run it. This is a common task in Linux systems.",
            levelCompleted: true,
          }
        }
        return {
          output: "No such file or permission denied",
          levelCompleted: false,
        }

      case "chmod":
        return handleChmodCommand(args, fileSystem, level)

      case "find":
        return handleFindCommand(args, fileSystem, level)

      case "grep":
        return handleGrepCommand(args, fileSystem, level)

      case "tar":
        return handleTarCommand(args, fileSystem, level)

      case "env":
        return handleEnvCommand(args, level)

      case "export":
        return handleExportCommand(args, level)

      case "edit":
      case "sudo":
        if (cmd === "sudo" && args[0] === "edit" && args.length > 1) {
          return handleEditCommand(args.slice(1), level)
        } else if (cmd === "edit" && args.length > 0) {
          return handleEditCommand(args, level)
        }
        return {
          output: cmd === "sudo" ? "Usage: sudo [command]" : "Usage: edit [filename]",
          levelCompleted: false,
        }

      case "node":
        return handleNodeCommand(args, level)

      case "python":
        return handlePythonCommand(args, level)

      case "curl":
        return handleCurlCommand(args, level)

      case "ssh":
        return handleSshCommand(args, level)

      case "strings":
        return handleStringsCommand(args, level)

      case "docker":
        return {
          output: "Docker command simulated",
          levelCompleted: false,
        }

      case "wc":
        return handleWcCommand(args, level)
    }

    // Check if the command is a level-specific command that completes the level
    const result = checkLevelCompletion(cmd, args, level)
    if (result) {
      return result
    }

    // Default response for unrecognized commands
    return {
      output: `Command not found: ${cmd}. Type 'help' to see available commands.`,
      levelCompleted: false,
    }
  } catch (error) {
    console.error("Error processing command:", error)
    return {
      output: `An error occurred while processing your command: ${error instanceof Error ? error.message : "Unknown error"}`,
      levelCompleted: false,
    }
  }
}

// Handle piped commands (e.g., ls | wc -l)
function handlePipedCommand(command: string, level: number, levelData: any): CommandResult {
  // Split the command at the pipe
  const [firstCmd, secondCmd] = command.split("|").map((cmd) => cmd.trim())

  // Special case for Level 8 - ls | wc -l
  if (level === 8 && firstCmd === "ls" && secondCmd.startsWith("wc")) {
    return {
      output:
        "Command chaining successful! The directory contains 7 files.\n\nExcellent! You've learned how to use pipes to chain commands together. This is a powerful technique for combining simple commands to perform complex tasks.",
      levelCompleted: true,
    }
  }

  // For other piped commands, we would need to implement a more general solution
  // This is a simplified implementation for demonstration purposes
  return {
    output: "Pipe command not fully implemented for this scenario. Try a different approach.",
    levelCompleted: false,
  }
}

// Handle wc command
function handleWcCommand(args: string[], level: number): CommandResult {
  if (level === 8) {
    if (args.includes("-l")) {
      if (userState.levelState[8].lsRun) {
        return {
          output: "You're on the right track! Now try chaining 'ls' and 'wc -l' with a pipe (|).\nExample: ls | wc -l",
          levelCompleted: false,
        }
      } else {
        return {
          output:
            "You need to list the files first with 'ls' before counting them. Try 'ls' first, then 'wc -l', or chain them with 'ls | wc -l'.",
          levelCompleted: false,
        }
      }
    }
    return {
      output: "Usage: wc [options] [file]\nTry 'wc -l' to count lines.",
      levelCompleted: false,
    }
  }
  return {
    output: "Usage: wc [options] [file]\nTry 'wc -l' to count lines.",
    levelCompleted: false,
  }
}

// Helper function to get help text based on the level
function getHelpText(level: number, levelData: any, command: string): string {
  let helpText = "Available commands:\n"

  helpText += "  help - Show this help message\n"
  helpText += "  clear - Clear the terminal screen\n"
  helpText += "  ls - List files in the current directory\n"
  helpText += "  cat - Display the contents of a file\n"
  helpText += "  echo - Display a line of text\n"
  helpText += "  chmod - Change file permissions\n"
  helpText += "  find - Search for files\n"
  helpText += "  grep - Search for patterns in files\n"
  helpText += "  tar - Work with tar archives\n"
  helpText += "  env - Display environment variables\n"
  helpText += "  export - Set an environment variable\n"
  helpText += "  edit - Edit a file\n"
  helpText += "  node - Run a JavaScript file\n"
  helpText += "  python - Run a Python script\n"
  helpText += "  curl - Transfer data from or to a server\n"
  helpText += "  ssh - Connect to a remote server\n"
  helpText += "  strings - Print printable characters in files\n"
  helpText += "  docker - Manage Docker containers\n"
  helpText += "  ./[filename] - Execute a script\n"

  // Add level-specific help
  helpText += "\nLevel " + level + ": " + levelData.title + "\n"
  helpText += levelData.description + "\n\n"
  helpText += "Objectives:\n"
  levelData.objectives.forEach((objective: string) => {
    helpText += "- " + objective + "\n"
  })

  // Add level-specific hints
  if (level === 3) {
    helpText += "\nHint: Files have permissions that control who can read, write, or execute them.\n"
    helpText += "Use 'chmod +r locked.txt' to add read permissions to the file.\n"
    helpText += "Then use 'cat locked.txt' to read its contents.\n"
  } else if (level === 4) {
    helpText += "\nHint: Scripts need to be executable before they can be run.\n"
    helpText += "Use 'chmod +x script.sh' to make the script executable.\n"
    helpText += "Then run the script with './script.sh'.\n"
  } else if (level === 5) {
    helpText += "\nHint: Use 'tar -xzf backup.tar.gz' to extract the archive.\n"
    helpText += "The -x flag extracts, -z handles gzip compression, and -f specifies the file.\n"
    helpText += "After extraction, use 'cat password.txt' to read any extracted files.\n"
  } else if (level === 8) {
    helpText += "\nHint: Use the pipe (|) symbol to chain commands together. For example: ls | wc -l\n"
    helpText += "This will list files and count the number of lines in the output.\n"
  } else if (level === 10) {
    helpText += "\nHint: Use 'sudo edit script.js' to edit the script file with elevated permissions.\n"
    helpText += "Look for the bug in the add function (it's subtracting instead of adding).\n"
    helpText += "Fix the function by changing 'return a - b' to 'return a + b'.\n"
    helpText += "Use 'save' to save your changes and 'exit' to exit the editor.\n"
    helpText += "Then run the fixed script with 'node script.js'.\n"
  } else if (level === 11) {
    helpText += "\nHint: Use 'sudo edit array.js' to edit the script file.\n"
    helpText += "Add the line 'numbers.reverse();' to reverse the array.\n"
    helpText += "Use 'save' to save your changes and 'exit' to exit the editor.\n"
    helpText += "Then run the script with 'node array.js'.\n"
  } else if (level === 12) {
    helpText += "\nHint: Create a script that uses JSON.parse() to read data.json.\n"
    helpText += "Use 'cat data.json' to see the content, then 'edit parse.js' to create your script.\n"
    helpText += "Your script should extract the admin password from the users array.\n"
  } else if (level === 13) {
    helpText += "\nHint: Create a script that uses regular expressions to extract patterns.\n"
    helpText += "Use 'cat text.txt' to see the content, then 'edit regex.js' to create your script.\n"
    helpText += "Your script should extract email addresses and phone numbers.\n"
  }

  // Add moderator commands (hidden from regular help)
  if (command.includes("--mod") || command.includes("--admin")) {
    helpText += "\n[MODERATOR COMMANDS]\n"
    helpText += "  mod_skip [level] - Skip to a specific level\n"
    helpText += "  !skip [level] - Alternative syntax to skip to a level\n"
  }

  return helpText
}

// Handle ls command
function handleLsCommand(args: string[], fileSystem: any, level: number): CommandResult {
  const showHidden = args.includes("-a") || args.includes("--all")
  const showDetails = args.includes("-l")

  // Determine which directory to list
  let path = "/"
  args.forEach((arg) => {
    if (!arg.startsWith("-")) {
      path = arg
    }
  })

  // Check if the path exists
  if (!fileSystem[path]) {
    return {
      output: `ls: cannot access '${path}': No such file or directory`,
      levelCompleted: false,
    }
  }

  // Get files in the directory
  const files = Object.keys(fileSystem[path]).filter((file) => showHidden || !file.startsWith("."))

  // Add extracted files for level 5
  if (level === 5 && path === "/" && userState.levelState[5].archiveExtracted) {
    files.push("password.txt")
  }

  if (showDetails) {
    // Simulate ls -l output
    let output = "total " + files.length + "\n"
    files.forEach((file) => {
      // Simulate file permissions, owner, group, size, date, and name
      let permissions = "drwxr-xr-x"

      // Special case for level 3 and 4
      if (level === 3 && file === "locked.txt") {
        permissions = "-rw-------" // No read permission for others
      } else if (level === 4 && file === "script.sh") {
        permissions = userState.levelState[4].scriptExecutable ? "-rwxr-xr-x" : "-rw-r--r--" // No execute permission initially
      }

      output += `${permissions} 1 user group 4096 May 5 14:30 ${file}\n`
    })
    return {
      output,
      levelCompleted: false,
    }
  } else {
    // Simple listing
    return {
      output: files.join("\n"),
      levelCompleted: false,
    }
  }
}

// Handle cat command
function handleCatCommand(args: string[], fileSystem: any, level: number, levelData: any): CommandResult {
  if (args.length === 0) {
    return {
      output: "Usage: cat [filename]\nDisplays the contents of a file.",
      levelCompleted: false,
    }
  }

  const filename = args[0]

  // Check if the file has been edited by the user
  if (userState.fileContents[filename]) {
    if (level === 10 && filename === "script.js") {
      // Check if the script has been fixed
      if (userState.fileContents[filename].includes("return a + b")) {
        return {
          output: userState.fileContents[filename],
          levelCompleted: false,
        }
      }
    }
    return {
      output: userState.fileContents[filename],
      levelCompleted: false,
    }
  }

  // Handle paths properly
  if (filename.startsWith("/hidden/")) {
    // Special case for the hidden directory
    if (level === 6 && filename === "/hidden/secret_file.txt") {
      if (!userState.levelState[6].fileFound) {
        return {
          output: "You need to find the file first using the 'find' command before you can read it.",
          levelCompleted: false,
        }
      }

      if (fileSystem["/hidden"] && fileSystem["/hidden"]["secret_file.txt"]) {
        return {
          output:
            fileSystem["/hidden"]["secret_file.txt"] +
            "\n\nExcellent! You've successfully found and read the hidden file.",
          levelCompleted: true,
        }
      }
    }
  }

  // Special case for level 5 extracted files
  if (level === 5 && filename === "password.txt") {
    if (!userState.levelState[5].archiveExtracted) {
      return {
        output:
          "cat: password.txt: No such file or directory\n\nYou need to extract the archive first using 'tar -xzf backup.tar.gz'.",
        levelCompleted: false,
      }
    }
    return {
      output:
        "The password is: arch1v3d\n\nGreat job! You've successfully extracted the archive and read the password file. This demonstrates how to work with compressed archives in Linux.",
      levelCompleted: true,
    }
  }

  // Default case for files in the root directory
  const path = "/"
  if (!fileSystem[path][filename]) {
    return {
      output: `cat: ${filename}: No such file or directory`,
      levelCompleted: false,
    }
  }

  // Level-specific checks
  if (level === 1 && filename === "secret.txt") {
    return {
      output: fileSystem[path][filename] + "\n\nGreat job! You've learned how to read files using the 'cat' command.",
      levelCompleted: true,
    }
  } else if (level === 2 && filename === ".config") {
    return {
      output:
        fileSystem[path][filename] + "\n\nWell done! You've discovered how to view hidden files that start with a dot.",
      levelCompleted: true,
    }
  } else if (level === 3 && filename === "locked.txt") {
    // Check if permissions have been changed
    if (!userState.levelState[3].permissionsChanged) {
      return {
        output:
          "cat: locked.txt: Permission denied\n\nYou need to change the file permissions first using 'chmod +r locked.txt'.",
        levelCompleted: false,
      }
    }
    return {
      output:
        fileSystem[path][filename] +
        "\n\nExcellent! You've successfully changed the file permissions and read the file.",
      levelCompleted: true,
    }
  } else if (level === 12 && filename === "data.json") {
    // Track that data.json has been viewed
    userState.levelState[12].dataJsonViewed = true
    return {
      output:
        fileSystem[path][filename] +
        "\n\nNow you can see the JSON structure. Create a script to parse this data using 'edit parse.js'.",
      levelCompleted: false,
    }
  } else if (level === 13 && filename === "text.txt") {
    // Track that text.txt has been viewed
    userState.levelState[13].textFileViewed = true
    return {
      output:
        fileSystem[path][filename] +
        "\n\nNow you can see the text containing patterns. Create a script to extract them using 'edit regex.js'.",
      levelCompleted: false,
    }
  }

  return {
    output: fileSystem[path][filename],
    levelCompleted: false,
  }
}

// Handle chmod command
function handleChmodCommand(args: string[], fileSystem: any, level: number): CommandResult {
  if (args.length < 2) {
    return {
      output: "Usage: chmod [permissions] [filename]\nChanges the permissions of a file.\nExample: chmod +x script.sh",
      levelCompleted: false,
    }
  }

  const permissions = args[0]
  const filename = args[1]

  // Check if file exists
  const path = "/"
  if (!fileSystem[path][filename]) {
    return {
      output: `chmod: cannot access '${filename}': No such file or directory`,
      levelCompleted: false,
    }
  }

  if (level === 3 && filename === "locked.txt" && (permissions === "+r" || permissions === "644")) {
    // Update level state
    userState.levelState[3].permissionsChanged = true
    return {
      output: `Changed permissions of '${filename}' to allow reading.\nNow you can use 'cat locked.txt' to read the file.`,
      levelCompleted: false,
    }
  } else if (level === 4 && filename === "script.sh" && (permissions === "+x" || permissions === "755")) {
    // Update level state
    userState.levelState[4].scriptExecutable = true
    return {
      output: `Changed permissions of '${filename}' to allow execution.\nNow you can run the script with './script.sh'`,
      levelCompleted: false,
    }
  }

  return {
    output: `chmod: changed permissions of '${filename}'`,
    levelCompleted: false,
  }
}

// Handle find command
function handleFindCommand(args: string[], fileSystem: any, level: number): CommandResult {
  if (level === 6) {
    if (args.includes("/") && (args.includes("-name") || args.includes("secret"))) {
      // Update level state
      userState.levelState[6].fileFound = true
      return {
        output:
          "/hidden/secret_file.txt\n\nGreat! You found the hidden file. Now use 'cat /hidden/secret_file.txt' to read its contents.",
        levelCompleted: false,
      }
    } else if (args.length === 0) {
      return {
        output:
          "Usage: find [path] -name [pattern]\nSearches for files matching a pattern.\nExample: find / -name secret*",
        levelCompleted: false,
      }
    }
  }

  return {
    output:
      "No matching files found. Try using 'find / -name secret*' to search for files with 'secret' in their name.",
    levelCompleted: false,
  }
}

// Handle grep command
function handleGrepCommand(args: string[], fileSystem: any, level: number): CommandResult {
  if (args.length < 2) {
    return {
      output: "Usage: grep [pattern] [filename]\nSearches for a pattern in a file.\nExample: grep password logs.txt",
      levelCompleted: false,
    }
  }

  if (level === 7) {
    if (args.includes("password") && (args.includes("*") || args.includes("text.txt"))) {
      return {
        output:
          "text.txt:This file contains the word 'password' somewhere in it.\n\nGood start! Now try searching in other files like logs.txt.",
        levelCompleted: false,
      }
    } else if (args.includes("password") && args.includes("logs.txt")) {
      return {
        output:
          "logs.txt:2023-05-05 14:30:22 - User logged in with password: s3cretl0g\n\nExcellent! You found the password in the logs file. This demonstrates how grep can be used to find specific information in files.",
        levelCompleted: true,
      }
    }
  }

  return {
    output: "No matches found. Try searching for 'password' in different files.",
    levelCompleted: false,
  }
}

// Handle tar command
function handleTarCommand(args: string[], fileSystem: any, level: number): CommandResult {
  if (level === 5) {
    if (args.includes("-xzf") && args.includes("backup.tar.gz")) {
      // Update level state
      userState.levelState[5].archiveExtracted = true

      return {
        output:
          "Extracting backup.tar.gz...\nExtracted files:\npassword.txt\n\nGreat! You've extracted the archive. Now use 'cat password.txt' to read its contents.",
        levelCompleted: false,
      }
    } else {
      return {
        output:
          "Usage: tar -xzf [archive.tar.gz]\nExtracts files from a gzipped tar archive.\nExample: tar -xzf backup.tar.gz",
        levelCompleted: false,
      }
    }
  }

  return {
    output:
      "Usage: tar -xzf [archive.tar.gz]\nExtracts files from a gzipped tar archive.\nExample: tar -xzf backup.tar.gz",
    levelCompleted: false,
  }
}

// Handle env command
function handleEnvCommand(args: string[], level: number): CommandResult {
  if (level === 9) {
    return {
      output:
        "PATH=/usr/local/bin:/usr/bin:/bin\nHOME=/home/user\nUSER=hacker\nSECRET=3nv1r0nm3nt4l\n\nWell done! You found the SECRET environment variable. Environment variables are used to store configuration and sensitive information.",
      levelCompleted: true,
    }
  } else if (level === 59 && args.includes("grep") && args.includes("KEY")) {
    return {
      output: "Environment variable found:\nDECRYPTION_KEY=r4ns0mw4r3_d3f34t3d",
      levelCompleted: true,
    }
  }

  return {
    output: "PATH=/usr/local/bin:/usr/bin:/bin\nHOME=/home/user\nUSER=hacker",
    levelCompleted: false,
  }
}

// Handle export command
function handleExportCommand(args: string[], level: number): CommandResult {
  if (args.length === 0) {
    return {
      output: "Usage: export NAME=VALUE\nSets an environment variable.\nExample: export DEBUG=true",
      levelCompleted: false,
    }
  }

  const arg = args[0]
  const match = arg.match(/^([^=]+)=(.*)$/)

  if (match) {
    const [, name, value] = match
    userState.environmentVariables[name] = value
    return {
      output: `Environment variable ${name} set to ${value}`,
      levelCompleted: false,
    }
  }

  return {
    output: "Invalid export syntax. Use: export NAME=VALUE",
    levelCompleted: false,
  }
}

// Handle edit command
function handleEditCommand(args: string[], level: number): CommandResult {
  if (args.length === 0) {
    return {
      output: "Usage: edit [filename]\nOpens a text editor to edit a file.",
      levelCompleted: false,
    }
  }

  const filename = args[0]

  // Get initial content if file exists
  const fileSystem = getLevelFileSystem(level)
  let initialContent = ""

  if (userState.fileContents[filename]) {
    initialContent = userState.fileContents[filename]
  } else if (fileSystem["/"] && fileSystem["/"][filename]) {
    initialContent = fileSystem["/"][filename]
  } else if (level === 12 && filename === "parse.js") {
    // Check if data.json has been viewed
    if (!userState.levelState[12].dataJsonViewed) {
      return {
        output:
          "You should first view the data.json file with 'cat data.json' to understand its structure before creating a script to parse it.",
        levelCompleted: false,
      }
    }

    initialContent = `// Create a script to parse data.json and extract the admin password
// Hint: Use JSON.parse() and fs.readFileSync()

const fs = require('fs');

// Your code here
// 1. Read the data.json file
// 2. Parse the JSON
// 3. Find the admin user
// 4. Extract and print the password
`
  } else if (level === 13 && filename === "regex.js") {
    // Check if text.txt has been viewed
    if (!userState.levelState[13].textFileViewed) {
      return {
        output:
          "You should first view the text.txt file with 'cat text.txt' to see what patterns you need to extract before creating a regex script.",
        levelCompleted: false,
      }
    }

    initialContent = `// Create a script to extract email and phone number using regex
// Hint: Use regular expressions with pattern.exec() or string.match()

const fs = require('fs');

// Your code here
// 1. Read the text.txt file
// 2. Create regex patterns for email and phone
// 3. Extract and print the matches
`
  } else if (level === 11 && filename === "array.js") {
    initialContent = `// Create a script that reverses an array
// 1. Define an array with some elements
// 2. Print the original array
// 3. Use the array.reverse() method to reverse it
// 4. Print the reversed array

// Example:
const numbers = [1, 2, 3, 4, 5];
console.log('Original array:', numbers);
// TODO: Add code to reverse the array using numbers.reverse()
console.log('Reversed array:', numbers);
`
  }

  // For level 10, add a hint
  if (level === 10 && filename === "script.js") {
    return {
      output: initialContent + "\n\nHint: The add function has a bug. It should add numbers, not subtract them.",
      levelCompleted: false,
    }
  }

  return {
    output: initialContent,
    levelCompleted: false,
  }
}

// Handle node command
function handleNodeCommand(args: string[], level: number): CommandResult {
  if (args.length === 0) {
    return {
      output: "Usage: node [filename]\nRuns a JavaScript file.\nExample: node script.js",
      levelCompleted: false,
    }
  }

  const filename = args[0]

  // Check if the file has been edited by the user
  if (userState.fileContents[filename]) {
    if (level === 10 && filename === "script.js") {
      // Check if the script has been fixed - ignore spacing
      const content = userState.fileContents[filename]
      const noSpaces = content.replace(/\s+/g, "")

      if (noSpaces.includes("returna+b")) {
        // Extract the arguments from the console.log call
        const match = content.match(/console\.log$$add$$(\d+),\s*(\d+)$$$$/)
        let a = 5,
          b = 3 // Default values

        if (match && match.length >= 3) {
          a = Number.parseInt(match[1], 10)
          b = Number.parseInt(match[2], 10)
        }

        // Calculate the actual result
        const result = a + b

        return {
          output: `Running script.js...\nOutput: ${result}\n\nExcellent! You've successfully fixed the add function. It now correctly returns a + b instead of a - b.`,
          levelCompleted: true,
        }
      } else {
        return {
          output:
            "Running script.js...\nOutput: 2\n\nThe function still doesn't work correctly. It should add the numbers, not subtract them. Use 'edit script.js' to edit it again.",
          levelCompleted: false,
        }
      }
    } else if (level === 12 && filename === "parse.js") {
      // Check if the script correctly parses JSON - more thorough check
      const content = userState.fileContents[filename]
      const noSpaces = content.replace(/\s+/g, "")
      if (
        content.includes("JSON.parse") &&
        content.includes("data.json") &&
        (content.includes("admin") || content.includes("users")) &&
        (content.includes("password") || noSpaces.includes("password"))
      ) {
        return {
          output:
            "Running parse.js...\nParsing data.json...\nAdmin password: s3cur3!\n\nGreat job! You've successfully parsed the JSON data and extracted the admin password.",
          levelCompleted: true,
        }
      } else {
        return {
          output:
            "Running parse.js...\nError: Your script doesn't correctly parse the JSON or extract the admin password.\nMake sure to use JSON.parse() and access the users array to find the admin user.",
          levelCompleted: false,
        }
      }
    } else if (level === 13 && filename === "regex.js") {
      // Check if the script correctly uses regex
      const content = userState.fileContents[filename]
      if (
        content.includes("match") ||
        content.includes("exec") ||
        content.includes("test") ||
        content.includes("search") ||
        content.includes("replace")
      ) {
        if (
          (content.includes("@") || content.includes("\\w+@\\w+")) &&
          (content.includes("\\d{3}") || content.includes("555-"))
        ) {
          return {
            output:
              "Running regex.js...\nExtracting patterns from text.txt...\nFound email: admin@example.com\nFound phone: 555-123-4567\n\nExcellent! You've successfully extracted both the email and phone number using regular expressions.",
            levelCompleted: true,
          }
        } else {
          return {
            output:
              "Running regex.js...\nYour script is using regex, but it doesn't correctly extract both the email and phone number.\nMake sure to create patterns that match email (something@example.com) and phone (555-123-4567) formats.",
            levelCompleted: false,
          }
        }
      } else {
        return {
          output:
            "Running regex.js...\nError: Your script doesn't appear to use regular expressions.\nMake sure to use regex patterns with methods like match() or exec() to extract the patterns.",
          levelCompleted: false,
        }
      }
    } else if (level === 11 && filename === "array.js") {
      // Check if the file has been edited by the user
      if (userState.fileContents[filename]) {
        // Check if the file content includes array.reverse() - more thorough check
        const content = userState.fileContents[filename]
        // Check specifically for numbers.reverse() with proper syntax
        if (content.includes("numbers.reverse()") || content.match(/numbers\s*\.\s*reverse\s*$$\s*$$/)) {
          return {
            output:
              "Running array.js...\nOriginal array: [1, 2, 3, 4, 5]\nReversed array: [5, 4, 3, 2, 1]\n\nGreat job! You've successfully used the array.reverse() method to reverse the array.",
            levelCompleted: true,
          }
        } else {
          return {
            output:
              "Running array.js...\nOriginal array: [1, 2, 3, 4, 5]\nArray not reversed: [1, 2, 3, 4, 5]\n\nThe array hasn't been reversed correctly. Make sure to use 'numbers.reverse()' to reverse the array. Edit the file with 'sudo edit array.js'.",
            levelCompleted: false,
          }
        }
      } else {
        // If the user hasn't edited the file yet
        return {
          output:
            "Running array.js...\nOriginal array: [1, 2, 3, 4, 5]\nArray not reversed: [1, 2, 3, 4, 5]\n\nThe array hasn't been reversed. Edit the file with 'sudo edit array.js' and add the array.reverse() method.",
          levelCompleted: false,
        }
      }
    } else if (level === 11 && filename !== "array.js") {
      return {
        output:
          "For this level, you need to work with the array.js file. Use 'sudo edit array.js' to edit it and 'node array.js' to run it.",
        levelCompleted: false,
      }
    } else if (level === 11 && filename === "script.js") {
      return {
        output:
          "For this level, you should create a new file called array.js that reverses an array. Use 'edit array.js' to create it.",
        levelCompleted: false,
      }
    }
  }

  if (level === 10 && filename === "script.js") {
    // Check if script has been edited
    if (!userState.levelState[10].scriptEdited) {
      return {
        output:
          "Error: The script has a bug. The add function returns a - b instead of a + b.\nUse 'edit script.js' to edit and fix the bug.",
        levelCompleted: false,
      }
    }
    return {
      output:
        "Running script.js...\nOutput: 8\n\nExcellent! You've successfully fixed the add function. It now correctly returns a + b instead of a - b.",
      levelCompleted: true,
    }
  } else if (level === 11 && filename === "script.js") {
    return {
      output:
        "Error: The script has a bug. The add function returns a - b instead of a + b.\nUse 'edit script.js' to edit and fix the bug.",
      levelCompleted: false,
    }
  } else if (level === 12 && filename === "parse.js") {
    return {
      output: "Error: File not found. You need to create parse.js first.\nUse 'edit parse.js' to create the file.",
      levelCompleted: false,
    }
  } else if (level === 14 && filename === "loop.js") {
    return {
      output:
        "Loop created!\nOutput: 1 2 3 4 5 6 7 8 9 10\n\nWell done! You've successfully created a loop that prints numbers from 1 to 10.",
      levelCompleted: true,
    }
  } else if (level === 16 && filename === "sort.js") {
    return {
      output:
        "Array sorted!\nOriginal: [5, 3, 8, 1, 2, 4]\nSorted: [1, 2, 3, 4, 5, 8]\n\nGreat job! You've successfully sorted the array.",
      levelCompleted: true,
    }
  } else if (level === 17 && filename === "filter.js") {
    return {
      output:
        "Array filtered!\nOriginal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nFiltered (odd numbers): [1, 3, 5, 7, 9]\n\nExcellent! You've successfully filtered the array to get only odd numbers.",
      levelCompleted: true,
    }
  } else if (level === 18 && filename === "decode.js") {
    return {
      output:
        "Base64 decoded!\nEncoded: SGVsbG8gSGFja2VyIQ==\nDecoded: Hello Hacker!\n\nWell done! You've successfully decoded the Base64 string.",
      levelCompleted: true,
    }
  } else if (level === 20 && filename === "hash.js") {
    return {
      output:
        "Hash cracked!\nHash: 5f4dcc3b5aa765d61d8327deb882cf99\nPassword: password\n\nExcellent! You've successfully identified the password from its MD5 hash.",
      levelCompleted: true,
    }
  }

  return {
    output: `Error: ${filename} not found or cannot be executed.\nMake sure the file exists and has the correct content.`,
    levelCompleted: false,
  }
}

// Handle python command
function handlePythonCommand(args: string[], level: number): CommandResult {
  if (args.length === 0) {
    return {
      output: "Usage: python [filename]\nRuns a Python script.\nExample: python script.py",
      levelCompleted: false,
    }
  }

  const filename = args[0]

  if (level === 15 && filename === "broken.py") {
    return {
      output: "Python script fixed!\nOutput: Hello\n\nGreat job! You've successfully fixed the Python script.",
      levelCompleted: true,
    }
  }

  return {
    output: `Running ${filename}...\nNo output or file not found.`,
    levelCompleted: false,
  }
}

// Handle curl command
function handleCurlCommand(args: string[], level: number): CommandResult {
  if (level === 21 && args.includes("example.com")) {
    return {
      output:
        "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<!DOCTYPE html>\n<html>\n<body>\n<h1>Example Domain</h1>\n</body>\n</html>\n\nGreat! You've successfully made an HTTP request to example.com.",
      levelCompleted: true,
    }
  } else if (level === 23 && args.includes("-X") && args.includes("POST") && args.includes("/login")) {
    return {
      output:
        "POST request sent to /login\nResponse: HTTP/1.1 302 Found\nLocation: /dashboard\nSet-Cookie: session=logged_in\n\nExcellent! You've successfully sent a POST request to the login endpoint.",
      levelCompleted: true,
    }
  } else if (level === 27 && args.join(" ").includes("Authorization: Bearer")) {
    return {
      output:
        'Authorized request sent!\nResponse: HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"success","message":"Authorized access granted"}\n\nWell done! You\'ve successfully sent an authorized request with a Bearer token.',
      levelCompleted: true,
    }
  }

  return {
    output: "Usage: curl [options] [URL]\nMakes HTTP requests to web servers.\nExample: curl example.com",
    levelCompleted: false,
  }
}

// Handle ssh command
function handleSshCommand(args: string[], level: number): CommandResult {
  if ((level === 38 && args.includes("target")) || (args.includes("admin@192.168.1.100") && args.includes("-i"))) {
    return {
      output:
        "SSH connection established!\nWelcome to target server.\nYou've successfully connected using the SSH configuration.\n\nGreat job! You've established a secure SSH connection to the target server.",
      levelCompleted: true,
    }
  }

  return {
    output:
      "Usage: ssh [options] [user@]hostname\nEstablishes a secure shell connection to a remote server.\nExample: ssh -i key.pem admin@192.168.1.100",
    levelCompleted: false,
  }
}

// Handle strings command
function handleStringsCommand(args: string[], level: number): CommandResult {
  if (level === 58 && args.join(" ").includes("memory")) {
    return {
      output:
        "Memory analysis results:\nFound potential credentials:\nusername=admin\npassword=memory_dump_analysis_complete\ntoken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.7hfTUz8yX9aRuYs5BW1nqhWRQEPDjtJibq5LGCjkuTg\n\nExcellent! You've successfully analyzed the memory dump and found the credentials.",
      levelCompleted: true,
    }
  } else if (level === 60 && args.join(" ").includes("image.jpg")) {
    return {
      output:
        "Strings analysis of image.jpg:\nFound hidden text in the image!\nStage 1 password: st3g4n0gr4phy\n\nUse this password to proceed to stage 2.\n\nWell done! You've discovered hidden text embedded in the image.",
      levelCompleted: false,
    }
  }

  return {
    output: "Usage: strings [file]\nExtracts printable strings from binary files.\nExample: strings memory.dump",
    levelCompleted: false,
  }
}

// Check if a command completes a specific level
function checkLevelCompletion(cmd: string, args: string[], level: number): CommandResult | null {
  // Level-specific command completion checks
  switch (level) {
    case 10:
      if ((cmd === "analyze" || cmd === "identify") && args.join(" ").includes("fake-bank.example")) {
        return {
          output:
            "Correct! You've identified the phishing URL: fake-bank.example\n\nGreat job! Phishing URLs often mimic legitimate websites but have subtle differences. Always check URLs carefully before entering sensitive information.",
          levelCompleted: true,
        }
      }
      break

    case 13:
      if (
        (cmd === "regex" || cmd === "extract") &&
        args.join(" ").includes("admin@example.com") &&
        args.join(" ").includes("555-123-4567")
      ) {
        return {
          output:
            "Both patterns extracted!\nEmail: admin@example.com\nPhone: 555-123-4567\n\nExcellent! You've successfully extracted both patterns using regular expressions. This is a powerful technique for finding specific text patterns in data.",
          levelCompleted: true,
        }
      }
      break

    case 19:
      if (cmd === "modify" && args.join(" ").includes("admin") && args.join(" ").includes("true")) {
        return {
          output:
            'API payload modified!\nOriginal: {"username":"admin","password":"REDACTED"}\nModified: {"username":"admin","password":"REDACTED","admin":true}\n\nGreat job! You\'ve successfully modified the JSON payload to gain admin privileges. This is a common technique in API security testing.',
          levelCompleted: true,
        }
      }
      break

    case 22:
      if (cmd === "analyze" && args.join(" ").includes("cookie") && args.join(" ").includes("session")) {
        return {
          output:
            "Cookie analysis:\nName: session\nValue: abc123\nThis appears to be a session identifier.\n\nWell done! Session cookies are used to maintain user state across requests. They're often targets for session hijacking attacks.",
          levelCompleted: true,
        }
      }
      break

    case 24:
      if (cmd === "decode" && args.join(" ").includes("admin")) {
        return {
          output:
            'Cookie modified!\nOriginal: {"user":"guest"}\nModified: {"user":"admin"}\nEncoded: eyJ1c2VyIjoiYWRtaW4ifQ==\n\nExcellent! You\'ve successfully modified and encoded the cookie to escalate privileges. This is why server-side validation is essential.',
          levelCompleted: true,
        }
      }
      break

    case 25:
      if (cmd === "inject" && args.join(" ").includes("' OR '1'='1")) {
        return {
          output:
            "SQL injection successful!\nModified query: SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''\nResult: Authentication bypassed!\n\nGreat job! SQL injection is a common vulnerability when user input isn't properly sanitized.",
          levelCompleted: true,
        }
      }
      break

    case 26:
      if (cmd === "inject" && args.join(" ").includes("<script>")) {
        return {
          output:
            "XSS payload injected!\nOriginal HTML: <div>Welcome, <!--INPUT--></div>\nInjected HTML: <div>Welcome, <script>alert('XSS')</script></div>\nResult: JavaScript executed in the browser!\n\nExcellent! Cross-Site Scripting (XSS) allows attackers to execute malicious scripts in users' browsers.",
          levelCompleted: true,
        }
      }
      break

    case 28:
      if (cmd === "analyze" && args.join(" ").includes("CORS")) {
        return {
          output:
            "CORS analysis:\nThe 'Access-Control-Allow-Origin: *' header allows any website to make requests to this API.\nThis is a security risk as it allows cross-origin requests from any domain.\n\nWell done! Proper CORS configuration is essential for web API security.",
          levelCompleted: true,
        }
      }
      break

    case 29:
      if (cmd === "decode" && args.join(" ").includes("admin")) {
        return {
          output:
            'JWT modified!\nOriginal payload: {"user":"guest","role":"user"}\nModified payload: {"user":"guest","role":"admin"}\nNew JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoiYWRtaW4ifQ.modified_signature\n\nGreat job! JWTs should be properly signed to prevent tampering.',
          levelCompleted: true,
        }
      }
      break

    case 30:
      if (cmd === "bypass" && args.join(" ").includes("admin")) {
        return {
          output:
            "Admin panel bypass successful!\nThe admin panel was hidden with CSS (display:none).\nBy modifying the DOM to show the panel, you revealed the secret: bypass_complete\n\nExcellent! Security by obscurity is not effective. Never rely on client-side hiding for security.",
          levelCompleted: true,
        }
      }
      break
  }

  // Add more level-specific checks as needed

  return null
}
