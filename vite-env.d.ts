/*
 * @Author: yangmiaomiao
 * @Date: 2023-12-28 20:30:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-08-23 14:20:22
 * @Description:
 */
interface ImportMetaEnv {
    VITE_APP_MODE: string
    VITE_API_BASE_URL: string
    VITE_APP_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
