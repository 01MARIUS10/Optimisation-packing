import { ref } from 'vue'

const conteneurLength = ref(800)

export function useConteneur() {
  return { conteneurLength }
}
