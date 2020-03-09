/**
 * jet-mock 应用接口数据模拟服务器
 * Copyright (c) 2020, https://github.com/chanjet-fe
 */

'use strict'

const mockjs = require('mockjs')

const Mock = {
  Handler: mockjs.Handler,
  Random: mockjs.Random
}

Mock.mock = function (template) {
  // Mock.mock(template)
  return mockjs.Handler.gen(template)
}

module.exports = Mock
