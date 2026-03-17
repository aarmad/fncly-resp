"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] text-[#f5f5f5] w-full max-w-lg rounded-[2rem] border border-[#333] overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-[#333] flex justify-between items-center bg-[#111]">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">New Record</h2>
                        <p className="text-[#888] text-xs font-bold tracking-widest mt-1 uppercase">Log a new operation</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[#222] rounded-full transition-all">
                        <X className="w-5 h-5 text-[#888] hover:text-[#f5f5f5]" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex bg-[#111] p-2 rounded-2xl gap-2 border border-[#333]">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "expense" })}
                            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === "expense"
                                    ? "bg-[#f5f5f5] text-black"
                                    : "text-[#888] hover:text-[#f5f5f5]"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "income" })}
                            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === "income"
                                    ? "bg-[#f5f5f5] text-black"
                                    : "text-[#888] hover:text-[#f5f5f5]"
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Amount (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-black text-lg text-[#f5f5f5] focus:border-[#666] transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-sm text-[#f5f5f5] focus:border-[#666] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Category</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-sm text-[#f5f5f5] focus:border-[#666] transition-colors"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Note (Optional)</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="e.g. Salary, Groceries..."
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-medium text-sm text-[#f5f5f5] h-24 resize-none focus:border-[#666] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f5f5f5] text-black hover:bg-[#ccc] disabled:opacity-50 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Record"}
                    </button>
                </form>
            </div>
        </div>
    );
}
