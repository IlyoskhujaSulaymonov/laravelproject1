import type React from "react"
// MathLive configuration and initialization
export const initializeMathLive = async (): Promise<boolean> => {
  try {
    // Check if already loaded
    if (window.customElements.get("math-field")) {
      return true
    }

    // Pre-configure MathLive before loading
    window.MathfieldElement = window.MathfieldElement || {}

    // Set correct paths for fonts and sounds
    window.MathfieldElement.fontsDirectory = "https://unpkg.com/mathlive/dist/fonts/"
    window.MathfieldElement.soundsDirectory = "https://unpkg.com/mathlive/dist/sounds/"

    // Configure default options
    window.MathfieldElement.defaultOptions = {
      fontsDirectory: "https://unpkg.com/mathlive/dist/fonts/",
      soundsDirectory: "https://unpkg.com/mathlive/dist/sounds/",
      virtualKeyboardMode: "onfocus",
      virtualKeyboardTheme: "material",
    }

    // Import MathLive module
    await import("https://unpkg.com/mathlive?module")

    // Wait a bit for the web component to register
    await new Promise((resolve) => setTimeout(resolve, 100))

    return true
  } catch (error) {
    console.error("Failed to initialize MathLive:", error)
    return false
  }
}

// Global type declarations
declare global {
  interface Window {
    MathfieldElement: any
  }

  namespace JSX {
    interface IntrinsicElements {
      "math-field": {
        ref?: any
        onInput?: () => void
        style?: React.CSSProperties
        "virtual-keyboard-mode"?: string
        "virtual-keyboard-theme"?: string
        "fonts-directory"?: string
        "sounds-directory"?: string
        [key: string]: any
      }
    }
  }
}
