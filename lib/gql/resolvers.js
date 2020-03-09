/**
 * Copyright (c) 2020, chanjet-fe, https://github.com/chanjet-fe.
 * jet-mock 应用接口数据模拟服务器
 * More see info: https://github.com/chanjet-fe/jet-mock
 */

'use strict'

const globby = require('globby')
const path = require('path')
const merge = require('lodash.merge')

const resolversFiles = globby.sync(path.join(process.cwd(), 'mock/resolvers', '**/*.js'))

let resolvers = {}
resolversFiles.map((file) => {
  const resolversTemp = require(file)
  merge(resolvers, resolversTemp)
})

module.exports = resolvers
