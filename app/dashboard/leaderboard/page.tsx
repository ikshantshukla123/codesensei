import { auth } from "@clerk/nextjs/server";
import { getLeaderboard } from "@/lib/wallet/actions";
import Link from "next/link";
import { ArrowLeft, Trophy, Flame, Coins, TrendingUp, Crown } from "lucide-react";

export default async function LeaderboardPage() {
  const { userId } = await auth();
  const leaderboardData = await getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-500/10 rounded-2xl">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
              <p className="text-gray-400 mt-1">Top security masters ranked by career capital</p>
            </div>
          </div>
        </div>

        {/* Current User Rank (if available) */}
        {leaderboardData.currentUser && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full border-2 border-green-500/50">
                  <span className="text-2xl font-bold text-green-500">#{leaderboardData.currentUser.rank}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Your Rank</p>
                  <h3 className="text-xl font-bold text-white">{leaderboardData.currentUser.user?.name || "You"}</h3>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Total Earned</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">{leaderboardData.currentUser.totalEarned}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-white">{leaderboardData.currentUser.streakCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Leaderboard */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              Top 10 Security Masters
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {leaderboardData.topUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>No users on the leaderboard yet. Be the first!</p>
              </div>
            ) : (
              leaderboardData.topUsers.map((entry) => {
                const isTopThree = entry.rank <= 3;
                const medalColors = {
                  1: "text-yellow-500",
                  2: "text-gray-400",
                  3: "text-orange-600",
                };

                return (
                  <div
                    key={entry.user.id}
                    className={`p-6 flex items-center justify-between hover:bg-white/5 transition ${isTopThree ? "bg-white/[0.02]" : ""
                      }`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank Badge */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${isTopThree
                            ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50"
                            : "bg-white/5 border border-white/10"
                          }`}
                      >
                        {isTopThree && entry.rank === 1 ? (
                          <Crown className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <span className={`text-xl font-bold ${isTopThree ? medalColors[entry.rank as 1 | 2 | 3] : "text-gray-500"}`}>
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <h3 className="text-lg font-bold text-white">{entry.user.name || `User #${entry.user.id.slice(0, 8)}`}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Rank #{entry.rank}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Total Earned</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-xl font-bold text-white">{entry.totalEarned}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-xl font-bold text-white">{entry.streakCount}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Current Balance</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-4 h-4 text-green-500" />
                          <span className="text-xl font-bold text-white">{entry.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
