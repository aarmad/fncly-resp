import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(credentials) {
            const { data } = await axios.post('/login', credentials)
            this.setAuth(data)
        },
        async register(credentials) {
            const { data } = await axios.post('/register', credentials)
            this.setAuth(data)
        },
        setAuth(data) {
            this.token = data.access_token
            this.user = data.user
            localStorage.setItem('token', this.token)
            localStorage.setItem('user', JSON.stringify(this.user))
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete axios.defaults.headers.common['Authorization']
        }
    }
})
