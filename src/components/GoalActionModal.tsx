"use client";

import { useState } from "react";
import axios from "axios";
import { X, Loader2, Trash2, PlusCircle, AlertCircle } from "lucide-react";

interface GoalActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    goal: any;
}

export default function GoalActionModal({ isOpen, onClose, onSuccess, goal }: GoalActionModalProps) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [view, setView] = useState<"actions" | "add" | "delete">("actions");

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch(`/api/goals/${goal._id}`, { amount: parseFloat(amount) });
            onSuccess();
            onClose();
            setAmount("");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/api/goals/${goal._id}`);
            onSuccess();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !goal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] text-[#f5f5f5] w-full max-w-sm rounded-[2rem] border border-[#333] overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-[#333] flex justify-between items-center bg-[#111]">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white truncate max-w-[200px]">{goal.name}</h2>
                        <p className="text-[#888] text-[9px] font-black tracking-widest mt-1 uppercase">Gérer mon objectif</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[#222] rounded-full transition-all text-[#888] hover:text-[#f5f5f5]">
                        <X className="w-4 h-4" />
                    </button>
                </header>

                <div className="p-8 space-y-6">
                    {view === "actions" && (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setView("add")}
                                className="w-full flex items-center justify-between p-5 bg-[#222] hover:bg-[#333] border border-[#333] rounded-2xl group transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#f5f5f5] rounded-full text-black"><PlusCircle className="w-4 h-4" /></div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-[#f5f5f5]">Contribuer</p>
                                        <p className="text-[10px] font-bold text-[#666] uppercase mt-1">Ajouter de l'argent</p>
                                    </div>
                                </div>
                            </button>
                            <button 
                                onClick={() => setView("delete")}
                                className="w-full flex items-center justify-between p-5 bg-black/50 hover:bg-rose-900/10 border border-transparent hover:border-rose-900/40 rounded-2xl group transition-all"
                            >
                                <div className="flex items-center gap-4 text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="p-3 bg-rose-500/10 rounded-full"><Trash2 className="w-4 h-4" /></div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest">Retirer l'objectif</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Supprimer définitivement</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {view === "add" && (
                        <form onSubmit={handleAddFunds} className="space-y-6 animate-in slide-in-from-right duration-300">
                           <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Montant à ajouter (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    autoFocus
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-[#111] border border-[#333] p-6 rounded-2xl outline-none font-black text-2xl text-[#f5f5f5] focus:border-[#666] transition-colors"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setView("actions")} className="flex-1 py-4 border border-[#333] rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-[#888] hover:bg-[#222]">Retour</button>
                                <button type="submit" disabled={loading || !amount} className="flex-2 bg-[#f5f5f5] text-black w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer"}
                                </button>
                            </div>
                        </form>
                    )}

                    {view === "delete" && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-5 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/30">
                                    <AlertCircle className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter">Supprimer ?</h3>
                                    <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mt-2 max-w-[200px]">Cette action est irréversible et supprimera le suivi de ce projet.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setView("actions")} className="flex-1 py-4 border border-[#333] rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-[#888] hover:bg-[#222]">Annuler</button>
                                <button onClick={handleDelete} disabled={loading} className="flex-1 bg-rose-600 text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
