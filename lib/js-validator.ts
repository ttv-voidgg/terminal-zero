// This file handles validation of JavaScript code for different levels

interface ValidationResult {
  isValid: boolean
  meetsRequirements: boolean
  feedback: string
}

console.log("[VALIDATOR-INIT] Initializing JS validator module")

// Validate JavaScript syntax and level-specific requirements
export function validateLevelSolution(level: number, code: string): ValidationResult {
  console.log(`[VALIDATOR] Validating code for level ${level}, code length: ${code?.length || 0}`)

  try {
    if (!code) {
      console.error(`[VALIDATOR] Error: Empty code provided for validation`)
      return {
        isValid: false,
        meetsRequirements: false,
        feedback: "No code provided for validation",
      }
    }

    // Basic syntax check - this will throw an error if the syntax is invalid
    console.log(`[VALIDATOR] Performing syntax check`)
    Function(`"use strict"; ${code}`)
    console.log(`[VALIDATOR] Syntax check passed`)

    // Level-specific validation
    console.log(`[VALIDATOR] Performing level-specific validation for level ${level}`)
    switch (level) {
      case 10:
        return validateLevel10(code)
      case 11:
        return validateLevel11(code)
      case 12:
        return validateLevel12(code)
      case 13:
        return validateLevel13(code)
      default:
        console.log(`[VALIDATOR] No specific validation for level ${level}, returning default success`)
        return {
          isValid: true,
          meetsRequirements: true,
          feedback: "Code looks good!",
        }
    }
  } catch (error) {
    console.error(`[VALIDATOR] Syntax error in code:`, error)
    return {
      isValid: false,
      meetsRequirements: false,
      feedback: `Your code has a syntax error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Validate level 10 (fix the add function)
function validateLevel10(code: string): ValidationResult {
  console.log(`[VALIDATOR-L10] Validating level 10 code`)
  const noSpaces = code.replace(/\s+/g, "")
  console.log(`[VALIDATOR-L10] Checking for "returna+b" in code`)

  if (noSpaces.includes("returna+b") || noSpaces.includes("returna+b;")) {
    console.log(`[VALIDATOR-L10] Found "returna+b" - validation passed`)
    return {
      isValid: true,
      meetsRequirements: true,
      feedback:
        "Excellent! You've successfully fixed the add function. It now correctly returns a + b instead of a - b.",
    }
  } else {
    console.log(`[VALIDATOR-L10] Did not find "returna+b" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback:
        "The function still doesn't work correctly. It should add the numbers, not subtract them. Use 'edit script.js' to edit it again.",
    }
  }
}

// Validate level 11 (reverse an array)
function validateLevel11(code: string): ValidationResult {
  console.log(`[VALIDATOR-L11] Validating level 11 code`)
  console.log(`[VALIDATOR-L11] Checking for "numbers.reverse()" in code`)

  if (code.includes("numbers.reverse()") || code.match(/numbers\s*\.\s*reverse\s*$$\s*$$/)) {
    console.log(`[VALIDATOR-L11] Found "numbers.reverse()" - validation passed`)
    return {
      isValid: true,
      meetsRequirements: true,
      feedback: "Great job! You've successfully used the array.reverse() method to reverse the array.",
    }
  } else {
    console.log(`[VALIDATOR-L11] Did not find "numbers.reverse()" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "The array hasn't been reversed correctly. Make sure to use 'numbers.reverse()' to reverse the array.",
    }
  }
}

// Validate level 12 (parse JSON)
function validateLevel12(code: string): ValidationResult {
  console.log(`[VALIDATOR-L12] Validating level 12 code`)
  const noSpaces = code.replace(/\s+/g, "")

  if (!code.includes("JSON.parse")) {
    console.log(`[VALIDATOR-L12] Did not find "JSON.parse" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't use JSON.parse() to parse the JSON data. Try again.",
    }
  }

  if (!code.includes("data.json")) {
    console.log(`[VALIDATOR-L12] Did not find "data.json" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't read the data.json file. Use fs.readFileSync('data.json') to read the file.",
    }
  }

  if (!(code.includes("admin") || code.includes("users"))) {
    console.log(`[VALIDATOR-L12] Did not find "admin" or "users" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't look for the admin user in the users array.",
    }
  }

  if (!(code.includes("password") || noSpaces.includes("password"))) {
    console.log(`[VALIDATOR-L12] Did not find "password" - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't extract the password from the admin user.",
    }
  }

  console.log(`[VALIDATOR-L12] All checks passed - validation successful`)
  return {
    isValid: true,
    meetsRequirements: true,
    feedback: "Great job! You've successfully parsed the JSON data and extracted the admin password.",
  }
}

// Validate level 13 (regex)
function validateLevel13(code: string): ValidationResult {
  console.log(`[VALIDATOR-L13] Validating level 13 code`)

  if (
    !(
      code.includes("match") ||
      code.includes("exec") ||
      code.includes("test") ||
      code.includes("search") ||
      code.includes("replace")
    )
  ) {
    console.log(`[VALIDATOR-L13] Did not find regex methods - validation failed`)
    return {
      isValid: true,
      meetsRequirements: false,
      feedback:
        "Your script doesn't appear to use regular expressions. Make sure to use regex patterns with methods like match() or exec() to extract the patterns.",
    }
  }

  const hasEmailPattern = code.includes("@") || code.includes("\\w+@\\w+")
  const hasPhonePattern = code.includes("\\d{3}") || code.includes("555-")

  console.log(`[VALIDATOR-L13] Has email pattern: ${hasEmailPattern}, Has phone pattern: ${hasPhonePattern}`)

  if (!hasEmailPattern && !hasPhonePattern) {
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't have patterns to match both email and phone number formats.",
    }
  } else if (!hasEmailPattern) {
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't have a pattern to match email addresses.",
    }
  } else if (!hasPhonePattern) {
    return {
      isValid: true,
      meetsRequirements: false,
      feedback: "Your script doesn't have a pattern to match phone numbers.",
    }
  }

  console.log(`[VALIDATOR-L13] All checks passed - validation successful`)
  return {
    isValid: true,
    meetsRequirements: true,
    feedback: "Excellent! You've successfully extracted both the email and phone number using regular expressions.",
  }
}
