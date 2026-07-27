<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-15 09:38:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2025-03-24 10:35:27
 * @Description: 
-->
<template>
    <div>
        <h1>输入数据并转换为 XML</h1>
        <form @submit.prevent="handleSubmit">
            <label for="name">名称:</label>
            <input type="text" id="name" v-model="item.name" required /><br />
            <label for="type">类型:</label>
            <select id="type" v-model="item.type">
                <option value="normal">普通类型</option>
                <option value="list">列表类型</option></select
            ><br />
            <label for="value">值:</label>
            <input type="text" id="value" v-model="item.value" v-if="item.type === 'normal'" required /><br />
            <input type="text" v-model="newListItem" placeholder="输入列表项" @keyup.enter="addListItem" />
            <button @click="addListItem">添加列表项</button>
            <ul>
                <li v-for="(listItem, index) in item.listValues" :key="index">{{ listItem }}</li>
            </ul>
            <button type="submit" @click="handleSubmit">提交</button>
        </form>
        <a :href="downloadUrl" :download="downloadFilename" v-if="downloadUrl">下载 XML</a>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 存储当前输入项
const item = ref({
    name: '',
    type: 'normal',
    value: '',
    listValues: [],
})

// 用于临时存储新的列表项
const newListItem = ref('')

// 存储下载链接和文件名
const downloadUrl = ref('')
const downloadFilename = ref('output.xml')

// 添加列表项的方法
const addListItem = () => {
    if (newListItem.value) {
        item.value.listValues.push(newListItem.value)
        newListItem.value = ''
    }
}

// 处理表单提交的方法
const handleSubmit = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><root>'

    if (item.value.type === 'normal') {
        xml += `<${item.value.name}>${item.value.value}</${item.value.name}>`
    } else {
        xml += `<${item.value.name}>`
        item.value.listValues.forEach((listItem) => {
            xml += `<item>${listItem}</item>`
        })
        xml += `</${item.value.name}>`
    }

    xml += '</root>'

    console.log(xml, 'xml')

    const blob = new Blob([xml], { type: 'text/xml' })
    downloadUrl.value = URL.createObjectURL(blob)
}
</script>

<style scoped>
form {
    margin-bottom: 20px;
}
</style>

<!-- <template>
    <div class="main-padding">
        <div>
            <el-button type="primary" @click="handleAdd">+新增表单-2</el-button>
        </div>
        <el-form ref="formRef" :model="form" label-width="100px">
            <div v-for="(item, index) in form.data" :key="index" class="form-view">
                <el-form-item :label="`字段路径`" :prop="`data.${index}.attributePath`" :rules="rules.attributePath">
                    <el-input v-model="item.attributePath"></el-input>
                </el-form-item>
                <el-form-item label="字段key值" :prop="`data.${index}.freemarkerkey`" :rules="rules.freemarkerkey">
                    <el-input v-model="item.freemarkerkey"></el-input>
                </el-form-item>
                <el-form-item label="字段类型">
                    <el-select v-model="item.type" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <span class="form-delete-icon">
                    <el-icon color="#F56C6C" :size="24" @click="handleDelete(index)"><DeleteFilled /></el-icon>
                </span>
            </div>
        </el-form>
        <div v-if="form.data.length > 0">
            <el-button @click="submitForm(formRef)">submit-2</el-button>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { FormInstance, FormRules, ElMessage } from 'element-plus'
const formRef = ref<FormInstance>()
const form = reactive<any>({
    data: [],
})
const options = reactive([
    {
        value: '1',
        label: '普通',
    },
    {
        value: '2',
        label: 'list',
    },
])

const validator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入字段路径'))
    } else if (!value.includes('.')) {
        callback(new Error('请输入正确路径格式：Head.Xxxx或者Body.Xxxx.Ssss'))
    } else if (!/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(value)) {
        callback(new Error('请输入正确路径格式：Head.Xxxx或者Body.Xxxx.Ssss'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules>({
    attributePath: [{ required: true, validator: validator, trigger: ['blur', 'change'] }],
    freemarkerkey: [{ required: true, message: '请输入字段key值', trigger: 'blur' }],
})
const json = [
    {
        attributePath: 'Head.S1',
        freemarkerkey: 'Head_S1',
        type: '1',
        pathArry: ['Head', 'S1'],
    },
    {
        attributePath: 'Head.S2',
        freemarkerkey: 'Head_S2',
        type: '1',
        pathArry: ['Head', 'S2'],
    },
    {
        attributePath: 'Head.S2.S21',
        freemarkerkey: 'Head_S2_S21',
        type: '1',
        pathArry: ['Head', 'S2', 'S21'],
    },
    {
        attributePath: 'Head1.S2.S21',
        freemarkerkey: 'Head1_S2_S21',
        type: '1',
        pathArry: ['Head1', 'S2', 'S21'],
    },
    {
        attributePath: 'Body.B1',
        freemarkerkey: 'Body_B1',
        type: '1',
        pathArry: ['Body', 'B1'],
    },
]
onMounted(() => {
    const xmlOutput = jsonToXml(json)
    console.log(xmlOutput)
})

function jsonToXml(jsonData) {
    const root = {}

    // 处理每个 JSON 对象
    jsonData.forEach((item) => {
        let current = root
        const { pathArry, freemarkerkey } = item
        pathArry.forEach((tag, index) => {
            if (!current[tag]) {
                current[tag] = {}
            }
            if (index === pathArry.length - 1) {
                current[tag].value = freemarkerkey
            }
            current = current[tag]
        })
    })

    function buildXml(obj, tag) {
        let xml = ''
        if (tag) {
            xml += `<${tag}>`
        }
        if (obj.value) {
            xml += obj.value
        }
        for (const key in obj) {
            if (key !== 'value') {
                xml += buildXml(obj[key], key)
            }
        }
        if (tag) {
            xml += `</${tag}>`
        }
        return xml
    }

    const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>' + buildXml(root, 'root')
    return xmlOutput
}

const handleAdd = () => {
    form.data.push({
        attributePath: '',
        freemarkerkey: '',
        type: '1',
    })
}
const handleDelete = (index: number) => {
    form.data.splice(index, 1)
}

const submitForm = async (formEl: FormInstance | undefined) => {
    console.log(form.data, 'form.data==')

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 判断字段路径和字段 key 值是否有重复
            const hasRepeat = hasDuplicate()
            let hasRepeatMsg =
                (hasRepeat.hasDuplicatePaths ? '【字段路径】：' : '') +
                (hasRepeat.hasDuplicateKeys ? '【字段 key 值】：' : '')
            if (hasRepeatMsg) {
                ElMessage.warning(hasRepeatMsg + '存在数据重复')
            }
            saveDataHandle()
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const saveDataHandle = () => {
    const list = JSON.parse(JSON.stringify(form.data))
    list.map((v) => {
        v.pathArry = v.attributePath.split('.')
    })

    const list1 = list.filter((item) => item.type === '1')
    const list2 = list.filter((item) => item.type === '2')

    console.log(list, JSON.stringify(list1), JSON.stringify(list2), 'list')
}
//判断重复
const hasDuplicate = () => {
    const dataList = JSON.parse(JSON.stringify(form.data))
    const paths = dataList.map((item) => item.attributePath)
    const keys = dataList.map((item) => item.freemarkerkey)

    const hasDuplicatePaths = new Set(paths).size !== paths.length
    const hasDuplicateKeys = new Set(keys).size !== keys.length
    console.log(hasDuplicatePaths, hasDuplicateKeys)

    return {
        hasDuplicatePaths,
        hasDuplicateKeys,
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
</style> -->
