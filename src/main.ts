import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8081/api/'
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(res => {
  store.commit('setLoading', false)
  return res
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
