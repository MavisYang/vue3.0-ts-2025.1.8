<template>
    <div>
        <button @click="convertToXML">转换为 XML1</button>
        <button @click="convertToXML2">转换为 XML2</button>
        <!-- <button @click="convertToXMLHandle(data)">转换为 XML3</button> -->

        <!-- <pre v-if="xmlResult">{{ xmlResult }}</pre> -->
        <br />
        ------jsonToXml--
        <pre>{{ jsonToXml(data) }}</pre>
        <br />
        ------jsonToComplexXML---
        <pre>{{ jsonToComplexXML(data2) }}</pre>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const data = [
    { attributePath: 'Head.S1', freemarkerkey: 'Head_S1', type: '2' },
    { attributePath: 'Head2.S2', freemarkerkey: 'Head_S2', type: '2' },
    { attributePath: 'Body.S2.S21', freemarkerkey: 'Body_S2_S21', type: '2' },
    { attributePath: 'Body.S1', freemarkerkey: 'Body_S2_S21', type: '1' },
]

const data2 = [
    { attributePath: 'Head.S1', freemarkerkey: 'Head_S1', type: '1', pathArry: ['Head', 'S1'] },
    { attributePath: 'Body.AdjAmt', freemarkerkey: 'Body_AdjAmt', type: '1', pathArry: ['Body', 'AdjAmt'] },
    {
        attributePath: 'Body.AccFileArry.AdeMsgArry.EqmtFpno',
        freemarkerkey: 'Body_AccFileArry',
        type: '2',
        pathArry: ['Body', 'AccFileArry', 'AdeMsgArry', 'EqmtFpno'],
    },
]
const xmlResult = ref('')

const convertToXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

    data.forEach((item) => {
        const pathArray = item.attributePath.split('.')
        console.log(pathArray, 'pathArray')

        if (item.type === '1') {
            // type 为 1 转平铺 XML 格式
            let headPath = ''
            pathArray.forEach((path, index) => {
                if (pathArray.length - 1 === index) {
                    //最后一位
                    headPath += `<${path}>${item.freemarkerkey}</${path}>`
                } else {
                    headPath += `<${path}>`
                }
            })
            console.log(headPath, 'headPath')
            // pathArray.forEach((path,index)) => {

            //     console.log(path, 'path')

            //     headPath += `<${path}>${item.freemarkerkey}</${path}>\n`
            // })
            // console.log(headPath, 'headPath')

            xml += headPath

            // console.log(xml, 'xml==1')
        } else if (item.type === '2') {
            // type 为 2 转有 list if 结构的 XML 格式
            let nestedXML = ''
            let currentPath = ''
            pathArray.forEach((path, index) => {
                if (index === 0) {
                    currentPath = path
                } else {
                    currentPath += `.${path}`
                }
                if (index < pathArray.length - 1) {
                    nestedXML += `<#if ${currentPath.replace(/\./g, '_')}??>\n<${currentPath.replace(/\./g, '_')}>\n`
                }
            })
            nestedXML += `<#list ${item.attributePath.replace(/\./g, '_')} as ${pathArray[pathArray.length - 1]}>\n`
            nestedXML += `<${pathArray[pathArray.length - 1]}>${item.freemarkerkey}</${
                pathArray[pathArray.length - 1]
            }>\n`
            nestedXML += `</#list>\n`
            for (let i = pathArray.length - 2; i >= 0; i--) {
                let currentPath = pathArray.slice(0, i + 1).join('.')
                nestedXML += `</${currentPath.replace(/\./g, '_')}>\n</#if>\n`
            }
            xml += nestedXML
        }
    })

    xmlResult.value = xml
}

onMounted(() => {
    // const xmlOutput = jsonToXml(data)
    // console.log(xmlOutput)
    const a = data.map((v) => ({
        ...v,
        pathArry: v.attributePath.split('.'),
    }))
    console.log(JSON.stringify(a), '===')
})

