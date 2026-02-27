"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Loader2 } from "lucide-react";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TransactionModal({ isOpen, onClose, onSuccess }: TransactionModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        note: ""
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories");
            setCategories(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/transactions", {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onSuccess();
            onClose();
            setFormData({
                amount: "",
                type: "expense",
                categoryId: "",
                date: new Date().toISOString().split('T')[0],
                note: ""
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Nouvelle Transaction</h2>
                        <p className="text-slate-500 text-sm font-medium">Enregistrez une nouvelle opération</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "expense" })}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${formData.type === "expense"
                                    ? "bg-white dark:bg-slate-800 text-rose-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            Dépense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "income" })}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${formData.type === "income"
                                    ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            Revenu
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Montant (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none p-4 rounded-2xl outline-none font-black text-lg dark:text-white focus:ring-2 ring-indigo-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none p-4 rounded-2xl outline-none font-bold text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Catégorie</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none p-4 rounded-2xl outline-none font-bold text-sm dark:text-white"
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Note (optionnel)</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="Ex: McDonald's, Salaire..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none p-4 rounded-2xl outline-none font-medium text-sm dark:text-white h-24 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 ${formData.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enregistrer"}
                    </button>
                </form>
            </div>
        </div>
    );
}
