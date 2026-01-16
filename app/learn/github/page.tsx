import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GitHubLearningClient from "./GitHubLearningClient";

export const metadata = {
  title: "GitHub Basics for Beginners | CodeSensei",
  description:
    "Learn Git and GitHub from scratch with interactive lessons, quizzes, and hands-on practice. Master version control, branching, pull requests, and more.",
};

export default async function GitHubLearningPage() {
  // Protect the route - only authenticated users can access
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <GitHubLearningClient />;
}
