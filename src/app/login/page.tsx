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
                setError("Invalid credentials.");
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
        <div className="min-h-screen bg-black flex items-center justify-center p-6 transition-colors font-sans text-[#f5f5f5]">
            <div className="w-full max-w-lg bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl mx-auto flex items-center justify-center text-black font-black text-3xl mb-6">F.</div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-[#f5f5f5]">System Login</h2>
                    <p className="text-[#888] font-bold text-xs uppercase tracking-widest mt-2">Identify to proceed</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-[#111] border border-rose-900 text-rose-500 p-4 rounded-2xl text-[10px] uppercase font-black tracking-widest animate-in slide-in-from-top duration-300">
                            [ERROR] {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="USER@FNCLY.NET"
                            className="w-full bg-[#111] border border-[#333] focus:border-[#666] p-4 rounded-2xl outline-none transition-colors text-white font-bold text-sm uppercase"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Passcode</label>
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
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authenticate"}
                    </button>
                </form>

                <p className="text-center mt-10 text-[#666] text-xs font-black uppercase tracking-widest">
                    No clearance?{" "}
                    <Link href="/register" className="text-[#f5f5f5] hover:underline underline-offset-4 decoration-2">
                        Request Access
                    </Link>
                </p>
            </div>
        </div>
    );
}
