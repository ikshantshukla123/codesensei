"use client";

import { useState } from "react";
import { Coins, Zap, BookOpen, Briefcase, TrendingUp, Flame } from "lucide-react";
import { redeemCoins, type RedeemItem } from "@/lib/wallet/actions";
import { Button } from "@/components/ui/Button";

interface CareerWalletClientProps {
  coins: number;
  totalEarned: number;
  streakCount: number;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    reason: string;
    createdAt: Date;
  }>;
}

const REDEEM_ITEMS = [
  {
    id: "AI_HINT" as RedeemItem,
    name: "AI Hint Token",
    description: "Get instant AI-powered hints for your code",
    cost: 50,
    icon: Zap,
    color: "yellow",
  },
  {
    id: "PREMIUM_LESSON" as RedeemItem,
    name: "Premium Lesson Unlock",
    description: "Access exclusive advanced security lessons",
    cost: 120,
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "MOCK_INTERVIEW" as RedeemItem,
    name: "Mock Interview Session",
    description: "1-on-1 AI interview practice session",
    cost: 200,
    icon: Briefcase,
    color: "blue",
  },
];

export default function CareerWalletClient({
  coins,
  totalEarned,
  streakCount,
  transactions,
}: CareerWalletClientProps) {
  const [redeeming, setRedeeming] = useState<RedeemItem | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRedeem = async (item: RedeemItem) => {
    setRedeeming(item);
    setMessage(null);

    try {
      const result = await redeemCoins(item);
      setMessage({
        type: "success",
        text: `✅ Successfully redeemed: ${result.item}! New balance: ${result.newBalance} coins`,
      });

      // Refresh page to update balances
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `❌ ${error.message || "Redemption failed"}`,
      });
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-6 h-6 text-green-500" />
            <span className="text-sm text-gray-400 uppercase tracking-wide">Current Balance</span>
          </div>
          <p className="text-4xl font-bold text-white">{coins}</p>
          <p className="text-xs text-gray-500 mt-1">Coins</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <span className="text-sm text-gray-400 uppercase tracking-wide">All-Time Earned</span>
          </div>
          <p className="text-4xl font-bold text-white">{totalEarned}</p>
          <p className="text-xs text-gray-500 mt-1">Total Coins</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-gray-400 uppercase tracking-wide">Current Streak</span>
          </div>
          <p className="text-4xl font-bold text-white">{streakCount}</p>
          <p className="text-xs text-gray-500 mt-1">Days</p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Redeem Store */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Redeem Coins
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REDEEM_ITEMS.map((item) => {
            const Icon = item.icon;
            const canAfford = coins >= item.cost;
            const isRedeeming = redeeming === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white/5 border rounded-xl p-6 transition-all ${canAfford ? "border-white/20 hover:border-green-500/50" : "border-white/10 opacity-60"
                  }`}
              >
                <div className={`p-3 bg-${item.color}-500/10 rounded-lg inline-block mb-4`}>
                  <Icon className={`w-8 h-8 text-${item.color}-400`} />
                </div>

                <h4 className="text-lg font-bold text-white mb-2">{item.name}</h4>
                <p className="text-sm text-gray-400 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-green-500" />
                    <span className="text-xl font-bold text-white">{item.cost}</span>
                  </div>

                  <Button
                    onClick={() => handleRedeem(item.id)}
                    disabled={!canAfford || isRedeeming}
                    className={`${canAfford
                        ? "bg-green-500 hover:bg-green-600 text-black"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {isRedeeming ? "Processing..." : canAfford ? "Redeem" : "Insufficient Coins"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions yet. Complete lessons to earn coins!</div>
          ) : (
            <div className="divide-y divide-white/10">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                  <div className="flex-1">
                    <p className="text-white font-medium">{tx.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-bold ${tx.type === "EARN" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {tx.type === "EARN" ? "+" : "-"}
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
