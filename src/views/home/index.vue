<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-15 09:38:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2025-03-24 17:02:05
 * @Description: 
-->

<template>
    <div class="welPage main-padding">
        <div class="card">
            <!-- <Times /> -->
            <!-- <AddForm /> -->
            <!-- <AddForm2 /> -->
            <keep-alive>
                <!-- <AddForm3 /> -->
            </keep-alive>
            <AddForm4 />
        </div>
    </div>
</template>

<script setup lang="ts">
import Times from './Times.vue'
import AddForm from './AddForm.vue'
import AddForm2 from './AddForm2.vue'
import AddForm3 from './AddForm3.vue'
import AddForm4 from './AddForm4.vue'
</script>

<style lang="scss">
.welPage {
    width: 100%;
    height: 100%;
    & > div {
        width: 100%;
        height: 100%;
    }
}
</style>
