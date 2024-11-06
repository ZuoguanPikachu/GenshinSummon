<template>
  <div class="container">
    <div class="form">
      <tiny-form label-position="top" label-width="150px">
        <tiny-form-item label="角色个数">
          <tiny-numeric v-model="itemNum" max="14" min="1"></tiny-numeric>
        </tiny-form-item>

        <tiny-form-item label="已垫抽数">
          <tiny-numeric v-model="cumulativeN" max="89" min="0"></tiny-numeric>
        </tiny-form-item>

        <tiny-form-item label="大保底">
          <tiny-radio v-model="isUpPity" label="0" text="非大保底"></tiny-radio>
          <tiny-radio v-model="isUpPity" label="1" text="大保底"></tiny-radio>
        </tiny-form-item>

        <tiny-form-item class="item-center">
          <tiny-button type="primary" @click="router.push('chart')"> 计算概率 </tiny-button>
        </tiny-form-item>
      </tiny-form>
    </div>
  </div>
</template>

<script setup>
import {
  TinyForm,
  TinyFormItem,
  TinyNumeric,
  TinyButton,
  TinyRadio
} from '@opentiny/vue'
import { storeToRefs } from 'pinia'
import { useSummonParamsStore } from '../stores/summon_params'
import { useRouter } from 'vue-router'

const { itemNum, cumulativeN, isUpPity } = storeToRefs(useSummonParamsStore())
const router = useRouter()
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("https://zuoguan-piclib-1257172707.cos.ap-guangzhou.myqcloud.com/assets/15.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .form {
    max-width: 300px;
    /* border: 2px solid #000; */
    border-radius: 1rem;
    padding: 2rem 3rem 1rem 3rem;
    background: rgba(255, 255, 255, .7);
    backdrop-filter: blur(7px);
    box-shadow: 5px 5px 10px 5px rgba(5, 5, 5, .5);
  }

  .item-center{
    display: flex;
    justify-content: center;
  }
</style>
