"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TransactionModal from "@/components/TransactionModal";
import Loader from "@/components/Loader";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-500">
            <Sidebar />
            <Loader show={loading} />

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Transactions</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Historique détaillé de vos opérations</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all font-bold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle Transaction
                    </button>
                </header>

                {/* Quick Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Revenus</p>
                        <p className="text-xl font-black text-emerald-600">{formatCurrency(stats.income)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Dépenses</p>
                        <p className="text-xl font-black text-rose-600">{formatCurrency(stats.expense)}</p>
                    </div>
                    <div className="bg-indigo-600 p-6 rounded-3xl shadow-sm text-white">
                        <p className="text-indigo-100 font-bold uppercase text-[10px] mb-1">Solde</p>
                        <p className="text-xl font-black">{formatCurrency(stats.balance)}</p>
                    </div>
                </section>

                {/* Filters */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Type</label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm dark:text-white"
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">Tous les types</option>
                                <option value="income">Revenus</option>
                                <option value="expense">Dépenses</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Début</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm dark:text-white"
                                value={filters.start_date}
                                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Fin</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm dark:text-white"
                                value={filters.end_date}
                                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ start_date: "", end_date: "", type: "", category_id: "" })}
                                className="w-full p-3 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </section>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Note</th>
                                <th className="px-8 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {transactions.length > 0 ? (
                                transactions.map((t: any) => (
                                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-800 dark:text-white">{format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase">
                                                {t.categoryId?.name || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.note || '-'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                                        Aucune transaction trouvée pour cette période.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-black text-slate-500 dark:text-slate-400">Page {page} sur {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 disabled:opacity-30"
                        >
                            <ChevronRight className="w-5 h-5" />
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
