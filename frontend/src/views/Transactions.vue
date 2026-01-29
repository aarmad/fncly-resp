<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex selection:bg-indigo-100 selection:text-indigo-700">
      <!-- Sidebar -->
      <Sidebar :is-dark="isDark" @toggle-dark="toggleDark" />

      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div class="animate-in slide-in-from-left duration-700">
             <h1 class="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Transactions</h1>
             <p class="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Historique détaillé de vos opérations</p>
          </div>
          <div class="flex items-center space-x-3 w-full md:w-auto animate-in fade-in duration-1000">
               <button @click="openAddModal" class="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 font-bold">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                   <span>Nouvelle Transaction</span>
               </button>
          </div>
        </header>

        <!-- Summary Stats Section -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500">
                <p class="text-slate-400 font-bold uppercase text-xs mb-2">Total Revenus</p>
                <p class="text-3xl font-black text-emerald-600">{{ formatCurrency(stats.income) }}</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500 delay-75">
                <p class="text-slate-400 font-bold uppercase text-xs mb-2">Total Dépenses</p>
                <p class="text-3xl font-black text-rose-600">{{ formatCurrency(stats.expense) }}</p>
            </div>
            <div class="bg-indigo-600 p-8 rounded-[2rem] shadow-xl text-white animate-in zoom-in duration-500 delay-150">
                <p class="text-indigo-100 font-bold uppercase text-xs mb-2">SOLDE PÉRIODE</p>
                <p class="text-3xl font-black">{{ formatCurrency(stats.balance) }}</p>
            </div>
        </section>

        <!-- Filters Section -->
        <section class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-10">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Du</label>
                    <input v-model="filters.start_date" type="date" class="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-slate-700 dark:text-white border-2 border-transparent focus:border-indigo-500 transition-all" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Au</label>
                    <input v-model="filters.end_date" type="date" class="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-slate-700 dark:text-white border-2 border-transparent focus:border-indigo-500 transition-all" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Type</label>
                    <select v-model="filters.type" class="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-slate-700 dark:text-white border-2 border-transparent focus:border-indigo-500 transition-all appearance-none">
                        <option value="">Tous les types</option>
                        <option value="income">Revenus</option>
                        <option value="expense">Dépenses</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Catégorie</label>
                    <select v-model="filters.category_id" class="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-slate-700 dark:text-white border-2 border-transparent focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                        <option value="">Toutes les catégories</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button @click="resetFilters" class="w-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        Réinitialiser
                    </button>
                </div>
            </div>
        </section>

        <!-- Transactions Table -->
        <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                            <th class="px-8 py-5">Date</th>
                            <th class="px-8 py-5">Note / Libellé</th>
                            <th class="px-8 py-5">Catégorie</th>
                            <th class="px-8 py-5 text-right">Montant</th>
                            <th class="px-8 py-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr v-for="t in transactions" :key="t.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                            <td class="px-8 py-5">
                                <span class="text-slate-600 dark:text-slate-300 font-medium">{{ formatDate(t.date) }}</span>
                            </td>
                            <td class="px-8 py-5">
                                <span class="text-slate-800 dark:text-white font-bold block">{{ t.note || '---' }}</span>
                            </td>
                            <td class="px-8 py-5">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter" 
                                      :class="t.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'">
                                    {{ t.category?.name || 'Inconnu' }}
                                </span>
                            </td>
                            <td class="px-8 py-5 text-right">
                                <span class="text-lg font-black font-mono lining-nums" :class="t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
                                    {{ t.type === 'income' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
                                </span>
                            </td>
                            <td class="px-8 py-5 text-center flex items-center justify-center space-x-2">
                                <button @click="editTransaction(t)" class="p-2 text-slate-300 hover:text-indigo-500 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button @click="deleteTransaction(t.id)" class="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!loading && !transactions.length">
                            <td colspan="5" class="px-8 py-20 text-center text-slate-400 italic">Aucune transaction trouvée</td>
                        </tr>
                        <tr v-if="loading">
                             <td colspan="5" class="px-8 py-20 text-center">
                                 <div class="flex items-center justify-center space-x-2">
                                     <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                     <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                     <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                                 </div>
                             </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <p class="text-sm text-slate-500">Page {{ pagination.current_page }} sur {{ pagination.last_page }}</p>
                <div class="flex space-x-2">
                    <button @click="changePage(pagination.current_page - 1)" 
                            :disabled="pagination.current_page === 1"
                            class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold disabled:opacity-50 hover:border-indigo-500 transition-all dark:text-white">Précédent</button>
                    <button @click="changePage(pagination.current_page + 1)" 
                            :disabled="pagination.current_page === pagination.last_page"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all">Suivant</button>
                </div>
            </div>
        </div>

        <!-- Add Modal (Reuse from Dashboard for consistency) -->
        <Transition name="fade">
            <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-xl w-full p-10 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-6">
                        <button @click="showModal = false" class="bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all w-10 h-10 rounded-full flex items-center justify-center font-black text-xl hover:rotate-90">&times;</button>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{{ isEditing ? 'Modifier' : 'Nouvelle' }} opération</h3>
                    </div>

                    <form @submit.prevent="saveTransaction" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <input v-model="form.amount" type="number" step="0.01" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-black text-2xl dark:text-white" placeholder="0.00" required />
                        </div>
                        <div class="grid grid-cols-2 gap-2 md:col-span-2">
                            <button type="button" @click="form.type = 'expense'" :class="form.type === 'expense' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'" class="p-3 rounded-xl font-bold transition-all">Dépense</button>
                            <button type="button" @click="form.type = 'income'" :class="form.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'" class="p-3 rounded-xl font-bold transition-all">Revenu</button>
                        </div>
                        <div class="md:col-span-2">
                            <input v-model="form.date" type="date" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium dark:text-white" required />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Catégorie</label>
                            <select v-model="form.category_id" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium appearance-none cursor-pointer dark:text-white-800">
                                <option value="">Auto-catégorisation</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }} ({{ cat.type }})</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                             <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Libellé / Note</label>
                            <input v-model="form.note" type="text" placeholder="Note / Libellé" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium dark:text-white" />
                        </div>
                        <button type="submit" :disabled="saving" class="md:col-span-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all disabled:opacity-50">
                            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                        </button>
                    </form>
                </div>
            </div>
        </Transition>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

