"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { ChartTooltip } from "@/components/ChartTooltip";

export default function StatsPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0, monthly: [], by_category: [] });
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (status === "unauthenticated") {
            redirect("/login");
        }
        if (status === "authenticated") {
            fetchStats();
        }
    }, [status]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard/stats");
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <Loader show={true} />;
    }

    const savingsRatio = stats.income > 0 ? Math.round(((stats.income - stats.expense) / stats.income) * 100) : 0;
    const clampedRatio = Math.max(0, Math.min(100, savingsRatio));

    return (
        <div className="min-h-screen bg-black flex font-sans text-[#f5f5f5]">
            <Sidebar />
            <Loader show={loading} />

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 uppercase">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">ANALYSES</h1>
                        <p className="text-[#888] font-bold mt-2 tracking-widest text-xs flex gap-4 uppercase">
                            <span>Diagnostic & Métriques</span>
                        </p>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Detailed Evolution */}
                    <div className="md:col-span-2 bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-[#f5f5f5] tracking-widest uppercase">Tendance Revenus vs Dépenses</h3>
                            <span className="text-[#666] text-[10px] font-black tracking-widest">[ 6 MOIS ]</span>
                        </div>
                        <div className="h-[400px] w-full">
                            {mounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.monthly} barGap={2}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.5} />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} 
                                        />
                                        <YAxis hide />
                                        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#222' }} />
                                        <Bar dataKey="income" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expense" fill="#444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Savings Ratio */}
                    <div className="bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] flex flex-col items-center justify-center text-center col-span-1 md:col-span-1 min-h-[300px]">
                        <h3 className="text-sm font-black text-[#888] tracking-widest uppercase mb-6">Taux d'Épargne</h3>
                        <div className="text-7xl font-black text-[#f5f5f5] mb-8 tracking-tighter">
                            {savingsRatio}%
                        </div>
                        <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-[#f5f5f5] h-full transition-all duration-1000"
                                style={{ width: `${clampedRatio}%` }}
                            ></div>
                        </div>
                        <p className="text-[#666] text-[10px] font-black uppercase tracking-widest mt-6">Part des revenus épargnée</p>
                    </div>

                    {/* Breakdown Pie Chart */}
                    <div className="bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] flex flex-col items-center justify-center text-center col-span-1 md:col-span-1 min-h-[300px]">
                        <h3 className="text-sm font-black text-[#888] tracking-widest uppercase mb-6">Distribution des Flux</h3>
                        <div className="w-48 h-48 rounded-full flex items-center justify-center">
                            {mounted && (
                                <PieChart width={192} height={192}>
                                    <Pie
                                        data={[
                                            { name: 'Solde', value: stats.balance > 0 ? stats.balance : 0 }, 
                                            { name: 'Dépenses', value: stats.expense }
                                        ]}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell fill="#f5f5f5" />
                                        <Cell fill="#333" />
                                    </Pie>
                                </PieChart>
                            )}
                        </div>
                        <p className="text-[#666] text-[10px] font-black uppercase tracking-widest mt-6">Solde vs Dépenses</p>
                    </div>
                </section>
            </main>
        </div>
    );
}
