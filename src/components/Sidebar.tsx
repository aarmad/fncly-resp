"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, BarChart3, LogOut, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme") === "dark";
        setIsDark(saved);
        if (saved) document.documentElement.classList.add("dark");
    }, []);

    const toggleDark = () => {
        const newVal = !isDark;
        setIsDark(newVal);
        localStorage.setItem("theme", newVal ? "dark" : "light");
        document.documentElement.classList.toggle("dark");
    };

    const navItems = [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Transactions", href: "/transactions", icon: Receipt },
        { label: "Statistiques", href: "/stats", icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-indigo-700 dark:bg-slate-900 text-white min-h-screen hidden lg:flex flex-col flex-shrink-0 transition-colors duration-500 shadow-xl z-20">
            <div className="p-8">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-700 font-black text-2xl shadow-lg">F.</div>
                    <span className="text-2xl font-black tracking-tighter">Fncly.</span>
                </div>

                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 font-bold group",
                                pathname === item.href
                                    ? "bg-white text-indigo-700 shadow-lg shadow-black/10"
                                    : "hover:bg-indigo-600 dark:hover:bg-slate-800 text-indigo-100"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-indigo-600" : "text-indigo-300")} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-8 space-y-4">
                <button
                    onClick={toggleDark}
                    className="w-full flex items-center justify-between p-4 bg-indigo-800/50 dark:bg-slate-800/50 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
                >
                    <span>{isDark ? "Thème Sombre" : "Thème Clair"}</span>
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center space-x-3 p-4 text-indigo-200 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all font-bold group"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
