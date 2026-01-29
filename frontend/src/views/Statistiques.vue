<template>
  <div :class="{ 'dark': isDark }">
    <Loader :show="loading" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex selection:bg-indigo-100 selection:text-indigo-700">
      <!-- Sidebar -->
      <Sidebar :is-dark="isDark" @toggle-dark="toggleDark" />

      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div class="animate-in slide-in-from-left duration-700">
             <h1 class="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Analyse Financière</h1>
             <p class="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Visualisez vos habitudes et optimisez vos finances</p>
          </div>
          <div class="flex items-center space-x-3 w-full md:w-auto">
                <input v-model="filters.start_date" type="date" class="bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 dark:text-white" />
                <span class="text-slate-400 font-bold">à</span>
                <input v-model="filters.end_date" type="date" class="bg-white dark:bg-slate-800 p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 dark:text-white" />
          </div>
        </header>

        <!-- Dynamic Charts Grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Full Width Trend -->
            <div class="md:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden relative group">
                <div class="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg class="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                </div>
                <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center space-x-3">
                    <span class="w-2 h-8 bg-indigo-500 rounded-full"></span>
                    <span>Évolution des Flux</span>
                </h3>
                <div class="h-96 w-full">
                    <Bar v-if="loaded" :data="barChartData" :options="chartOptions" />
                </div>
            </div>

            <!-- Categories Breakdown -->
            <div class="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center space-x-3">
                    <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                    <span>Répartition des Dépenses</span>
                </h3>
                <div class="h-80 w-full">
                    <Doughnut v-if="loaded && stats.by_category.length" :data="doughnutChartData" :options="chartOptions" />
                    <div v-else-if="loaded" class="h-full flex items-center justify-center text-slate-400 italic">Pas de données</div>
                </div>
            </div>

            <!-- Summary Textual Data -->
            <div class="grid grid-cols-1 gap-6">
                <div class="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white transform hover:scale-[1.02] transition-transform duration-500">
                    <p class="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">Taux d'Épargne</p>
                    <p class="text-5xl font-black">{{ calculateSavingRate() }}%</p>
                    <div class="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div class="h-full bg-white transition-all duration-1000" :style="{ width: calculateSavingRate() + '%' }"></div>
                    </div>
                </div>
                <div class="bg-emerald-500 p-8 rounded-[2.5rem] shadow-xl text-white transform hover:scale-[1.02] transition-transform duration-500">
                    <p class="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">Plus gros Revenu</p>
                    <p class="text-4xl font-black">{{ formatCurrency(stats.income) }}</p>
                </div>
                <div class="bg-rose-500 p-8 rounded-[2.5rem] shadow-xl text-white transform hover:scale-[1.02] transition-transform duration-500">
                    <p class="text-rose-100 font-bold uppercase tracking-widest text-xs mb-2">Total Dépensé</p>
                    <p class="text-4xl font-black">{{ formatCurrency(stats.expense) }}</p>
                </div>
            </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import Sidebar from '../components/Sidebar.vue'
import Loader from '../components/Loader.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const router = useRouter()
const stats = ref({ balance: 0, income: 0, expense: 0, by_category: [], monthly: [] })
const loaded = ref(false)
const loading = ref(false)
const isDark = ref(localStorage.getItem('theme') === 'dark')

const filters = ref({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
})

const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)

const toggleDark = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const fetchData = async () => {
    loading.value = true
    try {
        const response = await axios.get('/dashboard/stats', { params: filters.value })
        stats.value = response.data
        loaded.value = true
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const calculateSavingRate = () => {
    if (stats.value.income === 0) return 0
    const rate = ((stats.value.income - stats.value.expense) / stats.value.income) * 100
    return Math.max(0, Math.round(rate))
}

const barChartData = computed(() => ({
    labels: stats.value.monthly.map(m => {
        const [y, m_num] = m.month.split('-')
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        return months[parseInt(m_num) - 1] + ' ' + y
    }),
    datasets: [
        { label: 'Revenus', backgroundColor: '#10b981', borderRadius: 12, data: stats.value.monthly.map(m => m.income) },
        { label: 'Dépenses', backgroundColor: '#ef4444', borderRadius: 12, data: stats.value.monthly.map(m => m.expense) }
    ]
}))

const doughnutChartData = computed(() => ({
    labels: stats.value.by_category.map(c => c.name),
    datasets: [{
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        borderWidth: 0,
        hoverOffset: 20,
        data: stats.value.by_category.map(c => c.total)
    }]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { font: { weight: 'bold' }, usePointStyle: true, padding: 25 } }
    }
}

const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
}

onMounted(fetchData)
watch(filters, fetchData, { deep: true })
</script>
