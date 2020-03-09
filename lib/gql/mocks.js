/**
 * Copyright (c) 2020, chanjet-fe, https://github.com/chanjet-fe.
 * jet-mock 应用接口数据模拟服务器
 * More see info: https://github.com/chanjet-fe/jet-mock
 */

'use strict'

const globby = require('globby')
const path = require('path')
const merge = require('lodash.merge')

const mocksFiles = globby.sync(path.join(process.cwd(), 'mock/gqlmocks', '**/*.js'))

let mocks = {}
mocksFiles.map((file) => {
  const mocksTemp = require(file)
  merge(mocks, mocksTemp)
})

module.exports = mocks
