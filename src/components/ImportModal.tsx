"use client";

import { useState } from "react";
import axios from "axios";
import { X, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError("");

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result;
            
            try {
                const response = await axios.post("/api/import", {
                    rawData: data,
                    fileName: file.name,
                    fileType: file.type
                });
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setSuccess(false);
                    setFile(null);
                }, 2000);
            } catch (err: any) {
                setError(err.response?.data?.message || "Erreur lors de l'importation");
            } finally {
                setLoading(false);
            }
        };

        if (file.type === "application/pdf") {
            reader.readAsDataURL(file); // Send as Base64 for simplicity in this bridge
        } else {
            reader.readAsText(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] text-[#f5f5f5] w-full max-w-lg rounded-[2rem] border border-[#333] overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-[#333] flex justify-between items-center bg-[#111]">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Importation Bancaire</h2>
                        <p className="text-[#888] text-xs font-bold tracking-widest mt-1 uppercase">Synchronisez vos relevés</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[#222] rounded-full transition-all">
                        <X className="w-5 h-5 text-[#888] hover:text-[#f5f5f5]" />
                    </button>
                </header>

                <div className="p-8 space-y-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            <p className="text-lg font-black uppercase tracking-tighter">Importation Réussie</p>
                            <p className="text-[#888] text-xs font-bold uppercase tracking-widest text-center">Vos transactions ont été ajoutées avec succès.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border-2 border-dashed border-[#333] rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 bg-[#111] hover:border-[#666] transition-colors cursor-pointer relative overflow-hidden group">
                                <input
                                    type="file"
                                    accept=".csv,.txt,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#888] group-hover:text-[#f5f5f5] transition-colors">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black uppercase tracking-widest text-[#f5f5f5]">
                                        {file ? file.name : "Cliquez ou glissez un fichier (CSV, PDF)"}
                                    </p>
                                    <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mt-1">Format supporté: CSV, TXT, PDF</p>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">{error}</p>
                                </div>
                            )}

                            <div className="bg-[#111] p-4 rounded-2xl border border-[#333]">
                                <h4 className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] mb-3">Format attendu:</h4>
                                <p className="text-[11px] font-bold text-[#666] leading-relaxed">
                                    Date (YYYY-MM-DD), Montant, Description <br/>
                                    Ex: 2024-03-18, -42.50, Supermarché
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !file}
                                className="w-full bg-[#f5f5f5] text-black hover:bg-[#ccc] disabled:opacity-50 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Lancer l'Importation"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
