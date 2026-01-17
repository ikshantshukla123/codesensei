// lib/ai/providers/openrouter.ts

// 1. Define Types (So TypeScript is happy)
interface Bug {
  type: string;
  file?: string;
  line?: number;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  recommendation?: string;
}

interface BugReport {
  bugs: Bug[];
}

export async function findBugsWithOpenRouter(diff: string): Promise<BugReport> {
  // Check if key exists
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ FATAL: OPENROUTER_API_KEY is missing");
    return { bugs: [] };
  }

  const PROMPT = `
You are a friendly coding mentor helping students learn secure programming practices.
Analyze this code diff and identify learning opportunities (bugs/issues).

Focus on these common student mistakes:
1. 🔒 Security Issues (SQL Injection, XSS, exposed secrets)
2. 🐛 Logic Bugs (null checks, edge cases, race conditions)  
3. 💡 Best Practices (error handling, validation, proper types)

IMPORTANT:
- Use the file path from diff headers (lines like: "diff --git a/... b/...")
- Always include "file" in each bug if possible
- Line number should be the NEW file line number
- Write descriptions in a friendly, educational tone
- Include "recommendation" with a brief fix suggestion

Return a JSON object ONLY in this format:
{
  "bugs": [
    { 
      "type": "SQL Injection Risk",
      "file": "src/api/users.ts", 
      "line": 42, 
      "description": "This query directly uses user input without sanitization, which could allow attackers to manipulate your database",
      "severity": "HIGH",
      "recommendation": "Use parameterized queries or an ORM like Prisma"
    }
  ]
}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CodeSensei - Student Learning Platform"
      },
      body: JSON.stringify({
        // Use DeepSeek V3 (Cheap & Smart)
        model: "deepseek/deepseek-chat",
        max_tokens: 1500,
        messages: [
          { role: "system", content: PROMPT },
          { role: "user", content: diff.substring(0, 15000) }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ OpenRouter Error:", data.error);
      return { bugs: [] };
    }

    if (!data.choices || data.choices.length === 0) {
      return { bugs: [] };
    }

    // Parse the JSON string from DeepSeek
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error("OpenRouter System Error:", err);
    return { bugs: [] };
  }
}
