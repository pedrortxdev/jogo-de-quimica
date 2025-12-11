"use client";

import { useState, useEffect } from "react";

interface Player {
  id: string;
  username: string;
  highscore: number;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://82.29.59.179:8030/api/leaderboard");
        const data = await res.json();
        setPlayers(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-lab-panel/50 border border-lab-muted/10 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-sm font-mono text-lab-accent mb-4 uppercase tracking-widest border-b border-lab-muted/20 pb-2">
        Melhores Pesquisadores
      </h3>
      <div className="space-y-2">
        {players.length === 0 ? (
            <div className="text-lab-muted font-mono text-xs">NENHUM DADO DISPONÍVEL</div>
        ) : (
            players.map((p, i) => (
            <div key={p.id} className="flex justify-between items-center font-mono text-sm group">
                <div className="flex items-center gap-3">
                    <span className={`w-6 text-center ${i === 0 ? 'text-lab-accent font-bold' : 'text-lab-muted'}`}>
                        {i + 1}
                    </span>
                    <span className="group-hover:text-white transition-colors">{p.username}</span>
                </div>
                <span className="text-lab-muted group-hover:text-lab-success transition-colors">
                    {p.highscore} <span className="text-[10px]">PTS</span>
                </span>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
