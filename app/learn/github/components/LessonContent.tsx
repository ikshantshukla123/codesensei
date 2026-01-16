"use client";

import { Lesson } from "@/lib/learning/githubLessons";
import { AlertCircle, CheckCircle } from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Lesson Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {lesson.id}
          </span>
          <h1 className="text-3xl font-bold text-foreground m-0">
            {lesson.title}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ⏱️ Estimated time: {lesson.duration}
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-8">
        <p className="text-foreground m-0 leading-relaxed">
          {lesson.content.introduction}
        </p>
      </div>

      {/* Lesson Sections */}
      {lesson.content.sections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {section.heading}
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            {section.content}
          </p>

          {/* Code Block if present */}
          {section.codeBlock && (
            <div className="my-4 rounded-lg overflow-hidden border border-border">
              <div className="bg-secondary px-4 py-2 text-xs font-mono text-muted-foreground border-b border-border">
                {section.codeBlock.language}
              </div>
              <pre className="bg-card p-4 overflow-x-auto m-0">
                <code className="text-sm font-mono text-foreground">
                  {section.codeBlock.code}
                </code>
              </pre>
            </div>
          )}
        </section>
      ))}

      {/* Common Mistakes */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <h3 className="text-xl font-semibold text-foreground m-0">
            ⚠️ Common Mistakes Students Make
          </h3>
        </div>
        <ul className="space-y-2 m-0 pl-8">
          {lesson.content.commonMistakes.map((mistake, index) => (
            <li key={index} className="text-foreground/90">
              {mistake}
            </li>
          ))}
        </ul>
      </div>

      {/* Practice Task */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <h3 className="text-xl font-semibold text-foreground m-0">
            ✅ {lesson.content.practiceTask.title}
          </h3>
        </div>
        <p className="text-foreground/90 mb-4">
          {lesson.content.practiceTask.description}
        </p>
        <ol className="space-y-2 m-0 pl-8">
          {lesson.content.practiceTask.steps.map((step, index) => (
            <li key={index} className="text-foreground/90">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
