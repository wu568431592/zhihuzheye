import { ref, Ref, onMounted, onUnmounted } from 'vue'

export default function useClickOutside (elementRef: Ref<null | HTMLElement>) {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    console.log('click', elementRef.value)
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}
