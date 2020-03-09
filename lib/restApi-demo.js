/**
 * restapi.config.js配置示例
 * jet-mock底层使用express，支持对应于 HTTP 的get、post、put、head、delete、options等各种路由方法
 * 具体请参考：https://expressjs.com/zh-cn/guide/routing.html
 */
const Mock = require('jet-mock/mockTools')

module.exports = {
  /**
   * 模拟对象类型的静态数据
   */
  'GET /api/demoGet': {
    tips: '用于演示GET请求',
    name: 'jet-mock应用接口数据模拟服务器',
    github: 'https://github.com/chanjet-fe/jet-mock'
  },
  /**
   * 模拟数组类型的静态数据
   */
  'POST /api/demoArray': [{
    tips: '用于演示返回数组的请求',
    name: 'num1'
  }, {
    tips: '用于演示返回数组的请求',
    name: 'num2'
  }],
  /**
   * 使用mockjs语法模拟随机数据
   * 也可以使用 Mock.Random
   * 更多信息请参考：https://github.com/nuysoft/Mock/wiki/Mock.Random
   */
  'GET /api/tags': (req, res) => {
    res.send(Mock.mock({
      'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
    }))
  },
  /**
   * 模拟逻辑判断的场景数据，即根据前端传参返回数据
   * 支持req及res的各种API，具体请参考：
   * https://expressjs.com/zh-cn/4x/api.html#req
   * https://expressjs.com/zh-cn/4x/api.html#res
   */
  'POST /api/login': (req, res) => {
    /**
     * 已集成body-parser中间件，并已配置application/x-www-form-urlencoded和application/json的解析
     * 可以通过req.body接收请求数据，具体可参考：https://github.com/expressjs/body-parser。
     */
    const { password, userName } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        userName: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        userName: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      userName: 'guest',
    })
  }
}
