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
import {
    TrendingUp,
    Activity
} from "lucide-react";
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

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

    if (status === "loading") {
        return <Loader show={true} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-500">
            <Sidebar />
            <Loader show={loading} />

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Analyses Financières</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Visualisez vos habitudes et optimisez vos finances</p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Detailed Evolution */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            Tendance des Revenus vs Dépenses
                        </h3>
                        <div className="h-[400px] w-full">
                            {mounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.monthly}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                                        <Bar dataKey="income" fill="#10B981" radius={[10, 10, 0, 0]} />
                                        <Bar dataKey="expense" fill="#F43F5E" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Savings Ratio */}
                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                        <Activity className="w-10 h-10 text-emerald-500 mb-6" />
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Taux d'Épargne</h3>
                        <p className="text-slate-500 font-bold mb-6 italic">Part de vos revenus mise de côté ce mois-ci</p>
                        <div className="text-6xl font-black text-emerald-600 mb-4 tracking-tighter">
                            {stats.income > 0 ? Math.round(((stats.income - stats.expense) / stats.income) * 100) : 0}%
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 h-4 rounded-full overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full transition-all duration-1000"
                                style={{ width: `${stats.income > 0 ? Math.max(0, Math.min(100, Math.round(((stats.income - stats.expense) / stats.income) * 100))) : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Breakdown Pie Chart */}
                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                        <div className="w-48 h-48 rounded-full flex items-center justify-center">
                            {mounted && (
                                <PieChart width={192} height={192}>
                                    <Pie
                                        data={[{ name: 'Solde', value: stats.balance > 0 ? stats.balance : 0 }, { name: 'Dépenses', value: stats.expense }]}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell key={`cell-0`} fill="#6366f1" />
                                        <Cell key={`cell-1`} fill="#F43F5E" />
                                    </Pie>
                                </PieChart>
                            )}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mt-8 mb-2">Répartition des Flux</h3>
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Ratio Solde / Dépenses</p>
                    </div>
                </section>
            </main>
        </div>
    );
}
