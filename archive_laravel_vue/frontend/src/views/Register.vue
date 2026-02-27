<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors duration-500">
    <div class="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl text-white font-black text-2xl shadow-lg mb-4">F.</div>
        <h2 class="text-3xl font-black text-gray-800 dark:text-white">Créer un compte</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Rejoignez Fncly pour gérer vos finances.</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Nom complet</label>
          <input v-model="name" type="text" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl transition-all font-medium dark:text-white" placeholder="Jean Dupont" required />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Adresse Email</label>
          <input v-model="email" type="email" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl transition-all font-medium dark:text-white" placeholder="exemple@mail.com" required />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Mot de passe</label>
          <input v-model="password" type="password" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl transition-all font-medium dark:text-white" placeholder="••••••••" required minlength="6" />
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">S'inscrire</button>
      </form>

      <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Vous avez déjà un compte ? 
        <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    router.push('/')
  } catch (e) {
     alert('Échec de l\'inscription : ' + (e.response?.data?.message || 'Veuillez vérifier les informations'))
     console.error(e)
  }
}
</script>
