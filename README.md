# demo-vue3.0-ts

demo-vue3.0-ts

# 启动项目

## 安装

```js
yarn
```

## 启动

```js
yarn dev
```

## 打包

```js
yarn build
```

# 开发配置

## 开发环境

vite.config.ts 中配置接口请求地址

```js
proxy: {
    '/Web': {
        //设置开发环境代理
        target: 'http://10.158.27.179:8080/Web', //代理的目标地址(后端设置的端口号)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/Web/, ''),
    },
},
```

.env.development

```js
VITE_API_BASE_URL = /Web
```

## 生产环境

public/config.js 中配置接口请求地址

[在打包后可动态配置接口请求地址](https://juejin.cn/post/7406147963876753448)

```js
var PLATFROM_CONFIG = {
    PRO_BASE_URL: 'http://10.64.16.180:8083', // 正式环境 打包后用的正式环境地址，如改动可修改此处
}
```

## 引入 pubilc 中的静态资源

```js
<img src='/menu/assets/img/bg_login_left_.png' alt='' srcset='' />
```
