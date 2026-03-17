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
    <div className="min-h-screen bg-black flex transition-colors duration-500 font-sans text-[#f5f5f5]">
      <Sidebar />
      <Loader show={loading} />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header - Huge Brutalist Typography */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 uppercase">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-[#fff]">FNCLY<br/>OVERVIEW</h1>
            <p className="text-[#888] font-bold mt-2 tracking-widest text-xs flex gap-4">
              <span>[{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}]</span>
              <span>[ {session?.user?.name || "User"} ]</span>
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#222] hover:bg-[#333] text-[#f5f5f5] px-6 py-3 rounded-full transition-all font-bold tracking-widest text-xs uppercase"
          >
            New Record
          </button>
        </header>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          
          {/* Main Balance Box - Spans 2 cols */}
          <div className="md:col-span-2 bg-[#f5f5f5] text-black p-8 rounded-[2rem] flex flex-col justify-between min-h-[200px]">
            <span className="text-xs font-black uppercase tracking-widest opacity-50">Current Balance</span>
            <div>
              <p className="text-6xl font-black tracking-tighter">{formatCurrency(stats.balance)}</p>
              <p className="text-sm font-bold opacity-50 uppercase mt-2">Available Funds</p>
            </div>
          </div>

          {/* Income Box */}
          <div className="bg-[#1a1a1a] p-8 rounded-[2rem] flex flex-col justify-between border border-[#333] min-h-[200px]">
            <span className="text-[#888] text-xs font-black uppercase tracking-widest">Total Income</span>
            <div>
              <p className="text-3xl font-black text-[#f5f5f5]">+{formatCurrency(stats.income)}</p>
            </div>
          </div>

          {/* Expenses Box */}
          <div className="bg-[#1a1a1a] p-8 rounded-[2rem] flex flex-col justify-between border border-[#333] min-h-[200px]">
            <span className="text-[#888] text-xs font-black uppercase tracking-widest">Total Expenses</span>
            <div>
              <p className="text-3xl font-black text-[#f5f5f5]">{formatCurrency(stats.expense)}</p>
            </div>
          </div>
        </section>

        {/* Chart Flow */}
        <section className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-[#f5f5f5] tracking-widest uppercase">Cash Flow Analysis</h3>
            <span className="text-[#666] text-[10px] font-black tracking-widest">[ Last 6 Months ]</span>
          </div>
          <div className="h-[300px] w-full">
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
