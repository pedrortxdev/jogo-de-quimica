"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GameInterface from "../components/GameInterface";
import Leaderboard from "../components/Leaderboard";
import { Beaker } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null); // { id, username, score }
  const [view, setView] = useState<"login" | "game" | "leaderboard">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    try {
      const res = await fetch("http://82.29.59.179:8030/api/register", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setUser(data);
      setView("game");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-lab-accent blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-lab-danger blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
      </div>

      <div className="z-20 w-full max-w-4xl">
        <header className="flex justify-between items-center mb-10 border-b border-lab-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <Beaker className="text-lab-accent w-8 h-8" />
            <h1 className="text-2xl font-bold font-mono tracking-tighter text-white">
              MENTE QUÍMICA <span className="text-lab-accent text-xs block font-normal tracking-widest">O PROTOCOLO DE SOLUÇÃO</span>
            </h1>
          </div>
          {user && (
            <div className="flex gap-4 font-mono text-sm">
               <span className="text-lab-muted">OPERADOR: <span className="text-white">{user.username}</span></span>
               <span className="text-lab-muted">PONTUAÇÃO: <span className="text-lab-success">{user.score}</span></span>
            </div>
          )}
        </header>

        {view === "login" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto bg-lab-panel border border-lab-muted/20 p-8 rounded-lg shadow-2xl backdrop-blur-sm"
          >
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-lab-accent uppercase">Identificar Protocolo</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="DIGITE SEU NOME"
                  className="w-full bg-black/50 border border-lab-muted/40 p-3 rounded text-white focus:outline-none focus:border-lab-accent font-mono placeholder:text-gray-700"
                />
              </div>
              <button 
                type="submit"
                className="bg-lab-accent/10 border border-lab-accent text-lab-accent py-3 px-6 rounded font-mono hover:bg-lab-accent hover:text-black transition-all uppercase tracking-widest font-bold"
              >
                INICIALIZAR
              </button>
            </form>
          </motion.div>
        )}

        {view === "game" && user && (
          <GameInterface user={user} setUser={setUser} />
        )}

        <div className="mt-12">
            <Leaderboard />
        </div>
      </div>
    </main>
  );
}
