import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import axios from 'axios'
// import Home from './views/Home.vue'
// import Login from './views/Login.vue'
// import Signup from './views/Signup.vue'
// import ColumnDetail from './views/ColumnDetail.vue'
// import CreatePost from './views/CreatePost.vue'
// import PostDetail from './views/PostDetail.vue'
// import store from './store'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue'),
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: () => import('./views/ColumnDetail.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('./views/CreatePost.vue'),
      meta: { requiredLogin: true }
    }
    // {
    //   path: '/posts/:id',
    //   name: 'post',
    //   component: () => import('./views/PostDetail.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
