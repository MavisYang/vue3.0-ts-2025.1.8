<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-15 09:38:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2025-03-20 20:41:23
 * @Description: 
-->

<template>
    <div class="main-padding">
        <div>
            <el-button type="primary" @click="handleAdd">+新增表单</el-button>
        </div>
        <el-form ref="formRef" :model="form">
            <div v-for="(item, index) in form.data" :key="index" class="form-view">
                <el-form-item
                    :label="`姓名-${index}`"
                    :prop="`data.${index}.name`"
                    :rules="rules.name"
                    label-width="80px"
                >
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="年龄" :prop="`data.${index}.age`" :rules="rules.age" label-width="80px">
                    <el-input v-model="item.age"></el-input>
                </el-form-item>
                <el-form-item label="是否开关" :prop="`data.${index}.isSwitch`" label-width="80px">
                    <el-switch v-model="item.isSwitch" @change="(e) => handleSwitch(e, index)"></el-switch>
                </el-form-item>
                <template v-if="item.isSwitch">
                    <div class="map-box" v-for="(mm, ii) in form.data[index].mapList">
                        <el-form-item label="mapKey" :prop="`data.${index}.mapList.${ii}.mapKey`" :rules="rules.mapKey">
                            <el-input v-model="mm.mapKey"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="mapValue"
                            :prop="`data.${index}.mapList.${ii}.mapValue`"
                            :rules="rules.mapValue"
                        >
                            <el-input v-model="mm.mapValue"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-icon
                                color="#409efc"
                                style="margin-left: 12px; margin-right: 6px"
                                :size="24"
                                @click="handleDeleteMap(index, ii)"
                                ><Remove
                            /></el-icon>
                            <el-icon
                                v-show="form.data[index].mapList.length - 1 === ii"
                                color="#409efc"
                                :size="24"
                                @click="handleAddMap(index)"
                                ><CirclePlus
                            /></el-icon>
                        </el-form-item>
                    </div>
                </template>
                <span class="form-delete-icon">
                    <el-icon color="#F56C6C" :size="24" @click="handleDelete(index)"><DeleteFilled /></el-icon>
                </span>
            </div>
        </el-form>
        <div v-if="form.data.length > 0">
            <el-button @click="submitForm(formRef)">submit</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { FormInstance, FormRules, ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    mapKey: [{ required: true, message: '请输入mapkey', trigger: 'blur' }],
    mapValue: [{ required: true, message: '请输入mapValue', trigger: 'blur' }],
})
const form = reactive<any>({
    data: [],
})
const handleAdd = () => {
    form.data.push({
        name: '',
        age: '',
        mapList: [],
    })
}
const handleDelete = (index: number) => {
    form.data.splice(index, 1)
}

const handleAddMap = (index: number) => {
    form.data[index].mapList.push({
        mapKey: '',
        mapValue: '',
    })
}

const handleDeleteMap = (index: number, ii: number) => {
    if (form.data[index].mapList.length === 1) {
        ElMessage.error('至少保留一个map')
        return
    }
    form.data[index].mapList.splice(ii, 1)
}
const handleSwitch = (e: any, index: number) => {
    console.log(e, '==')
    if (e) {
        handleAddMap(index)
    } else {
        form.data[index].mapList = []
    }
}

const submitForm = async (formEl: FormInstance | undefined) => {
    console.log(formRef, 'formRef==')
    console.log(form.data, 'form.data==')

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 判断字段路径和字段 key 值是否有重复
            const hasRepeat = hasDuplicate()
            let hasRepeatMsg =
                (hasRepeat.hasDuplicatePaths ? '【字段路径】：' : '') +
                (hasRepeat.hasDuplicateKeys ? '【字段 key 值】：' : '') +
                (hasRepeat.hasDuplicateMapKeys ? '【映射转换原值】：' : '')
            if (hasRepeatMsg) {
                ElMessage.warning('存在数据重复')
            }
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}
//判断重复
const hasDuplicate = () => {
    const dataList = JSON.parse(JSON.stringify(form.data))
    const paths = dataList.map((item) => item.name)
    const keys = dataList.map((item) => item.age)
    const mapKeys = dataList
        .filter((v) => v.isSwitch)
        .map((item) => item.switchMap)
        .flat()
        .map((v) => v.mapKey)

    console.log(mapKeys, 'mapKeys==1122223')
    const hasDuplicatePaths = new Set(paths).size !== paths.length
    const hasDuplicateKeys = new Set(keys).size !== keys.length
    const hasDuplicateMapKeys = new Set(mapKeys).size !== mapKeys.length
    console.log(hasDuplicatePaths, hasDuplicateKeys, hasDuplicateMapKeys)

    return {
        hasDuplicatePaths,
        hasDuplicateKeys,
        hasDuplicateMapKeys,
    }
}
</script>

<style lang="scss">
.form-view {
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 20px;
    margin: 10px 0;
    position: relative;
    .form-delete-icon {
        position: absolute;
        right: -10px;
        top: -10px;
        cursor: pointer;
    }
}
.map-box {
    display: flex;
    align-items: center;
    padding-left: 80px;
    svg {
        cursor: pointer;
    }
}
</style>
