/**
 * jet-mock 应用接口数据模拟服务器
 * Copyright (c) 2020, https://github.com/chanjet-fe
 */

'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const portscanner = require('portscanner')
const path = require('path')
const cons = require('consolidate')
const Handlebars = require('handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const boxen = require('boxen')
const chalk = require('chalk')
const address = require('address')

const { ApolloServer, gql } = require('apollo-server-express')

const mockMiddleware = require('./lib/mock-middleware')
const serverConfig = require('./lib/jetmock.config')
const prepareUrl = require('./utils/prepareUrl')
const clearConsole = require('./utils/clearConsole')

const schemaContent = require('./lib/gql/schema')
const resolvers = require('./lib/gql/resolvers')
const mocks = require('./lib/gql/mocks')

const typeDefs = gql`${schemaContent}`
const server = new ApolloServer({ typeDefs, resolvers, mocks, mockEntireSchema: false })

server.applyMiddleware({ app })

// 允许所有的请求形式 (跨域)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin) //需要显示设置来源
  res.header("Access-Control-Allow-Credentials", true) //带cookies
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// cookie-parser
app.use(cookieParser(serverConfig.cookie.secret, serverConfig.cookie.options))

//express-session
app.use(session(serverConfig.session))

app.use('/static', express.static(path.join(__dirname, './public')))
app.set('views', path.join(__dirname, './views'))
app.engine('html', cons.handlebars)
app.set('view engine', 'html')

/**
 * [@index 从 1 开始]
 */
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1
})

let interfaceList = [] //接口列表
mockMiddleware.filter(item => {
  app[item.method](item.route, item.handle)
  interfaceList.push({
    method: item.method,
    route: item.route
  })
})

const serverIp = address.ip() || 'localhost' //服务器IP

let serverPort = 0

app.get('/', (req, res) => {
  res.render('index', {
    projectName: process.cwd().split(path.sep).pop(),
    interface: interfaceList,
    serverIp: serverIp,
    serverPort: serverPort
  })
})


portscanner.findAPortNotInUse(serverConfig.port, serverConfig.port + 50, '127.0.0.1', function (error, port) {
  serverPort = port //服务器端口

  if (error) return console.error(error)
  app.listen(port, () => {
    // clearConsole()
    console.log(chalk.green('Compiled successfully!'))
    const urls = prepareUrl('http', '0.0.0.0', serverPort)

    let message = chalk.cyan('欢迎使用jet-mock应用接口数据模拟服务器')
    message += `\n\nRestAPI:`

    if (urls.lanUrlForTerminal) {
      message += `\n  - ${chalk.bold('Local:')}    ${chalk.magenta(urls.localUrlForTerminal)}`
      message += `\n  - ${chalk.bold('Network:')}  ${chalk.magenta(urls.lanUrlForTerminal)}`
    } else {
      message += `\n\n  ${urls.localUrlForTerminal}`
    }

    message += `\n\nGraphGL:`

    if (urls.lanUrlForTerminal) {
      message += `\n  - ${chalk.bold('Local:')}    ${chalk.magenta(urls.localUrlForTerminal)}${server.graphqlPath}`
      message += `\n  - ${chalk.bold('Network:')}  ${chalk.magenta(urls.lanUrlForTerminal)}${server.graphqlPath}`
    } else {
      message += `\n\n  ${urls.localUrlForTerminal}`
    }

    message += `\n\n${chalk.gray('More info see:https://github.com/chanjet-fe/jet-mock')}`
    console.log(boxen(message, {
      padding: 1,
      borderColor: 'white',
      margin: 0,
      borderStyle: 'classic'
    }))
  })

})

process.on('SIGINT', () => {
  console.log("Gracefully shutting down from SIGINT (Ctrl-C)")
  process.exit()
})
