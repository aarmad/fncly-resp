<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors duration-500">
    <div class="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl text-white font-black text-2xl shadow-lg mb-4">F.</div>
        <h2 class="text-3xl font-black text-gray-800 dark:text-white">Ravi de vous revoir</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Connectez-vous à votre compte Fncly.</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Adresse Email</label>
          <input v-model="email" type="email" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl transition-all font-medium dark:text-white" placeholder="exemple@mail.com" required />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Mot de passe</label>
          <input v-model="password" type="password" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl transition-all font-medium dark:text-white" placeholder="••••••••" required />
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Se connecter</button>
      </form>
      
      <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Vous n'avez pas encore de compte ? 
        <router-link to="/register" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Créer un compte</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (e) {
    alert('Échec de la connexion : ' + (e.response?.data?.message || 'Vérifiez vos identifiants'))
    console.error(e)
  }
}
</script>
