import { GoogleGenerativeAI } from "@google/generative-ai";

interface Bug {
  type: string;
  line?: number;
  file?: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  recommendation?: string;
}

interface BugReport {
  bugs: Bug[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function explainImpactWithGemini(
  bugs: BugReport,
  diffContext: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
You are a friendly coding mentor writing a SHORT, encouraging GitHub PR comment for a student.

INPUT:
- Issues Found: ${JSON.stringify(bugs)}
- Code Context: ${diffContext.substring(0, 2500)}

RULES:
- Keep it SHORT and student-friendly (max 12 lines)
- Be encouraging but honest about risks
- Output ONLY Markdown
- Use ONLY ONE table (max 3 most important issues)
- No overwhelming technical jargon
- Focus on learning opportunities

FORMAT (exactly like this):

## 📚 CodeSensei Learning Summary
**Status:** [✅ Great Start / ⚠️ Needs Review / 🚫 Critical Issues] | **Learning Score:** [0-100]/100  
**Estimated Technical Debt:** $[number]

| Priority | What to Learn | Line | How to Fix |
|----------|---------------|------|------------|
| 🔴 HIGH | ... | ... | ... |

**Next Steps:** [1 encouraging sentence, e.g. "Review the security issues above, then check out our Trinity Knowledge Deck to learn the concepts!"]

**Ready to learn?** Click below to dive deeper! 👇
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "⚠️ Summary generation failed";
  } catch (err) {
    console.error("❌ Gemini Impact Error:", err);
    return "⚠️ Summary generation failed (AI Error)";
  }
}

// Generate student-friendly explanations for the Trinity Knowledge Deck
export async function generateTrinityCards(bug: Bug): Promise<{
  definition: string;
  compliance: string;
  impact: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
You are creating educational cards for a student learning platform called CodeSensei.
Generate 3 cards (Definition, Compliance/Rules, Real-World Impact) for this coding issue:

Issue Type: ${bug.type}
Description: ${bug.description}
Severity: ${bug.severity}

REQUIREMENTS:
1. DEFINITION Card: Explain what this issue is in simple terms (2-3 sentences)
2. COMPLIANCE/RULES Card: Explain the security standard or best practice rule (2-3 sentences)
3. REAL-WORLD IMPACT Card: Give a concrete example of what could happen (include potential $ impact if applicable)

Keep each card under 100 words. Use friendly, educational language.
Format as JSON:
{
  "definition": "...",
  "compliance": "...",
  "impact": "..."
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from markdown if wrapped
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Gemini Trinity Cards Error:", err);
    return {
      definition: "An issue was detected in your code that needs attention.",
      compliance: "Following coding best practices helps prevent security vulnerabilities.",
      impact: "This issue could lead to security problems or unexpected behavior in production."
    };
  }
}
