// Enhanced math module with extensive formulas and templates
import { CustomMathField } from "./custom-math-field"

// Export the custom element class
export { CustomMathField }

// Enhanced utility functions
export const MathUtils = {
  // Convert common math expressions to LaTeX
  toLatex: (expression: string): string => {
    return expression
      .replace(/\*\*/g, "^")
      .replace(/sqrt$$([^)]+)$$/g, "\\sqrt{$1}")
      .replace(/frac$$([^,]+),([^)]+)$$/g, "\\frac{$1}{$2}")
      .replace(/sum$$([^)]+)$$/g, "\\sum_{$1}")
      .replace(/int$$([^)]+)$$/g, "\\int $1")
      .replace(/alpha/g, "\\alpha")
      .replace(/beta/g, "\\beta")
      .replace(/gamma/g, "\\gamma")
      .replace(/pi/g, "\\pi")
      .replace(/infinity/g, "\\infty")
  },

  // Enhanced LaTeX validation
  validateLatex: (latex: string): { valid: boolean; error?: string } => {
    try {
      // Check for balanced braces
      let braceCount = 0
      let bracketCount = 0
      let parenCount = 0

      for (const char of latex) {
        if (char === "{") braceCount++
        if (char === "}") braceCount--
        if (char === "[") bracketCount++
        if (char === "]") bracketCount--
        if (char === "(") parenCount++
        if (char === ")") parenCount--

        if (braceCount < 0) return { valid: false, error: "Unmatched closing brace }" }
        if (bracketCount < 0) return { valid: false, error: "Unmatched closing bracket ]" }
        if (parenCount < 0) return { valid: false, error: "Unmatched closing parenthesis )" }
      }

      if (braceCount !== 0) return { valid: false, error: "Unmatched opening brace {" }
      if (bracketCount !== 0) return { valid: false, error: "Unmatched opening bracket [" }
      if (parenCount !== 0) return { valid: false, error: "Unmatched opening parenthesis (" }

      // Check for common LaTeX errors
      if (latex.includes("\\frac{}")) return { valid: false, error: "Empty fraction numerator or denominator" }
      if (latex.includes("\\sqrt{}")) return { valid: false, error: "Empty square root" }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: "Invalid LaTeX syntax" }
    }
  },

  // Extensive formula templates organized by category
  templates: {
    // Basic Algebra
    quadratic: "ax^2 + bx + c = 0",
    quadraticFormula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    factoring: "(x + a)(x + b) = x^2 + (a+b)x + ab",
    binomialSquare: "(a + b)^2 = a^2 + 2ab + b^2",
    differenceOfSquares: "a^2 - b^2 = (a+b)(a-b)",

    // Geometry
    pythagorean: "a^2 + b^2 = c^2",
    circleArea: "A = \\pi r^2",
    sphereVolume: "V = \\frac{4}{3}\\pi r^3",
    triangleArea: "A = \\frac{1}{2}bh",
    distanceFormula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",

    // Trigonometry
    sinLaw: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
    cosLaw: "c^2 = a^2 + b^2 - 2ab\\cos C",
    pythagoreanIdentity: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
    doubleAngle: "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta",

    // Calculus
    powerRule: "\\frac{d}{dx}x^n = nx^{n-1}",
    productRule: "\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)",
    quotientRule: "\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
    chainRule: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
    fundamentalTheorem: "\\int_a^b f'(x)dx = f(b) - f(a)",
    integrationByParts: "\\int u\\,dv = uv - \\int v\\,du",

    // Statistics & Probability
    mean: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i",
    variance: "\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\mu)^2",
    standardDeviation: "\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n (x_i - \\mu)^2}",
    normalDistribution: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    binomialProbability: "P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}",

    // Linear Algebra
    matrix2x2: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
    matrix3x3: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
    determinant2x2: "\\det(A) = ad - bc",
    determinant3x3: "\\det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)",
    eigenvalue: "A\\vec{v} = \\lambda\\vec{v}",

    // Physics
    newtonSecond: "F = ma",
    kineticEnergy: "KE = \\frac{1}{2}mv^2",
    potentialEnergy: "PE = mgh",
    momentum: "p = mv",
    waveEquation: "v = f\\lambda",
    einsteinMassEnergy: "E = mc^2",
    coulombsLaw: "F = k\\frac{q_1q_2}{r^2}",

    // Chemistry
    idealGasLaw: "PV = nRT",
    pHFormula: "pH = -\\log[H^+]",
    arrheniusEquation: "k = Ae^{-\\frac{E_a}{RT}}",

    // Number Theory
    primeFactorization: "n = p_1^{a_1} \\cdot p_2^{a_2} \\cdot \\ldots \\cdot p_k^{a_k}",
    euclideanAlgorithm: "\\gcd(a,b) = \\gcd(b, a \\bmod b)",

    // Set Theory
    unionDefinition: "A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}",
    intersectionDefinition: "A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}",

    // Logic
    deMorganLaw1: "\\neg(A \\land B) \\equiv \\neg A \\lor \\neg B",
    deMorganLaw2: "\\neg(A \\lor B) \\equiv \\neg A \\land \\neg B",

    // Complex Numbers
    eulerFormula: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
    complexConjugate: "\\overline{a + bi} = a - bi",

    // Series and Sequences
    arithmeticSeries: "S_n = \\frac{n}{2}(2a + (n-1)d)",
    geometricSeries: "S_n = a\\frac{1-r^n}{1-r}",
    taylorSeries: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
  },

  // Get templates by category
  getTemplatesByCategory: () => {
    const categories = {
      "Basic Algebra": ["quadratic", "quadraticFormula", "factoring", "binomialSquare", "differenceOfSquares"],
      Geometry: ["pythagorean", "circleArea", "sphereVolume", "triangleArea", "distanceFormula"],
      Trigonometry: ["sinLaw", "cosLaw", "pythagoreanIdentity", "doubleAngle"],
      Calculus: ["powerRule", "productRule", "quotientRule", "chainRule", "fundamentalTheorem", "integrationByParts"],
      Statistics: ["mean", "variance", "standardDeviation", "normalDistribution", "binomialProbability"],
      "Linear Algebra": ["matrix2x2", "matrix3x3", "determinant2x2", "determinant3x3", "eigenvalue"],
      Physics: [
        "newtonSecond",
        "kineticEnergy",
        "potentialEnergy",
        "momentum",
        "waveEquation",
        "einsteinMassEnergy",
        "coulombsLaw",
      ],
      Chemistry: ["idealGasLaw", "pHFormula", "arrheniusEquation"],
      "Number Theory": ["primeFactorization", "euclideanAlgorithm"],
      "Set Theory": ["unionDefinition", "intersectionDefinition"],
      Logic: ["deMorganLaw1", "deMorganLaw2"],
      "Complex Numbers": ["eulerFormula", "complexConjugate"],
      Series: ["arithmeticSeries", "geometricSeries", "taylorSeries"],
    }
    return categories
  },
}

// Initialize function for easy setup
export const initCustomMathModule = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (customElements.get("custom-math-field")) {
      resolve(true)
      return
    }

    try {
      customElements.define("custom-math-field", CustomMathField)
      customElements.whenDefined("custom-math-field").then(() => {
        resolve(true)
      })
    } catch (error) {
      console.error("Failed to register custom-math-field:", error)
      resolve(false)
    }
  })
}

// Default export
export default {
  CustomMathField,
  MathUtils,
  initCustomMathModule,
}
