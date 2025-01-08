<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-27 09:29:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-26 17:14:44
 * @Description: 
-->
<template>
    <div class="motior-tps-chart card mb-10" :class="className">
        <div class="flx-justify-between">
            <Title title="热点TPS" />
            <div class="tps-motior-search flx-align-center">
                <el-date-picker
                    v-model="date"
                    type="date"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    :shortcuts="shortcuts"
                    :clearable="false"
                    style="width: 160px; margin-right: 8px"
                    @change="handleChange"
                />
                <el-select v-model="selectType" placeholder="请选择" @change="handleChange" style="width: 80px">
                    <el-option
                        v-for="item in DATE_TIME_TYPE"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                    />
                </el-select>
            </div>
        </div>
        <div class="tps-motior-chart" v-loading="loading">
            <HotTpsChart :echartData="echartData" color="#FFA600" gradientColors="rgba(254, 219, 101,0.1)" />
        </div>
    </div>
</template>

<script setup lang="ts" name="TPSEcharts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import Title from '@/views/dataMonitor/components/Title.vue'
import HotTpsChart from '@/views/dataMonitor/components/HotTpsChart.vue'
import { DATE_TIME_TYPE } from '@/views/dataMonitor/enums'
import moment from 'moment'

interface PropsType {
    api: (params: any) => Promise<any>
    className?: string
    params?: any
    type?: string
}
const props = withDefaults(defineProps<PropsType>(), {
    params: {},
    type: 'details',
})
const shortcuts = [
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '一周前',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        },
    },
]

const loading = ref(false)
const echartData = reactive({
    xData: [],
    yData: [],
})

const date = ref(moment().format('YYYY-MM-DD'))
const selectType = ref(2) //1表示时，2表示分，3表示秒
const setInterDelay = {
    3: {
        time: 1000,
        func: (val: string) => moment(val).format('HH:mm:ss'),
        name: '每秒',
        format: 'HH:mm:ss',
    },
    2: {
        time: 60 * 1000,
        func: (val: string) => moment(val).format('HH:mm'),
        name: '每分',
        format: 'HH:mm',
    },
    1: {
        time: 60 * 60 * 1000,
        func: (val: string) => moment(val).format('HH'),
        name: '每时',
        format: 'HH',
    },
}

// 定时器轮询
const timer = ref<any>(null)

watch(
    () => props.params,
    (newVal) => {
        if (Object.keys(newVal).length > 0) setInterGetData()
    },
    { deep: true },
)
onMounted(() => {
    console.log('挂载了')
    if (props.type !== 'details') setInterGetData()
})
onUnmounted(() => {
    console.log('卸载了')
    window.clearInterval(timer.value)
})

const setInterGetData = () => {
    window.clearInterval(timer.value)
    loading.value = true
    generateData() //初始化数据
    if (moment().format('YYYY-MM-DD') === date.value) {
        getItervalData() //定时数据
    }
}

// 过去时间不轮询
const getItervalData = () => {
    timer.value = window.setInterval(() => {
        setTimeout(() => {
            generateData()
        }, 0)
    }, setInterDelay[selectType.value].time)
}

const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}

const handleChange = () => {
    echartData.xData = []
    echartData.yData = []
    setInterGetData()
}

//获取全是数据
const generateData = async () => {
    const timeType = selectType.value
    const { func } = setInterDelay[timeType]

    const timeArray = returnTimeAry(),
        currentDay = date.value !== moment().format('YYYY-MM-DD') //是否是当天时间 true 否 false 是
    let nowTime: string = date.value + ' ' + func(new Date()), //当前时间
        newTimeArray: any = []

    if (currentDay) {
        newTimeArray = timeArray
    } else {
        const index = timeArray.findIndex((v: string) => v === nowTime)
        newTimeArray = timeArray.slice(0, index)
    }
    console.log(nowTime, 'nowTime')

    const paramsData = {
        date: nowTime,
        timeType,
        ...props.params,
    }

    // console.log(paramsData, 'paramsData')

    const { data } = await props.api(paramsData)
    const xData: any = []
    const yData: any = []

    // console.log(data, 'data')

    newTimeArray.forEach((v: string) => {
        const find = data.find((item: any) => item.time === v)
        xData.push(func(v))
        yData.push(find ? find.tps : 0)
    })

    echartData.xData = []
    echartData.xData = xData
    echartData.yData = []
    echartData.yData = yData
    loading.value = false

    // console.log(currentTime, echartData.xData[echartData.xData.length - 1])
}
//获取一天时间全部数组，截取到当前时间，生成新的数据，后续根据接口返回数据，有值取值无值返回0
const returnTimeAry = () => {
    const { time, func } = setInterDelay[selectType.value]
    let startDate = date.value + ' 00:00:00', //开始时间
        endDate = date.value + ' 23:59:59', //结束时间
        countTimeCha = new Date(startDate).getTime() - new Date(endDate).getTime(), //开始时间和结束时间毫秒差
        countDelay = Math.abs(countTimeCha / time).toFixed() //根据秒分时，确定x轴的时间长度

    const count = selectType.value === 3 ? Number(countDelay) + 1 : Number(countDelay) //获取一天的全部时间
    // count = 86400 秒
    // count = 1440 分
    // count = 24 时
    // console.log(count, 'returnTimeAry=count')

    let timeDelay = +new Date(startDate),
        categoryData: any = []

    for (let i = 0; i < count; i++) {
        categoryData.push(date.value + ' ' + func(timeDelay))
        timeDelay += time
    }
    return categoryData
}
</script>

<style scoped lang="scss">
.motior-tps-chart {
    flex: 1 1 auto;
    height: 100%;
}
.tps-motior-chart {
    width: 100%;
    height: calc(100% - 32px);
}
</style>
