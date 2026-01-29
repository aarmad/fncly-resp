<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium">Full Name</label>
          <input v-model="name" type="text" class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Email Address</label>
          <input v-model="email" type="email" class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Password</label>
          <input v-model="password" type="password" class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required minlength="6" />
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Register</button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account? <router-link to="/login" class="text-indigo-600 font-medium hover:underline">Login</router-link>
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
     alert('Register failed: ' + (e.response?.data?.message || 'Check console'))
     console.error(e)
  }
}
</script>
