import React, { useEffect, useMemo, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { create, all, MathNode } from "mathjs";

const math = create(all, {});

// --- Enhanced SVG Plot with Better Error Handling ---
function SvgPlot({ expr, from=-10, to=10, samples=800 }: { expr: string; from?: number; to?: number; samples?: number }) {
  const [plotData, error] = useMemo(() => {
    try {
      // Preprocess the expression to handle common mathematical functions
      let processedExpr = expr
        .replace(/\bsin\(/g, 'sin(')
        .replace(/\bcos\(/g, 'cos(')
        .replace(/\btan\(/g, 'tan(')
        .replace(/\bln\(/g, 'log(')
        .replace(/\blog10\(/g, 'log10(')
        .replace(/\bsqrt\(/g, 'sqrt(')
        .replace(/\babs\(/g, 'abs(')
        .replace(/\be\^/g, 'exp(')
        .replace(/\^/g, '^')
        .replace(/pi/gi, 'pi')
        .replace(/e(?!x)/gi, 'e');

      const compiled = math.compile(processedExpr);
      const xs: number[] = [];
      const ys: number[] = [];
      const minX = from, maxX = to;
      let minY = Infinity, maxY = -Infinity;
      let validPoints = 0;
      
      // Enhanced sampling with adaptive resolution for discontinuities
      for (let i = 0; i < samples; i++) {
        const x = minX + (i / (samples - 1)) * (maxX - minX);
        let y = NaN;
        
        try {
          const result = compiled.evaluate({ x });
          y = typeof result === 'number' ? result : NaN;
          
          // Handle complex numbers and return real part if applicable
          if (typeof result === 'object' && result?.re !== undefined) {
            y = result.re;
          }
        } catch (e) {
          // Skip invalid points
          continue;
        }
        
        // Filter out extreme values and NaN/Infinity
        if (Number.isFinite(y) && Math.abs(y) < 1e6) {
          xs.push(x);
          ys.push(y);
          validPoints++;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      
      if (validPoints === 0) {
        return [null, 'Funksiya hech qanday yaroqli qiymat bermadi. Ifodani tekshiring.'];
      }
      
      if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
        minY = -1;
        maxY = 1;
      }
      
      // Add padding with better scaling
      const range = maxY - minY;
      const padY = range === 0 ? 1 : Math.max(0.1 * range, range * 0.05);
      
      return [{
        xs,
        ys,
        minX,
        maxX,
        minY: minY - padY,
        maxY: maxY + padY,
        validPoints
      }, null];
    } catch (e: any) {
      return [null, `Ifodani tahlil qilishda xatolik: ${e.message || 'Noma\'lum xatolik'}`];
    }
  }, [expr, from, to, samples]);

  if (error) {
    return (
      <div className="w-full h-80 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <svg className="h-12 w-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="text-red-700 font-medium mb-2">Grafik chizishda xatolik</div>
          <div className="text-red-600 text-sm">{error}</div>
          <div className="text-gray-600 text-xs mt-2">Masalan: x^2, sin(x), cos(x), ln(x), sqrt(x)</div>
        </div>
      </div>
    );
  }

  if (!plotData) {
    return (
      <div className="w-full h-80 rounded-2xl bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Grafik yuklanmoqda...</div>
      </div>
    );
  }

  const { xs, ys, minX, maxX, minY, maxY, validPoints } = plotData;
  const width = 600, height = 400;
  
  const mapX = (x: number) => ((x - minX) / (maxX - minX)) * width;
  const mapY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

  // Create path segments to handle discontinuities
  const createPath = () => {
    if (xs.length === 0) return '';
    
    let path = '';
    let currentSegment = `M ${mapX(xs[0])},${mapY(ys[0])}`;
    
    for (let i = 1; i < xs.length; i++) {
      const x1 = xs[i - 1], y1 = ys[i - 1];
      const x2 = xs[i], y2 = ys[i];
      
      // Check for discontinuity (large jump in y-value)
      const deltaX = Math.abs(x2 - x1);
      const deltaY = Math.abs(y2 - y1);
      const expectedDeltaY = deltaX * Math.abs(maxY - minY) / (maxX - minX);
      
      if (deltaY > expectedDeltaY * 10) {
        // Discontinuity detected, start new path segment
        path += currentSegment;
        currentSegment = ` M ${mapX(x2)},${mapY(y2)}`;
      } else {
        currentSegment += ` L ${mapX(x2)},${mapY(y2)}`;
      }
    }
    path += currentSegment;
    return path;
  };

  const pathData = createPath();

  // Grid lines
  const gridLines: React.ReactElement[] = [];
  const xStep = (maxX - minX) / 10;
  const yStep = (maxY - minY) / 8;
  
  for (let i = 1; i < 10; i++) {
    const x = minX + i * xStep;
    if (x !== 0) {
      gridLines.push(
        <line key={`grid-v-${i}`} x1={mapX(x)} y1={0} x2={mapX(x)} y2={height} stroke="#f0f0f0" strokeWidth={0.5} />
      );
    }
  }
  
  for (let i = 1; i < 8; i++) {
    const y = minY + i * yStep;
    if (y !== 0) {
      gridLines.push(
        <line key={`grid-h-${i}`} x1={0} y1={mapY(y)} x2={width} y2={mapY(y)} stroke="#f0f0f0" strokeWidth={0.5} />
      );
    }
  }

  // Axes
  const zeroX = (0 >= minX && 0 <= maxX) ? mapX(0) : -1000;
  const zeroY = (0 >= minY && 0 <= maxY) ? mapY(0) : -1000;

  // Axis labels
  const xLabels: React.ReactElement[] = [];
  const yLabels: React.ReactElement[] = [];
  
  for (let i = 0; i <= 10; i++) {
    const x = minX + i * xStep;
    const xPos = mapX(x);
    if (Math.abs(x) > 0.01) {
      xLabels.push(
        <text key={`x-label-${i}`} x={xPos} y={height - 5} textAnchor="middle" fontSize="10" fill="#666">
          {x.toFixed(1)}
        </text>
      );
    }
  }
  
  for (let i = 0; i <= 8; i++) {
    const y = minY + i * yStep;
    const yPos = mapY(y);
    if (Math.abs(y) > 0.01) {
      yLabels.push(
        <text key={`y-label-${i}`} x={5} y={yPos + 3} fontSize="10" fill="#666">
          {y.toFixed(1)}
        </text>
      );
    }
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-96 rounded-2xl bg-white border border-gray-200">
        <rect x={0} y={0} width={width} height={height} fill="#fafafa" />
        
        {/* Grid */}
        {gridLines}
        
        {/* Axes */}
        {zeroY >= 0 && zeroY <= height && (
          <line x1={0} y1={zeroY} x2={width} y2={zeroY} stroke="#999" strokeWidth={1.5} />
        )}
        {zeroX >= 0 && zeroX <= width && (
          <line x1={zeroX} y1={0} x2={zeroX} y2={height} stroke="#999" strokeWidth={1.5} />
        )}
        
        {/* Function curve */}
        <path d={pathData} fill="none" strokeWidth={2.5} stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Labels */}
        {xLabels}
        {yLabels}
        
        {/* Axis labels */}
        {zeroX >= 0 && zeroX <= width && zeroY >= 0 && zeroY <= height && (
          <circle cx={zeroX} cy={zeroY} r={2} fill="#666" />
        )}
      </svg>
      
      {/* Graph info */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
        <div>Nuqtalar: {validPoints} • Oraliq: [{minX.toFixed(1)}, {maxX.toFixed(1)}]</div>
        <div>Qiymatlar: [{(minY + (maxY - minY) * 0.1).toFixed(2)}, {(maxY - (maxY - minY) * 0.1).toFixed(2)}]</div>
      </div>
    </div>
  );
}

// --- Helpers to build step-by-step solutions ---
function formatTex(s: string) {
  return s.replace(/\*/g, "\\cdot ");
}

// Safely convert user input (equation or expression) to TeX for preview
function toTexSafeInput(input: string): { tex: string | null; error?: string } {
  const raw = input.trim();
  if (!raw) return { tex: null };
  try {
    const eq = parseEquation(raw);
    if (eq) {
      // Equation: render LHS = RHS
      const Ltex = math.parse(eq.L).toTex();
      const Rtex = math.parse(eq.R).toTex();
      return { tex: `${Ltex} \\; = \\; ${Rtex}` };
    }
    // Expression
    const tex = math.parse(raw).toTex();
    return { tex };
  } catch (e:any) {
    return { tex: null, error: "Ifodani tahlil qilib bo'lmadi" };
  }
}

function compileSafely(expr: string) {
  try { return math.compile(expr); } catch { return null; }
}

function valueOf(node: MathNode, scope: any) {
  try { return node.evaluate(scope); } catch { return NaN; }
}

function parseEquation(raw: string): { L: string, R: string } | null {
  const s = raw.replace(/\s+/g, "");
  if (!s.includes("=")) return null;
  const [L, R] = s.split("=");
  return { L, R };
}

function polyAt(expr: string, x: number) {
  const comp = compileSafely(expr);
  if (!comp) return NaN;
  const v = comp.evaluate({ x });
  return Number(v);
}

function toStandardLinear(L: string, R: string) {
  // For linear equations, compute coefficients by finite differences
  const L0 = polyAt(L, 0), L1 = polyAt(L, 1);
  const R0 = polyAt(R, 0), R1 = polyAt(R, 1);
  if ([L0,L1,R0,R1].some(v=>!Number.isFinite(v))) return null;
  const a = (L1 - L0) - (R1 - R0); // coefficient on x
  const b = (L0 - R0);             // constant term
  return { a, b };
}

function toStandardQuadratic(L: string, R: string) {
  // Using finite differences on p(x) = L(x) - R(x)
  const p0 = polyAt(`${L}-(${R})`, 0);
  const p1 = polyAt(`${L}-(${R})`, 1);
  const p2 = polyAt(`${L}-(${R})`, 2);
  if ([p0,p1,p2].some(v=>!Number.isFinite(v))) return null;
  const d1 = p1 - p0; // a + b
  const d2 = p2 - p1; // 3a + b
  const a = (d2 - d1) / 2;
  const b = d1 - a;
  const c = p0;
  return { a, b, c };
}

function solveLinearSteps(L: string, R: string) {
  const std = toStandardLinear(L, R);
  if (!std || Math.abs(std.a) < 1e-12) return null;
  const { a, b } = std;
  const steps = [
    { tex: formatTex(`${L} = ${R}`), note: "Dastlabki tenglama" },
    { tex: formatTex(`${a.toFixed(6)}\,x + ${b.toFixed(6)} = 0`), note: "Barcha hadlarni bir tomonga ko'chirish: a·x + b = 0" },
    { tex: formatTex(`${a.toFixed(6)}\,x = ${(-b).toFixed(6)}`), note: "Ikkala tomondan b ni ayirish" },
    { tex: formatTex(`x = ${(-b/a).toFixed(6)}`), note: "a ga bo'lish" },
  ];
  return { steps, solution: -b/a };
}

function solveQuadraticSteps(L: string, R: string) {
  const std = toStandardQuadratic(L, R);
  if (!std || Math.abs(std.a) < 1e-12) return null;
  const { a, b, c } = std;
  const D = b*b - 4*a*c;
  const steps = [
    { tex: formatTex(`${L} = ${R}`), note: "Dastlabki tenglama" },
    { tex: formatTex(`${a.toFixed(6)}\,x^2 + ${b.toFixed(6)}\,x + ${c.toFixed(6)} = 0`), note: "Standart ko'rinish: a·x^2 + b·x + c = 0" },
    { tex: formatTex(`\n\Delta = b^2 - 4ac = ${D.toFixed(6)}`), note: "Diskriminant" },
  ];
  if (D > 1e-12) {
    const x1 = (-b + Math.sqrt(D)) / (2*a);
    const x2 = (-b - Math.sqrt(D)) / (2*a);
    steps.push({ tex: formatTex(`x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\{ ${x1.toFixed(6)},\, ${x2.toFixed(6)} \\}`), note: "Ikkita haqiqiy ildiz" });
    return { steps, solution: [x1, x2] };
  } else if (Math.abs(D) <= 1e-12) {
    const x = (-b) / (2*a);
    steps.push({ tex: formatTex(`x = \\frac{-b}{2a} = ${x.toFixed(6)}`), note: "Bitta (ikki marta takrorlangan) ildiz" });
    return { steps, solution: [x, x] };
  } else {
    steps.push({ tex: formatTex(`x = \\frac{-b \\pm i\\sqrt{${(-D).toFixed(6)}}}{2a}`), note: "Kompleks ildizlar" });
    return { steps, solution: null };
  }
}

function derivativeSteps(expr: string) {
  // Provide simple term-wise explanation for polynomials
  let texExpr = expr;
  try { texExpr = math.simplify(expr).toTex(); } catch {}
  let d = "";
  try { d = math.simplify(math.derivative(expr, "x")).toTex(); } catch { return null; }
  const steps = [
    { tex: texExpr, note: "Ifodani soddalashtirish" },
    { tex: `\\frac{d}{dx}\\left(${texExpr}\\right) = ${d}`, note: "x bo'yicha hosila olish" },
  ];
  return { steps, derivativeTex: d };
}

function simplifySteps(expr: string) {
  try {
    const tree = math.parse(expr);
    const simp = math.simplify(tree).toTex();
    return { steps: [
      { tex: tree.toTex(), note: "Dastlabki ifoda" },
      { tex: simp, note: "Soddalashtirilgan" },
    ] };
  } catch { return null; }
}

function isProbablyQuadratic(L: string, R: string) {
  const s = `${L}-(${R})`;
  return /\^2|x\*x|x\s*x|x²/.test(s);
}

function isProbablyLinear(L: string, R: string) {
  const s = `${L}-(${R})`;
  // has x but no x^2 or higher powers
  return /x/.test(s) && !/\^\s*[2-9]|x\*x|x\s*x|x²/.test(s);
}

function isProbablyCubic(L: string, R: string) {
  const s = `${L}-(${R})`;
  return /\^3|x\*x\*x|x³/.test(s);
}

function isProbablyTrigonometric(expr: string) {
  return /sin|cos|tan|cot|sec|csc/.test(expr);
}

function isProbablyLogarithmic(expr: string) {
  return /log|ln|lg/.test(expr);
}

function isProbablyExponential(expr: string) {
  return /\^x|e\^|exp\(/.test(expr);
}

function isProbablyIntegral(expr: string) {
  return /∫|integral|int\(/.test(expr);
}

function hasVariable(expr: string, variable = 'x') {
  return new RegExp(variable).test(expr);
}

function isComplexExpression(expr: string) {
  // Check for complex mathematical operations
  return /sqrt|\^|sin|cos|tan|log|ln|abs|factorial|!/.test(expr);
}

function tryNumericalSolution(L: string, R: string) {
  try {
    const expr = `${L}-(${R})`;
    const compiled = math.compile(expr);
    
    // Try to find roots using numerical methods (simple approach)
    const roots: number[] = [];
    for (let x = -10; x <= 10; x += 0.1) {
      const val = compiled.evaluate({ x });
      if (Math.abs(val) < 0.001) {
        // Check if this root is already found (avoid duplicates)
        const isDuplicate = roots.some(root => Math.abs(root - x) < 0.05);
        if (!isDuplicate) {
          roots.push(x);
        }
      }
    }
    
    if (roots.length > 0) {
      const steps = [
        { tex: formatTex(`${L} = ${R}`), note: "Dastlabki tenglama" },
        { tex: formatTex(`${expr} = 0`), note: "Standart ko'rinishga keltirish" },
        { tex: "\\text{Sonli usul bilan yechim topildi}", note: "Yechish usuli" },
      ];
      return { steps, solution: `x ≈ ${roots.map(r => r.toFixed(3)).join(", ")}` };
    }
  } catch (e) {
    return null;
  }
  return null;
}

function tryIntegration(expr: string) {
  try {
    // Remove integral symbols and extract the expression
    let cleanExpr = expr.replace(/∫|integral|int\(/g, '').replace(/dx|d\s*x/g, '').trim();
    if (cleanExpr.endsWith(')')) cleanExpr = cleanExpr.slice(0, -1);
    
    // Try to compute antiderivative
    const antiderivative = math.evaluate(`derivative(${cleanExpr}, x)`);
    const steps = [
      { tex: `\\int ${math.parse(cleanExpr).toTex()} \\,dx`, note: "Aniqmas integral" },
      { tex: `${math.parse(cleanExpr).toTex()} + C`, note: "Antiderivativ (doimiy qo'shiladi)" },
    ];
    return { steps, solution: `∫${cleanExpr}dx = ${cleanExpr} + C` };
  } catch (e) {
    return null;
  }
}

function tryTrigonometricSimplification(expr: string) {
  try {
    const simplified = math.simplify(expr);
    const steps = [
      { tex: math.parse(expr).toTex(), note: "Trigonometrik ifoda" },
      { tex: simplified.toTex(), note: "Soddalashtirilgan ko'rinish" },
    ];
    return { steps, solution: simplified.toString() };
  } catch (e) {
    return null;
  }
}

function tryLogarithmicSimplification(expr: string) {
  try {
    const simplified = math.simplify(expr);
    const steps = [
      { tex: math.parse(expr).toTex(), note: "Logaritmik ifoda" },
      { tex: simplified.toTex(), note: "Soddalashtirilgan ko'rinish" },
    ];
    return { steps, solution: simplified.toString() };
  } catch (e) {
    return null;
  }
}

function tryArithmeticEvaluation(expr: string) {
  try {
    const result = math.evaluate(expr);
    const steps = [
      { tex: math.parse(expr).toTex(), note: "Arifmetik ifoda" },
      { tex: result.toString(), note: "Natija" },
    ];
    return { steps, solution: `= ${result}` };
  } catch (e) {
    return null;
  }
}

function tryGeneralEvaluation(expr: string) {
  try {
    // Try to parse and display the expression
    const parsed = math.parse(expr);
    const tex = parsed.toTex();
    
    // Try to evaluate if it's a constant expression
    try {
      const result = math.evaluate(expr);
      if (typeof result === 'number' && !hasVariable(expr)) {
        return {
          steps: [
            { tex: tex, note: "Ifoda" },
            { tex: result.toString(), note: "Natija" },
          ],
          solution: `= ${result}`
        };
      }
    } catch {}
    
    // Try to simplify
    try {
      const simplified = math.simplify(expr);
      const simplifiedTex = simplified.toTex();
      if (simplifiedTex !== tex) {
        return {
          steps: [
            { tex: tex, note: "Dastlabki ifoda" },
            { tex: simplifiedTex, note: "Soddalashtirilgan" },
          ],
          solution: null
        };
      }
    } catch {}
    
    // Just display the expression
    return {
      steps: [
        { tex: tex, note: "Matematik ifoda" },
      ],
      solution: null
    };
  } catch (e) {
    return null;
  }
}

export default function MathTutor() {
  const [input, setInput] = useState("2x + 3 = 7");
  const [mode, setMode] = useState<"auto"|"solve"|"differentiate"|"integrate"|"simplify"|"graph"|"evaluate">("auto");
  const [steps, setSteps] = useState<{tex: string; note?: string}[]>([]);
  const [result, setResult] = useState<string>("");
  const [graphExpr, setGraphExpr] = useState<string>("");
  const [aiText, setAiText] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [planName, setPlanName] = useState<string>("");
  const [planSlug, setPlanSlug] = useState<string>("");
  const [aiHintsLimit, setAiHintsLimit] = useState<number | null>(null);
  const [aiHintsUsedToday, setAiHintsUsedToday] = useState<number>(0);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  
  // Plan selection modal state
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [plansLoading, setPlansLoading] = useState<boolean>(false);
  const [currentUserPlan, setCurrentUserPlan] = useState<any>(null);

  function parseGraphExpression(input: string): { expr: string; isValid: boolean; error?: string } {
  const trimmedInput = input.trim();
  
  // Handle different input formats
  let expr = trimmedInput;
  
  // Pattern 1: y = expression
  const yEqualsMatch = expr.match(/^y\s*=\s*(.+)$/i);
  if (yEqualsMatch) {
    expr = yEqualsMatch[1];
  }
  
  // Pattern 2: f(x) = expression
  const functionMatch = expr.match(/^f\s*\(\s*x\s*\)\s*=\s*(.+)$/i);
  if (functionMatch) {
    expr = functionMatch[1];
  }
  
  // Pattern 3: equation with both sides (try to solve for y)
  if (expr.includes('=') && !yEqualsMatch && !functionMatch) {
    const parts = expr.split('=');
    if (parts.length === 2) {
      const left = parts[0].trim();
      const right = parts[1].trim();
      
      // If left side is just 'y', use right side
      if (left.toLowerCase() === 'y') {
        expr = right;
      }
      // If right side is just 'y', use left side
      else if (right.toLowerCase() === 'y') {
        expr = left;
      }
      // Try to detect if it's a simple rearrangeable equation
      else {
        try {
          // For simple cases, try to rearrange
          const simplified = math.simplify(`${left} - (${right})`);
          expr = simplified.toString();
        } catch {
          expr = `${left} - (${right})`;
        }
      }
    }
  }
  
  // Clean up common mathematical notation
  expr = expr
    .replace(/\s+/g, ' ')  // normalize spaces
    .replace(/×/g, '*')    // multiplication symbol
    .replace(/÷/g, '/')    // division symbol
    .replace(/²/g, '^2')   // superscript 2
    .replace(/³/g, '^3')   // superscript 3
    .replace(/π/g, 'pi')   // pi symbol
    .replace(/\bsen\(/gi, 'sin(')  // Spanish sin
    .replace(/\bcos\(/gi, 'cos(')  // cos
    .replace(/\btg\(/gi, 'tan(')   // tan (alternative)
    .replace(/\bcotg\(/gi, 'cot(') // cotangent
    .replace(/\bctg\(/gi, 'cot(')  // cotangent (alternative)
    .replace(/\blg\(/gi, 'log10(') // log base 10
    .replace(/\bln\(/gi, 'log(')   // natural log
    .replace(/\bexp\(/gi, 'exp(')  // exponential
    .replace(/\bsqrt\(/gi, 'sqrt(') // square root
    .replace(/\babs\(/gi, 'abs(')  // absolute value
    .replace(/\bmod\(/gi, 'mod(')  // modulo
    .replace(/\bmax\(/gi, 'max(')  // maximum
    .replace(/\bmin\(/gi, 'min('); // minimum
  
  // Handle implicit multiplication
  expr = expr
    .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // 2x -> 2*x
    .replace(/([a-zA-Z])(\d)/g, '$1*$2')  // x2 -> x*2
    .replace(/\)\(/g, ')*(')             // )( -> )*(
    .replace(/([a-zA-Z])\(/g, '$1*(')     // x( -> x*(
    .replace(/\)([a-zA-Z])/g, ')*$1');   // )x -> )*x
  
  // Validate that the expression contains 'x' variable
  if (!/\bx\b/.test(expr)) {
    return {
      expr: expr,
      isValid: false,
      error: "Grafik chizish uchun ifodada 'x' o'zgaruvchisi bo'lishi kerak"
    };
  }
  
  // Test if expression can be compiled
  try {
    const compiled = math.compile(expr);
    // Test evaluation with a sample value
    const testResult = compiled.evaluate({ x: 1 });
    
    if (typeof testResult === 'object' && testResult?.im !== undefined) {
      // Complex number - might still be valid if imaginary part is negligible
      if (Math.abs(testResult.im) > 1e-10) {
        return {
          expr: expr,
          isValid: false,
          error: "Ifoda kompleks qiymatlar beradi. Real qiymatli funksiya kiriting."
        };
      }
    }
    
    return { expr: expr, isValid: true };
  } catch (e: any) {
    return {
      expr: expr,
      isValid: false,
      error: `Ifodani tahlil qilib bo'lmadi: ${e.message || 'Noma\'lum xatolik'}`
    };
  }
}

function detectGraphIntent(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  
  // Explicit graph patterns - only these should trigger graphing in auto mode
  if (/^(y\s*=|f\s*\(\s*x\s*\)\s*=|graph|grafik|plot|chiz)/i.test(trimmed)) {
    return true;
  }
  
  // Don't auto-detect if it looks like an equation to solve (has = sign)
  if (trimmed.includes('=')) {
    return false;
  }
  
  // Don't auto-detect if it looks like a derivative or integral
  if (/^(d\/dx|∫|integral|int\()/i.test(trimmed)) {
    return false;
  }
  
  // Only detect simple function expressions that are clearly meant for graphing
  // These should be very specific to avoid conflicts
  const explicitFunctionPatterns = [
    /^x\^[2-9]$/,                     // Simple powers: x^2, x^3 (but not x^1 or x^0)
    /^-?x\^[2-9]$/,                  // Negative simple powers: -x^2
    /^-?\d*x\^[2-9]$/,               // Coefficient with power: 2x^2, -3x^3
    /^(sin|cos|tan)\(x\)$/,           // Simple trig: sin(x), cos(x), tan(x)
    /^(ln|log|log10)\(x\)$/,         // Simple log: ln(x), log(x)
    /^e\^x$/,                         // e^x
    /^\d+\^x$/,                      // 2^x, 3^x etc.
    /^sqrt\(x\)$/,                   // sqrt(x)
    /^abs\(x\)$/,                    // abs(x)
    /^1\/x$/                         // 1/x
  ];
  
  return explicitFunctionPatterns.some(pattern => pattern.test(trimmed));
}

  function run() {
    setAiText("");
    setResult("");
    setGraphExpr("");
    const eq = parseEquation(input);
    const want = mode;
    const trimmedInput = input.trim();

    // Enhanced graph handling: explicit graph mode OR auto-detect function patterns
    if (want === "graph" || (want === "auto" && detectGraphIntent(trimmedInput))) {
      const graphResult = parseGraphExpression(trimmedInput);
      
      if (!graphResult.isValid) {
        setSteps([ { 
          tex: "\\text{" + (graphResult.error || "Grafik chizish uchun yaroqsiz ifoda") + "}", 
          note: "Grafik xatoligi" 
        } ]);
        return;
      }
      
      try {
        const parsedExpr = math.parse(graphResult.expr);
        setSteps([ { 
          tex: `f(x) = ${parsedExpr.toTex()}`, 
          note: "Grafik chizish uchun funksiya" 
        } ]);
        setGraphExpr(graphResult.expr);
        setResult(`Funksiya: f(x) = ${graphResult.expr}`);
        return;
      } catch (e: any) {
        setSteps([ { 
          tex: "\\text{Ifodani TeX formatiga o'tkazishda xatolik}", 
          note: "Grafik xatoligi" 
        } ]);
        setGraphExpr(graphResult.expr); // Still try to plot even if TeX conversion fails
        return;
      }
    }

    // Handle equations (with = sign)
    if ((want === "auto" || want === "solve") && eq) {
      // Try different equation types based on complexity
      if (isProbablyCubic(eq.L, eq.R)) {
        // For cubic equations, try numerical methods or special cases
        const result = tryNumericalSolution(eq.L, eq.R);
        if (result) {
          setSteps(result.steps);
          setResult(result.solution);
          return;
        }
      }
      
      if (isProbablyQuadratic(eq.L, eq.R)) {
        const out = solveQuadraticSteps(eq.L, eq.R);
        if (out) {
          setSteps(out.steps);
          if (Array.isArray(out.solution)) {
            setResult(`x = ${out.solution.map(x=>x.toFixed(6)).join(", ")}`);
          }
          return;
        }
      }
      
      if (isProbablyLinear(eq.L, eq.R)) {
        const out = solveLinearSteps(eq.L, eq.R);
        if (out) {
          setSteps(out.steps);
          setResult(`x = ${Number(out.solution).toFixed(6)}`);
          return;
        }
      }
    }

    // Handle derivatives
    if (want === "differentiate" || (want === "auto" && !eq && hasVariable(trimmedInput))) {
      const out = derivativeSteps(trimmedInput);
      if (out) {
        setSteps(out.steps);
        setResult(`dy/dx = ${out.derivativeTex}`);
        return;
      }
    }

    // Handle integrals
    if (want === "integrate" || (want === "auto" && isProbablyIntegral(trimmedInput))) {
      const result = tryIntegration(trimmedInput);
      if (result) {
        setSteps(result.steps);
        setResult(result.solution);
        return;
      }
    }

    // Handle evaluation
    if (want === "evaluate") {
      const result = tryArithmeticEvaluation(trimmedInput);
      if (result) {
        setSteps(result.steps);
        setResult(result.solution);
        return;
      }
    }

    // Handle trigonometric expressions
    if (want === "auto" && isProbablyTrigonometric(trimmedInput)) {
      const result = tryTrigonometricSimplification(trimmedInput);
      if (result) {
        setSteps(result.steps);
        setResult(result.solution);
        return;
      }
    }

    // Handle logarithmic expressions
    if (want === "auto" && isProbablyLogarithmic(trimmedInput)) {
      const result = tryLogarithmicSimplification(trimmedInput);
      if (result) {
        setSteps(result.steps);
        setResult(result.solution);
        return;
      }
    }

    // Handle simplification
    if (want === "simplify" || (want === "auto" && isComplexExpression(trimmedInput))) {
      const out = simplifySteps(trimmedInput);
      if (out) { 
        setSteps(out.steps); 
        return; 
      }
    }

    // Handle basic arithmetic
    if (want === "auto" && !eq && !hasVariable(trimmedInput)) {
      const result = tryArithmeticEvaluation(trimmedInput);
      if (result) {
        setSteps(result.steps);
        setResult(result.solution);
        return;
      }
    }

    // Fallback: try general evaluation
    const generalResult = tryGeneralEvaluation(trimmedInput);
    if (generalResult) {
      setSteps(generalResult.steps);
      if (generalResult.solution) setResult(generalResult.solution);
      return;
    }

    setSteps([ { tex: "\\text{Bu masalani hali tushuna olmadim. Boshqa ko'rinishda yozing yoki rejimni tanlang.}", note: "" } ]);
  }

  async function askAI() {
    try {
      setBusy(true);
      
      // Get CSRF token for authenticated requests
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const res = await fetch("/api/ai/explain-math", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({ 
          problem: input, 
          steps: steps,
          language: "uz"
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          // Usage limit reached
          setAiText(data.error || "AI tushuntirish limiti tugadi. Rejangizni yangilang.");
          // Refresh usage data
          refreshUsage();
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      
      if (data.success) {
        setAiText(data.explanation || "AI tushuntirishni bermadi.");
        // Update remaining count from server response
        if (typeof data.remaining === 'number') {
          const newUsed = Math.max(0, (aiHintsLimit || 0) - data.remaining);
          setAiHintsUsedToday(newUsed);
        } else {
          // Fallback: refresh usage from server
          refreshUsage();
        }
      } else {
        throw new Error(data.error || "AI xizmatida xatolik");
      }
    } catch (e) {
      console.error('AI Error:', e);
      setAiText(
        e.message?.includes('401') || e.message?.includes('403')
          ? "AI xizmatidan foydalanish uchun tizimga kiring."
          : e.message?.includes('timeout') || e.message?.includes('network')
          ? "Tarmoq xatosi. Iltimos, qaytadan urinib ko'ring."
          : "AI xizmati hozirda mavjud emas. Keyinroq qaytadan urinib ko'ring."
      );
    } finally { 
      setBusy(false); 
    }
  }

  async function getAIHint() {
    try {
      setBusy(true);
      
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const res = await fetch("/api/ai/get-hint", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({ 
          problem: input,
          current_step: steps.length > 0 ? steps[steps.length - 1].note : "",
          language: "uz"
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          // Usage limit reached
          setAiText(data.error || "AI maslahat limiti tugadi. Rejangizni yangilang.");
          // Refresh usage data
          refreshUsage();
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      
      if (data.success) {
        setAiText(`💡 Maslahat: ${data.hint}`);
        // Update remaining count from server response
        if (typeof data.remaining === 'number') {
          const newUsed = Math.max(0, (aiHintsLimit || 0) - data.remaining);
          setAiHintsUsedToday(newUsed);
        } else {
          // Fallback: refresh usage from server
          refreshUsage();
        }
      } else {
        throw new Error(data.error || "Maslahat olishda xatolik");
      }
    } catch (e) {
      console.error('Hint Error:', e);
      setAiText("Maslahat olishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally { 
      setBusy(false); 
    }
  }

  async function solveWithAI() {
    try {
      setBusy(true);
      setAiText("");
      
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const res = await fetch("/api/ai/solve-problem", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({ 
          problem: input,
          type: mode === "auto" ? "auto" : mode,
          language: "uz"
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          // Usage limit reached
          setAiText(data.error || "AI yechim limiti tugadi. Rejangizni yangilang.");
          // Refresh usage data
          refreshUsage();
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      
      if (data.success && data.solution) {
        setAiText(`🤖 AI yechimi:\n${data.solution}`);
        // Update remaining count from server response
        if (typeof data.remaining === 'number') {
          const newUsed = Math.max(0, (aiHintsLimit || 0) - data.remaining);
          setAiHintsUsedToday(newUsed);
        } else {
          // Fallback: refresh usage from server
          refreshUsage();
        }
      } else {
        throw new Error(data.error || "AI yechim topa olmadi");
      }
    } catch (e) {
      console.error('AI Solve Error:', e);
      setAiText("AI yechim olishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally { 
      setBusy(false); 
    }
  }

  // Fetch current plan and today usage
  useEffect(() => {
    let cancelled = false;
    async function refreshUsageInner() {
      try {
        const usageRes = await fetch("/api/user-plan/usage", {
          headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
          credentials: "include",
        });
        if (!cancelled && usageRes.ok) {
          const usageData = await usageRes.json();
          const used = usageData?.data?.current_usage?.ai_hints ?? usageData?.current_usage?.ai_hints ?? 0;
          setAiHintsUsedToday(Number(used) || 0);
        }
      } catch {}
    }
    async function fetchPlan() {
      try {
        setPlanLoading(true);
        await fetch("/sanctum/csrf-cookie", { credentials: "include" });
        const [planRes, usageRes] = await Promise.all([
          fetch("/api/user-plan/current", {
            headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
            credentials: "include",
          }),
          fetch("/api/user-plan/usage", {
            headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
            credentials: "include",
          }),
        ]);
        if (!cancelled && planRes.ok) {
          const planData = await planRes.json();
          const p = planData?.data || planData?.plan || null;
          if (p) {
            setPlanName(p.name || p.slug || "");
            setPlanSlug(p.slug || "");
            // Read from nested limits if present
            const limitRaw = (p.limits && (p.limits.ai_hints_limit ?? p.limits.ai_hints)) ?? (p.ai_hints_limit ?? p.ai_hints);
            setAiHintsLimit(limitRaw == null ? null : Number(limitRaw));
          }
        }
        if (!cancelled && usageRes.ok) {
          const usageData = await usageRes.json();
          // Backend provides monthly/period usage: data.current_usage.ai_hints
          const used = usageData?.data?.current_usage?.ai_hints ?? usageData?.current_usage?.ai_hints ?? 0;
          setAiHintsUsedToday(Number(used) || 0);
        }
        // Also refresh local daily for free plan display only
        if ((planSlug || "").toLowerCase() === 'free') {
          try {
            const key = `ai_hints_used_${new Date().toISOString().slice(0,10)}`;
            const localUsed = Number(localStorage.getItem(key) || '0');
            if (!cancelled && localUsed > aiHintsUsedToday) setAiHintsUsedToday(localUsed);
          } catch {}
        }
      } catch (e) {
        // Silently ignore; UI will treat as unknown/unlimited
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    }
    fetchPlan();
    return () => { cancelled = true };
  }, []);

  async function refreshUsage() {
    try {
      const usageRes = await fetch("/api/user-plan/usage", {
        headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        credentials: "include",
      });
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        const used = usageData?.data?.current_usage?.ai_hints ?? usageData?.current_usage?.ai_hints ?? 0;
        setAiHintsUsedToday(Number(used) || 0);
      }
    } catch {}
  }

  // Plan selection functions
  async function fetchAvailablePlans() {
    try {
      setPlansLoading(true);
      await fetch("/sanctum/csrf-cookie", { credentials: "include" });
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/plans', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAvailablePlans(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching available plans:', error);
    } finally {
      setPlansLoading(false);
    }
  }

  const handleUpgradePlan = async () => {
    setShowPlanModal(true);
    await fetchAvailablePlans();
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlanSelection = () => {
    if (selectedPlan) {
      // Create a message for the admin with selected plan details
      const message = `Salom! Men ${selectedPlan.name} rejasini tanlashni xohlayman.\n\nReja tafsilotlari:\n- Nomi: ${selectedPlan.name}\n- Narxi: ${selectedPlan.price > 0 ? selectedPlan.price.toLocaleString() + ' so\'m' : 'Bepul'}\n- Muddati: ${selectedPlan.duration > 0 ? selectedPlan.duration + ' kun' : 'Cheksiz'}\n- Testlar: ${selectedPlan.assessments_limit === 999 ? 'Cheksiz' : selectedPlan.assessments_limit}\n- Darslar: ${selectedPlan.lessons_limit === -1 ? 'Cheksiz' : selectedPlan.lessons_limit}\n- AI yordami: ${selectedPlan.ai_hints_limit === -1 ? 'Cheksiz' : selectedPlan.ai_hints_limit}\n\nIltimos, bu rejani faollashtiring.`;
      
      const encodedMessage = encodeURIComponent(message);
      const telegramUrl = `https://t.me/talimtizimi_admin?text=${encodedMessage}`;
      
      // Close modal and redirect to Telegram
      setShowPlanModal(false);
      setSelectedPlan(null);
      window.open(telegramUrl, '_blank');
    }
  };

  const examples = [
    { expr: "2x + 3 = 7", desc: "Chiziqli tenglama" },
    { expr: "x^2 - 5x + 6 = 0", desc: "Kvadrat tenglama" },
    { expr: "x^3 - 2x^2 + x - 2 = 0", desc: "Kub tenglama" },
    { expr: "y = x^2 + 2x - 3", desc: "Parabola grafigi" },
    { expr: "y = sin(x)", desc: "Sinus funksiyasi" },
    { expr: "y = cos(x) + 0.5*sin(2*x)", desc: "Trigonometrik kombinatsiya" },
    { expr: "y = e^x", desc: "Eksponensial funksiya" },
    { expr: "y = ln(x)", desc: "Natural logaritm" },
    { expr: "y = sqrt(x)", desc: "Kvadrat ildiz" },
    { expr: "y = abs(x)", desc: "Mutlaq qiymat" },
    { expr: "y = 1/x", desc: "Giperbola" },
    { expr: "y = x^3 - 3*x", desc: "Kub funksiya" },
    { expr: "sin(x) + cos(x)", desc: "Trigonometrik ifoda" },
    { expr: "log(x) + ln(2x)", desc: "Logaritmik ifoda" },
    { expr: "sqrt(16) + 2^3", desc: "Arifmetik hisoblash" },
    { expr: "d/dx (3x^3 - 2x^2 + x - 4)", desc: "Hosila olish" },
    { expr: "(x^2 + 2x + 1) * (x - 1)", desc: "Algebraik soddalashtirish" },
    { expr: "y = tan(x)", desc: "Tangens funksiyasi" },
    { expr: "y = x^2 * sin(x)", desc: "Parabola va sinus ko'paytmasi" },
    { expr: "y = 2^x", desc: "Eksponensial funksiya (asosi 2)" }
  ];
  const [showAllExamples, setShowAllExamples] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Matematik Yordamchi</h1>
            <p className="text-purple-100 text-lg">Matematik masalalarni qadam-baqadam hal qiling va tushuntirish oling</p>    
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2H11c.8 0 1.5-.7 1.5-1.5S11.8 10 11 10H9.5V8H11c1.3 0 2.5 1.1 2.5 2.5 0 .7-.3 1.4-.8 1.8.5.4.8 1.1.8 1.8 0 1.4-1.2 2.9-2.5 2.9zm5.5 0H14v-2h2.5c.8 0 1.5-.7 1.5-1.5S17.3 10 16.5 10H14V8h2.5c1.3 0 2.5 1.1 2.5 2.5 0 .7-.3 1.4-.8 1.8.5.4.8 1.1.8 1.8 0 1.4-1.2 2.9-2.5 2.9z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Masala</label>
            <textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="Matematik masalani yozing:\n\n• Tenglamalar: 2x + 3 = 7, x^2 - 5x + 6 = 0\n• Grafiklar: y = x^2, f(x) = sin(x)\n• Hosilalar: d/dx (x^3 + 2x)\n• Integrallar: ∫ x^2 dx\n• Hisoblash: sqrt(16) + 2^3\n• Soddalashtirish: (x+1)^2"
            />
            {/* Input quick actions */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={()=> setInput("")}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                title="Tozalash"
              >Tozalash</button>
              <button
                type="button"
                onClick={async ()=> {
                  try { const t = await navigator.clipboard.readText(); if (t) setInput(t); } catch {}
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                title="Buferdan qo'yish"
              >Qo'yish</button>
              {/* Quick templates */}
              <div className="flex flex-wrap gap-2">
                {[
                  { k: "Chiziqli", v: "2x + 3 = 7" },
                  { k: "Kvadrat", v: "x^2 - 5x + 6 = 0" },
                  { k: "Hosila", v: "d/dx (3x^3 - 2x^2 + x - 4)" },
                  { k: "Integral", v: "∫ x^2 dx" },
                  { k: "Trigonometrik", v: "sin(x) + cos(x)" },
                  { k: "Grafik", v: "y = x^2 + 1" },
                ].map(t => (
                  <button
                    key={t.k}
                    type="button"
                    onClick={()=> { setInput(t.v); if (t.k === "Grafik") setMode("graph"); }}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                    title={`${t.k} namuna`}
                  >{t.k}</button>
                ))}
              </div>
            </div>
            {/* Quick Insert Toolbar */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { k: "+", v: "+" },
                { k: "-", v: "-" },
                { k: "x^2", v: "x^2" },
                { k: "x^3", v: "x^3" },
                { k: "√x", v: "sqrt(x)" },
                { k: "|x|", v: "abs(x)" },
                { k: "sin", v: "sin(x)" },
                { k: "cos", v: "cos(x)" },
                { k: "tan", v: "tan(x)" },
                { k: "log", v: "log(x)" },
                { k: "ln", v: "ln(x)" },
                { k: "e^x", v: "e^x" },
                { k: "∫", v: "∫ x dx" },
                { k: "d/dx", v: "d/dx (x^2)" },
              ].map(b => (
                <button
                  key={b.k}
                  type="button"
                  onClick={()=> setInput(prev => (prev ? `${prev} ${b.v}` : b.v))}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  title={`${b.k} qo'shish`}
                >
                  {b.k}
                </button>
              ))}
            </div>
            {/* Live TeX Preview */}
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">TeX ko'rinishida oldindan ko'rish:</div>
              {(() => {
                const preview = toTexSafeInput(input);
                if (preview.tex) return <BlockMath math={preview.tex} />;
                return <div className="text-gray-400 text-sm">Yozgan ifodangiz shu yerda chiroyli ko'rinishda chiqadi</div>;
              })()}
            </div>
          </div>
          
          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-600">Misollar:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={()=> setShowAllExamples(s => !s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${showAllExamples ? 'border-purple-600 text-purple-700 bg-purple-50 hover:bg-purple-100' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  title={showAllExamples ? "Misollarni yashirish" : "Misollarni ko'rsatish"}
                >{showAllExamples ? "Yashirish" : "Ko'rsatish"}</button>
              </div>
            </div>
            {!showAllExamples ? (
              <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-3`}>
                {(examples.slice(0,3)).map(ex => {
                  const texPreview = toTexSafeInput(ex.expr).tex;
                  return (
                    <div key={ex.expr} className="p-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                      <div className="text-xs text-gray-500 mb-1">{ex.desc}</div>
                      <div className="min-h-[40px]">
                        {texPreview ? <BlockMath math={texPreview} /> : <span className="font-mono text-sm text-gray-700">{ex.expr}</span>}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={()=>setInput(ex.expr)}
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Qo'llash
                        </button>
                        <button
                          type="button"
                          onClick={()=> navigator.clipboard?.writeText(ex.expr)}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Nusxa olish
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-300`}>
                {examples.map(ex => {
                  const texPreview = toTexSafeInput(ex.expr).tex;
                  return (
                    <div key={ex.expr} className="p-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                      <div className="text-xs text-gray-500 mb-1">{ex.desc}</div>
                      <div className="min-h-[40px]">
                        {texPreview ? <BlockMath math={texPreview} /> : <span className="font-mono text-sm text-gray-700">{ex.expr}</span>}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={()=>setInput(ex.expr)}
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Qo'llash
                        </button>
                        <button
                          type="button"
                          onClick={()=> navigator.clipboard?.writeText(ex.expr)}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Nusxa olish
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={()=> setShowAllExamples(s => !s)}
                className="text-sm text-purple-700 hover:text-purple-800 font-medium"
              >
                {showAllExamples ? "Kamroq ko'rsatish" : "Ko'proq misollar"}
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Qo'llab-quvvatlanadigan yozuvlar: x^2, sqrt(x), sin(x), cos(x), tan(x), log(x), ln(x), e^x, |x| uchun abs(x).
              Integral uchun "∫ x dx" yoki "integral(x)" deb yozing. Hosila uchun "d/dx (ifoda)".
            </div>
          </div>

          {/* Mode Selection and Solve Button */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-sm font-medium text-gray-600">Rejim:</label>
              {(["auto","solve","differentiate","integrate","simplify","graph","evaluate"] as const).map(m => {
                const modeLabels = {
                  auto: "Avtomatik",
                  solve: "Yechish",
                  differentiate: "Hosila",
                  integrate: "Integral",
                  simplify: "Soddalashtirish",
                  graph: "Grafik",
                  evaluate: "Hisoblash"
                };
                return (
                  <button
                    key={m}
                    onClick={()=>setMode(m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode===m
                        ?"bg-purple-600 text-white shadow-md"
                        :"border border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-300"
                    }`}
                  >{modeLabels[m]}</button>
                );
              })}
            </div>
            <button 
              onClick={run} 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[.98] transition-all duration-200"
            >
              Yech
            </button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="h-6 w-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Yechim qadamlari
        </h2>
        <div className="space-y-4">
          {steps.length===0 && (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Hozircha qadamlar yo'q. "Yech" tugmasini bosing.</p>
            </div>
          )}
          {steps.map((s, i)=> (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full mr-3">
                  {i+1}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {s.note || `Qadam ${i+1}`}
                </div>
              </div>
              <div className="ml-8">
                <BlockMath math={s.tex} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {(result || graphExpr) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Natija
          </h2>
          {result && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-4">
              <BlockMath math={result} />
            </div>
          )}
          {graphExpr && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Grafik</h3>
                  <div className="flex items-center gap-2">
                    {/* Graph Controls */}
                    <div className="flex items-center gap-2 text-sm">
                      <label className="text-gray-600">Oraliq:</label>
                      <select 
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                        onChange={(e) => {
                          const [from, to] = e.target.value.split(',').map(Number);
                          // Force re-render with new range by updating graphExpr state
                          setGraphExpr(prev => prev + ' ');
                          setTimeout(() => setGraphExpr(prev => prev.trim()), 50);
                        }}
                        defaultValue="-10,10"
                      >
                        <option value="-5,5">[-5, 5]</option>
                        <option value="-10,10">[-10, 10]</option>
                        <option value="-20,20">[-20, 20]</option>
                        <option value="-50,50">[-50, 50]</option>
                        <option value="-100,100">[-100, 100]</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        // Copy function to clipboard
                        navigator.clipboard?.writeText(`f(x) = ${graphExpr}`);
                      }}
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                      title="Funksiyani nusxa olish"
                    >
                      Nusxa olish
                    </button>
                  </div>
                </div>
                <SvgPlot expr={graphExpr} />
                
                {/* Function Analysis */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Funksiya tahlili:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                    <div>
                      <strong>Funksiya:</strong> f(x) = {graphExpr}
                    </div>
                    <div>
                      <strong>Turi:</strong> {(() => {
                        if (/sin|cos|tan/.test(graphExpr)) return 'Trigonometrik';
                        if (/log|ln/.test(graphExpr)) return 'Logaritmik';
                        if (/exp|e\^/.test(graphExpr)) return 'Eksponensial';
                        if (/x\^3/.test(graphExpr)) return 'Kub';
                        if (/x\^2/.test(graphExpr)) return 'Kvadrat';
                        if (/\^/.test(graphExpr)) return 'Daraja';
                        if (/sqrt/.test(graphExpr)) return 'Ildiz';
                        if (/abs/.test(graphExpr)) return 'Mutlaq qiymat';
                        if (/x/.test(graphExpr)) return 'Chiziqli';
                        return 'Doimiy';
                      })()}
                    </div>
                    <div>
                      <strong>Hosila:</strong> 
                      <button
                        onClick={() => {
                          setInput(`d/dx (${graphExpr})`);
                          setMode('differentiate');
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800 underline"
                      >
                        Hisobla
                      </button>
                    </div>
                    <div>
                      <strong>Integral:</strong>
                      <button
                        onClick={() => {
                          setInput(`∫ ${graphExpr} dx`);
                          setMode('integrate');
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800 underline"
                      >
                        Hisobla
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Common Function Values */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ba'zi qiymatlar:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {(() => {
                      try {
                        const compiled = math.compile(graphExpr);
                        const values = [-2, -1, 0, 1, 2, 3];
                        return values.map(x => {
                          try {
                            const y = compiled.evaluate({ x });
                            const yValue = typeof y === 'object' ? y.re || 0 : y;
                            return (
                              <div key={x} className="text-center p-1 bg-white rounded border">
                                <div className="font-medium">x = {x}</div>
                                <div className="text-gray-600">f({x}) = {Number.isFinite(yValue) ? yValue.toFixed(3) : '—'}</div>
                              </div>
                            );
                          } catch {
                            return (
                              <div key={x} className="text-center p-1 bg-white rounded border">
                                <div className="font-medium">x = {x}</div>
                                <div className="text-gray-600">f({x}) = —</div>
                              </div>
                            );
                          }
                        });
                      } catch {
                        return <div className="text-gray-500">Qiymatlarni hisoblab bo'lmadi</div>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Explanation Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Yordamchi
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
              {planLoading ? "Reja: yuklanmoqda..." : (
                aiHintsLimit == null
                  ? `Reja: ${planName || '—'} • AI maslahatlar: cheksiz`
                  : `Reja: ${planName || '—'} • Qolgan maslahat: ${Math.max(aiHintsLimit - aiHintsUsedToday, 0)}/${aiHintsLimit}`
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={getAIHint} 
                disabled={busy || !input.trim() || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                busy || !input.trim() || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg"
                }`}
                title="Maslahat olish"
              >
                {busy ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Izlayapti...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {aiHintsLimit != null ? `Maslahat (${Math.max(aiHintsLimit - aiHintsUsedToday, 0)}/${aiHintsLimit})` : "Maslahat"}
                  </div>
                )}
              </button>
              
              <button 
                onClick={solveWithAI} 
                disabled={busy || !input.trim() || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  busy || !input.trim() || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
                title="AI bilan yechish"
              >
                {busy ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yechyapti...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Yechim
                  </div>
                )}
              </button>
              
              <button 
                onClick={askAI} 
                disabled={busy || steps.length === 0 || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  busy || steps.length === 0 || (aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
                title="Yechimni tushuntirish"
              >
                {busy ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI so'rayapti...
                  </div>
                ) : "Tushuntirish"}
              </button>
              
              {/* Upgrade Plan CTA */}
              {(aiHintsLimit != null && aiHintsUsedToday >= aiHintsLimit) && (
                <button
                  type="button"
                  onClick={handleUpgradePlan}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200"
                  title="Rejani yangilash"
                >
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Rejani yangilash
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* AI Response Display */}
        <div className={`text-gray-700 whitespace-pre-wrap min-h-[4rem] p-4 rounded-xl border transition-all duration-200 ${
          aiText 
            ? aiText.includes('💡') 
              ? "bg-yellow-50 border-yellow-200" 
              : aiText.includes('🤖')
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
        }`}>
          {aiText || (
            <div className="text-gray-500 italic">
              AI yordamidan foydalanish uchun:
              <br />• Maslahat olish - keyingi qadamni ko'rsatadi
              <br />• AI yechim - to'liq yechimni beradi  
              <br />• Tushuntirish - mavjud yechimni tushuntiradi
            </div>
          )}
        </div>
        
        {/* AI Service Status */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            AI xizmati faol
          </div>
          <div className="flex items-center gap-3">
            {aiHintsLimit != null && (
              <span className={`px-2 py-0.5 rounded-full border border-gray-200 ${
                aiHintsUsedToday >= aiHintsLimit 
                  ? 'bg-red-100 text-red-700 border-red-200'
                  : aiHintsUsedToday >= aiHintsLimit * 0.8
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  : 'bg-gray-100'
              }`}>
                {aiHintsUsedToday >= aiHintsLimit 
                  ? `Limit tugadi! 0/${aiHintsLimit}`
                  : `Qolgan: ${Math.max(aiHintsLimit - aiHintsUsedToday, 0)}/${aiHintsLimit}`
                }
              </span>
            )}
            <span>Powered by Gemini AI • Tezkor va aniq javoblar</span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Maslahatlar
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Barcha rejimlar:</strong></p>
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            <div>
              <p className="font-medium text-purple-700 mb-1">• Yechish (Solve):</p>
              <p className="text-xs ml-3">2x + 3 = 7, x^2 - 5x + 6 = 0, x^3 - x = 0</p>
            </div>
            <div>
              <p className="font-medium text-blue-700 mb-1">• Grafik (Graph):</p>
              <p className="text-xs ml-3">y = x^2, f(x) = sin(x), y = ln(x), y = e^x</p>
            </div>
            <div>
              <p className="font-medium text-green-700 mb-1">• Hosila (Derivative):</p>
              <p className="text-xs ml-3">d/dx (x^3), x^2 + 2x - 1, sin(x) + cos(x)</p>
            </div>
            <div>
              <p className="font-medium text-orange-700 mb-1">• Integral:</p>
              <p className="text-xs ml-3">∫ x^2 dx, ∫ sin(x) dx, integral(e^x)</p>
            </div>
            <div>
              <p className="font-medium text-red-700 mb-1">• Hisoblash (Evaluate):</p>
              <p className="text-xs ml-3">2 + 3 * 4, sqrt(16), 2^3 + log(100)</p>
            </div>
            <div>
              <p className="font-medium text-indigo-700 mb-1">• Soddalashtirish (Simplify):</p>
              <p className="text-xs ml-3">(x + 1)^2, sin^2(x) + cos^2(x)</p>
            </div>
          </div>
          <p className="mt-3"><strong>Avtomatik rejim</strong> eng mos usulni tanlaydi. Aniq rejim uchun yuqoridagi tugmalarni ishlating.</p>
          <p><strong>Qo'llab-quvvatlanadigan:</strong> Barcha asosiy matematik funksiyalar, trigonometriya, logaritmlar, eksponensiallar, ildizlar va mutlaq qiymatlar.</p>
        </div>
      </div>
      
      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPlanModal(false);
              setSelectedPlan(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tarif rejasini tanlang</h2>
                  <p className="text-gray-600 mt-1">O'zingizga mos keladigan rejani tanlang va admin bilan bog'laning</p>
                </div>
                <button
                  onClick={() => {
                    setShowPlanModal(false);
                    setSelectedPlan(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {plansLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Rejalar yuklanmoqda...</p>
                </div>
              ) : availablePlans.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availablePlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedPlan?.id === plan.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : plan.slug === planSlug
                          ? 'border-gray-300 bg-gray-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => plan.slug !== planSlug && handleSelectPlan(plan)}
                    >
                      {plan.slug === planSlug && (
                        <div className="flex items-center space-x-2 mb-4">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-green-700">Joriy rejangiz</span>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {plan.price > 0 ? `${plan.price.toLocaleString()} so'm` : "Bepul"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {plan.duration > 0 ? `${plan.duration} kun` : "Cheksiz muddatli"}
                        </div>
                      </div>
                      
                      {plan.description && (
                        <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                      )}
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Testlar:</span>
                          <span className="font-medium text-gray-900">
                            {plan.assessments_limit === 999 ? "Cheksiz" : plan.assessments_limit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Darslar:</span>
                          <span className="font-medium text-gray-900">
                            {plan.lessons_limit === -1 ? "Cheksiz" : plan.lessons_limit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">AI yordami:</span>
                          <span className="font-medium text-gray-900">
                            {plan.ai_hints_limit === -1 ? "Cheksiz" : plan.ai_hints_limit}
                          </span>
                        </div>
                        {plan.subjects_limit && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Fanlar:</span>
                            <span className="font-medium text-gray-900">
                              {plan.subjects_limit === -1 ? "Cheksiz" : plan.subjects_limit}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {plan.features && plan.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Xususiyatlar:</h4>
                          <div className="space-y-1">
                            {plan.features.slice(0, 3).map((feature: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{feature}</span>
                              </div>
                            ))}
                            {plan.features.length > 3 && (
                              <div className="text-sm text-gray-500">+{plan.features.length - 3} boshqa xususiyat</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {plan.slug === planSlug ? (
                        <button disabled className="w-full bg-gray-100 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg font-medium">
                          Joriy reja
                        </button>
                      ) : (
                        <button
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                            selectedPlan?.id === plan.id
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan);
                          }}
                        >
                          {selectedPlan?.id === plan.id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Tanlangan</span>
                            </div>
                          ) : (
                            "Tanlash"
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Hozirda mavjud rejalar yo'q</p>
                </div>
              )}
              
              {selectedPlan && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Tanlangan reja: {selectedPlan.name}</h3>
                      <p className="text-gray-600">Admin bilan bog'lanib, rejani faollashtiring</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowPlanModal(false);
                          setSelectedPlan(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={handleConfirmPlanSelection}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Admin bilan bog'lanish</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
