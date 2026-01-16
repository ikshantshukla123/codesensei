# GitHub Learning Module

## Overview
Production-ready GitHub learning module for CodeSensei students. Features interactive lessons, quizzes, progress tracking, and a clean professional UI.

## Features

### Core Functionality
- ✅ **10 Comprehensive Lessons** covering Git and GitHub basics
- ✅ **Progress Tracking** with localStorage persistence
- ✅ **Interactive Quizzes** with instant feedback (2 MCQs per lesson)
- ✅ **Auth Protection** - Only authenticated users can access
- ✅ **Mobile Responsive** - Sidebar becomes dropdown on small screens
- ✅ **Dark Theme Support** - Maintains CodeSensei theme
- ✅ **SSG + Client-side** - Static generation with client interactivity

### Lessons Covered
1. What is Git and GitHub?
2. Installing Git + Git Config
3. Repositories and README
4. Commit History and Messages
5. Branching (Feature Branches)
6. Pushing to GitHub (Origin)
7. Pull Requests (PR)
8. Code Review (Comments, Approvals)
9. Merge Strategies (Merge Commit, Squash, Rebase)
10. Resolving Merge Conflicts

### Each Lesson Includes
- Clear explanations in simple language
- Real Git commands in code blocks
- Common mistakes section (⚠️)
- Practice tasks (✅)
- 2 multiple-choice quiz questions
- Instant feedback and explanations

## File Structure

```
app/learn/github/
├── page.tsx                      # Server component with auth protection
├── GitHubLearningClient.tsx      # Main client component
├── loading.tsx                   # Loading skeleton
└── components/
    ├── ProgressBar.tsx           # Shows completion percentage
    ├── LessonSidebar.tsx         # Module navigation (responsive)
    ├── LessonContent.tsx         # Renders lesson content
    └── QuizSection.tsx           # Quiz with feedback

lib/learning/
└── githubLessons.ts              # All lesson data and TypeScript types
```

## Components Architecture

### Server Component (page.tsx)
- Handles authentication check
- Redirects unauthenticated users to sign-in
- Static metadata for SEO
- Renders client component

### Client Components

#### GitHubLearningClient
- Main orchestrator component
- Manages lesson state and progress
- localStorage integration
- Navigation between lessons

#### ProgressBar
- Visual progress indicator
- Shows X/10 lessons completed
- Percentage display

#### LessonSidebar
- Desktop: Fixed sidebar navigation
- Mobile: Slide-out drawer with overlay
- Shows completed lessons with ✅ checkmark
- Highlights current lesson

#### LessonContent
- Renders lesson introduction
- Displays sections with headings
- Code blocks with syntax highlighting
- Common mistakes (red alert box)
- Practice tasks (green box)

#### QuizSection
- Radio button selection
- Immediate feedback on answer
- Shows correct answer with explanation
- "Mark Lesson Complete" button after answering

## Data Structure

### Lesson Interface
```typescript
interface Lesson {
  id: number;
  title: string;
  slug: string;
  duration: string;
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      content: string;
      codeBlock?: {
        language: string;
        code: string;
      };
    }>;
    commonMistakes: string[];
    practiceTask: {
      title: string;
      description: string;
      steps: string[];
    };
  };
  quiz: QuizQuestion[];
}
```

## Progress Tracking

### localStorage Schema
```typescript
interface LearningProgress {
  completedLessons: number[];  // Array of completed lesson IDs
  currentLessonId: number;     // Last viewed lesson
}
```

### Storage Key
`github-learning-progress`

## Navigation

### Navbar Integration
- GitHub icon button added to navbar (left of theme toggle)
- Only visible to authenticated users
- Links to `/learn/github`
- Blue icon with hover effect

## Responsive Design

### Desktop (lg+)
- Fixed sidebar (320px width)
- Main content area (max-width: 4xl)
- Side-by-side layout

### Mobile (<lg)
- Floating menu button (top-left)
- Slide-out sidebar with overlay
- Full-width content
- Touch-friendly navigation

## Theme Support

All components use Tailwind CSS theme classes:
- `bg-background` - Page background
- `bg-card` - Card backgrounds
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `border-border` - Borders
- `bg-primary` - Primary actions
- `bg-secondary` - Secondary elements
- `bg-destructive` - Error states

## Quiz System

### Answer Flow
1. User selects an option (radio button)
2. Immediately shows result (correct/incorrect)
3. Displays explanation below
4. After all questions answered, "Mark Complete" button appears
5. Lesson added to completedLessons array

### Visual Feedback
- ✅ Green checkmark for correct answers
- ❌ Red X for incorrect answers
- Correct answer highlighted in green
- Wrong selection highlighted in red
- Explanatory text for learning

## Performance Optimizations

### Static Generation
- Page pre-rendered at build time
- Fast initial load
- SEO-friendly

### Client-side Hydration
- Progress loaded from localStorage
- Smooth transitions
- No unnecessary re-renders

### Code Splitting
- Components lazy-loaded as needed
- Separate chunks for better performance

## Future Enhancements

Potential additions:
- [ ] Practice environment (in-browser Git simulator)
- [ ] Code challenges with automated checking
- [ ] Certificates upon completion
- [ ] Social sharing of progress
- [ ] Leaderboard/gamification
- [ ] More advanced lessons (Git workflows, hooks, etc.)
- [ ] Video tutorials integration
- [ ] AI-powered help chatbot

## Usage

### For Students
1. Sign in to CodeSensei
2. Click GitHub icon in navbar
3. Start with Lesson 1
4. Read content, answer quiz
5. Mark complete, move to next
6. Track progress in sidebar

### For Developers
```bash
# The module is self-contained
# Simply navigate to /learn/github when authenticated

# To add more lessons:
# Edit lib/learning/githubLessons.ts
# Add new lesson object to githubLessons array
```

## Dependencies

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Clerk (Authentication)
- lucide-react (Icons)

## Testing Checklist

- [x] Auth protection (redirects to sign-in)
- [x] Progress saves to localStorage
- [x] Progress loads on page refresh
- [x] Sidebar navigation works
- [x] Quiz feedback displays correctly
- [x] Lessons mark as complete
- [x] Previous/Next buttons work
- [x] Mobile menu opens/closes
- [x] Theme switches properly
- [x] All lessons render without errors
- [x] Code blocks display correctly
- [x] Responsive on all screen sizes

## Accessibility

- Semantic HTML elements
- ARIA labels on icon buttons
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast
- Screen reader friendly

---

**Created for CodeSensei EdTech Platform**
*Making GitHub learning accessible and engaging for all students*
