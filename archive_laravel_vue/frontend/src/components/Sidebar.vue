<template>
  <aside class="w-64 bg-indigo-700 dark:bg-slate-900 text-white min-h-screen hidden lg:block flex-shrink-0 transition-colors duration-500 shadow-xl z-20">
    <div class="p-8">
      <div class="flex items-center space-x-3 group cursor-default">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-700 font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">F.</div>
        <span class="text-2xl font-bold tracking-tight">Fncly.</span>
      </div>
    </div>

    <nav class="mt-4 px-4 space-y-2">
      <router-link to="/" class="flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300" 
                   :class="isActive('/') ? 'bg-white/10 border border-white/5 shadow-inner font-bold' : 'hover:bg-white/5 text-indigo-100 group'">
        <svg class="w-5 h-5" :class="isActive('/') ? 'text-white' : 'text-indigo-300 group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span>Tableau de bord</span>
      </router-link>
      
      <router-link to="/transactions" class="flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300"
                   :class="isActive('/transactions') ? 'bg-white/10 border border-white/5 shadow-inner font-bold' : 'hover:bg-white/5 text-indigo-100 group'">
        <svg class="w-5 h-5" :class="isActive('/transactions') ? 'text-white' : 'text-indigo-300 group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        <span>Transactions</span>
      </router-link>

      <router-link to="/statistics" class="flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300"
                   :class="isActive('/statistics') ? 'bg-white/10 border border-white/5 shadow-inner font-bold' : 'hover:bg-white/5 text-indigo-100 group'">
        <svg class="w-5 h-5" :class="isActive('/statistics') ? 'text-white' : 'text-indigo-300 group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
        <span>Statistiques</span>
      </router-link>
    </nav>
    
    <div class="absolute bottom-10 w-64 p-8 space-y-4">
      <button @click="$emit('toggle-dark')" class="flex items-center justify-between w-full py-2 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
          <span>{{ isDark ? 'Mode Nuit' : 'Mode Jour' }}</span>
          <span class="text-xl">{{ isDark ? '🌙' : '☀️' }}</span>
      </button>
      <button @click="logout" class="flex items-center space-x-3 text-indigo-200 hover:text-white transition-colors w-full px-4 group">
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="font-medium">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps(['isDark'])
const emit = defineEmits(['toggle-dark'])

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isActive = (path) => route.path === path

const logout = () => {
    localStorage.removeItem('token')
    auth.logout()
    router.push('/login')
}
</script>
