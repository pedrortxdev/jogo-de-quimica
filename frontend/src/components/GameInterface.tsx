"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Zap, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  type: string;
  text: string;
  units: string;
  points: number;
}

export default function GameInterface({ user, setUser }: { user: any, setUser: any }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{msg: string, correct: boolean, realVal?: string} | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setInputVal("");
    try {
      const res = await fetch("http://82.29.59.179:8030/api/question");
      const data = await res.json();
      setQuestion(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !inputVal) return;

    const val = parseFloat(inputVal);
    if (isNaN(val)) return;

    try {
      const res = await fetch("http://82.29.59.179:8030/api/submit", {
        method: "POST",
        body: JSON.stringify({
          player_id: user.id,
          question_id: question.id,
          value: val
        })
      });
      const data = await res.json();
      
      setFeedback({
        msg: data.message,
        correct: data.correct,
        realVal: data.real_value
      });

      setUser((prev: any) => ({ ...prev, score: data.new_score }));

      // Auto next after delay if correct
      if (data.correct) {
         setTimeout(fetchQuestion, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!question) return <div className="text-center font-mono animate-pulse">GERANDO PROBLEMA...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        layoutId="game-panel"
        className="md:col-span-2 bg-lab-panel border border-lab-muted/20 p-6 rounded-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <Zap className="w-24 h-24" />
        </div>
        
        <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-mono text-lab-accent border border-lab-accent/30 px-2 py-1 rounded">
                TIPO: {question.type.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-lab-success">RECOMPENSA: {question.points} PTS</span>
        </div>

        <h2 className="text-xl md:text-2xl font-light leading-relaxed mb-8">
            {question.text}
        </h2>

        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
                <label className="block text-xs font-mono text-lab-muted mb-2 uppercase">Valor Calculado ({question.units})</label>
                <div className="relative">
                    <input 
                        type="number" 
                        step="0.01"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="w-full bg-black/40 border-b-2 border-lab-muted/50 py-3 text-xl font-mono focus:outline-none focus:border-lab-accent transition-colors"
                        placeholder="0.00"
                        autoFocus
                    />
                    <span className="absolute right-2 bottom-3 text-lab-muted font-mono">{question.units}</span>
                </div>
            </div>
            <button 
                disabled={!!feedback}
                className="bg-white text-black px-6 py-3 rounded font-bold font-mono hover:bg-lab-accent transition-colors disabled:opacity-50"
            >
                {loading ? "..." : <ArrowRight />}
            </button>
        </form>

        {feedback && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded border ${feedback.correct ? 'border-lab-success/50 bg-lab-success/10 text-lab-success' : 'border-lab-danger/50 bg-lab-danger/10 text-lab-danger'} font-mono flex items-center gap-3`}
            >
                {feedback.correct ? <CheckCircle2 /> : <XCircle />}
                <div>
                    <p className="font-bold">{feedback.msg}</p>
                    {!feedback.correct && <p className="text-xs opacity-70 mt-1">Esperado: {parseFloat(feedback.realVal!).toFixed(2)}</p>}
                    {!feedback.correct && (
                        <button onClick={fetchQuestion} className="mt-2 text-xs underline">PRÓXIMO PROBLEMA</button>
                    )}
                </div>
            </motion.div>
        )}
      </motion.div>

      <div className="space-y-4">
        <div className="bg-lab-panel border border-lab-muted/20 p-4 rounded-lg">
            <h3 className="text-xs font-mono text-lab-muted mb-4 uppercase tracking-widest">Ferramentas</h3>
            <div className="space-y-2">
                <button className="w-full text-left p-3 text-sm font-mono border border-lab-muted/30 rounded hover:border-lab-accent/50 transition-colors opacity-50 cursor-not-allowed" title="Indisponível no protótipo">
                    🧪 Catalisador (Dica)
                </button>
                <button className="w-full text-left p-3 text-sm font-mono border border-lab-muted/30 rounded hover:border-lab-accent/50 transition-colors opacity-50 cursor-not-allowed">
                    ⚖️ Reagente Puro (2x Pts)
                </button>
            </div>
        </div>
        
        <div className="bg-lab-panel border border-lab-muted/20 p-4 rounded-lg">
            <h3 className="text-xs font-mono text-lab-muted mb-2 uppercase tracking-widest">Status do Protocolo</h3>
             <div className="flex justify-between text-sm font-mono">
                <span>ESTABILIDADE</span>
                <span className="text-lab-success">100%</span>
             </div>
             <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-lab-success w-full h-full"></div>
             </div>
        </div>
      </div>
    </div>
  );
}
