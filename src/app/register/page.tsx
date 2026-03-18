"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/api/register", {
                name,
                email,
                password,
            });

            if (res.status === 201) {
                router.replace("/login");
            }
        } catch (error: any) {
            setError(error.response?.data?.message || "Une erreur est survenue lors de l&apos;inscription.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 transition-colors font-sans text-[#f5f5f5]">
            <div className="w-full max-w-lg bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl mx-auto flex items-center justify-center text-black font-black text-3xl mb-6">F.</div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-[#f5f5f5]">Accès Système</h2>
                    <p className="text-[#888] font-bold text-xs uppercase tracking-widest mt-2">Demande d&apos;autorisation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-[#111] border border-rose-900 text-rose-500 p-4 rounded-2xl text-[10px] uppercase font-black tracking-widest animate-in slide-in-from-top duration-300">
                            [ERROR] {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Nom de l&apos;opérateur</label>
                        <input
                            type="text"
                            placeholder="JOHN DOE"
                            className="w-full bg-[#111] border border-[#333] focus:border-[#666] p-4 rounded-2xl outline-none transition-colors text-white font-bold text-sm uppercase"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Adresse Email</label>
                        <input
                            type="email"
                            placeholder="USER@FNCLY.NET"
                            className="w-full bg-[#111] border border-[#333] focus:border-[#666] p-4 rounded-2xl outline-none transition-colors text-white font-bold text-sm uppercase"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Mot de passe initial</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#111] border border-[#333] focus:border-[#666] p-4 rounded-2xl outline-none transition-colors text-white font-bold text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f5f5f5] text-black hover:bg-[#ccc] disabled:opacity-50 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Demander l&apos;accès"}
                    </button>
                </form>

                <p className="text-center mt-10 text-[#666] text-xs font-black uppercase tracking-widest">
                    Déjà Opérateur ?{" "}
                    <Link href="/login" className="text-[#f5f5f5] hover:underline underline-offset-4 decoration-2">
                        Vérifiez votre identité
                    </Link>
                </p>
            </div>
        </div>
    );
}
