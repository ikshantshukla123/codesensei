import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getWalletInfo } from "@/lib/wallet/actions";
import CareerWalletClient from "@/components/CareerWalletClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function WalletPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const wallet = await getWalletInfo();

  if (!wallet) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wallet Not Found</h1>
          <p className="text-gray-400 mb-6">Complete your first lesson to create your career wallet!</p>
          <Link href="/dashboard" className="text-green-500 hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">Career Wallet</h1>
          <p className="text-gray-400 mt-2">Manage your coins, streak, and rewards</p>
        </div>

        <CareerWalletClient
          coins={wallet.coins}
          totalEarned={wallet.totalEarned}
          streakCount={wallet.streakCount}
          transactions={wallet.transactions.map((tx: any) => ({
            ...tx,
            createdAt: tx.createdAt,
          }))}
        />
      </main>
    </div>
  );
}