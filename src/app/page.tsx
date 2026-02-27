"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TransactionModal from "@/components/TransactionModal";
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
  ResponsiveContainer
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus
} from "lucide-react";
import { ChartTooltip } from "@/components/ChartTooltip";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0, monthly: [], by_category: [] });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-500">
      <Sidebar />
      <Loader show={loading} />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Vue d'ensemble</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Tableau de bord financier</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Transaction
            </button>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Balance */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">Solde Total</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg"><Wallet className="w-5 h-5 text-indigo-600" /></div>
            </div>
            <p className="text-4xl font-black text-slate-800 dark:text-white">{formatCurrency(stats.balance)}</p>
          </div>

          {/* Income */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Revenus</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg"><ArrowUpRight className="w-5 h-5 text-emerald-600" /></div>
            </div>
            <p className="text-4xl font-black text-emerald-600">+{formatCurrency(stats.income)}</p>
          </div>

          {/* Expenses */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full">Dépenses</span>
              <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg"><ArrowDownRight className="w-5 h-5 text-rose-600" /></div>
            </div>
            <p className="text-4xl font-black text-rose-600">-{formatCurrency(stats.expense)}</p>
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 min-h-[400px]">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
            Évolution des Flux
          </h3>
          <div className="h-[350px] w-full">
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
        </section>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchStats}
        />
      </main>
    </div>
  );
}
