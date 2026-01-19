'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldAlert, BookMarked } from 'lucide-react';

interface Bug {
  type: string;
  severity: string;
  file: string;
  line: number;
  claimed?: boolean;
  lessonContent?: string;
}

interface LessonSidebarProps {
  bugs: Bug[];
  repositoryName: string;
  prNumber: number;
}

export default function LessonSidebar({ bugs, repositoryName, prNumber }: LessonSidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-lesson-index') || '0');
            setActiveIndex(index);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px', // Trigger when lesson enters top 20% of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all lesson sections
    const lessonSections = document.querySelectorAll('[data-lesson-index]');
    lessonSections.forEach((section) => observer.observe(section));

    return () => {
      lessonSections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToLesson = (index: number) => {
    const element = document.getElementById(`lesson-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="lg:w-96 border-b lg:border-r border-white/10 bg-black/40 backdrop-blur-xl overflow-y-auto">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-10">
        <div className="p-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="mt-4">
            <h1 className="text-xl font-bold text-white font-serif">Security Curriculum</h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">{repositoryName}</p>
            <p className="text-xs text-gray-600 mt-0.5">PR #{prNumber} • {bugs.length} Modules</p>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <nav className="p-4 space-y-2">
        {bugs.map((bug, index) => {
          const isCritical = bug.severity === "CRITICAL" || bug.severity === "HIGH";
          const isActive = index === activeIndex;
          const isCompleted = bug.claimed;

          return (
            <button
              key={index}
              onClick={() => scrollToLesson(index)}
              className={`w-full text-left block p-4 rounded-lg border transition-all ${isActive
                  ? 'bg-white/10 border-green-500/50 shadow-lg shadow-green-500/10 ring-2 ring-green-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <ShieldAlert className={`w-5 h-5 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${isCritical ? 'bg-red-500 text-black' : 'bg-yellow-500 text-black'
                      }`}>
                      {bug.severity}
                    </span>
                    {bug.lessonContent && !isCompleted && (
                      <BookMarked className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">{bug.type}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{bug.file}:{bug.line}</p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
