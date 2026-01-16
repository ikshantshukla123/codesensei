"use client";

import { Lesson } from "@/lib/learning/githubLessons";
import { Check, Menu, X } from "lucide-react";
import { useState } from "react";

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: number;
  completedLessons: number[];
  totalLessons: number;
  onLessonSelect: (lessonId: number) => void;
}

export default function LessonSidebar({
  lessons,
  currentLessonId,
  completedLessons,
  totalLessons,
  onLessonSelect,
}: LessonSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const percentage = Math.round((completedLessons.length / totalLessons) * 100);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Compact Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-3">
          <h2 className="text-lg font-bold text-foreground">
            GitHub Basics
          </h2>
          <span className="text-xs font-bold text-primary">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden px-3">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-3">
          {completedLessons.length} of {totalLessons} completed
        </p>
      </div>

      {/* Lessons Navigation */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;

          return (
            <button
              key={lesson.id}
              onClick={() => {
                onLessonSelect(lesson.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-start gap-3 group ${isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground"
                }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${isCurrent
                        ? "border-primary-foreground text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground group-hover:border-foreground"
                      }`}
                  >
                    {lesson.id}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-tight ${isCurrent ? "text-primary-foreground" : ""
                    }`}
                >
                  {lesson.title}
                </p>
                <p
                  className={`text-xs mt-1 ${isCurrent
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                    }`}
                >
                  {lesson.duration}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-card border border-border shadow-lg hover:bg-accent transition-colors"
          aria-label="Toggle lesson menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-80 bg-card border-r border-border h-screen sticky top-0">
        <div className="p-6 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] bg-card border-r border-border shadow-2xl flex flex-col h-full">
            <div className="p-6 flex flex-col h-full overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
