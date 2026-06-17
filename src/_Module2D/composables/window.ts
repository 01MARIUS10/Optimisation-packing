import { ref } from 'vue'
import { containerWidth, containerHeight } from '../mock/data'
const windowWidth = ref(containerWidth)
const windowHeight = ref(containerHeight)

export function useWindow() {
  return { windowWidth, windowHeight }
}