function jsonToXml(jsonData) {
    const root = {}

    // 处理每个 JSON 对象
    jsonData.forEach((item) => {
        let current = root
        const { attributePath, freemarkerkey } = item
        const pathArry = attributePath.split('.')
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

    console.log(root, 'root')

    function buildXml(obj, tag) {
        let xml = ''
        if (tag) {
            xml += `\n<${tag}>`
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
            xml += `</${tag}>\n`
        }
        return xml
    }

    const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>' + buildXml(root, '')
    return xmlOutput
}

function convertToXMLHandle(data) {
    const tagGroups = {}

    // 按标签分组
    data.forEach((item) => {
        const pathArry = item.attributePath.split('.')
        console.log(pathArry, 'pathArry')

        const lastTag = pathArry[pathArry.length - 1]
        if (!tagGroups[lastTag]) {
            tagGroups[lastTag] = []
        }
        tagGroups[lastTag].push(item)
    })

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

    // 生成 XML
    for (const tag in tagGroups) {
        const group = tagGroups[tag]
        group.forEach((item) => {
            const pathArry = item.attributePath.split('.')
            if (item.type === '1') {
                // type 为 1 转嵌套 XML 格式
                let nestedXML = ''
                let currentPath = ''

                pathArry.forEach((path, index) => {
                    if (index === 0) {
                        currentPath = path
                    } else {
                        currentPath += `.${path}`
                    }
                    nestedXML += `<${currentPath.replace(/\./g, '_')}>`
                })
                nestedXML += `${item.freemarkerkey}`
                for (let i = pathArry.length - 1; i >= 0; i--) {
                    let currentPath = pathArry.slice(0, i + 1).join('.')
                    nestedXML += `</${currentPath.replace(/\./g, '_')}>`
                }
                xml += nestedXML + '\n'
            } else if (item.type === '2') {
                // type 为 2 转有 list if 结构的 XML 格式
                let nestedXML = ''
                let currentPath = ''
                pathArry.forEach((path, index) => {
                    if (index === 0) {
                        currentPath = path
                    } else {
                        currentPath += `.${path}`
                    }
                    if (index < pathArry.length - 1) {
                        nestedXML += `<#if ${currentPath.replace(/\./g, '_')}??>\n<${currentPath.replace(
                            /\./g,
                            '_',
                        )}>\n`
                    }
                })
                nestedXML += `<#list ${item.attributePath.replace(/\./g, '_')} as ${pathArry[pathArry.length - 1]}>\n`
                nestedXML += `<${pathArry[pathArry.length - 1]}>${item.freemarkerkey}</${
                    pathArry[pathArry.length - 1]
                }>\n`
                nestedXML += `</#list>\n`
                for (let i = pathArry.length - 2; i >= 0; i--) {
                    let currentPath = pathArry.slice(0, i + 1).join('.')
                    nestedXML += `</${currentPath.replace(/\./g, '_')}>\n</#if>\n`
                }
                xml += nestedXML
            }
        })
    }

    return xml
}

const convertToXML2 = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

    data.forEach((item) => {
        const pathArry = item.attributePath.split('.')
        if (item.type === '2') {
            let nestedXML = ''
            let currentPath = ''
            pathArry.forEach((path, index) => {
                if (index === 0) {
                    currentPath = path
                } else {
                    currentPath += `.${path}`
                }
                if (index < pathArry.length - 1) {
                    nestedXML += `<#if ${currentPath.replace(/\./g, '_')}??>\n<${currentPath.replace(/\./g, '_')}>\n`
                }
            })
            nestedXML += `<#list ${item.attributePath.replace(/\./g, '_')} as ${pathArry[pathArry.length - 1]}>\n`
            nestedXML += `<${pathArry[pathArry.length - 1]}>${item.freemarkerkey}</${pathArry[pathArry.length - 1]}>\n`
            nestedXML += `</#list>\n`
            for (let i = pathArry.length - 2; i >= 0; i--) {
                let currentPath = pathArry.slice(0, i + 1).join('.')
                nestedXML += `</${currentPath.replace(/\./g, '_')}>\n</#if>\n`
            }
            xml += nestedXML
        }
    })

    xmlResult.value = xml
}

function jsonToComplexXML(jsonData) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

    jsonData.forEach((item) => {
        const pathArray = item.pathArry
        let nestedXML = ''
        let currentPath = ''

        if (item.type === '2') {
            // 生成 if 判断标签
            pathArray.forEach((path, index) => {
                if (index === 0) {
                    currentPath = path
                } else {
                    currentPath += `.${path}`
                }
                if (index > 0) {
                    nestedXML += `<#if ${currentPath.replace(/\./g, '_')}??>\n<${currentPath.replace(/\./g, '_')}>\n`
                }
            })
            console.log(currentPath, 'currentPath')

            // 生成 list 标签
            nestedXML += `<#list ${item.attributePath.replace(/\./g, '_')} as ${pathArray[pathArray.length - 1]}>\n`

            // 生成具体标签内容
            nestedXML += `<${pathArray[pathArray.length - 1]}>${item.freemarkerkey}</${
                pathArray[pathArray.length - 1]
            }>\n`

            // 结束 list 标签
            nestedXML += `</#list>\n`

            // 结束 if 判断标签
            for (let i = pathArray.length - 2; i >= 0; i--) {
                let currentPath = pathArray.slice(0, i + 1).join('.')
                nestedXML += `</${currentPath.replace(/\./g, '_')}>\n</#if>\n`
            }
        }
        xml += nestedXML
    })

    return xml
}
</script>
