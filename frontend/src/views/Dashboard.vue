<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex selection:bg-indigo-100 selection:text-indigo-700">
      <!-- Sidebar -->
      <Sidebar :is-dark="isDark" @toggle-dark="toggleDark" />

      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <!-- Header Section -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div class="animate-in slide-in-from-left duration-700">
             <h1 class="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Vue d'ensemble</h1>
             <p class="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Ravi de vous revoir, <span class="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-4">{{ auth.user?.name }}</span> 👋</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto animate-in fade-in duration-1000">
               <div class="hidden sm:flex items-center bg-white dark:bg-slate-800 p-1 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-x-2">
                   <input v-model="startDate" type="date" class="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 py-2" />
                   <span class="text-slate-300 px-1">→</span>
                   <input v-model="endDate" type="date" class="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 py-2" />
               </div>
               <button @click="exportPdf" 
                       :disabled="loadingExport"
                       class="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50">
                  <svg v-if="!loadingExport" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span class="font-bold">{{ loadingExport ? 'Génération...' : 'Exporter PDF' }}</span>
               </button>
               <button @click="showModal = true" class="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 font-bold">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                   <span>Nouvelle Transaction</span>
               </button>
          </div>
        </header>

        <!-- Stats Cards Section -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Balance Card -->
          <div class="relative group bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 overflow-hidden">
             <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div class="flex items-center justify-between mb-4">
                <span class="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">Solde Total</span>
                <div class="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg"><svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
             </div>
             <p class="text-4xl font-black text-slate-800 dark:text-white font-mono lining-nums transition-all" :class="{'opacity-50 scale-95': loading}">{{ formatCurrency(stats.balance) }}</p>
             <div class="mt-4 flex items-center text-xs font-bold" :class="stats.balance >= 0 ? 'text-emerald-500' : 'text-red-500'">
                 {{ stats.balance >= 0 ? '▲ En hausse' : '▼ En baisse' }}
             </div>
          </div>

          <!-- Income Card -->
          <div class="relative group bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 overflow-hidden">
             <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div class="flex items-center justify-between mb-4">
                <span class="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Revenus</span>
                <div class="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg"><svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
             </div>
             <p class="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono lining-nums transition-all" :class="{'opacity-50 scale-95': loading}">+{{ formatCurrency(stats.income) }}</p>
          </div>

          <!-- Expenses Card -->
          <div class="relative group bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 overflow-hidden">
             <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div class="flex items-center justify-between mb-4">
                <span class="text-rose-600 dark:text-rose-400 text-sm font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full">Dépenses</span>
                <div class="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg"><svg class="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></div>
             </div>
             <p class="text-4xl font-black text-rose-600 dark:text-rose-400 font-mono lining-nums transition-all" :class="{'opacity-50 scale-95': loading}">-{{ formatCurrency(stats.expense) }}</p>
          </div>
        </section>
        
        <!-- Charts Grid Section -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <!-- Monthly Chart -->
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:border-indigo-500/30">
               <div class="flex items-center justify-between mb-8">
                   <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">Analyse Mensuelle</h3>
                   <div class="flex space-x-2">
                       <span class="w-12 h-1 bg-indigo-500 rounded-full"></span>
                       <span class="w-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                   </div>
               </div>
               <div class="h-80 w-full">
                  <Bar v-if="loaded" :data="barChartData" :options="chartOptions" />
                  <div v-else class="h-full flex items-center justify-center space-x-2"><div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div><div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div></div>
               </div>
            </div>

            <!-- Categories Chart -->
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:border-emerald-500/30">
               <div class="flex items-center justify-between mb-8">
                   <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">Dépenses par Catégorie</h3>
                   <div class="flex space-x-2">
                       <span class="w-12 h-1 bg-emerald-500 rounded-full"></span>
                       <span class="w-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                   </div>
               </div>
               <div class="h-80 w-full">
                  <Doughnut v-if="loaded && stats.by_category.length" :data="doughnutChartData" :options="chartOptions" />
                  <div v-else-if="loaded" class="h-full flex flex-col items-center justify-center text-slate-400 italic">
                      <svg class="w-16 h-16 mb-4 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                      Aucune dépense enregistrée
                  </div>
                  <div v-else class="h-full flex items-center justify-center"><div class="animate-pulse flex items-center space-x-4"><div class="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div><div class="flex-1 space-y-2 py-1"><div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-24"></div><div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></div></div></div>
               </div>
            </div>
        </section>

        <!-- Transaction Modal with Premium Design -->
        <Transition name="fade">
            <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-xl w-full p-10 relative overflow-hidden animate-in zoom-in-95 duration-300">
                    <div class="absolute top-0 right-0 p-6">
                        <button @click="showModal = false" class="bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all w-10 h-10 rounded-full flex items-center justify-center font-black text-xl hover:rotate-90">&times;</button>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Ajouter une opération</h3>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Suivez vos finances en temps réel.</p>
                    </div>

                    <form @submit.prevent="saveTransaction" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Montant (€)</label>
                            <input v-model="form.amount" type="number" step="0.01" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-2xl transition-all font-black text-2xl" placeholder="0.00" required autofocus />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Type d'opération</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" @click="form.type = 'expense'" :class="form.type === 'expense' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'" class="p-3 rounded-xl font-bold transition-all">Dépense</button>
                                <button type="button" @click="form.type = 'income'" :class="form.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'" class="p-3 rounded-xl font-bold transition-all">Revenu</button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Date</label>
                            <input v-model="form.date" type="date" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium dark:text-white" required />
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Catégorie</label>
                            <select v-model="form.category_id" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium appearance-none cursor-pointer dark:text-white">
                                <option value="">Auto-catégorisation (basée sur la note)</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }} ({{ cat.type }})</option>
                            </select>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Libellé / Note</label>
                            <input v-model="form.note" type="text" placeholder="Ex: McDo, Loyer, Bonus..." class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium dark:text-white" />
                        </div>

                        <div class="md:col-span-2 flex space-x-3 mt-6">
                            <button type="submit" 
                                    :disabled="saving"
                                    class="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 hover:bg-slate-900 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2">
                                <span v-if="!saving">{{ form.type === 'expense' ? 'Enregistrer la dépense' : 'Enregistrer le revenu' }}</span>
                                <span v-else class="animate-pulse">Traitement...</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import Sidebar from '../components/Sidebar.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const auth = useAuthStore()
