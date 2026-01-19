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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

// Generate full structured Markdown lesson for the Professor Mode
export async function generateFullLesson(bug: {
  type: string;
  description: string;
  severity: string;
  codeSnippet?: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // 🎓 THE PROFESSOR PROMPT
  const prompt = `
Act as a Senior Cybersecurity Instructor writing a lesson for a junior developer.

TOPIC: ${bug.type}
CONTEXT: The student wrote this code (which has the bug):
"${bug.codeSnippet || bug.description}"

TASK: Write a structured Markdown lesson.

REQUIRED SECTIONS (Use these exact headers):

## 1. The Concept 🧠
Explain ${bug.type} simply. Use a real-world analogy (e.g., "It's like leaving your keys in the door").

## 2. The Code Anatomy 🔍
Look at the student's code snippet above. Explain EXACTLY which line is dangerous and why. Be specific.

## 3. Real-World Disaster 📉
Find a specific HISTORICAL breach caused by this specific bug (e.g., TalkTalk, Equifax, or a recent 2024/2025 DeFi hack).
- Name the Company.
- Amount Lost (approximate).
- What happened in 1-2 sentences.

## 4. The Fix 🛠️
Provide the CORRECTED code block (TypeScript/JavaScript). Explain why the fix works.

TONE: Professional, Encouraging, Educational.
`;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      lastError = err;
      console.error(`Gemini Lesson Error (Attempt ${attempt}/${maxRetries}):`, err);

      // If it's a 503 (overloaded), wait and retry
      if (err?.status === 503 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // If it's a different error or final attempt, break
      break;
    }
  }

  // All retries failed - return user-friendly error
  return `## ⚠️ AI Professor Temporarily Unavailable

The AI lesson generator is currently experiencing high demand. This doesn't affect your learning - the security issue has been identified and saved.

**What you can do:**
1. **Try again in a few minutes** - Click "Generate Lesson" again
2. **Review the issue details** above to understand the vulnerability
3. **Research independently** - Search for "${bug.type} security best practices"

**The Issue:** ${bug.description}

**Why it matters:** ${bug.severity} severity vulnerabilities can lead to serious security breaches.

Your learning progress is saved. Come back anytime to generate this lesson!
`;
}

// Legacy function kept for backwards compatibility
export async function generateTrinityCards(bug: Bug): Promise<{
  definition: string;
  compliance: string;
  impact: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
Issue Type: ${bug.type}
Description: ${bug.description}
Severity: ${bug.severity}
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
