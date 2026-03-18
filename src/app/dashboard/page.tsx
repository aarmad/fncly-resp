"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TransactionModal from "@/components/TransactionModal";
import GoalModal from "@/components/GoalModal";
import ContactModal from "@/components/ContactModal";
import ImportModal from "@/components/ImportModal";
import GoalActionModal from "@/components/GoalActionModal";
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
import { Bell, ArrowUpRight, ArrowDownRight, Plus, ChevronRight, Globe, FileUp, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>({ balance: 0, income: 0, expense: 0, monthly: [], by_category: [], goals: [], contacts: [], notifications: [], latestInvoice: null });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGoalActionModalOpen, setIsGoalActionModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-[#fff]">FNCLY<br/>BOARD</h1>
            <p className="text-[#888] font-bold mt-2 tracking-widest text-[10px] md:text-xs flex gap-4">
              <span>[{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}]</span>
              <span>[ {session?.user?.name || "User"} ]</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => setIsImportModalOpen(true)}
                className="bg-[#111] hover:bg-[#222] text-[#888] hover:text-[#f5f5f5] px-6 py-3 rounded-full transition-all font-bold tracking-widest text-[10px] flex items-center gap-2 uppercase border border-[#333]"
            >
                <FileUp className="w-4 h-4" />
                Importer CSV
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#f5f5f5] hover:bg-[#ccc] text-black px-6 py-3 rounded-full transition-all font-bold tracking-widest text-[10px] flex items-center gap-2 uppercase"
            >
                <Plus className="w-4 h-4" />
                Nouv. Entrée
            </button>
          </div>
        </header>

        {/* Complex Bento Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* LEFT COLUMN: Main Stats & Charts (col-span-8) */}
          <div className="xl:col-span-8 space-y-4">
             
             {/* Top Row: Balance & Activity */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f5f5f5] text-black p-8 rounded-[2rem] flex flex-col justify-between min-h-[240px]">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Solde Actuel</span>
                   <div>
                     <p className="text-5xl lg:text-7xl font-black tracking-tighter">{formatCurrency(stats.balance)}</p>
                     <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">[ Fonds Disponibles ]</p>
                   </div>
                </div>

                {/* Income / Expense split */}
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] flex justify-between items-center hover:bg-[#222] transition-colors cursor-pointer">
                      <div>
                        <span className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">Revenus</span>
                        <p className="text-2xl lg:text-3xl font-black text-[#f5f5f5] mt-1">+{formatCurrency(stats.income)}</p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-[#fff] opacity-20" />
                   </div>
                   <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] flex justify-between items-center hover:bg-[#222] transition-colors cursor-pointer">
                      <div>
                        <span className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">Dépenses</span>
                        <p className="text-2xl lg:text-3xl font-black text-[#888] mt-1">{formatCurrency(stats.expense)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-[#fff] opacity-20" />
                   </div>
                </div>
             </div>

             {/* Chart Flow */}
             <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-[#f5f5f5] tracking-widest uppercase">Analyse des flux</h3>
                  <span className="text-[#666] text-[10px] font-black tracking-widest">[ 6 Derniers Mois ]</span>
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">Projets d'Épargne</span>
                        <button onClick={() => setIsGoalModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-[#f5f5f5] bg-[#222] hover:bg-[#333] px-3 py-1 rounded-full transition-colors">Ajouter</button>
                    </div>
                    <div className="space-y-4 max-h-[160px] overflow-y-auto scrollbar-hide">
                        {stats.goals && stats.goals.length > 0 ? stats.goals.map((goal: any) => {
                            const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
                            return (
                                <div 
                                    key={goal._id} 
                                    onClick={() => {
                                        setSelectedGoal(goal);
                                        setIsGoalActionModalOpen(true);
                                    }}
                                    className="bg-[#111] border border-[#333] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#f5f5f5] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-[#f5f5f5] tracking-wide group-hover:text-white transition-colors">{goal.name}</span>
                                            <span className={`text-xs font-black transition-colors ${percent >= 100 ? 'text-emerald-500' : 'text-[#888] group-hover:text-[#f5f5f5]'}`}>
                                                {percent}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${percent >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-[#f5f5f5]'}`} 
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        {percent >= 100 && (
                                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-2 flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Objectif Atteint
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-4">
                                <span className="text-[#666] text-[10px] font-black uppercase tracking-widest">Aucun Projet</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map / Tracking feature */}
                <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] overflow-hidden relative min-h-[220px] flex flex-col justify-between group cursor-pointer">
                    <Globe className="w-48 h-48 absolute -right-10 -bottom-10 text-[#222] opacity-50 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] relative z-10">Localisation</span>
                       <p className="text-2xl font-black tracking-tighter text-[#f5f5f5] mt-2 relative z-10">France</p>
                       <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mt-1">[ Région Principale ]</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 mt-8">
                       <div className="w-2 h-2 rounded-full bg-[#f5f5f5] animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#f5f5f5]">Surveillance Active</span>
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
                  <span className="ml-auto bg-[#333] text-[9px] px-2 py-0.5 rounded-full text-[#888] font-black">
                     {stats.notifications ? stats.notifications.length : 0} NOUV
                  </span>
               </div>
               <div className="space-y-3">
                  {stats.notifications && stats.notifications.length > 0 ? stats.notifications.slice(0, 3).map((notif: any) => (
                      <div key={notif._id} className="bg-[#222] p-4 rounded-xl border border-[#444] cursor-pointer hover:bg-[#333] transition-colors">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">{notif.type} | {notif.title}</span>
                         <p className="text-sm font-bold tracking-wide text-[#f5f5f5]">{notif.message}</p>
                         <span className="text-[10px] font-bold text-[#666] mt-2 block tracking-widest">{new Date(notif.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                  )) : (
                      <div className="bg-[#111] p-4 rounded-xl border border-[#333] opacity-60">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">Système</span>
                         <p className="text-sm font-bold tracking-wide text-[#888]">Aucune notification.</p>
                      </div>
                  )}
               </div>
             </div>

             {/* Receipt / Invoice Breakdown */}
             <div className="bg-[#f5f5f5] text-black p-8 rounded-[2rem] border border-[#ccc]">
                {stats.latestInvoice ? (
                    <>
                        <div className="flex justify-between items-start mb-6 border-b border-[#ddd] pb-4">
                           <div>
                              <h4 className="font-black uppercase tracking-tighter text-3xl leading-none">DERNIÈRE <br/> DÉPENSE</h4>
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#888] mt-2">
                                [ ID: {stats.latestInvoice._id ? stats.latestInvoice._id.slice(-6).toUpperCase() : 'N/A'} ]
                              </p>
                           </div>
                        </div>
                        <div className="space-y-3 text-[10px] font-black uppercase tracking-[0.15em]">
                           <div className="flex justify-between">
                              <span className="text-[#666]">Catégorie:</span>
                              <span className="truncate max-w-[120px]">{stats.latestInvoice.categoryId?.name || 'Non classé'}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-[#666]">Note:</span>
                              <span className="truncate max-w-[120px]">{stats.latestInvoice.note || '-'}</span>
                           </div>
                           <div className="flex justify-between text-[#888]">
                              <span>Date:</span>
                              <span>{new Date(stats.latestInvoice.date).toLocaleDateString('fr-FR')}</span>
                           </div>
                           <div className="flex justify-between border-t border-[#ddd] pt-4 mt-2">
                              <span className="text-[#000] text-xs">Total:</span>
                              <span className="text-xl tracking-tighter text-[#000]">{formatCurrency(stats.latestInvoice.amount)}</span>
                           </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 opacity-50">
                        <span className="text-[10px] font-black uppercase tracking-widest">Aucune Dépense</span>
                    </div>
                )}
             </div>

             {/* Contacts / Quick Send */}
             <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] block mb-6">Transfert Rapide</span>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                   {stats.contacts && stats.contacts.map((contact: any) => (
                      <button key={contact._id} title={contact.name} className="flex-shrink-0 w-12 h-12 rounded-full border border-[#333] font-black text-sm flex items-center justify-center transition-all bg-[#111] text-[#888] hover:bg-[#f5f5f5] hover:text-black hover:border-transparent">
                         {contact.initials || "?"}
                      </button>
                   ))}
                   <button onClick={() => setIsContactModalOpen(true)} className="flex-shrink-0 w-12 h-12 rounded-full border border-[#333] font-black text-sm flex items-center justify-center transition-all bg-[#f5f5f5] text-black hover:bg-[#ccc]">
                      <Plus className="w-4 h-4" />
                   </button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full mt-2 bg-[#111] hover:bg-[#222] transition-colors border border-[#333] rounded-xl p-4 flex justify-between items-center group">
                   <span className="text-[#888] group-hover:text-[#f5f5f5] text-[10px] font-black tracking-widest uppercase transition-colors">Choisir Contact</span>
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
        <GoalModal 
          isOpen={isGoalModalOpen} 
          onClose={() => setIsGoalModalOpen(false)} 
          onSuccess={fetchStats} 
        />
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
          onSuccess={fetchStats} 
        />
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={fetchStats}
        />
        <GoalActionModal
          isOpen={isGoalActionModalOpen}
          onClose={() => {
            setIsGoalActionModalOpen(false);
            setSelectedGoal(null);
          }}
          onSuccess={fetchStats}
          goal={selectedGoal}
        />
      </main>
    </div>
  );
}
