// Custom Math Field Web Component with extensive math symbols
export class CustomMathField extends HTMLElement {
  private input: HTMLInputElement
  private preview: HTMLDivElement
  private latex = ""
  private isInitialized = false

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.input = document.createElement("input")
    this.preview = document.createElement("div")
    this.init()
  }

  private init() {
    // Create styles
    const style = document.createElement("style")
    style.textContent = `
      :host {
        display: block;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        background: white;
        font-family: 'Times New Roman', serif;
      }
      
      .container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .input-section {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      input {
        flex: 1;
        border: 1px solid #ddd;
        padding: 6px 10px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
      }
      
      .toolbar-container {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: #fafafa;
      }
      
      .toolbar-section {
        padding: 8px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .toolbar-section:last-child {
        border-bottom: none;
      }
      
      .toolbar-title {
        font-size: 11px;
        font-weight: bold;
        color: #666;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      
      .toolbar {
        display: flex;
        gap: 3px;
        flex-wrap: wrap;
      }
      
      .btn {
        padding: 4px 6px;
        border: 1px solid #ddd;
        background: #f8f8f8;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        min-width: 28px;
        text-align: center;
        font-family: 'Times New Roman', serif;
      }
      
      .btn:hover {
        background: #e8e8e8;
        border-color: #bbb;
        transform: translateY(-1px);
      }
      
      .btn.large {
        font-size: 16px;
        padding: 6px 8px;
      }
      
      .preview {
        min-height: 50px;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        background: #fafafa;
        font-size: 18px;
        display: flex;
        align-items: center;
        line-height: 1.4;
      }
      
      .preview.empty {
        color: #999;
        font-style: italic;
        font-size: 14px;
      }
      
      .quick-insert {
        display: flex;
        gap: 4px;
        margin-top: 4px;
      }
      
      .quick-btn {
        padding: 2px 6px;
        background: #e3f2fd;
        border: 1px solid #bbdefb;
        border-radius: 2px;
        font-size: 10px;
        cursor: pointer;
        color: #1976d2;
      }
      
      .quick-btn:hover {
        background: #bbdefb;
      }
    `

    // Create comprehensive toolbar
    const toolbarContainer = document.createElement("div")
    toolbarContainer.className = "toolbar-container"

    // Define symbol categories
    const symbolCategories = [
      {
        title: "Basic Operations",
        symbols: [
          { text: "+", latex: "+", title: "Plus" },
          { text: "−", latex: "-", title: "Minus" },
          { text: "×", latex: "\\times", title: "Multiply" },
          { text: "÷", latex: "\\div", title: "Divide" },
          { text: "±", latex: "\\pm", title: "Plus minus" },
          { text: "∓", latex: "\\mp", title: "Minus plus" },
          { text: "·", latex: "\\cdot", title: "Dot product" },
          { text: "∗", latex: "\\ast", title: "Asterisk" },
        ],
      },
      {
        title: "Powers & Roots",
        symbols: [
          { text: "x²", latex: "^2", title: "Square" },
          { text: "x³", latex: "^3", title: "Cube" },
          { text: "xⁿ", latex: "^n", title: "Power" },
          { text: "√", latex: "\\sqrt{}", title: "Square root" },
          { text: "∛", latex: "\\sqrt[3]{}", title: "Cube root" },
          { text: "ⁿ√", latex: "\\sqrt[n]{}", title: "Nth root" },
          { text: "x₁", latex: "_1", title: "Subscript" },
          { text: "xₙ", latex: "_n", title: "Subscript n" },
        ],
      },
      {
        title: "Fractions & Functions",
        symbols: [
          { text: "½", latex: "\\frac{1}{2}", title: "One half" },
          { text: "a/b", latex: "\\frac{a}{b}", title: "Fraction" },
          { text: "sin", latex: "\\sin", title: "Sine" },
          { text: "cos", latex: "\\cos", title: "Cosine" },
          { text: "tan", latex: "\\tan", title: "Tangent" },
          { text: "log", latex: "\\log", title: "Logarithm" },
          { text: "ln", latex: "\\ln", title: "Natural log" },
          { text: "exp", latex: "\\exp", title: "Exponential" },
        ],
      },
      {
        title: "Greek Letters",
        symbols: [
          { text: "α", latex: "\\alpha", title: "Alpha" },
          { text: "β", latex: "\\beta", title: "Beta" },
          { text: "γ", latex: "\\gamma", title: "Gamma" },
          { text: "δ", latex: "\\delta", title: "Delta" },
          { text: "ε", latex: "\\epsilon", title: "Epsilon" },
          { text: "θ", latex: "\\theta", title: "Theta" },
          { text: "λ", latex: "\\lambda", title: "Lambda" },
          { text: "μ", latex: "\\mu", title: "Mu" },
          { text: "π", latex: "\\pi", title: "Pi" },
          { text: "ρ", latex: "\\rho", title: "Rho" },
          { text: "σ", latex: "\\sigma", title: "Sigma" },
          { text: "φ", latex: "\\phi", title: "Phi" },
          { text: "ω", latex: "\\omega", title: "Omega" },
          { text: "Γ", latex: "\\Gamma", title: "Capital Gamma" },
          { text: "Δ", latex: "\\Delta", title: "Capital Delta" },
          { text: "Θ", latex: "\\Theta", title: "Capital Theta" },
          { text: "Λ", latex: "\\Lambda", title: "Capital Lambda" },
          { text: "Σ", latex: "\\Sigma", title: "Capital Sigma" },
          { text: "Φ", latex: "\\Phi", title: "Capital Phi" },
          { text: "Ω", latex: "\\Omega", title: "Capital Omega" },
        ],
      },
      {
        title: "Comparison",
        symbols: [
          { text: "=", latex: "=", title: "Equals" },
          { text: "≠", latex: "\\neq", title: "Not equal" },
          { text: "<", latex: "<", title: "Less than" },
          { text: ">", latex: ">", title: "Greater than" },
          { text: "≤", latex: "\\leq", title: "Less than or equal" },
          { text: "≥", latex: "\\geq", title: "Greater than or equal" },
          { text: "≈", latex: "\\approx", title: "Approximately" },
          { text: "≡", latex: "\\equiv", title: "Equivalent" },
          { text: "∝", latex: "\\propto", title: "Proportional" },
          { text: "∼", latex: "\\sim", title: "Similar" },
        ],
      },
      {
        title: "Calculus",
        symbols: [
          { text: "∫", latex: "\\int", title: "Integral" },
          { text: "∬", latex: "\\iint", title: "Double integral" },
          { text: "∭", latex: "\\iiint", title: "Triple integral" },
          { text: "∮", latex: "\\oint", title: "Contour integral" },
          { text: "∂", latex: "\\partial", title: "Partial derivative" },
          { text: "∇", latex: "\\nabla", title: "Nabla" },
          { text: "Δ", latex: "\\Delta", title: "Delta" },
          { text: "lim", latex: "\\lim", title: "Limit" },
        ],
      },
      {
        title: "Set Theory",
        symbols: [
          { text: "∈", latex: "\\in", title: "Element of" },
          { text: "∉", latex: "\\notin", title: "Not element of" },
          { text: "⊂", latex: "\\subset", title: "Subset" },
          { text: "⊃", latex: "\\supset", title: "Superset" },
          { text: "⊆", latex: "\\subseteq", title: "Subset or equal" },
          { text: "⊇", latex: "\\supseteq", title: "Superset or equal" },
          { text: "∪", latex: "\\cup", title: "Union" },
          { text: "∩", latex: "\\cap", title: "Intersection" },
          { text: "∅", latex: "\\emptyset", title: "Empty set" },
          { text: "ℕ", latex: "\\mathbb{N}", title: "Natural numbers" },
          { text: "ℤ", latex: "\\mathbb{Z}", title: "Integers" },
          { text: "ℚ", latex: "\\mathbb{Q}", title: "Rational numbers" },
          { text: "ℝ", latex: "\\mathbb{R}", title: "Real numbers" },
          { text: "ℂ", latex: "\\mathbb{C}", title: "Complex numbers" },
        ],
      },
      {
        title: "Logic & Arrows",
        symbols: [
          { text: "∧", latex: "\\land", title: "And" },
          { text: "∨", latex: "\\lor", title: "Or" },
          { text: "¬", latex: "\\neg", title: "Not" },
          { text: "→", latex: "\\rightarrow", title: "Right arrow" },
          { text: "←", latex: "\\leftarrow", title: "Left arrow" },
          { text: "↔", latex: "\\leftrightarrow", title: "Left right arrow" },
          { text: "⇒", latex: "\\Rightarrow", title: "Implies" },
          { text: "⇐", latex: "\\Leftarrow", title: "Implied by" },
          { text: "⇔", latex: "\\Leftrightarrow", title: "If and only if" },
          { text: "∀", latex: "\\forall", title: "For all" },
          { text: "∃", latex: "\\exists", title: "There exists" },
          { text: "∄", latex: "\\nexists", title: "Does not exist" },
        ],
      },
      {
        title: "Special Symbols",
        symbols: [
          { text: "∞", latex: "\\infty", title: "Infinity" },
          { text: "∑", latex: "\\sum", title: "Sum" },
          { text: "∏", latex: "\\prod", title: "Product" },
          { text: "°", latex: "^\\circ", title: "Degree" },
          { text: "′", latex: "'", title: "Prime" },
          { text: "″", latex: "''", title: "Double prime" },
          { text: "‰", latex: "\\permil", title: "Per mille" },
          { text: "℃", latex: "^\\circ C", title: "Celsius" },
          { text: "℉", latex: "^\\circ F", title: "Fahrenheit" },
          { text: "Å", latex: "\\AA", title: "Angstrom" },
        ],
      },
    ]

    // Create toolbar sections
    symbolCategories.forEach((category) => {
      const section = document.createElement("div")
      section.className = "toolbar-section"

      const title = document.createElement("div")
      title.className = "toolbar-title"
      title.textContent = category.title
      section.appendChild(title)

      const toolbar = document.createElement("div")
      toolbar.className = "toolbar"

      category.symbols.forEach((symbol) => {
        const button = document.createElement("button")
        button.className = symbol.text.length > 2 ? "btn" : "btn large"
        button.textContent = symbol.text
        button.title = symbol.title
        button.onclick = () => this.insertSymbol(symbol.latex)
        toolbar.appendChild(button)
      })

      section.appendChild(toolbar)
      toolbarContainer.appendChild(section)
    })

    // Setup input
    this.input.placeholder = "Enter LaTeX formula..."
    this.input.addEventListener("input", () => this.updatePreview())
    this.input.addEventListener("keydown", (e) => this.handleKeydown(e))

    // Add quick insert suggestions
    const quickInsert = document.createElement("div")
    quickInsert.className = "quick-insert"

    const quickFormulas = [
      { text: "Quadratic", latex: "ax^2 + bx + c = 0" },
      { text: "Pythagorean", latex: "a^2 + b^2 = c^2" },
      { text: "Derivative", latex: "\\frac{d}{dx}f(x)" },
      { text: "Matrix 2x2", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
    ]

    quickFormulas.forEach((formula) => {
      const btn = document.createElement("button")
      btn.className = "quick-btn"
      btn.textContent = formula.text
      btn.onclick = () => this.insertSymbol(formula.latex)
      quickInsert.appendChild(btn)
    })

    // Setup preview
    this.preview.className = "preview empty"
    this.preview.textContent = "Formula preview will appear here"

    // Create container
    const container = document.createElement("div")
    container.className = "container"

    const inputSection = document.createElement("div")
    inputSection.className = "input-section"
    inputSection.appendChild(this.input)

    container.appendChild(toolbarContainer)
    container.appendChild(inputSection)
    container.appendChild(quickInsert)
    container.appendChild(this.preview)

    // Add to shadow DOM
    this.shadowRoot!.appendChild(style)
    this.shadowRoot!.appendChild(container)

    this.isInitialized = true
  }

  private insertSymbol(symbol: string) {
    const cursorPos = this.input.selectionStart || 0
    const currentValue = this.input.value
    const newValue = currentValue.slice(0, cursorPos) + symbol + currentValue.slice(cursorPos)

    this.input.value = newValue
    this.input.focus()

    // Position cursor after inserted symbol
    const newCursorPos = cursorPos + symbol.length
    this.input.setSelectionRange(newCursorPos, newCursorPos)

    this.updatePreview()
  }

  private handleKeydown(e: KeyboardEvent) {
    // Enhanced keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "2":
          e.preventDefault()
          this.insertSymbol("^2")
          break
        case "3":
          e.preventDefault()
          this.insertSymbol("^3")
          break
        case "r":
          e.preventDefault()
          this.insertSymbol("\\sqrt{}")
          break
        case "f":
          e.preventDefault()
          this.insertSymbol("\\frac{}{}")
          break
        case "i":
          e.preventDefault()
          this.insertSymbol("\\int")
          break
        case "s":
          e.preventDefault()
          this.insertSymbol("\\sum")
          break
        case "p":
          e.preventDefault()
          this.insertSymbol("\\pi")
          break
        case "a":
          e.preventDefault()
          this.insertSymbol("\\alpha")
          break
      }
    }
  }

  private updatePreview() {
    const value = this.input.value.trim()
    this.latex = value

    if (!value) {
      this.preview.className = "preview empty"
      this.preview.textContent = "Formula preview will appear here"
      return
    }

    this.preview.className = "preview"

    // Enhanced LaTeX to readable text conversion
    const readable = value
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
      .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, "[$1]√($2)")
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\\sqrt/g, "√")
      .replace(/\^(\w+)/g, "^($1)")
      .replace(/\^(\d)/g, "^$1")
      .replace(/_(\w+)/g, "_($1)")
      .replace(/_(\d)/g, "_$1")

      // Greek letters
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\pi/g, "π")
      .replace(/\\rho/g, "ρ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\phi/g, "φ")
      .replace(/\\omega/g, "ω")
      .replace(/\\Gamma/g, "Γ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Theta/g, "Θ")
      .replace(/\\Lambda/g, "Λ")
      .replace(/\\Sigma/g, "Σ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\Omega/g, "Ω")

      // Operations
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\pm/g, "±")
      .replace(/\\mp/g, "∓")
      .replace(/\\cdot/g, "·")

      // Comparison
      .replace(/\\neq/g, "≠")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\approx/g, "≈")
      .replace(/\\equiv/g, "≡")
      .replace(/\\propto/g, "∝")
      .replace(/\\sim/g, "∼")

      // Calculus
      .replace(/\\sum/g, "∑")
      .replace(/\\prod/g, "∏")
      .replace(/\\int/g, "∫")
      .replace(/\\iint/g, "∬")
      .replace(/\\iiint/g, "∭")
      .replace(/\\oint/g, "∮")
      .replace(/\\partial/g, "∂")
      .replace(/\\nabla/g, "∇")
      .replace(/\\lim/g, "lim")

      // Set theory
      .replace(/\\in/g, "∈")
      .replace(/\\notin/g, "∉")
      .replace(/\\subset/g, "⊂")
      .replace(/\\supset/g, "⊃")
      .replace(/\\subseteq/g, "⊆")
      .replace(/\\supseteq/g, "⊇")
      .replace(/\\cup/g, "∪")
      .replace(/\\cap/g, "∩")
      .replace(/\\emptyset/g, "∅")

      // Logic
      .replace(/\\land/g, "∧")
      .replace(/\\lor/g, "∨")
      .replace(/\\neg/g, "¬")
      .replace(/\\rightarrow/g, "→")
      .replace(/\\leftarrow/g, "←")
      .replace(/\\leftrightarrow/g, "↔")
      .replace(/\\Rightarrow/g, "⇒")
      .replace(/\\Leftarrow/g, "⇐")
      .replace(/\\Leftrightarrow/g, "⇔")
      .replace(/\\forall/g, "∀")
      .replace(/\\exists/g, "∃")
      .replace(/\\nexists/g, "∄")

      // Special
      .replace(/\\infty/g, "∞")
      .replace(/\\sin/g, "sin")
      .replace(/\\cos/g, "cos")
      .replace(/\\tan/g, "tan")
      .replace(/\\log/g, "log")
      .replace(/\\ln/g, "ln")
      .replace(/\\exp/g, "exp")

    this.preview.textContent = readable

    // Dispatch input event
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { latex: this.latex, readable },
      }),
    )
  }

  // Public API methods
  getValue(format: "latex" | "readable" = "latex"): string {
    if (format === "readable") {
      return this.preview.textContent || ""
    }
    return this.latex
  }

  setValue(value: string) {
    this.input.value = value
    this.updatePreview()
  }

  focus() {
    this.input.focus()
  }

  clear() {
    this.input.value = ""
    this.updatePreview()
  }

  // Lifecycle callbacks
  connectedCallback() {
    if (!this.isInitialized) {
      this.init()
    }
  }

  static get observedAttributes() {
    return ["placeholder", "disabled"]
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "placeholder" && this.input) {
      this.input.placeholder = newValue || "Enter LaTeX formula..."
    }
    if (name === "disabled" && this.input) {
      this.input.disabled = newValue !== null
    }
  }
}

// Register the custom element
if (!customElements.get("custom-math-field")) {
  customElements.define("custom-math-field", CustomMathField)
}
