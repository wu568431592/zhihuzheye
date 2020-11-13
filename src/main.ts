import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
axios.defaults.baseURL = 'http://localhost:8081/api/'
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', {
    status: false,
    message: ''
  })
  return config
})
axios.interceptors.response.use(res => {
  store.commit('setLoading', false)
  return res
}, e => {
  const { error } = e.response.data
  store.commit('setError', {
    status: true,
    message: error
  })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
