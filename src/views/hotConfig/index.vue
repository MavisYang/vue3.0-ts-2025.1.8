<template>
    <div class="hot-config main-padding">
        <SearchForm :search="search" :reset="reset" :columns="columns" :search-param="searchParam" />

        <div class="card">
            <div class="tableToolContainer">
                <el-button type="primary" @click="handleShowModal(true, {})">新增{{ topTitle }}</el-button>
            </div>

            <TableColumns rowKey="resourceId" :tableData="tableData" :columns="columns" :isPageable="false">
                <template #operation>
                    <el-table-column label="操作" fixed="right" align="center" width="120px">
                        <template #default="{ row }">
                            <span class="operation edit" @click="() => handleShowModal(true, row, 'edit')">编辑</span>
                            <span class="operation delete" @click="() => handleDelete(row)">删除</span>
                        </template>
                    </el-table-column>
                </template>
            </TableColumns>
        </div>

        <ConfigAddDialog
            v-if="editData.visible"
            :visible="editData.visible"
            :form-data="editData.data"
            :title="`${editData.type === 'add' ? '新增' : '编辑'}`"
            :type="editData.type"
            :on-confirm="handleConfirmAdd"
            :on-cancel="handleCancelAdd"
        />
    </div>
</template>

<script setup lang="tsx">
import { reactive, onMounted } from 'vue'
import SearchForm from '@/components/SearchForm/index.vue'
import TableColumns from '@/components/TableColumns/index.vue'
import ConfigAddDialog from './modules/add.vue'
import { ElMessage } from 'element-plus'
import { useConfirm } from '@/utils/eleMessage'
import { sliceTime } from '@/utils'
import { CONFIG_STATUS, CONFIG_MODE_TYPE } from './enums'
import { getHotConfigListApi, addHotConfigApi, updateHotConfigApi, deleteHotConfigApi } from '@/api/modules/hotspot'
import { SearchDataProps, EditDataProps, StatusType } from './interface'
import { ColumnProps } from '@/components/TableColumns/interface'
import { splitItemKeys, initConfigEdit } from './enums'
import { useTable } from '@/hooks/useTable'

const topTitle = '热点识别扫描配置' //1.热点识别扫描
//没有热点限额类型了，TASK_TYPE的意思'热点任务类型 1.热点识别扫描3.热点历史数据清理',和之前不一样了

const initSearch: SearchDataProps = {
    taskType: '1', //热点识别扫描
}

const { tableData, searchParam, getTableList, search, reset } = useTable(getHotConfigListApi, initSearch, false)

onMounted(() => {
    getTableList()
})

const columns = reactive<ColumnProps<any>[]>([
    { label: '序号', type: 'index', width: 60 },
    {
        label: '监控状态',
        prop: 'useStatus',
        type: 'enum',
        enum: CONFIG_STATUS,
        width: 100,
        search: { el: 'select', props: { filterable: false } },
        fieldNames: { label: 'dictName', value: 'dictCode' },
    },
    {
        label: '热点模式',
        prop: 'hotspotModeType',
        type: 'enum',
        enum: CONFIG_MODE_TYPE,
        width: 100,
        search: { el: 'select', props: { filterable: false } },
        fieldNames: { label: 'dictName', value: 'dictCode' },
    },
    {
        label: '统计频率',
        prop: 'hotFre',
        width: 100,
    },
    {
        label: '持续时间',
        prop: 'hotTime',
        width: 100,
    },
    {
        label: '失效时间',
        prop: 'hotFailuretime',
        width: 100,
    },
    {
        label: '取消统计频率',
        prop: 'cancelhotFre',
        width: 110,
    },
    {
        label: '取消持续时间',
        prop: 'cancelhotTime',
        width: 110,
    },
    {
        label: '取消失效时间',
        prop: 'cancelhotFailuretime',
        width: 110,
    },
    {
        label: '监控数量',
        prop: 'hotValue',
        width: 100,
    },
    {
        label: '取消监控数量',
        prop: 'cancelhotValue',
        width: 110,
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: 140,
        render: ({ row }) => sliceTime(row.createTime),
    },
    {
        label: '更新时间',
        prop: 'updateTime',
        width: 140,
        render: ({ row }) => sliceTime(row.updateTime),
    },
])

//新增编辑
const editData = reactive<EditDataProps>({
    visible: false,
    data: {},
    type: 'add',
})

//======方法部分=======
//现实淫隐藏--新增编辑弹框
const handleShowModal = (visible: boolean = true, data: any = {}, type: StatusType = 'add') => {
    editData.visible = visible
    editData.type = type
    editData.data = visible ? { ...initConfigEdit, taskType: '1', ...data } : {} //新增taskType：1 必传
    regroupItemFn()
}
const handleHideModal = () => {
    editData.visible = false
    editData.type = 'add'
    editData.data = {}
}
//确定新增
const handleConfirmAdd = async (data: {}) => {
    // //提取提交的数据
    // console.log(data, "data=====新增数据");
    const paramsData: any = dataConcatFn(data)

    let fn = editData.type === 'add' ? addHotConfigApi : updateHotConfigApi

    fn(paramsData).then(() => {
        ElMessage.success(`${editData.type === 'add' ? '新增' : '编辑'}成功`)
        handleHideModal()
        getTableList()
    })
}
//取消新增/编辑
const handleCancelAdd = () => {
    handleHideModal()
}

//确定删除
const handleDelete = (val) => {
    useConfirm(
        '提示',
        '确定删除该热点资源监控配置吗？',
        () => {
            //确定 接口请求
            const params = {
                taskType: val.taskType,
                useStatus: val.useStatus,
            }
            deleteHotConfigApi(params)
                .then(() => {
                    getTableList()
                    ElMessage.success('删除成功')
                    handleHideModal()
                })
                .catch((req) => {
                    console.error(req, '失败')
                    ElMessage.error(req)
                })
        },
        () => {
            handleHideModal()
        },
    )
}

//拆分字段
function regroupItemFn() {
    let newObj = {}
    for (let [key, value] of Object.entries(editData.data)) {
        newObj = {
            ...newObj,
            [key]: value,
        }
        if (splitItemKeys.includes(key)) {
            newObj = {
                ...newObj,
                ...dataSplitFn(key, value),
            }
        }
    }
    editData.data = newObj
    return newObj
}

function dataSplitFn(name: String, val: any) {
    const item = {
        [`${name}_value`]: val ? val.slice(0, -2) : '',
        [`${name}_unit`]: val ? val.slice(-2).toLocaleLowerCase() : 'ss', //初始化选择
    }
    return item
}
// 合并字段
function dataConcatFn(data: {}) {
    let newObj = {}
    for (let [key, value] of Object.entries(data)) {
        newObj = {
            ...newObj,
            [key]: value,
        }
        splitItemKeys.map((v) => {
            if (key.includes(v)) {
                newObj = {
                    ...newObj,
                    [v]: `${data[`${v}_value`] || ''}${data[`${v}_unit`]}`,
                }
                delete newObj[`${v}_value`]
                delete newObj[`${v}_unit`]
            }
        })
    }
    return newObj
}
</script>
