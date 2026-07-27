<template>
    <div>
        ----------AddForm4.vue------
        <!-- 显示树形结构 -->
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        <!-- 选择新增位置 -->
        <select v-model="addPosition">
            <option value="sibling">同级</option>
            <option value="child">下一级</option>
        </select>
        <!-- 选择父节点 -->
        <select v-model="parentAttributePath">
            <option v-for="item in data" :key="item.attributePath" :value="item.attributePath">
                {{ item.attributePath }}
            </option>
        </select>
        <!-- 输入框，用于输入新节点的 attributePath -->
        <input v-model="newAttributePath" placeholder="请输入新节点的 attributePath" />
        <!-- 输入框，用于输入新节点的 freemarkerkey -->
        <input v-model="newFreemarkerkey" placeholder="请输入新节点的 freemarkerkey" />
        <!-- 选择节点类型 -->
        <select v-model="newType">
            <option value="1">普通</option>
            <option value="2">list</option>
        </select>

        <!-- 点击按钮触发新增节点操作 -->
        <button @click="addNode">新增节点</button>
        <!-- 点击按钮触发转换为 XML 的操作 -->
        <button @click="jsonToXml">转换为 XML</button>
        <!-- 显示生成的 XML 结果 -->
        <pre v-if="xmlResult">{{ xmlResult }}</pre>
        <div style="margin-bottom: 100px"></div>

        <!-- <?xml version="1.0" encoding="UTF-8"?>
        <Head>
            <S1>Head_S1</S1>
        </Head>
        <Body>
            <AdjAmt>Body_AdjAmt</AdjAmt>
            <AccFileArry>
                <#if Body_AccFileArry ??&& (Body_AccFileArry?size>0)>
                    <#list item.AdeMsgArry as item>
                        <#if item.AdeMsgArry ??&& (item.AdeMsgArry?size>0)>
                            <#list item.AdeMsgArry as item1>
                                <sdo>
                                    <IdNum>${item1.EqmtFpno}</IdNum>
                                </sdo>
                            <#list>
                         </#if>
                    <#list>
                </#if>
            </AccFileArry>
        </Body> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 初始数据
// const data = ref([
//     { attributePath: 'Head.S1', freemarkerkey: 'Head_S1', type: '1' },
//     { attributePath: 'Head2.S2', freemarkerkey: 'Head_S2', type: '1' },
//     { attributePath: 'Body.S2.S21', freemarkerkey: 'Body.S2.S21', type: '2' },
// ])
const data = ref([
    {
        attributePath: 'Head.S1.S11.S111',
        freemarkerkey: 'Head_S1',
        type: '1',
        // pathArry: ['Head', 'S1', 'S11', 'S111']
    },
    {
        attributePath: 'Body.AdjAmt',
        freemarkerkey: 'Body_AdjAmt',
        type: '1',
        //  pathArry: ['Body', 'AdjAmt']
    },
    // {
    //     attributePath: 'Body.AdjAmt.AA',
    //     freemarkerkey: 'Body_AdjAmtAA',
    //     type: '1',
    //     //  pathArry: ['Body', 'AdjAmt'.AA]
    // },
    {
        attributePath: 'Body.AccFileArry.AdeMsgArry.EqmtFpno.SS',
        freemarkerkey: 'Body_AccFileArry',
        type: '2',
        // pathArry: ['Body', 'AccFileArry', 'AdeMsgArry', 'EqmtFpno','SS'],
    },
    {
        attributePath: 'A.B',
        freemarkerkey: 'C',
        type: '2',
        // pathArry: ['Body', 'AccFileArry', 'AdeMsgArry', 'EqmtFpno','SS'],
    },
])

// 存储新节点的 attributePath
const newAttributePath = ref('')
// 存储新节点的 freemarkerkey
const newFreemarkerkey = ref('')
// 存储新节点的类型
const newType = ref('1')
// 存储新增位置（同级或下一级）
const addPosition = ref('sibling')
// 存储父节点的 attributePath
const parentAttributePath = ref('')
// 存储生成的 XML 结果
const xmlResult = ref('')

