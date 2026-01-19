import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Github, Shield, ArrowRight, CheckCircle } from "lucide-react";
import GitHubConnectButton from '@/components/GitHubConnectButton'

export default async function SignInPage() {
  const { userId } = await auth();

  // If user is already authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Shield className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to CodeSensei
          </h1>
          <p className="text-gray-600 mt-2">
            Connect your GitHub account to start transforming technical debt into career capital
          </p>
        </div>

        {/* GitHub Connection Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-lg">

          {/* Benefits List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Analyze your repositories for security vulnerabilities</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Learn the dollar cost of every bug you write</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Transform security debt into career equity</span>
            </div>
          </div>

          {/* GitHub Connect Button */}
          <GitHubConnectButton />

          {/* Privacy Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-900 mb-1">Secure & Private</p>
                <p className="text-xs text-gray-600">
                  We only access repositories you explicitly grant permission to.
                  Your code stays secure and private.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
          <Link href="/" className="text-xs text-green-600 hover:text-green-700 transition-colors">
            ← Back to homepage
          </Link>
        </div>

      </div>
    </div>
  );
}