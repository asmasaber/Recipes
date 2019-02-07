import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import RecipeService from '@/services/RecipeService'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    recipes: null,
    userRecipes: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
    },
    requestRecipes (state, {recipes, userRecipes}) {
      state.recipes = recipes
      state.userRecipes = userRecipes
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    async requestRecipes ({commit}) {
      let response = await RecipeService.getUserRecips()
      let userRecipes = response.data.recipes
      response = await RecipeService.getAll()
      let recipes = response.data.recipes
      commit('requestRecipes', {recipes, userRecipes})
    }
  }
})
