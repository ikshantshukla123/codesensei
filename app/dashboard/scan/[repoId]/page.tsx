import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Receipt, AlertCircle, ShieldCheck, Clock, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
              <div className="max-w-[70%]">
                <p className="font-bold">{item.desc}</p>
                <p className="text-xs text-gray-500 uppercase">{item.severity}</p>
              </div>
              <span>${item.cost.toFixed(2)}</span>
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

interface PageProps {
  params: {
    repoId: string
  }
}

export default async function RepoScanPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { repoId } = await params;

  // Fetch Repo + Latest Analysis
  const repo = await prisma.repository.findUnique({
    where: { id: repoId, userId },
    include: {
      analyses: {
        take: 1,
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

  const latestAnalysis = repo.analyses[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Nav */}
        <Link href="/dashboard" className="inline-flex items-center text-[#737373] hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-12 items-start">

          {/* Left: Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{repo.name}</h1>
            <p className="text-[#a1a1aa] mb-8 font-mono text-sm">
              LAST AUDIT: {latestAnalysis ? new Date(latestAnalysis.createdAt).toLocaleString() : 'NEVER'}
            </p>

            <div className="space-y-6">
              <div className="bg-[#111111] p-6 rounded-xl border border-[#262626]">
                <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-2">Action Required</h3>
                <p className="text-white">
                  {latestAnalysis
                    ? "Review the liability receipt. Fix these vulnerabilities to reduce your technical debt."
                    : "Waiting for the first Pull Request to initialize scan."}
                </p>
              </div>

              {latestAnalysis && (
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
              )}
            </div>
          </div>

          {/* Right: The Receipt */}
          <div className="w-full md:w-auto">
            <LiabilityReceipt analysis={latestAnalysis} repoName={repo.name} />
          </div>

        </div>
      </div>
    </div>
  )
}
