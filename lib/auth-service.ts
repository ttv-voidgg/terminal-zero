// This file provides authentication services for the terminal game

// Define the structure of a user
interface User {
  id: string
  username: string
  level: number
  xp: number
  completedLevels: number[]
}

// Mock user data - in a real app, this would come from a database
const users: User[] = [
  {
    id: "1",
    username: "hackmaster",
    level: 15,
    xp: 140,
    completedLevels: Array.from({ length: 14 }, (_, i) => i + 1),
  },
  {
    id: "2",
    username: "cyberNinja",
    level: 22,
    xp: 210,
    completedLevels: Array.from({ length: 21 }, (_, i) => i + 1),
  },
  {
    id: "3",
    username: "c0d3br34k3r",
    level: 8,
    xp: 70,
    completedLevels: Array.from({ length: 7 }, (_, i) => i + 1),
  },
  {
    id: "4",
    username: "terminalWizard",
    level: 30,
    xp: 290,
    completedLevels: Array.from({ length: 29 }, (_, i) => i + 1),
  },
  {
    id: "5",
    username: "securityPro",
    level: 18,
    xp: 170,
    completedLevels: Array.from({ length: 17 }, (_, i) => i + 1),
  },
]

// Get all users
export function getAllUsers(): User[] {
  return users
}

// Get a user by ID
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

// Get a user by username
export function getUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username)
}

// Login a user (mock implementation)
export function login(username: string, password: string): User | null {
  // In a real app, this would verify the password
  const user = getUserByUsername(username)
  return user || null
}

// Register a new user (mock implementation)
export function register(username: string, password: string): User | null {
  // Check if username already exists
  if (getUserByUsername(username)) {
    return null
  }

  // Create a new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    username,
    level: 1,
    xp: 0,
    completedLevels: [],
  }

  // Add to users array (in a real app, this would save to a database)
  users.push(newUser)

  return newUser
}

// Update a user's progress
export function updateUserProgress(userId: string, level: number, xp: number): User | null {
  const userIndex = users.findIndex((user) => user.id === userId)
  if (userIndex === -1) {
    return null
  }

  // Update the user
  users[userIndex] = {
    ...users[userIndex],
    level,
    xp,
    completedLevels: Array.from({ length: level - 1 }, (_, i) => i + 1),
  }

  return users[userIndex]
}
