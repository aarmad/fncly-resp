"use client";

import Link from "next/link";
import { ArrowRight, Activity, Target, Bell, Users, Globe, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f5] font-sans selection:bg-[#333] selection:text-[#f5f5f5] overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 lg:p-10 flex justify-between items-center z-50 bg-black/80 backdrop-blur-md border-b border-[#222]">
        <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center text-black font-black text-2xl">F.</div>
          <span className="text-2xl font-black tracking-tighter uppercase">FNCLY.</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#888] hover:text-[#f5f5f5] transition-colors hidden md:block">
            Se Connecter
          </Link>
          <Link href="/register" className="bg-[#f5f5f5] text-black px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#ccc] transition-colors">
            S'inscrire
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Hero Section */}
        <section className="flex flex-col items-start gap-8 mt-10 md:mt-20">
          <div className="inline-block border border-[#333] rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">
            Lancement V2.0
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.85] text-white uppercase break-words w-full">
            Contrôle <br />
            <span className="text-[#666]">Absolu.</span>
          </h1>
          <p className="text-[#888] max-w-xl text-lg md:text-2xl font-bold tracking-wide leading-relaxed">
            Reprenez en main vos finances avec FNCLY. Une interface minimaliste, brutale et redoutablement efficace. Pas de distractions.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/register" className="group bg-[#f5f5f5] text-black px-8 py-5 rounded-[2rem] font-black text-sm md:text-lg uppercase tracking-widest hover:bg-[#ccc] transition-all flex items-center gap-3 active:scale-[0.98]">
              Commencer Maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-5 rounded-[2rem] font-black text-sm md:text-lg uppercase tracking-widest text-[#888] hover:text-[#f5f5f5] border border-[#333] hover:border-[#666] transition-all bg-[#111] hover:bg-[#222]">
              Déjà Membre
            </Link>
          </div>
        </section>

        {/* Features / Bento Box */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] flex flex-col justify-between min-h-[300px] hover:border-[#666] transition-colors group">
            <Activity className="w-12 h-12 text-[#666] group-hover:text-[#f5f5f5] transition-colors mb-8" />
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#f5f5f5]">Analyses Flux</h3>
              <p className="text-[#888] font-bold text-sm leading-relaxed">
                Suivez vos revenus et dépenses en temps réel avec des graphiques clairs et percutants.
              </p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] flex flex-col justify-between min-h-[300px] hover:border-[#666] transition-colors group">
            <Target className="w-12 h-12 text-[#666] group-hover:text-[#f5f5f5] transition-colors mb-8" />
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#f5f5f5]">Objectifs</h3>
              <p className="text-[#888] font-bold text-sm leading-relaxed">
                Fixez et atterrissez vos cibles d'épargne. Une barre de progression vous montre exactement où vous en êtes.
              </p>
            </div>
          </div>

          <div className="bg-[#f5f5f5] p-10 rounded-[2rem] text-black border border-[#ccc] flex flex-col justify-between min-h-[300px] lg:col-span-1 md:col-span-2 group">
            <Bell className="w-12 h-12 text-[#888] group-hover:text-black transition-colors mb-8" />
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Alertes Smart</h3>
              <p className="font-bold text-sm text-[#333] leading-relaxed mb-6">
                Le système vous notifie automatiquement lors de transactions importantes ou pour le rappel de vos factures critiques.
              </p>
              <Link href="/register" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest gap-2 bg-black text-[#f5f5f5] px-4 py-2 rounded-full">
                S'inscrire <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-[#111] p-10 rounded-[2rem] border border-[#333] min-h-[300px] md:col-span-2 lg:col-span-2 relative overflow-hidden group">
            <Globe className="w-[400px] h-[400px] absolute -right-20 -top-20 text-[#222] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000 opacity-50 pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <Users className="w-12 h-12 text-[#666] group-hover:text-[#f5f5f5] transition-colors mb-8" />
              <div className="max-w-md">
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 text-[#f5f5f5]">Gestion de Contacts</h3>
                <p className="text-[#888] font-bold text-sm leading-relaxed">
                  Ajoutez vos bénéficiaires fréquents pour accélérer vos virements et enregistrer les historiques instantanément.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-10 rounded-[2rem] border border-[#333] min-h-[300px] flex flex-col justify-center items-center text-center group hover:bg-[#222] transition-colors cursor-pointer" onClick={() => window.location.href='/register'}>
            <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-8 h-8 -rotate-45" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-[#f5f5f5]">Découvrir l'App</h3>
            <span className="text-[10px] font-black text-[#888] uppercase tracking-[0.2em] mt-2 group-hover:text-[#f5f5f5] transition-colors">Créer un profil</span>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] bg-[#0a0a0a] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3 opacity-50">
            <div className="w-6 h-6 bg-[#f5f5f5] rounded text-black font-black text-xs flex items-center justify-center">F.</div>
            <span className="text-sm font-black tracking-tighter uppercase">FNCLY.</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#666]">
            © {new Date().getFullYear()} FNCLY SYSTEM. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
