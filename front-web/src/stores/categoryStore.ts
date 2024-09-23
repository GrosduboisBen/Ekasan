import { defineStore } from 'pinia'

export interface I_Category {
  name: string
  keywords: string[]
  types: string[]
  extensions: string[]
  signature: boolean
}
export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categories: [] as I_Category[],
  }),
  actions: {
    addCategory(category: I_Category) {
      this.categories.push(category)
    },
    removeCategory(category: I_Category) {
      const selectedCategory = this.categories.find(el => el === category)

      this.categories = this.categories.filter(el => el !== selectedCategory)
    },
  },
  getters: {
    getCategories: state => {
      return state.categories
    },
    getCategoriesAsOptions: state => {
      return state.categories.map(category => {
        return {
          title: category.name,
          value: category,
        }
      })
    },
  },
})
