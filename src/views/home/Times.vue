<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-15 09:38:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2025-03-20 20:12:29
 * @Description: 
-->

<template>
    <ul class="title">
        <li class="flx-align-center">
            {{ helloWords }}
            <SvgIcon name="#smile" size="40px" color="#e6a23c" :iconStyle="{ marginLeft: '-2px' }" />
        </li>
    </ul>
    <AddForm />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import SvgIcon from '@/components/SvgIcon/index.vue'

const helloWords = ref()

onMounted(() => {
    times()
})
const times = () => {
    let dayjs_ = dayjs().hour()
    let words = ''
    dayjs_ < 7
        ? (words = '现在是凌晨')
        : dayjs_ < 9
        ? (words = '早上好!')
        : dayjs_ < 12
        ? (words = '上午好！')
        : dayjs_ < 14
        ? (words = '中午好！')
        : dayjs_ < 17
        ? (words = '下午好！')
        : dayjs_ < 18
        ? (words = '下午好!')
        : dayjs_ < 23
        ? (words = '晚上好！')
        : dayjs_ == 24
        ? (words = '夜已深！')
        : ''

    helloWords.value = words
}
</script>

<style lang="scss">
.welPage {
    width: 100%;
    height: 100%;
    & > div {
        width: 100%;
        height: 100%;
    }

    .title {
        color: #666;
        padding-top: 32px;

        @media (max-width: 1367px) {
            padding-left: 30px;
            font-size: 20px;
        }
        @media (min-width: 1367px) and (max-width: 1921px) {
            padding-left: 40px;
            font-size: 25px;
        }
        @media (min-width: 1921px) {
            padding-left: 40px;
            font-size: 26px;
        }
    }
    .welWord {
        margin-left: 6px;
    }
    .block {
        width: 100%;
        display: flex;
        color: #1d70f5;
        margin: 60px 0;

        .item {
            width: calc(100% / 4);
            min-width: 150px;
            height: 380px;
            margin: 0 2%;
            border-radius: 8px;
            border: 1px solid #d1d3f0;
            background-color: #fff;
            box-shadow: 0 12px 10px -10px rgba(0, 0, 0, 0.1), 0 -12px 10px -10px rgba(0, 0, 0, 0.1),
                12px 0 10px -10px rgba(0, 0, 0, 0.1), -12px 0 10px -10px rgba(0, 0, 0, 0.1);

            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .symbol {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 30px auto;
            background-color: #f2f2f2;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
        }
        .text {
            font-size: 30px;
            margin: 30px 32px;
            text-align: center;
            @media (max-width: 1367px) {
                font-size: 20px;
            }
            @media (min-width: 1367px) and (max-width: 1921px) {
                font-size: 28px;
            }
            @media (min-width: 1921px) {
                font-size: 30px;
            }
        }
    }
}
</style>
