export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  duration: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
      codeBlock?: {
        language: string;
        code: string;
      };
    }[];
    commonMistakes: string[];
    practiceTask: {
      title: string;
      description: string;
      steps: string[];
    };
  };
  quiz: QuizQuestion[];
}

export const githubLessons: Lesson[] = [
  {
    id: 1,
    title: "What is Git and GitHub?",
    slug: "what-is-git-github",
    duration: "10 min",
    content: {
      introduction: "Git is a version control system that helps you track changes in your code over time. GitHub is a cloud platform where you can store your Git repositories and collaborate with others.",
      sections: [
        {
          heading: "Understanding Version Control",
          content: "Think of Git as a time machine for your code. Every change you make is saved, and you can go back to any previous version whenever you want. This is incredibly useful when you make mistakes or want to see how your project evolved."
        },
        {
          heading: "Git vs GitHub",
          content: "Git runs on your computer locally. GitHub is a website that hosts your Git repositories online. You can use Git without GitHub, but GitHub makes it easy to backup your code and collaborate with teammates."
        },
        {
          heading: "Why Developers Use Git",
          content: "Professional developers use Git for: tracking code changes, collaborating with team members, experimenting with new features safely, and maintaining different versions of their projects."
        }
      ],
      commonMistakes: [
        "Thinking Git and GitHub are the same thing - they're not!",
        "Not committing changes frequently enough",
        "Forgetting to sync local changes with GitHub"
      ],
      practiceTask: {
        title: "Create Your GitHub Account",
        description: "Let's get you set up with the tools you'll need.",
        steps: [
          "Visit github.com and create a free account",
          "Choose a professional username (employers will see this!)",
          "Verify your email address"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What is the main difference between Git and GitHub?",
        options: [
          "Git is for Python, GitHub is for JavaScript",
          "Git is local version control, GitHub is a hosting platform",
          "Git is paid, GitHub is free",
          "They are exactly the same thing"
        ],
        correctAnswer: 1,
        explanation: "Git is a version control system that runs locally on your computer, while GitHub is a cloud platform that hosts Git repositories online."
      },
      {
        id: 2,
        question: "What is the primary purpose of Git?",
        options: [
          "To make websites faster",
          "To track changes in code over time",
          "To debug code automatically",
          "To compile programs"
        ],
        correctAnswer: 1,
        explanation: "Git's primary purpose is to track changes in your code over time, acting as a version control system."
      }
    ]
  },
  {
    id: 2,
    title: "Installing Git + Git Config",
    slug: "installing-git-config",
    duration: "15 min",
    content: {
      introduction: "Before you can use Git, you need to install it on your computer and configure it with your information. This is a one-time setup that tells Git who you are.",
      sections: [
        {
          heading: "Installing Git",
          content: "The installation process varies by operating system. On macOS, Git often comes pre-installed. On Windows, download Git from git-scm.com. On Linux, use your package manager.",
          codeBlock: {
            language: "bash",
            code: `# Check if Git is already installed
git --version

# macOS (using Homebrew)
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win`
          }
        },
        {
          heading: "Basic Git Configuration",
          content: "After installing Git, you need to tell it your name and email. This information will be attached to every commit you make.",
          codeBlock: {
            language: "bash",
            code: `# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify your configuration
git config --global --list`
          }
        },
        {
          heading: "Optional but Recommended Settings",
          content: "These settings make Git easier to use and more visually appealing.",
          codeBlock: {
            language: "bash",
            code: `# Set default branch name to 'main'
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto

# Set your default editor
git config --global core.editor "code --wait"`
          }
        }
      ],
      commonMistakes: [
        "Using the wrong email (use the same email as your GitHub account)",
        "Forgetting the --global flag (settings won't be saved)",
        "Not verifying the configuration after setting it up"
      ],
      practiceTask: {
        title: "Configure Git on Your Machine",
        description: "Set up Git with your information.",
        steps: [
          "Open your terminal or command prompt",
          "Run git --version to verify Git is installed",
          "Configure your name and email using the commands above",
          "Run git config --global --list to verify"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What does the --global flag do in git config commands?",
        options: [
          "Makes the setting apply to the current project only",
          "Makes the setting apply to all Git repositories on your computer",
          "Uploads the setting to GitHub",
          "Deletes the configuration"
        ],
        correctAnswer: 1,
        explanation: "The --global flag makes the configuration setting apply to all Git repositories on your computer, not just the current one."
      },
      {
        id: 2,
        question: "Which email should you use for Git configuration?",
        options: [
          "Any random email address",
          "Your school email",
          "The same email you used for your GitHub account",
          "Git doesn't need an email"
        ],
        correctAnswer: 2,
        explanation: "You should use the same email address that you registered with GitHub so your commits are properly linked to your GitHub account."
      }
    ]
  },
  {
    id: 3,
    title: "Repositories and README",
    slug: "repositories-readme",
    duration: "12 min",
    content: {
      introduction: "A repository (or 'repo') is like a project folder that Git tracks. It contains all your project files and the complete history of changes. The README file is the front page of your repository.",
      sections: [
        {
          heading: "Creating Your First Repository",
          content: "You can create a repository in two ways: locally on your computer, or on GitHub first. Let's start by creating one locally.",
          codeBlock: {
            language: "bash",
            code: `# Create a new project folder
mkdir my-first-project
cd my-first-project

# Initialize Git repository
git init

# Check status
git status`
          }
        },
        {
          heading: "Understanding the README File",
          content: "The README.md file is the first thing people see when they visit your repository. It should explain what your project does, how to use it, and how to contribute. The .md extension means it's written in Markdown format.",
          codeBlock: {
            language: "markdown",
            code: `# My First Project

## Description
This is my first Git project where I'm learning version control.

## How to Use
Instructions go here...

## Author
Your Name`
          }
        },
        {
          heading: "Adding Files to Your Repository",
          content: "After creating files, you need to tell Git to track them. This is a two-step process: staging (git add) and committing (git commit).",
          codeBlock: {
            language: "bash",
            code: `# Create a README file
echo "# My First Project" > README.md

# Stage the file
git add README.md

# Or stage all files
git add .

# Check what's staged
git status`
          }
        }
      ],
      commonMistakes: [
        "Forgetting to run 'git init' before using Git commands",
        "Creating README without the .md extension",
        "Not including important information in the README"
      ],
      practiceTask: {
        title: "Create Your First Repository",
        description: "Initialize a Git repository and add a README.",
        steps: [
          "Create a new folder called 'my-learning-journey'",
          "Navigate into it and run 'git init'",
          "Create a README.md file describing your learning goals",
          "Run 'git status' to see the untracked file"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What command initializes a new Git repository?",
        options: [
          "git start",
          "git init",
          "git create",
          "git new"
        ],
        correctAnswer: 1,
        explanation: "The 'git init' command initializes a new Git repository in the current directory."
      },
      {
        id: 2,
        question: "What is the purpose of a README.md file?",
        options: [
          "To store passwords",
          "To compile the code",
          "To explain what the project does and how to use it",
          "To delete files"
        ],
        correctAnswer: 2,
        explanation: "The README.md file serves as the documentation and front page of your repository, explaining the project's purpose and usage."
      }
    ]
  },
  {
    id: 4,
    title: "Commit History and Messages",
    slug: "commit-history-messages",
    duration: "15 min",
    content: {
      introduction: "Commits are snapshots of your project at specific points in time. Each commit has a message explaining what changed. Good commit messages are crucial for understanding your project's history.",
      sections: [
        {
          heading: "Making Your First Commit",
          content: "A commit saves the changes you've staged. Think of it as taking a snapshot of your project that you can return to later.",
          codeBlock: {
            language: "bash",
            code: `# Stage your changes
git add README.md

# Commit with a message
git commit -m "Add initial README file"

# View commit history
git log

# View compact history
git log --oneline`
          }
        },
        {
          heading: "Writing Good Commit Messages",
          content: "A good commit message should be clear, concise, and describe what changed and why. Use present tense verbs (Add, Fix, Update, Remove).",
          codeBlock: {
            language: "bash",
            code: `# Good commit messages
git commit -m "Add user authentication feature"
git commit -m "Fix login button spacing issue"
git commit -m "Update homepage hero section"
git commit -m "Remove deprecated API calls"

# Bad commit messages (avoid these!)
git commit -m "changes"
git commit -m "fix stuff"
git commit -m "asdfgh"`
          }
        },
        {
          heading: "Viewing Commit History",
          content: "You can view your project's history in various formats to understand what changes were made and when.",
          codeBlock: {
            language: "bash",
            code: `# Detailed commit history
git log

# One line per commit
git log --oneline

# Show last 5 commits
git log -5

# Show commits with file changes
git log --stat`
          }
        }
      ],
      commonMistakes: [
        "Writing vague commit messages like 'fix' or 'update'",
        "Making huge commits with many unrelated changes",
        "Forgetting to commit frequently enough",
        "Not reviewing changes before committing (use git status first!)"
      ],
      practiceTask: {
        title: "Practice Committing Changes",
        description: "Make multiple commits with good messages.",
        steps: [
          "Add a new section to your README.md",
          "Stage the changes with 'git add README.md'",
          "Commit with a descriptive message",
          "Create a new file called 'notes.txt' and commit it",
          "View your commit history with 'git log --oneline'"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What is a commit in Git?",
        options: [
          "A way to delete files",
          "A snapshot of your project at a specific point in time",
          "A type of branch",
          "A GitHub feature only"
        ],
        correctAnswer: 1,
        explanation: "A commit is a snapshot of your project at a specific point in time, saving the state of all tracked files."
      },
      {
        id: 2,
        question: "Which is a good commit message?",
        options: [
          "stuff",
          "changes",
          "Add user registration form",
          "asdf"
        ],
        correctAnswer: 2,
        explanation: "A good commit message is clear and descriptive. 'Add user registration form' clearly states what was done."
      }
    ]
  },
  {
    id: 5,
    title: "Branching (Feature Branches)",
    slug: "branching-feature-branches",
    duration: "18 min",
    content: {
      introduction: "Branches allow you to work on new features or experiments without affecting the main codebase. Think of them as parallel universes where you can make changes safely.",
      sections: [
        {
          heading: "Understanding Branches",
          content: "The main branch (usually called 'main' or 'master') is your production code. Feature branches let you develop new features in isolation. When ready, you merge them back into main.",
          codeBlock: {
            language: "bash",
            code: `# View current branch
git branch

# Create a new branch
git branch feature-login

# Switch to the new branch
git checkout feature-login

# Create and switch in one command (recommended)
git checkout -b feature-signup`
          }
        },
        {
          heading: "Working on a Feature Branch",
          content: "Once on a feature branch, all your commits stay on that branch until you merge it. This keeps your main branch clean and stable.",
          codeBlock: {
            language: "bash",
            code: `# Create and switch to feature branch
git checkout -b feature-navbar

# Make your changes to files
# Stage and commit as usual
git add .
git commit -m "Add navigation bar component"

# View all branches
git branch -a`
          }
        },
        {
          heading: "Switching Between Branches",
          content: "You can switch between branches anytime to work on different features or return to main.",
          codeBlock: {
            language: "bash",
            code: `# Switch to main branch
git checkout main

# Switch to feature branch
git checkout feature-navbar

# Delete a branch (after merging)
git branch -d feature-navbar

# Force delete (if not merged)
git branch -D feature-navbar`
          }
        }
      ],
      commonMistakes: [
        "Making changes directly on the main branch instead of a feature branch",
        "Forgetting which branch you're on (always check with 'git branch')",
        "Not naming branches descriptively (use feature-login, not branch1)",
        "Deleting branches before merging them"
      ],
      practiceTask: {
        title: "Create and Use Feature Branches",
        description: "Practice working with branches safely.",
        steps: [
          "Check your current branch with 'git branch'",
          "Create a new branch called 'feature-about-page'",
          "Switch to it using 'git checkout feature-about-page'",
          "Create a new file called 'about.txt'",
          "Commit the file on your feature branch",
          "Switch back to main and verify the file doesn't exist there"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "Why do developers use feature branches?",
        options: [
          "To make Git slower",
          "To work on new features without affecting the main codebase",
          "Because it's required by GitHub",
          "To delete old code"
        ],
        correctAnswer: 1,
        explanation: "Feature branches allow developers to work on new features or experiments in isolation without affecting the stable main branch."
      },
      {
        id: 2,
        question: "Which command creates AND switches to a new branch?",
        options: [
          "git branch feature-name",
          "git switch feature-name",
          "git checkout -b feature-name",
          "git create feature-name"
        ],
        correctAnswer: 2,
        explanation: "The 'git checkout -b feature-name' command creates a new branch and switches to it in one step."
      }
    ]
  },
  {
    id: 6,
    title: "Pushing to GitHub (Origin)",
    slug: "pushing-to-github",
    duration: "16 min",
    content: {
      introduction: "Once you have commits locally, you'll want to push them to GitHub. This backs up your code to the cloud and allows others to see and collaborate on your work.",
      sections: [
        {
          heading: "Connecting Local Repo to GitHub",
          content: "First, create a repository on GitHub, then connect your local repository to it. The remote repository on GitHub is called 'origin' by convention.",
          codeBlock: {
            language: "bash",
            code: `# Add remote repository (replace with your URL)
git remote add origin https://github.com/username/repo-name.git

# Verify remote connection
git remote -v

# Push your code to GitHub
git push -u origin main`
          }
        },
        {
          heading: "Understanding Push and Pull",
          content: "Push sends your local commits to GitHub. Pull downloads commits from GitHub to your local machine. Always pull before you push to get the latest changes.",
          codeBlock: {
            language: "bash",
            code: `# Push your current branch to GitHub
git push

# Push and set upstream (first time)
git push -u origin main

# Pull latest changes from GitHub
git pull

# Push a specific branch
git push origin feature-login`
          }
        },
        {
          heading: "Authentication",
          content: "GitHub requires authentication to push code. You can use HTTPS with a personal access token or SSH keys. Personal access tokens are easier for beginners.",
          codeBlock: {
            language: "bash",
            code: `# Generate SSH key (recommended)
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy SSH key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# Add SSH key to GitHub (Settings > SSH Keys)
# Then use SSH URL instead of HTTPS
git remote set-url origin git@github.com:username/repo-name.git`
          }
        }
      ],
      commonMistakes: [
        "Trying to push without committing changes first",
        "Using the wrong remote URL",
        "Forgetting to authenticate (set up SSH keys or personal access token)",
        "Not pulling before pushing (can cause conflicts)"
      ],
      practiceTask: {
        title: "Push Your Code to GitHub",
        description: "Upload your local repository to GitHub.",
        steps: [
          "Create a new repository on GitHub (don't initialize with README)",
          "Copy the repository URL",
          "Run 'git remote add origin <your-url>'",
          "Push your code with 'git push -u origin main'",
          "Visit your GitHub repository page to see your code online"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What does 'origin' refer to in Git?",
        options: [
          "Your local computer",
          "The original author of the code",
          "The remote repository (usually on GitHub)",
          "The main branch"
        ],
        correctAnswer: 2,
        explanation: "'origin' is the default name for the remote repository, typically hosted on GitHub."
      },
      {
        id: 2,
        question: "What should you do before pushing your code?",
        options: [
          "Delete your local files",
          "Pull the latest changes from GitHub",
          "Restart your computer",
          "Nothing, just push"
        ],
        correctAnswer: 1,
        explanation: "You should always pull the latest changes before pushing to ensure you have the most recent code and avoid conflicts."
      }
    ]
  },
  {
    id: 7,
    title: "Pull Requests (PR)",
    slug: "pull-requests",
    duration: "20 min",
    content: {
      introduction: "A Pull Request (PR) is how you propose changes to a project. Instead of directly merging your branch into main, you create a PR for others to review your code first.",
      sections: [
        {
          heading: "Creating a Pull Request",
          content: "After pushing your feature branch to GitHub, you create a PR through the GitHub website. This signals that your feature is ready for review.",
          codeBlock: {
            language: "bash",
            code: `# Create and push a feature branch
git checkout -b feature-add-footer
# ... make your changes ...
git add .
git commit -m "Add footer component with social links"
git push -u origin feature-add-footer

# Now go to GitHub to create the PR
# Click "Compare & pull request" button`
          }
        },
        {
          heading: "Writing a Good PR Description",
          content: "Your PR description should explain what changes you made, why you made them, and any testing you did. This helps reviewers understand your work.",
          codeBlock: {
            language: "markdown",
            code: `## Changes Made
- Added responsive footer component
- Included social media links
- Added company information section

## Why
Users need to find social media and contact info

## Testing
- Tested on mobile (iPhone 12)
- Tested on desktop (Chrome, Firefox)
- All links work correctly`
          }
        },
        {
          heading: "PR Best Practices",
          content: "Keep PRs small and focused on one feature. Large PRs are hard to review. Include screenshots for UI changes. Link related issues if applicable."
        }
      ],
      commonMistakes: [
        "Creating PRs with too many unrelated changes",
        "Not providing a clear description of what changed",
        "Pushing directly to main instead of creating a PR",
        "Not testing code before creating a PR"
      ],
      practiceTask: {
        title: "Create Your First Pull Request",
        description: "Practice the PR workflow.",
        steps: [
          "Create a new feature branch: git checkout -b feature-test-pr",
          "Make a small change to your README",
          "Commit and push the branch to GitHub",
          "Go to your GitHub repository page",
          "Click 'Compare & pull request'",
          "Fill in the PR title and description",
          "Create the pull request (don't merge it yet)"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What is the purpose of a Pull Request?",
        options: [
          "To delete branches",
          "To download code from GitHub",
          "To propose changes and have them reviewed before merging",
          "To create new repositories"
        ],
        correctAnswer: 2,
        explanation: "A Pull Request allows you to propose changes and have team members review your code before it's merged into the main branch."
      },
      {
        id: 2,
        question: "What makes a good Pull Request?",
        options: [
          "Hundreds of files changed at once",
          "No description needed",
          "Small, focused changes with a clear description",
          "Directly pushing to main branch"
        ],
        correctAnswer: 2,
        explanation: "Good PRs are small, focused on one feature or fix, and include a clear description of what changed and why."
      }
    ]
  },
  {
    id: 8,
    title: "Code Review (Comments, Approvals)",
    slug: "code-review",
    duration: "18 min",
    content: {
      introduction: "Code review is when teammates examine your code, suggest improvements, and ensure quality. It's a crucial part of professional development that makes everyone better programmers.",
      sections: [
        {
          heading: "The Review Process",
          content: "When someone creates a PR, reviewers examine the code changes, leave comments, ask questions, and either approve or request changes. This collaborative process catches bugs and shares knowledge.",
          codeBlock: {
            language: "markdown",
            code: `# Common review comments:

"Could you add error handling here?"
"This function is getting long. Consider breaking it into smaller pieces."
"Great work! The logic is clear and well-tested."
"Have you considered using a for-loop instead?"
"This will break if the user input is empty. Add validation."`
          }
        },
        {
          heading: "Responding to Review Comments",
          content: "When you receive feedback, read it carefully, make the requested changes, and push new commits to the same branch. The PR updates automatically.",
          codeBlock: {
            language: "bash",
            code: `# After receiving review feedback
# Make the requested changes to your files

git add .
git commit -m "Address review feedback: add input validation"
git push

# The PR automatically updates with your new commits`
          }
        },
        {
          heading: "Approval and Merging",
          content: "Once reviewers approve your PR (usually with LGTM - 'Looks Good To Me'), it's ready to merge. Some teams require 1-2 approvals before merging."
        }
      ],
      commonMistakes: [
        "Taking review comments personally (it's about the code, not you!)",
        "Not responding to review comments",
        "Getting defensive instead of learning from feedback",
        "Merging PRs without approval"
      ],
      practiceTask: {
        title: "Practice Code Review Skills",
        description: "Learn how to give and receive feedback.",
        steps: [
          "Find an open source project's recent PR on GitHub",
          "Read through the code changes",
          "Look at the review comments to see examples",
          "Notice the tone: helpful and constructive",
          "On your own PR (from previous lesson), add a comment explaining one part of your code",
          "Practice writing constructive feedback"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What is the main purpose of code review?",
        options: [
          "To criticize other developers",
          "To catch bugs and share knowledge",
          "To slow down development",
          "To show off your skills"
        ],
        correctAnswer: 1,
        explanation: "Code review helps catch bugs, ensure code quality, and share knowledge among team members. It makes everyone better programmers."
      },
      {
        id: 2,
        question: "What should you do when you receive review comments?",
        options: [
          "Ignore them",
          "Argue with the reviewer",
          "Read carefully, make changes, and push updates",
          "Delete the PR"
        ],
        correctAnswer: 2,
        explanation: "When you receive review feedback, read it carefully, make the requested changes, commit, and push. The PR will update automatically."
      }
    ]
  },
  {
    id: 9,
    title: "Merge Strategies (Merge Commit, Squash, Rebase)",
    slug: "merge-strategies",
    duration: "22 min",
    content: {
      introduction: "There are different ways to merge a feature branch into main. Each strategy has pros and cons. Understanding them helps you maintain a clean Git history.",
      sections: [
        {
          heading: "Merge Commit (Default)",
          content: "A merge commit combines two branches and preserves all individual commits from both. This creates a complete history but can look messy with lots of small commits.",
          codeBlock: {
            language: "bash",
            code: `# Switch to main branch
git checkout main

# Merge feature branch (creates merge commit)
git merge feature-login

# The history shows all commits from both branches
git log --graph --oneline`
          }
        },
        {
          heading: "Squash and Merge",
          content: "Squashing combines all commits from your feature branch into a single commit. This keeps the main branch history clean and easy to read.",
          codeBlock: {
            language: "bash",
            code: `# On GitHub, select "Squash and merge" when merging PR
# Or via command line:

git checkout main
git merge --squash feature-login
git commit -m "Add login feature"

# All 15 commits from feature-login become 1 commit on main`
          }
        },
        {
          heading: "Rebase and Merge",
          content: "Rebasing rewrites history by moving your feature branch commits on top of the latest main branch. This creates a linear history without merge commits.",
          codeBlock: {
            language: "bash",
            code: `# Update feature branch with latest main
git checkout feature-login
git rebase main

# If conflicts occur, resolve them then:
git add .
git rebase --continue

# After rebase, force push (⚠️ be careful!)
git push --force-with-lease`
          }
        },
        {
          heading: "Which Strategy to Use?",
          content: "Squash and merge: Best for most teams. Keeps main clean. Use for feature branches.\n\nMerge commit: When you want to preserve detailed history. Good for long-lived branches.\n\nRebase: For maintaining linear history. Common in open source. Requires team agreement."
        }
      ],
      commonMistakes: [
        "Using rebase on public/shared branches (causes problems for teammates)",
        "Force pushing to main branch (never do this!)",
        "Not understanding which strategy your team uses",
        "Rebasing without resolving conflicts properly"
      ],
      practiceTask: {
        title: "Practice Different Merge Strategies",
        description: "Experiment with merging approaches.",
        steps: [
          "Create a test branch: git checkout -b test-merge",
          "Make 2-3 small commits",
          "Switch to main: git checkout main",
          "Merge normally: git merge test-merge",
          "Look at the history: git log --graph --oneline",
          "Try creating another test branch and experiment with squash merge on GitHub"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What does 'squash and merge' do?",
        options: [
          "Deletes all commits",
          "Combines all commits from a branch into one single commit",
          "Creates multiple merge commits",
          "Renames the branch"
        ],
        correctAnswer: 1,
        explanation: "Squash and merge combines all commits from your feature branch into a single commit, keeping the main branch history clean."
      },
      {
        id: 2,
        question: "When is it dangerous to use git rebase?",
        options: [
          "Always dangerous, never use it",
          "On private branches only",
          "On public/shared branches that others are using",
          "It's never dangerous"
        ],
        correctAnswer: 2,
        explanation: "Rebasing rewrites commit history, which can cause serious problems if others are working on the same branch. Only rebase private branches."
      }
    ]
  },
  {
    id: 10,
    title: "Resolving Merge Conflicts",
    slug: "resolving-merge-conflicts",
    duration: "25 min",
    content: {
      introduction: "Merge conflicts happen when two people edit the same part of a file differently. Git doesn't know which version to keep, so it asks you to decide. Don't panic - conflicts are normal and fixable!",
      sections: [
        {
          heading: "Understanding Conflicts",
          content: "Conflicts occur when: you and a teammate edit the same line, you delete a file that someone else edited, or Git can't automatically combine changes. Git marks the conflicting sections in your files.",
          codeBlock: {
            language: "text",
            code: `<<<<<<< HEAD (Your changes)
const greeting = "Hello World";
=======
const greeting = "Hi there!";
>>>>>>> feature-branch (Incoming changes)

# You need to choose which version to keep, or combine them`
          }
        },
        {
          heading: "Resolving Conflicts Step by Step",
          content: "When Git shows a conflict, open the file, look for conflict markers (<<<, ===, >>>), decide what to keep, remove the markers, then commit the resolution.",
          codeBlock: {
            language: "bash",
            code: `# Attempting to merge causes conflict
git merge feature-branch
# Auto-merging file.js
# CONFLICT (content): Merge conflict in file.js

# 1. Open the file and look for <<<<<<< markers
# 2. Edit the file to keep the version you want
# 3. Remove conflict markers (<<<<, ====, >>>>)
# 4. Stage the resolved file
git add file.js

# 5. Complete the merge
git commit -m "Resolve merge conflict in file.js"

# Or if in a rebase:
git rebase --continue`
          }
        },
        {
          heading: "Example: Resolving a Real Conflict",
          content: "Let's walk through a real example of fixing a conflict.",
          codeBlock: {
            language: "javascript",
            code: `// BEFORE (conflicted):
function greet() {
<<<<<<< HEAD
  return "Hello, Student!";
=======
  return "Welcome, Learner!";
>>>>>>> feature-greeting
}

// AFTER (resolved - you chose to combine both):
function greet() {
  return "Hello, Student! Welcome, Learner!";
}`
          }
        },
        {
          heading: "Preventing Conflicts",
          content: "Best practices: Pull frequently to stay updated, communicate with teammates about who's working on what, keep feature branches short-lived, and make small focused commits."
        }
      ],
      commonMistakes: [
        "Deleting all conflict markers without reading what changed",
        "Choosing your version without considering if the other changes are important",
        "Forgetting to test the code after resolving conflicts",
        "Committing with conflict markers still in the file (<<< ===)",
        "Panicking instead of reading what Git is telling you"
      ],
      practiceTask: {
        title: "Create and Resolve a Conflict",
        description: "Practice conflict resolution in a safe environment.",
        steps: [
          "Create a file called 'test.txt' with one line: 'Original'",
          "Commit it on main branch",
          "Create a branch: git checkout -b branch-a",
          "Change the line to 'Version A' and commit",
          "Go back to main: git checkout main",
          "Change the same line to 'Version B' and commit",
          "Try to merge: git merge branch-a (this creates a conflict)",
          "Open test.txt and see the conflict markers",
          "Choose which version to keep or combine them",
          "Remove the markers, save, git add, and git commit"
        ]
      }
    },
    quiz: [
      {
        id: 1,
        question: "What causes a merge conflict?",
        options: [
          "Using Git incorrectly",
          "Two people editing the same part of a file differently",
          "Having too many branches",
          "Not having internet connection"
        ],
        correctAnswer: 1,
        explanation: "Merge conflicts happen when two people (or branches) edit the same part of a file in different ways, and Git can't automatically decide which version to keep."
      },
      {
        id: 2,
        question: "After resolving a conflict, what must you do?",
        options: [
          "Delete the repository",
          "Stage the resolved file and commit",
          "Nothing, Git handles it automatically",
          "Restart your computer"
        ],
        correctAnswer: 1,
        explanation: "After manually resolving conflicts by editing the file, you must stage it with 'git add' and then commit to complete the merge."
      }
    ]
  }
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return githubLessons.find((lesson) => lesson.slug === slug);
}

export function getLessonById(id: number): Lesson | undefined {
  return githubLessons.find((lesson) => lesson.id === id);
}
