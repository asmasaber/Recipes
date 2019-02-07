import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/AuthComponents/Register'
import Login from '@/components/AuthComponents/Login'
import Recipes from '@/components/RecipeComponents/Recipes'
import Profile from '@/components/ContainerComponents/profile'
import store from '../store/store'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/recipes',
      name: 'recipes',
      component: Recipes
    },
    {
      path: '/',
      redirect: 'recipes'
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: 'recipes'
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.isUserLoggedIn) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }})
  } else if ((to.matched.some(record => record.name === 'register') || to.matched.some(record => record.name === 'login')) && store.state.isUserLoggedIn) {
    next({
      path: '/recipes'
    })
  } else {
    next()
  }
})

export default router
