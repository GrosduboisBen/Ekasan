import { defineStore } from 'pinia'
import type { I_User } from '@/utils/base-utils'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    token: '' as string,
    currentUser: undefined as undefined | I_User,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: I_User) {
      this.currentUser = user
    },
    logout() {
      this.token = ''
    },
  },
  getters: {
    getToken: state => {
      return state.token
    },
    getUser: state => {
      return state.currentUser
    },
  },
})