// 新增节点的方法
const addNode = () => {
    if (!newAttributePath.value || !newFreemarkerkey.value) return
    let newNode = {
        attributePath: newAttributePath.value,
        freemarkerkey: newFreemarkerkey.value,
        type: newType.value,
    }
    // if (parentAttributePath.value) {
    //     // 新增下一级节点 parentAttributePath 有值
    //     newNode.attributePath = parentAttributePath.value + '.' + newAttributePath.value
    //     data.value.push(newNode)
    // } else {
    //     // 新增同级节点
    //     const parentIndex = data.value.findIndex((item) => item.attributePath === parentAttributePath.value)
    //     console.log(parentIndex, 'parentIndex==')

    //     if (parentIndex > -1) {
    //         data.value.splice(parentIndex + 1, 0, newNode)
    //     } else {
    //         data.value.push(newNode)
    //     }
    // }

    if (addPosition.value === 'sibling') {
        // 新增同级节点 最后一个替换掉
        const parentIndex = data.value.findIndex((item) => item.attributePath === parentAttributePath.value)
        console.log(parentIndex, 'parentIndex==')

        if (parentIndex > -1) {
            data.value.splice(parentIndex + 1, 0, newNode)
        }
    } else {
        // 新增下一级节点
        // 这里可以根据实际需求进一步完善逻辑，比如构建更复杂的树形结构
        data.value.push(newNode)
    }

    // 清空输入框
    newAttributePath.value = ''
    newFreemarkerkey.value = ''
}
function jsonToXml() {
    const root = {}
    const jsonData = data.value

    // 处理每个 JSON 对象
    jsonData.forEach((item) => {
        // console.log(root, 'root')

        let current = root

        const { attributePath, freemarkerkey, type } = item

        const pathArry = attributePath.split('.')
        pathArry.forEach((tag, index) => {
            if (!current[tag]) {
                current[tag] = {}
            }

            if (index === pathArry.length - 1) {
                current[tag].value = freemarkerkey
            }
            current[tag].index = index
            current[tag].type = type + '&' + attributePath + '&' + freemarkerkey
            current = current[tag]
        })
    })

    function buildXml(obj, tag, path = '') {
        let xml = ''

        if (tag) {
            const typeAndPath = obj.type.split('&'),
                type = typeAndPath[0],
                attributePath = typeAndPath[1],
                freemarkerkey = typeAndPath[2]

            const item = jsonData.find((item) => item.attributePath === attributePath)
            const pathArry = item.attributePath.split('.')
            console.log(pathArry.length, obj.index, 'pathArry.length')

            if (type === '2' && pathArry.length > 2) {
                // if (obj.index === 1) {
                //     xml += `\n<${tag}>\n`
                //     xml += `<#if ${freemarkerkey}??&&(${freemarkerkey}?.size>0)>\n
                //     <#list ${freemarkerkey} as item${obj.index}>\n`
                // } else if (pathArry.length - 1 === obj.index) {
                //     //最后一级
                //     xml += '<sdo>\n<IdNum>\n' + '${item' + (pathArry.length - 2) + '.' + tag + '!}\n'
                // } else {
                //     xml += `   <#if item.${tag}??&&(item.${tag}?.size>0)>\n
                //     <#list item .${tag} as item${obj.index - 1}>\n`
                // }
                if (obj.index === 1) {
                    xml += `\n<${tag}>\n`
                    xml += `<#if ${freemarkerkey}??&&(${freemarkerkey}?.size>0)>\n
                    <#list ${freemarkerkey} as item>\n
                    `
                } else if (obj.index === 2) {
                    xml += `<#if item.${tag} as item${obj.index - 1}>\n`
                } else if (obj.index === 3) {
                    xml += '<sdo><IdNum>' + '${item' + (obj.index - 2) + '.' + tag + '!}'
                } else {
                    xml += `\n<${tag}>`
                }
            } else {
                xml += `\n<${tag}>`
            }
        }
        if (obj.value) {
            xml += '${' + obj.value + '}'
        }

        for (const key in obj) {
            if (key !== 'value' && key !== 'type' && key !== 'index') {
                // console.log(key, obj[key], 'obj[key]')
                // const newPath = path ? `${path}.${key}` : key
                const newPath = key
                xml += buildXml(obj[key], key, newPath)
            }
        }
        if (tag) {
            const typeAndPath = obj.type.split('&'),
                type = typeAndPath[0],
                attributePath = typeAndPath[1]

            const item = jsonData.find((item) => item.attributePath === attributePath)
            if (type === '2' && item.attributePath.split('.').length > 2) {
                if (obj.index === 1) {
                    xml += `\n</${tag}>\n`
                    xml += `</#if>
                    </#list>`
                } else if (obj.index === 2) {
                    xml += `</#list>`
                } else if (obj.index === 3) {
                    xml += '</sdo></IdNum>'
                } else {
                    xml += `\n<${tag}>`
                }
            } else {
                xml += `</${tag}>`
            }
        }
        return xml
    }

    function buildListXml(obj, xml, attributePath) {
        const tag = obj.tag
        const newPath = attributePath.replace(/\./g, '_')
        xml += `<#list ${newPath} as ${tag}>`
        return xml
    }

    function buildIfXml(obj, xml, attributePath) {
        const tag = obj.tag
        const newPath = attributePath.replace(/\./g, '_')
    }

    console.log(root, 'root')
    const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>' + buildXml(root, '', '')
    xmlResult.value = xmlOutput

    return xmlOutput
}
// function jsonToXml() {
//     const root = {}
//     const jsonData = data.value

//     // 处理每个 JSON 对象
//     jsonData.forEach((item) => {
//         let current = root
//         const { attributePath, freemarkerkey, type } = item
//         const pathArry = attributePath.split('.')
//         pathArry.forEach((tag, index) => {
//             if (!current[tag]) {
//                 current[tag] = {}
//             }
//             if (index === 0) {
//                 current[tag].type = type
//             }
//             if (index === pathArry.length - 1) {
//                 current[tag].value = freemarkerkey
//             }
//             current = current[tag]
//         })
//     })

//     console.log(root, 'root')

//     function buildXml(obj, tag) {
//         let xml = ''
//         if (tag) {
//             xml += `\n<${tag}>`
//         }
//         if (obj.value) {
//             xml += obj.value
//         }
//         for (const key in obj) {
//             console.log(key, obj[key], 'obj[key]')

//             if (key !== 'value') {
//                 xml += buildXml(obj[key], key)
//             }
//         }
//         if (tag) {
//             xml += `</${tag}>\n`
//         }
//         return xml
//     }

//     const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>' + buildXml(root, '')
//     xmlResult.value = xmlOutput
//     return xmlOutput
// }
</script>
