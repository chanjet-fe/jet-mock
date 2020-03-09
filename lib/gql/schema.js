/**
 * Copyright (c) 2020, chanjet-fe, https://github.com/chanjet-fe.
 * jet-mock 应用接口数据模拟服务器
 * More see info: https://github.com/chanjet-fe/jet-mock
 */

'use strict'

const globby = require('globby')
const fs = require('fs')
const path = require('path')

const schemaFiles = globby.sync(path.join(process.cwd(), 'mock/schema', '**/*.{gql,graphql}'))

let schemaContent = []
schemaFiles.map((file) => {
  const schemaContentTemp = fs.readFileSync(file, 'utf8')
  schemaContent.push(schemaContentTemp)
})

if (schemaFiles.length === 0) {
  schemaContent.push(`type Query {
  hello: String
}`)
}

module.exports = schemaContent.join('')
