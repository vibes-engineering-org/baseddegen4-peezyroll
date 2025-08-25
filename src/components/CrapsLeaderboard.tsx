"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PlayerStats } from "./CrapsGame";

type SortBy = "winRate" | "totalWon" | "gamesPlayed" | "netEth";

export default function CrapsLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("netEth");

  useEffect(() => {
    const loadLeaderboard = () => {
      const saved = localStorage.getItem("craps-leaderboard");
      if (saved) {
        const data: PlayerStats[] = JSON.parse(saved);
        // Filter out players with no games played
        const validPlayers = data.filter(player => player.stats.gamesPlayed > 0);
        setLeaderboard(validPlayers);
      }
    };

    loadLeaderboard();
    
    // Listen for storage changes to update leaderboard in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "craps-leaderboard") {
        loadLeaderboard();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getSortedLeaderboard = () => {
    return [...leaderboard].sort((a, b) => {
      switch (sortBy) {
        case "winRate":
          const winRateA = a.stats.gamesPlayed > 0 ? a.stats.gamesWon / a.stats.gamesPlayed : 0;
          const winRateB = b.stats.gamesPlayed > 0 ? b.stats.gamesWon / b.stats.gamesPlayed : 0;
          return winRateB - winRateA;
        case "totalWon":
          return b.stats.totalEthWon - a.stats.totalEthWon;
        case "gamesPlayed":
          return b.stats.gamesPlayed - a.stats.gamesPlayed;
        case "netEth":
          const netA = a.stats.totalEthWon - a.stats.totalEthLost;
          const netB = b.stats.totalEthWon - b.stats.totalEthLost;
          return netB - netA;
        default:
          return 0;
      }
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatWinRate = (player: PlayerStats) => {
    if (player.stats.gamesPlayed === 0) return "0.0%";
    return `${(player.stats.gamesWon / player.stats.gamesPlayed * 100).toFixed(1)}%`;
  };

  const formatNetEth = (player: PlayerStats) => {
    const net = player.stats.totalEthWon - player.stats.totalEthLost;
    return `${net >= 0 ? '+' : ''}${net.toFixed(4)} ETH`;
  };

  const sortedLeaderboard = getSortedLeaderboard();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === "netEth" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("netEth")}
          >
            Net ETH
          </Button>
          <Button
            variant={sortBy === "winRate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("winRate")}
          >
            Win Rate
          </Button>
          <Button
            variant={sortBy === "totalWon" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("totalWon")}
          >
            Total Won
          </Button>
          <Button
            variant={sortBy === "gamesPlayed" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("gamesPlayed")}
          >
            Games Played
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedLeaderboard.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No players yet. Be the first to play!
          </p>
        ) : (
          <div className="space-y-3">
            {sortedLeaderboard.slice(0, 10).map((player, index) => {
              const isPositive = player.stats.totalEthWon - player.stats.totalEthLost >= 0;
              return (
                <div
                  key={player.address}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{formatAddress(player.address)}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.stats.gamesWon}W - {player.stats.gamesLost}L
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-right text-sm">
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{formatWinRate(player)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Net ETH</p>
                      <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {formatNetEth(player)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Games</p>
                      <p className="font-semibold">{player.stats.gamesPlayed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Won</p>
                      <p className="font-semibold text-green-600">
                        {player.stats.totalEthWon.toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {sortedLeaderboard.length > 10 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing top 10 players
          </p>
        )}
      </CardContent>
    </Card>
  );
}