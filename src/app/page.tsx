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
import { Bell, ArrowUpRight, TrendingUp, Globe, Plus, ChevronRight } from "lucide-react";

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

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full pb-20 overflow-y-auto">
        {/* Header - Huge Brutalist Typography */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 uppercase">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-[#fff]">FNCLY<br/>OVERVIEW</h1>
            <p className="text-[#888] font-bold mt-2 tracking-widest text-[10px] md:text-xs flex gap-4">
              <span>[{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}]</span>
              <span>[ {session?.user?.name || "User"} ]</span>
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#222] hover:bg-[#333] text-[#f5f5f5] px-6 py-3 rounded-full transition-all font-bold tracking-widest text-[10px] md:text-xs uppercase whitespace-nowrap"
          >
            New Record
          </button>
        </header>

        {/* Complex Bento Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* LEFT COLUMN: Main Stats & Charts (col-span-8) */}
          <div className="xl:col-span-8 space-y-4">
             
             {/* Top Row: Balance & Activity */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f5f5f5] text-black p-8 rounded-[2rem] flex flex-col justify-between min-h-[240px]">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Current Balance</span>
                   <div>
                     <p className="text-5xl lg:text-7xl font-black tracking-tighter">{formatCurrency(stats.balance)}</p>
                     <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">[ Available Funds ]</p>
                   </div>
                </div>

                {/* Income / Expense split */}
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] flex justify-between items-center hover:bg-[#222] transition-colors cursor-pointer">
                      <div>
                        <span className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">Total Income</span>
                        <p className="text-2xl lg:text-3xl font-black text-[#f5f5f5] mt-1">+{formatCurrency(stats.income)}</p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-[#fff] opacity-20" />
                   </div>
                   <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] flex justify-between items-center hover:bg-[#222] transition-colors cursor-pointer">
                      <div>
                        <span className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">Total Expenses</span>
                        <p className="text-2xl lg:text-3xl font-black text-[#888] mt-1">{formatCurrency(stats.expense)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-[#fff] opacity-20" />
                   </div>
                </div>
             </div>

             {/* Chart Flow */}
             <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-[#f5f5f5] tracking-widest uppercase">Cash Flow Analysis</h3>
                  <span className="text-[#666] text-[10px] font-black tracking-widest">[ Last 6 Months ]</span>
                </div>
                <div className="flex-1 w-full min-h-0">
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

             {/* Bottom Row: Savings Goals / Projects & Map */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Savings Projects */}
                <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333]">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">Savings Projects</span>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#f5f5f5] bg-[#222] hover:bg-[#333] px-3 py-1 rounded-full transition-colors">Add</button>
                    </div>
                    <div className="space-y-4">
                        {/* Goal 1 */}
                        <div className="bg-[#111] border border-[#333] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#666] transition-colors">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm text-[#f5f5f5] tracking-wide">Emergency Fund</span>
                                    <span className="text-[#888] text-xs font-black">75%</span>
                                </div>
                                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#f5f5f5] w-[75%] h-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Goal 2 */}
                        <div className="bg-[#111] border border-[#333] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#666] transition-colors">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm text-[#888] tracking-wide">New Laptop</span>
                                    <span className="text-[#888] text-xs font-black">40%</span>
                                </div>
                                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#666] w-[40%] h-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map / Tracking feature */}
                <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] overflow-hidden relative min-h-[220px] flex flex-col justify-between group cursor-pointer">
                    <Globe className="w-48 h-48 absolute -right-10 -bottom-10 text-[#222] opacity-50 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] relative z-10">Global Tracking</span>
                       <p className="text-2xl font-black tracking-tighter text-[#f5f5f5] mt-2 relative z-10">France</p>
                       <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mt-1">[ Primary Region ]</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 mt-8">
                       <div className="w-2 h-2 rounded-full bg-[#f5f5f5] animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#f5f5f5]">Monitoring Active</span>
                    </div>
                </div>

             </div>

          </div>

          {/* RIGHT COLUMN: Sidebar elements (col-span-4) */}
          <div className="xl:col-span-4 space-y-4">
             
             {/* Notifications / Reminders */}
             <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333]">
               <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-4 h-4 text-[#888]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f5f5f5]">Notifications</span>
                  <span className="ml-auto bg-[#333] text-[9px] px-2 py-0.5 rounded-full text-[#888] font-black">2 NEW</span>
               </div>
               <div className="space-y-3">
                  <div className="bg-[#222] p-4 rounded-xl border border-[#444] cursor-pointer hover:bg-[#333] transition-colors">
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">Reminder | Upcoming Bill</span>
                     <p className="text-sm font-bold tracking-wide text-[#f5f5f5]">Server Hosting - 15.99€</p>
                     <span className="text-[10px] font-bold text-[#666] mt-2 block tracking-widest">Tomorrow, 08:00 AM</span>
                  </div>
                  <div className="bg-[#111] p-4 rounded-xl border border-[#333] opacity-60">
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">Alert | Threshold Reached</span>
                     <p className="text-sm font-bold tracking-wide text-[#888]">Budget 'Dining' exceeded by 10%</p>
                  </div>
               </div>
             </div>

             {/* Receipt / Invoice Breakdown */}
             <div className="bg-[#f5f5f5] text-black p-8 rounded-[2rem] border border-[#ccc]">
                <div className="flex justify-between items-start mb-6 border-b border-[#ddd] pb-4">
                   <div>
                      <h4 className="font-black uppercase tracking-tighter text-3xl leading-none">LATEST <br/> INVOICE</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#888] mt-2">[ ID: #001845 ]</p>
                   </div>
                </div>
                <div className="space-y-3 text-[10px] font-black uppercase tracking-[0.15em]">
                   <div className="flex justify-between">
                      <span className="text-[#666]">Sub Total:</span>
                      <span>145.00€</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-[#666]">Tax (20%):</span>
                      <span>29.00€</span>
                   </div>
                   <div className="flex justify-between text-[#888]">
                      <span>Discount (PROMO):</span>
                      <span>- 0.00€</span>
                   </div>
                   <div className="flex justify-between border-t border-[#ddd] pt-4 mt-2">
                      <span className="text-[#000] text-xs">Total Due:</span>
                      <span className="text-xl tracking-tighter text-[#000]">174.00€</span>
                   </div>
                </div>
             </div>

             {/* Contacts / Quick Send */}
             <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] block mb-6">Quick Transfer</span>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                   {['A', 'J', 'M', 'S', '+'].map((initial, i) => (
                      <button key={i} className={`flex-shrink-0 w-12 h-12 rounded-full border border-[#333] font-black text-sm flex items-center justify-center transition-all ${initial === '+' ? 'bg-[#f5f5f5] text-black hover:bg-[#ccc]' : 'bg-[#111] text-[#888] hover:bg-[#f5f5f5] hover:text-black hover:border-transparent'}`}>
                         {initial === '+' ? <Plus className="w-4 h-4" /> : initial}
                      </button>
                   ))}
                </div>
                <button className="w-full mt-2 bg-[#111] hover:bg-[#222] transition-colors border border-[#333] rounded-xl p-4 flex justify-between items-center group">
                   <span className="text-[#888] group-hover:text-[#f5f5f5] text-[10px] font-black tracking-widest uppercase transition-colors">Select Contact</span>
                   <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-[#f5f5f5] transition-colors" />
                </button>
             </div>

          </div>
        </div>

        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchStats} 
        />
      </main>
    </div>
  );
}
