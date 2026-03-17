"use client";

import { useState } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function GoalModal({ isOpen, onClose, onSuccess }: GoalModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/goals", {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount),
                currentAmount: parseFloat(formData.currentAmount)
            });
            onSuccess();
            onClose();
            setFormData({
                name: "",
                targetAmount: "",
                currentAmount: "0",
                deadline: new Date().toISOString().split('T')[0]
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] text-[#f5f5f5] w-full max-w-lg rounded-[2rem] border border-[#333] overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-[#333] flex justify-between items-center bg-[#111]">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Nouveau Projet</h2>
                        <p className="text-[#888] text-xs font-bold tracking-widest mt-1 uppercase">Définir un objectif</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[#222] rounded-full transition-all">
                        <X className="w-5 h-5 text-[#888] hover:text-[#f5f5f5]" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Nom du Projet</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ex: Nouvel Ordinateur"
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-sm text-[#f5f5f5] focus:border-[#666] transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Cible (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-black text-lg text-[#f5f5f5] focus:border-[#666] transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Actuel (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.currentAmount}
                                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-black text-lg text-[#888] focus:border-[#666] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Date limite cible</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-sm text-[#f5f5f5] focus:border-[#666] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f5f5f5] text-black hover:bg-[#ccc] disabled:opacity-50 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enregistrer"}
                    </button>
                </form>
            </div>
        </div>
    );
}
