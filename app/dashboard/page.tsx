"use client";

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useState, useEffect } from "react";
import { Github, Plus, ArrowRight, ShieldAlert, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Inline Premium Card
function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-12 py-12">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-10 w-32 bg-[#1a1a1a] rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
        </div>

        <div className="h-64 bg-[#1a1a1a] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

interface Repository {
  id: string;
  name: string;
  createdAt: string;
  analyses: {
    riskScore: number;
    createdAt: string;
  }[];
}

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      redirect('/sign-in');
    }

    // Force sync user data first
    fetch('/api/user/sync', { method: 'POST' })
      .then(() => {
        // Then fetch dashboard data
        return fetch('/api/dashboard/stats');
      })
      .then(res => {
        if (res.status === 401) return null;
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data) setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) return <LoadingSkeleton />;

  // Calculate stats from data if not provided directly
  const repositories = data?.repositories || [];
  const totalRepos = data?.stats?.totalRepos || repositories.length;
  const avgRiskScore = data?.stats?.avgRiskScore || 0;
  const criticalIssues = data?.stats?.highRisk || 0;

  // Check if GitHub is connected to Clerk account
  const hasGitHubConnection = user?.externalAccounts.some(acc => acc.provider === 'oauth_github');

  // URL for connecting GitHub via Clerk (redirects to profile where they can add it, or trigger flow)
  // Since we don't have a direct "connect" link, we can point to user profile or use Clerk's userProfile component
  // Better yet, we can't trigger OAuth flow easily from here without mounting <UserProfile />.
  // We'll direct them to the profile page to connect accounts.
  const connectGitHubUrl = "/profile";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10 pb-20">
      {/* Scrollbar Hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Security Overview</h1>
            <p className="text-[#a1a1aa] text-sm mt-2 max-w-lg leading-relaxed">
              Real-time vulnerability monitoring for {user?.fullName || 'you'}.
            </p>
          </div>

          {hasGitHubConnection ? (
            <Link href={process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "#"}>
              <Button className="bg-white text-black hover:bg-gray-200 border-0 font-medium">
                <Plus className="w-4 h-4 mr-2" /> Add Repository
              </Button>
            </Link>
          ) : (
            <Link href="/profile">
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400 border-0 font-medium">
                <Github className="w-4 h-4 mr-2" /> Connect GitHub
              </Button>
            </Link>
          )}
        </div>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GitBranch className="w-24 h-24 text-white" />
            </div>
            <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">Active Repositories</p>
            <p className="text-4xl font-bold text-white mt-4">{totalRepos}</p>
          </PremiumCard>

          <PremiumCard>
            <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">Avg. Risk Score</p>
            <div className="flex items-baseline gap-2 mt-4">
              <p className={`text-4xl font-bold ${avgRiskScore > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                {avgRiskScore}
              </p>
              <span className="text-sm text-[#525252]">/100</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${avgRiskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${avgRiskScore}%` }}
              />
            </div>
          </PremiumCard>

          <PremiumCard className="border-red-900/20 bg-red-950/5">
            <p className="text-sm font-medium text-red-400 uppercase tracking-wider">Critical Vulnerabilities</p>
            <p className="text-4xl font-bold text-red-500 mt-4">{criticalIssues}</p>
          </PremiumCard>
        </div>

        {/* Repositories List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Repositories</h2>
          </div>

          {repositories.length === 0 ? (
            <div className="border border-dashed border-[#262626] rounded-xl p-12 text-center bg-[#0a0a0a]">
              <h3 className="text-lg text-white mb-2">No repositories connected</h3>
              <p className="text-[#737373] text-sm mb-6">
                {hasGitHubConnection
                  ? "Install the GitHub App to start monitoring your code."
                  : "Connect your GitHub account to start monitoring your code."}
              </p>

              {hasGitHubConnection ? (
                <Link href={process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "#"}>
                  <Button variant="primary" className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" /> Install GitHub App
                  </Button>
                </Link>
              ) : (
                <Link href="/profile">
                  <Button variant="outline" className="border-[#262626] text-white hover:bg-[#262626] hover:text-white">
                    <Github className="w-4 h-4 mr-2" /> Connect GitHub Account
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {repositories.map((repo: any) => (
                <div key={repo.id} className="bg-[#111111] border border-[#262626] rounded-xl p-4 flex items-center justify-between hover:border-[#404040] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{repo.name}</h3>
                      <p className="text-xs text-[#737373]">Updated {new Date(repo.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">Risk Score</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        {repo.analyses?.[0]?.riskScore > 50 ? 'High Risk' : 'Low Risk'}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#a1a1aa] hover:text-white">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
