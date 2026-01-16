"use client";

import { githubLessons, Lesson } from "@/lib/learning/githubLessons";
import { useEffect, useState } from "react";
import LessonContent from "./components/LessonContent";
import LessonSidebar from "./components/LessonSidebar";
import QuizSection from "./components/QuizSection";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STORAGE_KEY = "github-learning-progress";

interface LearningProgress {
  completedLessons: number[];
  currentLessonId: number;
}

export default function GitHubLearningClient() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(githubLessons[0]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: LearningProgress = JSON.parse(saved);
        setCompletedLessons(progress.completedLessons || []);
        const lesson = githubLessons.find(
          (l) => l.id === progress.currentLessonId
        );
        if (lesson) {
          setCurrentLesson(lesson);
        }
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (!isLoading) {
      const progress: LearningProgress = {
        completedLessons,
        currentLessonId: currentLesson.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [completedLessons, currentLesson, isLoading]);

  const handleLessonSelect = (lessonId: number) => {
    const lesson = githubLessons.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuizComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = githubLessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    if (currentIndex < githubLessons.length - 1) {
      setCurrentLesson(githubLessons[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousLesson = () => {
    const currentIndex = githubLessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    if (currentIndex > 0) {
      setCurrentLesson(githubLessons[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isFirstLesson = currentLesson.id === 1;
  const isLastLesson = currentLesson.id === githubLessons.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <LessonSidebar
        lessons={githubLessons}
        currentLessonId={currentLesson.id}
        completedLessons={completedLessons}
        totalLessons={githubLessons.length}
        onLessonSelect={handleLessonSelect}
      />

      {/* Lesson Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <LessonContent lesson={currentLesson} />

          {/* Quiz Section */}
          <QuizSection
            questions={currentLesson.quiz}
            onComplete={handleQuizComplete}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <button
              onClick={handlePreviousLesson}
              disabled={isFirstLesson}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isFirstLesson
                  ? "opacity-50 cursor-not-allowed bg-secondary text-muted-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Lesson
            </button>

            <button
              onClick={handleNextLesson}
              disabled={isLastLesson}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isLastLesson
                  ? "opacity-50 cursor-not-allowed bg-secondary text-muted-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
            >
              Next Lesson
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Completion Message */}
          {completedLessons.length === githubLessons.length && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-foreground/80 mb-4">
                You've completed all GitHub basics lessons! You're now ready to
                start using Git and GitHub like a pro.
              </p>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "This will reset all your progress. Are you sure?"
                    )
                  ) {
                    setCompletedLessons([]);
                    setCurrentLesson(githubLessons[0]);
                  }
                }}
                className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
