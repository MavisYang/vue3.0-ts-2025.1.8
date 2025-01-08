<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-15 09:47:17
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-30 09:02:22
 * @Description: 
-->
<template>
    <div class="data-montior main-padding">
        <TPSEcharts :api="getTpsData" type="list" />
        <TopList />
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import TPSEcharts from '@/views/dataMonitor/components/TPSEcharts.vue'
import TopList from './modules/TopList.vue'
import { getTpsData } from '@/api/modules/hotspot'
const title = ref('title1')
// 向后代组件提供数据, 只要是后代都能接收
provide('name', title.value)
</script>

<style lang="scss" scoped>
$chartH: 320px;
.motior-tps-chart {
    width: 100%;
    height: $chartH;
}
.monitor-top-list {
    width: 100%;
    height: calc(100% - $chartH);
}
</style>
