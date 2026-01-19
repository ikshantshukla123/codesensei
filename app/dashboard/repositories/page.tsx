import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Github, ArrowRight } from "lucide-react";

export default async function AllRepositoriesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch ALL repositories for this page
  const repositories = await prisma.repository.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      analyses: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Repositories</h1>
          <p className="text-[#737373] mt-2 font-mono text-sm">
            {repositories.length} repositories connected
          </p>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => {
            const lastAnalysis = repo.analyses[0];
            const riskScore = lastAnalysis?.riskScore || 0;

            let repoStatusColor = "text-emerald-500";
            let repoStatusText = "SECURE";
            if (riskScore > 80) { repoStatusColor = "text-red-500"; repoStatusText = "CRITICAL"; }
            else if (riskScore > 40) { repoStatusColor = "text-yellow-500"; repoStatusText = "WARNING"; }

            const reportLink = lastAnalysis ? `/dashboard/scan/${lastAnalysis.id}` : '#';

            return (
              <Link key={repo.id} href={reportLink} className={`group ${!lastAnalysis ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 h-full flex flex-col justify-between">

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${repoStatusColor === 'text-red-500' ? 'bg-red-950/20 border-red-900/30 text-red-500' : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-500'}`}>
                        {repoStatusText}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-500 transition-colors truncate">
                      {repo.name}
                    </h3>
                    <p className="text-[#737373] text-xs font-mono mb-6">
                      UPDATED: {new Date(repo.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#262626] flex justify-between items-center">
                    <div>
                      <p className="text-[#525252] text-xs uppercase tracking-wider font-semibold">Latest Risk</p>
                      <p className={`text-xl font-bold ${repoStatusColor}`}>{riskScore}/100</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#525252] group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {repositories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No repositories connected yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
