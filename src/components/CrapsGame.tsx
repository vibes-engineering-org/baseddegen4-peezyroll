"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAccount, useBalance } from "wagmi";

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalEthWon: number;
  totalEthLost: number;
}

export interface PlayerStats {
  address: string;
  stats: GameStats;
}

type GamePhase = "come-out" | "point" | "finished";
type GameResult = "win" | "lose" | null;

export default function CrapsGame() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("come-out");
  const [point, setPoint] = useState<number | null>(null);
  const [dice1, setDice1] = useState<number>(1);
  const [dice2, setDice2] = useState<number>(1);
  const [total, setTotal] = useState<number>(2);
  const [betAmount, setBetAmount] = useState<string>("0.01");
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  
  // Load player stats from localStorage
  const [playerStats, setPlayerStats] = useState<GameStats>(() => {
    if (typeof window === "undefined") return {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalEthWon: 0,
      totalEthLost: 0,
    };
    
    const saved = localStorage.getItem(`craps-stats-${address}`);
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalEthWon: 0,
      totalEthLost: 0,
    };
  });

  // Save stats to localStorage
  useEffect(() => {
    if (address) {
      localStorage.setItem(`craps-stats-${address}`, JSON.stringify(playerStats));
      
      // Also save to global leaderboard
      const leaderboard: PlayerStats[] = JSON.parse(localStorage.getItem("craps-leaderboard") || "[]");
      const existingIndex = leaderboard.findIndex(p => p.address === address);
      
      if (existingIndex >= 0) {
        leaderboard[existingIndex].stats = playerStats;
      } else {
        leaderboard.push({ address, stats: playerStats });
      }
      
      localStorage.setItem("craps-leaderboard", JSON.stringify(leaderboard));
    }
  }, [playerStats, address]);

  const rollDice = useCallback(() => {
    const newDice1 = Math.floor(Math.random() * 6) + 1;
    const newDice2 = Math.floor(Math.random() * 6) + 1;
    const newTotal = newDice1 + newDice2;
    
    setDice1(newDice1);
    setDice2(newDice2);
    setTotal(newTotal);
    
    return { dice1: newDice1, dice2: newDice2, total: newTotal };
  }, []);

  const updateStats = useCallback((won: boolean, amount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
      gamesLost: won ? prev.gamesLost : prev.gamesLost + 1,
      totalEthWon: won ? prev.totalEthWon + amount : prev.totalEthWon,
      totalEthLost: won ? prev.totalEthLost : prev.totalEthLost + amount,
    }));
  }, []);

  const handleRoll = useCallback(async () => {
    if (isRolling) return;
    
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }

    const ethBalance = parseFloat(balance?.formatted || "0");
    if (bet > ethBalance) {
      alert("Insufficient ETH balance");
      return;
    }

    setIsRolling(true);
    setGameResult(null);

    // Animate dice roll
    const rollInterval = setInterval(() => {
      rollDice();
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalRoll = rollDice();
      const { total: rollTotal } = finalRoll;

      let newHistory = [...gameHistory];
      let won = false;

      if (gamePhase === "come-out") {
        if (rollTotal === 7 || rollTotal === 11) {
          // Pass - Win
          won = true;
          setGameResult("win");
          setGamePhase("finished");
          newHistory.push(`Come-out roll: ${rollTotal} - Pass! You win!`);
        } else if (rollTotal === 2 || rollTotal === 3 || rollTotal === 12) {
          // Crap out - Lose
          won = false;
          setGameResult("lose");
          setGamePhase("finished");
          newHistory.push(`Come-out roll: ${rollTotal} - Crap out! You lose!`);
        } else {
          // Point established
          setPoint(rollTotal);
          setGamePhase("point");
          newHistory.push(`Come-out roll: ${rollTotal} - Point established!`);
        }
      } else if (gamePhase === "point" && point) {
        if (rollTotal === point) {
          // Hit the point - Win
          won = true;
          setGameResult("win");
          setGamePhase("finished");
          newHistory.push(`Roll: ${rollTotal} - Hit the point! You win!`);
        } else if (rollTotal === 7) {
          // Seven out - Lose
          won = false;
          setGameResult("lose");
          setGamePhase("finished");
          newHistory.push(`Roll: ${rollTotal} - Seven out! You lose!`);
        } else {
          // Continue rolling
          newHistory.push(`Roll: ${rollTotal} - Keep rolling...`);
        }
      }

      setGameHistory(newHistory);

      if (gameResult !== null || won !== undefined) {
        updateStats(won, bet);
      }

      setIsRolling(false);
    }, 1000);
  }, [isRolling, betAmount, balance, gamePhase, point, gameHistory, rollDice, gameResult, updateStats]);

  const startNewGame = useCallback(() => {
    setGamePhase("come-out");
    setPoint(null);
    setGameResult(null);
    setGameHistory([]);
    setDice1(1);
    setDice2(1);
    setTotal(2);
  }, []);

  const getGamePhaseText = () => {
    switch (gamePhase) {
      case "come-out":
        return "Come-out roll - Roll for 7 or 11 to win, avoid 2, 3, or 12";
      case "point":
        return `Point is ${point} - Roll ${point} again to win, avoid 7`;
      case "finished":
        return gameResult === "win" ? "You won!" : "You lost!";
      default:
        return "";
    }
  };

  const winRate = playerStats.gamesPlayed > 0 ? 
    (playerStats.gamesWon / playerStats.gamesPlayed * 100).toFixed(1) : "0.0";
  const netEth = playerStats.totalEthWon - playerStats.totalEthLost;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Street Craps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Status */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{getGamePhaseText()}</p>
            {point && (
              <p className="text-lg font-semibold">Point: {point}</p>
            )}
          </div>

          {/* Dice Display */}
          <div className="flex justify-center space-x-4">
            <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold shadow-md">
              {dice1}
            </div>
            <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold shadow-md">
              {dice2}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold">Total: {total}</p>
          </div>

          {/* Betting */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="bet" className="text-sm font-medium">
                Bet Amount (ETH):
              </label>
              <Input
                id="bet"
                type="number"
                step="0.001"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="flex-1"
                disabled={isRolling}
              />
            </div>
            
            {balance && (
              <p className="text-sm text-muted-foreground">
                Balance: {parseFloat(balance.formatted).toFixed(4)} ETH
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {gamePhase === "finished" ? (
              <Button onClick={startNewGame} className="flex-1">
                New Game
              </Button>
            ) : (
              <Button 
                onClick={handleRoll} 
                disabled={isRolling || !address}
                className="flex-1"
              >
                {isRolling ? "Rolling..." : "Roll Dice"}
              </Button>
            )}
          </div>

          {!address && (
            <p className="text-sm text-red-500 text-center">
              Please connect your wallet to play
            </p>
          )}
        </CardContent>
      </Card>

      {/* Player Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Games Played</p>
              <p className="font-semibold">{playerStats.gamesPlayed}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Win Rate</p>
              <p className="font-semibold">{winRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Games Won</p>
              <p className="font-semibold text-green-600">{playerStats.gamesWon}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Games Lost</p>
              <p className="font-semibold text-red-600">{playerStats.gamesLost}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Net ETH</p>
              <p className={`font-semibold ${netEth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netEth >= 0 ? '+' : ''}{netEth.toFixed(4)} ETH
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Winnings</p>
              <p className="font-semibold text-green-600">
                {playerStats.totalEthWon.toFixed(4)} ETH
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game History */}
      {gameHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameHistory.slice(-5).map((entry, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {entry}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}