const router = useRouter()

const stats = ref({ balance: 0, income: 0, expense: 0, by_category: [], monthly: [] })
const categories = ref([])
const loaded = ref(false)
const loading = ref(false)
const saving = ref(false)
const loadingExport = ref(false)
const showModal = ref(false)
const isDark = ref(localStorage.getItem('theme') === 'dark')

const startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

const form = ref({
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
})

const formatCurrency = (val) => {
    const num = parseFloat(val) || 0
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num)
}

const toggleDark = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const fetchData = async () => {
    loading.value = true
    try {
        const [statsRes, categoriesRes] = await Promise.all([
            axios.get('/dashboard/stats', {
                params: {
                    start_date: startDate.value,
                    end_date: endDate.value
                }
            }),
            axios.get('/categories')
        ])
        stats.value = statsRes.data
        categories.value = categoriesRes.data
        loaded.value = true
    } catch (e) {
        console.error("Failed to load data", e)
    } finally {
        loading.value = false
    }
}

watch([startDate, endDate], fetchData)

onMounted(fetchData)

// Animation logic for numbers could go here if needed, but Vue's reactivity 
// combined with transitions is usually enough for "dynamic" feel.

const barChartData = computed(() => ({
    labels: stats.value.monthly.map(m => {
        const [y, m_num] = m.month.split('-')
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        return months[parseInt(m_num) - 1] + ' ' + y
    }),
    datasets: [
        { label: 'Revenus', backgroundColor: '#10b981', borderRadius: 8, data: stats.value.monthly.map(m => m.income) },
        { label: 'Dépenses', backgroundColor: '#ef4444', borderRadius: 8, data: stats.value.monthly.map(m => m.expense) }
    ]
}))

const doughnutChartData = computed(() => ({
    labels: stats.value.by_category.map(c => c.name),
    datasets: [{
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
        borderWidth: 0,
        hoverOffset: 15,
        data: stats.value.by_category.map(c => c.total)
    }]
}))

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1500,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: { 
            position: 'bottom',
            labels: { 
                padding: 20,
                usePointStyle: true,
                font: { size: 12, weight: 'bold' },
                color: isDark.value ? '#e2e8f0' : '#475569' 
            }
        },
        tooltip: {
            backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
            titleColor: isDark.value ? '#ffffff' : '#1e293b',
            bodyColor: isDark.value ? '#cbd5e1' : '#475569',
            borderColor: '#6366f1',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            cornerRadius: 12
        }
    },
    scales: {
        x: { 
            grid: { display: false },
            ticks: { color: isDark.value ? '#94a3b8' : '#64748b', font: { weight: 'bold' } } 
        },
        y: { 
            grid: { color: isDark.value ? '#334155' : '#f1f5f9' },
            ticks: { color: isDark.value ? '#94a3b8' : '#64748b' } 
        }
    }
}))

const saveTransaction = async () => {
    if (saving.value) return
    saving.value = true
    try {
        await axios.post('/transactions', form.value)
        showModal.value = false
        // Reset form
        form.value = {
            amount: '',
            type: 'expense',
            category_id: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        }
        await fetchData()
    } catch (e) {
        console.error(e)
        alert('Erreur lors de l\'enregistrement')
    } finally {
        saving.value = false
    }
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    auth.logout()
    router.push('/login')
}

const exportPdf = async () => {
    loadingExport.value = true
    try {
        const response = await axios.get('/dashboard/export', { 
            responseType: 'blob',
            params: {
                start_date: startDate.value,
                end_date: endDate.value
            }
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Rapport_${startDate.value}_au_${endDate.value}.pdf`)
        document.body.appendChild(link)
        link.click()
    } catch (e) {
        console.error(e)
        alert('Échec du téléchargement du PDF')
    } finally {
        loadingExport.value = false
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

font-mono { font-family: 'JetBrains Mono', 'Roboto Mono', monospace; }
</style>
