"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import CrapsGame from "~/components/CrapsGame";
import CrapsLeaderboard from "~/components/CrapsLeaderboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 min-h-screen">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Street Craps
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Roll the dice, place your bets, win ETH
          </p>
          
          <div className="flex justify-center space-x-2 mb-8">
            <Button
              variant={activeTab === "game" ? "default" : "outline"}
              onClick={() => setActiveTab("game")}
            >
              Play Game
            </Button>
            <Button
              variant={activeTab === "leaderboard" ? "default" : "outline"}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </Button>
          </div>
        </div>

        {activeTab === "game" ? <CrapsGame /> : <CrapsLeaderboard />}
      </div>
    </div>
  );
}
