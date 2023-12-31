import { defineStore } from 'pinia'

import { fetchWrapper } from '../helpers'
import { router } from '../router'
import { useAlertStore } from '../stores'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/auth`

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(email, password) {
      const alertStore = useAlertStore()
      try {
        const user = await fetchWrapper.post(`${baseUrl}/login`, { email, password })

        // update pinia state
        this.user = user.data

        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user.data))

        // redirect to previous url or default to home page
        router.push(this.returnUrl || '/')
      } catch (error) {
        alertStore.error(error)
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      router.push('/auth/login')
    }
  }
})
