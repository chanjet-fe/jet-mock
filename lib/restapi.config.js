/**
 * jet-mock 应用接口数据模拟服务器
 * Copyright (c) 2020, https://github.com/chanjet-fe
 */

'use strict';
const path = require('path')
const fs = require('fs')
const jetmockConfig = require('./jetmock.config')

const babelPresetEnvPath = path.join(__dirname, '../node_modules/@babel/preset-env')

require('@babel/register')({
  babelrc: false,
  presets: [babelPresetEnvPath]
})

const restApiConfig = path.join(process.cwd(), jetmockConfig.path.restApiConfig)

function getConfig() {
  if (fs.existsSync(restApiConfig)) {
    return require(restApiConfig).default || require(restApiConfig)
  } else {
    return {}
  }
}

module.exports = getConfig()
