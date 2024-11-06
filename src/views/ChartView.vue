<template>
  <v-chart class="chart" :option="option" />
  <div class="back-btn">
    <tiny-button type="primary" @click="router.back()"> 返回 </tiny-button>
  </div>
</template>

<script setup>
import VChart from "vue-echarts"
import { up5StarCharacterDist } from "../dist_calculator"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart } from "echarts/charts"
import { TinyButton } from '@opentiny/vue'
import { ref } from "vue"
import { useSummonParamsStore } from '../stores/summon_params'
import { range } from "lodash"
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import {
  TooltipComponent,
  TitleComponent,
  GridComponent
} from "echarts/components"


use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  TooltipComponent,
])

const { itemNum, cumulativeN, isUpPity } = storeToRefs(useSummonParamsStore())
const router = useRouter()

var dist = up5StarCharacterDist(itemNum.value, cumulativeN.value, isUpPity.value == "1")
var probs = dist.probs.tolist()
var cumulative_probs = dist.cumulative_probs.tolist()
var states = range(1, probs.length + 1)

const option = ref({
  title: [
    {
      text: "所需抽数分布",
      left: "center"
    },
    {
      top: '55%',
      left: 'center',
      text: '累积分布函数'
    }
  ],
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => (value*100).toFixed(4) + "%"
  },
  xAxis: [
    {
      data: states,
      axisTick: {
        show: false,
      }
    },
    {
      data: states,
      gridIndex: 1
    }
  ],
  yAxis: [
    {},
    {gridIndex: 1}
  ],
  grid: [
    {bottom: '60%'},
    {top: '60%'}
  ],
  series: [
    {
      data: probs,
      type: 'line',
      smooth: true,
      areaStyle: {},
      showSymbol: false,
    },
    {
      data: cumulative_probs,
      type: 'line',
      smooth: true,
      areaStyle: {},
      showSymbol: false,
      xAxisIndex: 1,
      yAxisIndex: 1,
    }
  ]
})
</script>

<style scoped>
.chart {
  height: calc(100vh - 64px);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>