/**
 * jet-mock 应用接口数据模拟服务器
 * Copyright (c) 2020, https://github.com/chanjet-fe
 */

'use strict';

const path = require('path')
const fs = require('fs')
const merge = require('lodash/merge')

const configFile = path.join(process.cwd(), 'jetmock.config.js')

function getConfig() {
  if (fs.existsSync(configFile)) {
    return require(configFile).default || require(configFile)
  } else {
    return {}
  }
}

const defaultConfig = {
  port: 3030, //服务器端口号
  path: {
    restApi: 'mock/restapi', //用于存放RestApi模块化数据
    restApiConfig: 'restapi.config.js', //RestApi配置文件
    schema: 'mock/schema', //GraphQL模型描述文件存放目录
    resolvers: 'mock/resolvers',//GraphQL解析器文件存放目录
    gqlmock: "mock/gqlmock"//GraphQL模拟数据解析器文件存放目录
  },
  /**
   * cookie-parser配置
   */
  cookie: {
    secret: 'jetmock',
    options: {}
  },
  /**
   * express-session配置
   */
  session: {
    secret: 'jetmock', // 对session id相关的cookie进行签名
    resave: false, //是否每次都重新保存会话，建议false
    saveUninitialized: true // 是否自动保存未初始化的会话，建议false
    // cookie: {
    //   maxAge: 10 * 1000 // 有效期，单位是毫秒
    // }
  }
}

module.exports = merge({}, defaultConfig, getConfig())
