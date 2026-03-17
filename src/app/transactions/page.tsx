"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TransactionModal from "@/components/TransactionModal";
import Loader from "@/components/Loader";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TransactionsPage() {
    const { data: session, status } = useSession();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ start_date: "", end_date: "", type: "", category_id: "" });
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        }
        if (status === "authenticated") {
            fetchData();
        }
    }, [status, page, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transRes, statsRes] = await Promise.all([
                axios.get("/api/transactions", { params: { ...filters, page } }),
                axios.get("/api/dashboard/stats", { params: filters })
            ]);
            setTransactions(transRes.data.data);
            setTotalPages(transRes.data.last_page);
            setStats(statsRes.data);
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
        <div className="min-h-screen bg-black flex font-sans text-[#f5f5f5]">
            <Sidebar />
            <Loader show={loading} />

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 uppercase">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">OPÉRATIONS</h1>
                        <p className="text-[#888] font-bold mt-2 tracking-widest text-xs flex gap-4 uppercase">
                            <span>Registre Détaillé</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#222] hover:bg-[#333] text-[#f5f5f5] px-6 py-3 rounded-full transition-all font-bold tracking-widest text-xs flex items-center gap-2 uppercase"
                    >
                        <Plus className="w-4 h-4" />
                        Nouv. Entrée
                    </button>
                </header>

                {/* Quick Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] min-h-[160px] flex flex-col justify-between">
                        <p className="text-[#888] font-black uppercase text-[10px] tracking-widest mb-1">Total Revenus</p>
                        <p className="text-3xl font-black text-[#f5f5f5]">{formatCurrency(stats.income)}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] min-h-[160px] flex flex-col justify-between">
                        <p className="text-[#888] font-black uppercase text-[10px] tracking-widest mb-1">Total Dépenses</p>
                        <p className="text-3xl font-black text-[#f5f5f5]">{formatCurrency(stats.expense)}</p>
                    </div>
                    <div className="bg-[#f5f5f5] text-black p-8 rounded-[2rem] min-h-[160px] flex flex-col justify-between">
                        <p className="font-black uppercase text-[10px] tracking-widest opacity-50 mb-1">Solde Net</p>
                        <p className="text-3xl font-black">{formatCurrency(stats.balance)}</p>
                    </div>
                </section>

                {/* Filters */}
                <section className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-[#333] mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Type</label>
                            <select
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-xs text-[#f5f5f5] uppercase transition-colors"
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">Tous les Types</option>
                                <option value="income">Revenus</option>
                                <option value="expense">Dépenses</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Date de Début</label>
                            <input
                                type="date"
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-xs text-[#f5f5f5] uppercase transition-colors"
                                value={filters.start_date}
                                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] ml-2">Date de Fin</label>
                            <input
                                type="date"
                                className="w-full bg-[#111] border border-[#333] p-4 rounded-2xl outline-none font-bold text-xs text-[#f5f5f5] uppercase transition-colors"
                                value={filters.end_date}
                                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ start_date: "", end_date: "", type: "", category_id: "" })}
                                className="w-full p-4 hover:bg-[#222] text-[#888] hover:text-[#f5f5f5] font-black text-xs uppercase tracking-widest rounded-2xl transition-colors border border-transparent hover:border-[#333]"
                            >
                                Réinitialiser Filtres
                            </button>
                        </div>
                    </div>
                </section>

                {/* Transactions Table */}
                <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#333] overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#111] border-b border-[#333]">
                            <tr>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Catégorie</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Note</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {transactions.length > 0 ? (
                                transactions.map((t: any) => (
                                    <tr key={t._id} className="hover:bg-[#222] transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm tracking-widest text-[#f5f5f5] uppercase">
                                                {format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-[#111] border border-[#333] text-[#888] rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {t.categoryId?.name || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[#aaa] text-sm font-bold truncate max-w-[200px]">{t.note || '—'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className={`text-lg font-black tracking-tighter ${t.type === 'income' ? 'text-[#f5f5f5]' : 'text-[#888]'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-8 py-20 text-center text-[#666] font-bold text-sm uppercase tracking-widest">
                                                        Aucune opération trouvée.
                                                    </td>
                                                </tr>
                                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-4 bg-[#1a1a1a] rounded-full border border-[#333] hover:bg-[#222] disabled:opacity-30 disabled:hover:bg-[#1a1a1a] transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#f5f5f5]" />
                        </button>
                        <span className="font-black text-[#888] text-xs uppercase tracking-widest">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-4 bg-[#1a1a1a] rounded-full border border-[#333] hover:bg-[#222] disabled:opacity-30 disabled:hover:bg-[#1a1a1a] transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-[#f5f5f5]" />
                        </button>
                    </div>
                )}

                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchData}
                />
            </main>
        </div>
    );
}
