// Simple in-memory file system utility

// Store files in memory
const inMemoryFiles: Record<string, string> = {}

console.log("[FS-INIT] Initializing file system module")

/**
 * Save a file to memory
 * @param filename The name of the file
 * @param content The content of the file
 */
export function saveFile(filename: string, content: string): void {
  console.log(`[FS-SAVE] Saving file: ${filename}, content length: ${content?.length || 0}`)

  try {
    if (!filename) {
      console.error("[FS-SAVE] Error: Attempted to save file with empty filename")
      return
    }
    if (content === undefined || content === null) {
      console.error(`[FS-SAVE] Error: Attempted to save undefined/null content to ${filename}`)
      content = ""
    }

    // Make sure inMemoryFiles is initialized
    if (typeof inMemoryFiles !== "object" || inMemoryFiles === null) {
      console.error("[FS-SAVE] Error: inMemoryFiles is not an object, reinitializing")
      // This shouldn't happen, but just in case
      Object.assign(inMemoryFiles, {})
    }

    inMemoryFiles[filename] = content
    console.log(`[FS-SAVE] File ${filename} saved to memory (${content.length} bytes)`)
    console.log(`[FS-SAVE] Current files in memory: ${Object.keys(inMemoryFiles).join(", ")}`)
  } catch (error) {
    console.error(`[FS-SAVE] Error saving file ${filename}:`, error)
  }
}

/**
 * Get a file from memory
 * @param filename The name of the file
 * @returns The content of the file, or undefined if it doesn't exist
 */
export function getFile(filename: string): string | undefined {
  console.log(`[FS-GET] Getting file: ${filename}`)

  try {
    if (!filename) {
      console.error("[FS-GET] Error: Attempted to get file with empty filename")
      return undefined
    }

    // Make sure inMemoryFiles is initialized
    if (typeof inMemoryFiles !== "object" || inMemoryFiles === null) {
      console.error("[FS-GET] Error: inMemoryFiles is not an object, reinitializing")
      // This shouldn't happen, but just in case
      Object.assign(inMemoryFiles, {})
      return undefined
    }

    const content = inMemoryFiles[filename]
    console.log(`[FS-GET] Retrieved file ${filename}: ${content ? `found (${content.length} bytes)` : "not found"}`)
    return content
  } catch (error) {
    console.error(`[FS-GET] Error getting file ${filename}:`, error)
    return undefined
  }
}

/**
 * Check if a file exists in memory
 * @param filename The name of the file
 * @returns True if the file exists, false otherwise
 */
export function fileExists(filename: string): boolean {
  console.log(`[FS-EXISTS] Checking if file exists: ${filename}`)

  try {
    if (!filename) {
      console.error("[FS-EXISTS] Error: Attempted to check existence of file with empty filename")
      return false
    }

    // Make sure inMemoryFiles is initialized
    if (typeof inMemoryFiles !== "object" || inMemoryFiles === null) {
      console.error("[FS-EXISTS] Error: inMemoryFiles is not an object, reinitializing")
      // This shouldn't happen, but just in case
      Object.assign(inMemoryFiles, {})
      return false
    }

    const exists = filename in inMemoryFiles
    console.log(`[FS-EXISTS] File ${filename} exists: ${exists}`)
    return exists
  } catch (error) {
    console.error(`[FS-EXISTS] Error checking if file exists: ${filename}`, error)
    return false
  }
}

/**
 * List all files in memory
 * @returns An array of filenames
 */
export function listFiles(): string[] {
  console.log(`[FS-LIST] Listing all files`)
  const files = Object.keys(inMemoryFiles)
  console.log(`[FS-LIST] Files in memory: ${files.join(", ")}`)
  return files
}

/**
 * Delete a file from  Files in memory: ${files.join(", ")}`)
  return files
}

/**
 * Delete a file from memory
 * @param filename The name of the file
 * @returns True if the file was deleted, false if it didn't exist
 */
export function deleteFile(filename: string): boolean {
  console.log(`[FS-DELETE] Deleting file: ${filename}`)

  try {
    if (!filename) {
      console.error("[FS-DELETE] Error: Attempted to delete file with empty filename")
      return false
    }

    // Make sure inMemoryFiles is initialized
    if (typeof inMemoryFiles !== "object" || inMemoryFiles === null) {
      console.error("[FS-DELETE] Error: inMemoryFiles is not an object, reinitializing")
      // This shouldn't happen, but just in case
      Object.assign(inMemoryFiles, {})
      return false
    }

    if (filename in inMemoryFiles) {
      delete inMemoryFiles[filename]
      console.log(`[FS-DELETE] File ${filename} deleted successfully`)
      return true
    }

    console.log(`[FS-DELETE] File ${filename} not found, nothing to delete`)
    return false
  } catch (error) {
    console.error(`[FS-DELETE] Error deleting file ${filename}:`, error)
    return false
  }
}
