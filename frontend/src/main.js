import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import './style.css'
import App from './App.vue'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const token = localStorage.getItem('token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
