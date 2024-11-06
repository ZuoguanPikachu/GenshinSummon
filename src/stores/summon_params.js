import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useSummonParamsStore = defineStore('summonParams', () => {

  const itemNum = ref(1)
  const cumulativeN = ref(0)
  const isUpPity = ref("0")

  return { itemNum, cumulativeN, isUpPity }
})
