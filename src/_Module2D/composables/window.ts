import { ref } from 'vue'

const windowWidth = ref(800)
const windowHeight = ref(600)

export function useWindow() {
  return { windowWidth, windowHeight }
}