const auth = useAuthStore()
const router = useRouter()

const transactions = ref([])
const stats = ref({ income: 0, expense: 0, balance: 0 })
const pagination = ref({ current_page: 1, last_page: 1 })
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const currentId = ref(null)
const isDark = ref(localStorage.getItem('theme') === 'dark')

const categories = ref([])
const filters = ref({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    type: '',
    category_id: ''
})

const form = ref({
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
})

const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

const toggleDark = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const fetchData = async (page = 1) => {
    loading.value = true
    try {
        const [transRes, catsRes, statsRes] = await Promise.all([
            axios.get('/transactions', {
                params: {
                    page,
                    start_date: filters.value.start_date,
                    end_date: filters.value.end_date,
                    type: filters.value.type,
                    category_id: filters.value.category_id
                }
            }),
            axios.get('/categories'),
            axios.get('/dashboard/stats', {
                params: {
                    start_date: filters.value.start_date,
                    end_date: filters.value.end_date,
                    type: filters.value.type,
                    category_id: filters.value.category_id
                }
            })
        ])
        transactions.value = transRes.data.data
        pagination.value = {
            current_page: transRes.data.current_page,
            last_page: transRes.data.last_page
        }
        categories.value = catsRes.data
        stats.value = statsRes.data
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.last_page) {
        fetchData(page)
    }
}

const resetFilters = () => {
    filters.value = { start_date: '', end_date: '', type: '', category_id: '' }
    fetchData(1)
}

const openAddModal = () => {
    resetForm()
    showModal.value = true
}

const editTransaction = (t) => {
    isEditing.value = true
    currentId.value = t.id
    form.value = {
        amount: t.amount,
        type: t.type,
        category_id: t.category_id || '',
        date: t.date,
        note: t.note || ''
    }
    showModal.value = true
}

const saveTransaction = async () => {
    saving.value = true
    try {
        if (isEditing.value) {
            await axios.put(`/transactions/${currentId.value}`, form.value)
        } else {
            await axios.post('/transactions', form.value)
        }
        showModal.value = false
        resetForm()
        fetchData(pagination.value.current_page)
    } catch (e) {
        alert('Erreur lors de l\'enregistrement')
    } finally {
        saving.value = false
    }
}

const resetForm = () => {
    isEditing.value = false
    currentId.value = null
    form.value = { amount: '', type: 'expense', category_id: '', date: new Date().toISOString().split('T')[0], note: '' }
}

const deleteTransaction = async (id) => {
    if (!confirm('Voulez-vous supprimer cette opération ?')) return
    try {
        await axios.delete(`/transactions/${id}`)
        fetchData(pagination.value.current_page)
    } catch (e) {
        alert('Erreur lors de la suppression')
    }
}

const logout = () => {
    localStorage.removeItem('token')
    auth.logout()
    router.push('/login')
}

onMounted(() => fetchData())
watch(filters, () => fetchData(1), { deep: true })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
