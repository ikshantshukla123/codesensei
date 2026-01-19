import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldAlert, BookOpen, Coins, Lock, Brain, AlertCircle, TrendingDown, Wrench, Award, CheckCircle } from "lucide-react";
import { generateFullLesson } from "@/lib/ai/providers/gemini";
import { Button } from "@/components/ui/Button";
import { revalidatePath } from "next/cache";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LessonSidebar from './LessonSidebar';

// --- SERVER ACTIONS ---

async function unlockLesson(analysisId: string, bugIndex: number, bugData: any) {
  "use server";

  // Call Gemini to generate the FULL Markdown lesson
  const lessonMarkdown = await generateFullLesson({
    type: bugData.type,
    description: bugData.description,
    severity: bugData.severity,
    codeSnippet: bugData.description
  });

  const analysis = await prisma.analysis.findUnique({ where: { id: analysisId } });
  if (!analysis) return;

  const updatedBugs = (analysis.bugs as any[]).map((b, i) => {
    if (i === bugIndex) {
      return { ...b, lessonContent: lessonMarkdown };
    }
    return b;
  });

  await prisma.analysis.update({
    where: { id: analysisId },
    data: { bugs: updatedBugs }
  });

  revalidatePath(`/dashboard/scan/${analysisId}`);
}

async function claimReward(analysisId: string, bugIndex: number, userId: string) {
  "use server";

  const analysis = await prisma.analysis.findUnique({ where: { id: analysisId } });
  if (!analysis) return;

  const bugs = analysis.bugs as any[];
  const bug = bugs[bugIndex];

  if (bug.claimed) return;

  const updatedBugs = bugs.map((b, i) => i === bugIndex ? { ...b, claimed: true } : b);

  await prisma.analysis.update({
    where: { id: analysisId },
    data: { bugs: updatedBugs }
  });

  const rewardMap: Record<string, number> = { "CRITICAL": 50, "HIGH": 30, "MEDIUM": 15, "LOW": 5 };
  const amount = rewardMap[bug.severity] || 5;

  await prisma.wallet.upsert({
    where: { userId },
    create: { userId, totalDebtPaid: amount, xp: amount },
    update: {
      totalDebtPaid: { increment: amount },
      xp: { increment: amount }
    }
  });

  revalidatePath(`/dashboard/scan/${analysisId}`);
}

// --- MAIN PAGE ---

