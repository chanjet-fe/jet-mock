/**
 * jet-mock 应用接口数据模拟服务器
 * Copyright (c) 2020, https://github.com/chanjet-fe
 */

'use strict'

const nodemon = require('nodemon')
const path = require('path')
const fs = require('fs')
const os = require('os')

const jetmockConfig = require('../lib/jetmock.config')

const restApiConfig = path.join(process.cwd(), jetmockConfig.path.restApiConfig)

if (!fs.existsSync(restApiConfig)) {
  const mockRouterTemp = fs.readFileSync(path.join(__dirname, '../lib/restApi-demo.js'), 'utf8')
  fs.writeFileSync(restApiConfig, mockRouterTemp + os.EOL, 'utf8')
}

const stream = nodemon({
  script: path.join(__dirname, '../', 'server.js'),
  ext: "js,gql,graphql",
  env: {
    'NODE_ENV': process.env.NODE_ENV
  },
  // 监听的路径
  watch: [
    path.join(process.cwd(), jetmockConfig.path.restApi),
    path.join(process.cwd(), jetmockConfig.path.schema),
    path.join(process.cwd(), jetmockConfig.path.resolvers),
    path.join(process.cwd(), jetmockConfig.path.gqlmock),
    restApiConfig
  ]
})

stream
  .on('start', () => {
    //服务启动
  })
  .on('restart', (files) => {
    //服务重新启动
    Array.isArray(files) && console.log('Reload ' + files.join(''))
  })
  .on('crash', () => {
    //崩溃退出 重启服务
    stream.emit('restart', 10)
  })
  .on('exit', () => {
    //服务退出
    if (stream.quitEmitted) {
      process.exit(0)
    }
  })

process.on('SIGINT', () => {
  stream.emit('quit')
  stream.quitEmitted = true
})
