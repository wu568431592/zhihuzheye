<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loading v-if="isLoading" text="拼命加载中..." background="rgba(0,0,0,0.5)"></loading>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 知乎者也</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Loading from './components/Loading.vue'
import createMessage from './components/createMessage'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loading
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { message, status } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>

</style>