export default async function ScanLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: { repository: true }
  });

  if (!analysis) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Analysis Not Found</h1>
        <Link href="/dashboard" className="text-green-500 hover:underline">Return to Dashboard</Link>
      </div>
    </div>
  );

  const bugs = analysis.bugs as any[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white">

      {/* SPLIT VIEW LAYOUT */}
      <div className="flex flex-col lg:flex-row h-screen">

        {/* LEFT SIDEBAR - Curriculum Navigator with Scroll Spy */}
        <LessonSidebar
          bugs={bugs}
          repositoryName={analysis.repository.name}
          prNumber={analysis.prNumber}
        />

        {/* RIGHT PANE - Reading Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">

            {bugs.map((bug, index) => {
              const isCritical = bug.severity === "CRITICAL" || bug.severity === "HIGH";

              return (
                <section
                  key={index}
                  id={`lesson-${index}`}
                  data-lesson-index={index}
                  className="mb-24 scroll-mt-8"
                >
                  {/* Lesson Header */}
                  <div className="mb-12">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-2xl ${isCritical ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                        <ShieldAlert className={`w-10 h-10 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`} />
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${isCritical ? 'bg-red-500 text-black' : 'bg-yellow-500 text-black'
                          }`}>
                          MODULE {index + 1} • {bug.severity}
                        </span>
                        <h1 className="text-4xl font-bold text-white font-serif leading-tight mb-3">
                          {bug.type}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                          {bug.description}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 font-mono">
                          <span>📁 {bug.file}</span>
                          <span>📍 Line {bug.line}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  {bug.lessonContent ? (
                    <div className="prose prose-lg prose-invert prose-green max-w-none">
                      <ReactMarkdown
                        components={{
                          h2: ({ node, children, ...props }) => (
                            <div className="flex items-center gap-3 mt-12 mb-6 pb-4 border-b border-white/10">
                              {children?.toString().includes('Concept') && <Brain className="w-6 h-6 text-blue-400" />}
                              {children?.toString().includes('Anatomy') && <AlertCircle className="w-6 h-6 text-purple-400" />}
                              {children?.toString().includes('Disaster') && <TrendingDown className="w-6 h-6 text-red-400" />}
                              {children?.toString().includes('Fix') && <Wrench className="w-6 h-6 text-green-400" />}
                              <h2 className="text-2xl font-bold text-white m-0 font-serif" {...props}>{children}</h2>
                            </div>
                          ),
                          p: ({ node, ...props }) => <p className="text-gray-300 text-lg leading-8 mb-6" {...props} />,
                          li: ({ node, ...props }) => <li className="text-gray-300 text-lg mb-3" {...props} />,
                          ul: ({ node, ...props }) => <ul className="space-y-2 my-6" {...props} />,
                          strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');

                            // Detect if it's "bad" or "fixed" code
                            const isBadCode = codeString.includes('eval(') || codeString.includes('dangerouslySetInnerHTML');
                            const isFixedCode = codeString.includes('textContent') || codeString.includes('sanitize');

                            return !inline && match ? (
                              <div className={`my-8 rounded-xl overflow-hidden border-2 ${isBadCode ? 'border-red-500/30 bg-red-950/10' :
                                isFixedCode ? 'border-green-500/30 bg-green-950/10' :
                                  'border-white/10'
                                }`}>
                                <div className={`px-5 py-3 flex items-center justify-between ${isBadCode ? 'bg-red-500/10' :
                                  isFixedCode ? 'bg-green-500/10' :
                                    'bg-white/5'
                                  }`}>
                                  <span className="text-sm font-mono font-semibold text-gray-400">{match[1]}</span>
                                  {isBadCode && <span className="text-xs font-bold text-red-400 uppercase">⚠️ Vulnerable Code</span>}
                                  {isFixedCode && <span className="text-xs font-bold text-green-400 uppercase">✅ Secure Code</span>}
                                </div>
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    background: 'transparent',
                                    fontSize: '0.95rem',
                                    padding: '1.5rem'
                                  }}
                                  {...props}
                                >
                                  {codeString}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="bg-white/10 text-green-400 px-2 py-1 rounded font-mono text-base" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {bug.lessonContent}
                      </ReactMarkdown>

                      {/* Sticky CTA Footer */}
                      <div className="mt-16 pt-8 border-t-2 border-white/10">
                        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/30 rounded-2xl p-8 text-center">
                          {bug.claimed ? (
                            <div className="space-y-4">
                              <Award className="w-16 h-16 text-green-500 mx-auto" />
                              <h3 className="text-2xl font-bold text-white font-serif">Lesson Mastered!</h3>
                              <p className="text-gray-400">You've earned your XP and unlocked this knowledge.</p>
                            </div>
                          ) : (
                            <form action={claimReward.bind(null, id, index, userId)} className="space-y-4">
                              <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-white mb-2 font-serif">Ready to Claim Your Mastery?</h3>
                              <p className="text-gray-400 mb-6">Confirm you understand this vulnerability and earn <span className="text-green-400 font-bold">+{isCritical ? 50 : 15} XP</span></p>
                              <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-bold px-10 py-5 h-auto text-lg rounded-xl shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-500/50">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                I Understand & Fixed It
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Locked State - Beautiful Call to Action
                    <div className="text-center py-20">
                      <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/20">
                          <Lock className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4 font-serif">Unlock Your Personal Lesson</h2>
                      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Dive deep into <strong className="text-white">{bug.type}</strong> with real-world examples,
                        historical breaches, and step-by-step fixes crafted by our AI Security Professor.
                      </p>
                      <form action={unlockLesson.bind(null, id, index, bug)}>
                        <Button variant="outline" className="border-2 border-green-500/50 hover:bg-green-500/10 text-green-400 px-8 py-4 h-auto text-lg font-semibold rounded-xl transition-all hover:scale-105 hover:border-green-500">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Generate Lesson with AI Professor
                        </Button>
                      </form>
                      <p className="text-xs text-gray-600 mt-6 font-mono">Powered by Gemini 2.5 Flash • Personalized to Your Code</p>
                    </div>
                  )}

                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
