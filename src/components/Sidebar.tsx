"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, BarChart3, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
        { label: "Transactions", href: "/transactions", icon: Receipt },
        { label: "Analyses", href: "/stats", icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-black text-[#f5f5f5] min-h-screen hidden lg:flex flex-col flex-shrink-0 border-r border-[#222] z-20">
            <div className="p-8">
                <Link href="/dashboard" className="flex items-center space-x-3 mb-10 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center text-black font-black text-2xl">F.</div>
                    <span className="text-2xl font-black tracking-tighter uppercase font-sans">FNCLY.</span>
                </Link>

                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-[#666] mb-4">Menu Princip.</div>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 font-bold group text-sm",
                                pathname === item.href || (item.href === '/dashboard' && pathname === '/')
                                    ? "bg-[#222] text-[#f5f5f5]"
                                    : "hover:bg-[#1a1a1a] text-[#888]"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", pathname === item.href || (item.href === '/dashboard' && pathname === '/') ? "text-[#f5f5f5]" : "text-[#666]")} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-8 space-y-2">
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-[#666] mb-4">Compte</div>
                <button
                    className="w-full flex items-center space-x-3 p-3 text-[#888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-xl transition-all font-bold group text-sm"
                >
                    <Settings className="w-4 h-4 text-[#666] group-hover:text-[#f5f5f5]" />
                    <span>Paramètres</span>
                </button>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center space-x-3 p-3 text-[#888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-xl transition-all font-bold group text-sm"
                >
                    <LogOut className="w-4 h-4 text-[#666] group-hover:text-[#f5f5f5]" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
