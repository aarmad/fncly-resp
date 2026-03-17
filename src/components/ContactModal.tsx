"use client";

import { useState } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ContactModal({ isOpen, onClose, onSuccess }: ContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        initials: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/contacts", formData);
            onSuccess();
            onClose();
            setFormData({ name: "", initials: "" });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] text-[#f5f5f5] w-full max-w-sm rounded-[2rem] border border-[#333] overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-[#333] flex justify-between items-center bg-[#111]">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">New Contact</h2>
                        <p className="text-[#888] text-xs font-bold tracking-widest mt-1 uppercase">Add a payee</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[#222] rounded-full transition-all">
                        <X className="w-5 h-5 text-[#888] hover:text-[#f5f5f5]" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Contact Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData({ 
                                    ...formData, 
                                    name: val, 
                                    initials: val.substring(0, 1).toUpperCase() 
                                })
                            }}
                            placeholder="e.g. Alice"
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-sm text-[#f5f5f5] focus:border-[#666] transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Initials (Icon)</label>
                        <input
                            type="text"
                            required
                            maxLength={2}
                            value={formData.initials}
                            onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                            placeholder="A"
                            className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-black text-xl text-[#f5f5f5] text-center focus:border-[#666] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f5f5f5] text-black hover:bg-[#ccc] disabled:opacity-50 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
}
