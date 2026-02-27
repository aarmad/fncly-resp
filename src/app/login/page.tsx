"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
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
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Identifiants incorrects.");
                setLoading(false);
                return;
            }

            router.replace("/");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-500">
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-600/30 mb-6">F.</div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">Ravi de vous revoir</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Connectez-vous à votre compte Fncly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top duration-300">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 p-4 rounded-2xl outline-none transition-all dark:text-white font-bold"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 p-4 rounded-2xl outline-none transition-all dark:text-white font-bold"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Se connecter"}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 dark:text-slate-400 font-bold">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 decoration-2">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}
