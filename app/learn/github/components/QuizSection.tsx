"use client";

import { QuizQuestion } from "@/lib/learning/githubLessons";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export default function QuizSection({ questions, onComplete }: QuizSectionProps) {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});
  const [allAnswered, setAllAnswered] = useState(false);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    const newAnswers = { ...answers, [questionId]: answerIndex };
    setAnswers(newAnswers);
    setShowResults({ ...showResults, [questionId]: true });

    // Check if all questions are answered
    if (Object.keys(newAnswers).length === questions.length) {
      setAllAnswered(true);
    }
  };

  const handleMarkComplete = () => {
    onComplete();
  };

  const allCorrect = questions.every(
    (q) => answers[q.id] === q.correctAnswer
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-foreground mb-6">
        📝 Quick Quiz
      </h3>
      <p className="text-muted-foreground mb-6">
        Test your understanding before moving to the next lesson.
      </p>

      <div className="space-y-8">
        {questions.map((question) => {
          const selectedAnswer = answers[question.id];
          const showResult = showResults[question.id];
          const isCorrect = selectedAnswer === question.correctAnswer;

          return (
            <div key={question.id} className="space-y-4">
              <p className="font-semibold text-foreground">
                {question.id}. {question.question}
              </p>

              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === question.correctAnswer;

                  let buttonClass =
                    "w-full text-left p-4 rounded-lg border transition-all ";

                  if (!showResult) {
                    buttonClass += isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-accent";
                  } else {
                    if (isCorrectAnswer) {
                      buttonClass += "border-green-500 bg-green-500/10";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-destructive bg-destructive/10";
                    } else {
                      buttonClass += "border-border opacity-60";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !showResult && handleAnswer(question.id, index)
                      }
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                            }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        <span className="text-foreground flex-1">{option}</span>
                        {showResult && isCorrectAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show explanation after answering */}
              {showResult && (
                <div
                  className={`p-4 rounded-lg border ${isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-destructive/10 border-destructive/30"
                    }`}
                >
                  <p className="text-sm text-foreground font-medium mb-1">
                    {isCorrect ? "✅ Correct!" : "❌ Not quite right"}
                  </p>
                  <p className="text-sm text-foreground/80">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete Lesson Button */}
      {allAnswered && (
        <div className="mt-8 p-6 bg-primary/10 border border-primary rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-foreground mb-1">
                {allCorrect
                  ? "🎉 Perfect Score!"
                  : "Quiz Completed"}
              </p>
              <p className="text-sm text-muted-foreground">
                {allCorrect
                  ? "You got all questions right! Great job!"
                  : "Review the explanations above to strengthen your understanding."}
              </p>
            </div>
            <button
              onClick={handleMarkComplete}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Mark Lesson Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
