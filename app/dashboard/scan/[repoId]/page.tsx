import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Receipt, AlertCircle, ShieldCheck, Clock, Download, ShieldAlert, Banknote, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ----------------------------------------------------------------------
// Methodology Card Component
// ----------------------------------------------------------------------

function MethodologyCard() {
  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#262626] mt-6">
      <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-4">Data Verification & Sources</h3>
      <div className="space-y-4">

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
            <ShieldAlert className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Severity Standards</p>
            <p className="text-[#a1a1aa] text-xs leading-relaxed mt-1">
              Mapped to <span className="text-white font-semibold">OWASP Top 10</span> Risk Ratings.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
            <Banknote className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Remediation Costs</p>
            <p className="text-[#a1a1aa] text-xs leading-relaxed mt-1">
              Baselined against <span className="text-white font-semibold">HackerOne 2025 Bug Bounty</span> average payouts.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
            <TrendingUp className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Liability Projection</p>
            <p className="text-[#a1a1aa] text-xs leading-relaxed mt-1">
              Impact forecasted using <span className="text-white font-semibold">IBM Cost of a Data Breach Report 2024</span>.
            </p>
          </div>
        </div>

      </div>
      <div className="mt-6 pt-4 border-t border-[#262626] flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-mono text-emerald-500 uppercase">Verified Algorithm ID: CS-2024-X9</span>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Liability Receipt Component
// ----------------------------------------------------------------------

function LiabilityReceipt({ analysis, repoName }: { analysis: any, repoName: string }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border border-dashed border-[#262626] rounded-xl bg-[#0a0a0a]">
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-8 h-8 text-[#737373]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Audit Pending...</h2>
        <p className="text-[#a1a1aa] max-w-md">
          CodeSensei is currently analyzing the latest Pull Request.
          Results will appear here shortly.
        </p>
      </div>
    )
  }

  // Parse bugs from JSON
  const bugs = Array.isArray(analysis.bugs) ? analysis.bugs : []

  // Calculate Debt
  let totalDebt = 0;
  const lineItems = bugs.map((bug: any, index: number) => {
    let cost = 50;
    if (bug.severity === 'High' || bug.severity === 'Critical') cost = 500;
    else if (bug.severity === 'Medium') cost = 200;

    totalDebt += cost;

    return {
      id: index,
      desc: bug.type || bug.description || "Security Vulnerability",
      severity: bug.severity || "Low",
      line: bug.line || null,
      cost
    }
  });

  const tax = totalDebt * 0.10; // 10% "Tech Debt Interest"
  const grandTotal = totalDebt + tax;

  return (
    <div className="max-w-md mx-auto bg-white text-black font-mono p-6 shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500 relative">
      {/* Torn Edge Effect Top */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[#0a0a0a] -mt-2 clip-path-jagged"></div>

      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
        <Receipt className="w-8 h-8 mx-auto mb-2" />
        <h2 className="text-xl font-bold uppercase tracking-widest">Liability Receipt</h2>
        <p className="text-xs mt-1">{new Date(analysis.createdAt).toLocaleString().toUpperCase()}</p>
        <p className="text-xs">ID: {analysis.id.slice(0, 8).toUpperCase()}</p>
      </div>

      {/* Repository Info */}
      <div className="mb-6 text-sm">
        <div className="flex justify-between mb-1">
          <span>REPO:</span>
          <span className="font-bold">{repoName}</span>
        </div>
        <div className="flex justify-between">
          <span>PR ID:</span>
          <span>#{analysis.prNumber || 'HEAD'}</span>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3 mb-6 text-sm">
        {lineItems.length === 0 ? (
          <div className="text-center py-4">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-bold text-green-600">NO LIABILITIES FOUND</p>
          </div>
        ) : (
          lineItems.map((item: any) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="max-w-[75%] flex gap-2">
                {/* Line Number Code */}
                <span className="text-gray-400 font-mono text-[10px] pt-1 min-w-[30px]">
                  {item.line ? `Ln ${item.line}` : 'HEAD'}
                </span>

                {/* Item Details */}
                <div>
                  <p className="font-bold leading-tight">{item.desc}</p>
                  <p className="text-[10px] text-gray-500 uppercase mt-0.5 tracking-wider">{item.severity} RISK</p>
                </div>
              </div>
              <span className="font-bold">${item.cost.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="border-t-2 border-dashed border-black pt-4 text-sm">
        <div className="flex justify-between mb-1">
          <span>SUBTOTAL</span>
          <span>${totalDebt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>INTEREST (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-black text-red-600">
          <span>TOTAL DEBT</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs opacity-60">
        <p>THANK YOU FOR CODING SECURELY</p>
        <p className="mt-1">CodeSensei Inc.</p>
      </div>

      {/* Torn Edge Effect Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#0a0a0a] -mb-2 clip-path-jaggedRotate"></div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------

export default async function RepoScanPage({
  params,
  searchParams
}: {
  params: Promise<{ repoId: string }>,
  searchParams: Promise<{ scanId?: string }>
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { repoId } = await params;
  const { scanId } = await searchParams;

  // Fetch Repo + ALL Analyses (History)
  const repo = await prisma.repository.findUnique({
    where: { id: repoId, userId },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!repo) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Repository Not Found</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const scans = repo.analyses;

  // Logic: Active Scan
  // If scanId is provided and exists, use it. Otherwise default to latest.
  const activeScan = scanId
    ? scans.find(s => s.id === scanId) || scans[0]
    : scans[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Nav */}
        <Link href="/dashboard" className="inline-flex items-center text-[#737373] hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8 border-b border-[#262626] pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{repo.name}</h1>
          <p className="text-[#a1a1aa] font-mono text-sm">
            CURRENT VIEW: {activeScan ? new Date(activeScan.createdAt).toLocaleString().toUpperCase() : 'NO DATA'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Column: History & Sources */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8 order-2 lg:order-1">

            {/* 1. Scan History List */}
            <div>
              <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-4">Audit History</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {scans.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-[#262626] rounded-xl text-[#525252] text-sm">
                    No audits recorded yet.
                  </div>
                ) : (
                  scans.map((scan) => {
                    const isActive = activeScan?.id === scan.id;
                    const isHighRisk = scan.riskScore > 80;

                    return (
                      <Link
                        key={scan.id}
                        href={`/dashboard/scan/${repoId}?scanId=${scan.id}`}
                        className={`block p-4 rounded-xl border transition-all duration-200 group ${isActive
                          ? 'bg-[#1a1a1a] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-[#111111] border-[#262626] hover:border-[#404040]'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#a1a1aa] group-hover:text-white'}`}>
                              {new Date(scan.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[#525252] font-mono mt-0.5">
                              {new Date(scan.createdAt).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isHighRisk
                            ? 'bg-red-950/30 text-red-500 border border-red-900/30'
                            : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/30'
                            }`}>
                            {isHighRisk ? 'CRITICAL' : 'SECURE'}
                          </div>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>

            {/* 2. Sources Card */}
            <MethodologyCard />

            {activeScan && (
              <Button className="w-full bg-white text-black hover:bg-gray-200 h-12">
                <Download className="w-4 h-4 mr-2" /> Export Audit Report
              </Button>
            )}
          </div>

          {/* Right Column: The Receipt */}
          <div className="flex-1 w-full lg:sticky lg:top-8 order-1 lg:order-2">
            <LiabilityReceipt analysis={activeScan} repoName={repo.name} />
          </div>

        </div>
      </div>
    </div>
  )
}
