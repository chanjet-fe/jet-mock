<a href="https://www.npmjs.com/package/jet-mock"><img src="https://img.shields.io/npm/v/jet-mock.svg" alt="npm-version"></a> <img src="https://img.shields.io/npm/dm/jet-mock.svg" alt="download-num"> <img src="https://img.shields.io/badge/node-%3E=8.16.0-brightgreen.svg" alt="node"> <img src="https://img.shields.io/npm/l/jet-mock.svg" alt="license"> <img src="https://img.shields.io/badge/platform-MacOS%7CLinux%7CWindows-lightgrey.svg" alt="platform">

# jet-mock

应用接口数据模拟服务器

## 基本特性

- 零配置、快速构建 MOCK 服务器
- 模拟服务器返回的对象、数组、以及根据传参变化的各种场景的请求数据
- 支持 Mockjs 语法模拟各种随机数据
- 支持 RestAPI 和 GraphQL 请求数据的模拟
- 支持修改 MOCK 数据的热更新、点击保存即时更新接口
- 支持使用 ES Module 模块化组织和维护复杂应用的 MOCK 数据
- 支持同时启动多个 MOCK 服务
- 支持本地和远端部署

## 快速开始

#### 项目中本地安装

```bash
yarn add jet-mock -D #或者 npm install jet-mock --save-dev
```

#### 项目中本地使用

在项目的`package.json`文件中配置`scripts`。

```json
{
  "name": "project-demo",
  "scripts": {
    "mock": "jet-mock start"
  },
  "devDependencies": {
    "jet-mock": "^1.0.0"
  }
}
```

执行：

```bash
yarn mock #或者 npm run mock
```

## RestAPI

第一次执行命令会自动生成`restapi.config.js`配置文件及 mock 示例。

```
project-demo
└── restapi.config.js
```

```
//restapi.config.js 示例

module.exports = {
  'GET /api/demoGet': {
    tips: '用于演示GET请求',
    name: 'jet-mock应用接口数据模拟服务器',
    github: 'https://github.com/chanjet-fe/jet-mock'
  },
  'POST /api/demoPost': {
    tips: '用于演示POST请求',
    name: 'jet-mock应用接口数据模拟服务器',
    github: 'https://github.com/chanjet-fe/jet-mock'
  }
}
```

**配置规则**

```js
// restapi.config.js

module.exports = {
    'GET /api/demoGet': {}/[]/function
//   \_/ \___________/ \______________/
//    |        |              |
//  method    path           data
}
```

- Method 是 HTTP 请求方法。
- PATH 是服务器上的路径。
- Data 是服务器返回的数据

为了便于复杂项目 MOCK 数据的管理，请在项目根目录下新建`mock`目录，用于存放更多的 MOCK 数据模块，并支持使用 ES Module 或 CommonJS 的模块化管理 MOCK 数据。

```bash
# 目录结构

project-demo
├── restapi.config.js # RestAPI配置文件
├── mock
│   └── restapi
│       ├── demo-get.js
│       └── demo-post.js
└── package.json

```

```js
//restapi.config.js

import demoGet from "./mock/restapi/demo-get";
import demoPost from "./mock/restapi/demo-post";
import Mock from "jet-mock/mockTools";

module.exports = {
  "GET /api/demoGet": demoGet,
  "POST /api/demoArray": demoPost,
  "GET /api/demoMockjs": Mock.mock('@string("lower", 5)')
};
```

## GraphQL

```bash
# 目录结构

project-demo
├── mock
│   ├── schema # 数据模型
│   │   └── demo.graphql
│   ├── gqlmocks # 模拟数据解析器
│   │   └── demo.js
│   └── resolvers # 解析器(非必须)
│       └── demo.js
└── package.json

```

- 新建 `mock/schema`目录用于存放模型描述文件，文件扩展名为`.graphql`。

```graphql
# project-demo/mock/schema/demo.graphql

type Query {
  hello: String
  resolved: String
  people: [Person]
}

type Person {
  name: String
  age: Int
}
```

- 新建 `mock/gqlmock`目录用于存放模拟数据文件

```js
// project-demo/mock/gqlmocks/demo.js

const Mock = require("jet-mock/mockTools");
const { MockList } = require("jet-mock/graphqlTools");
const Random = Mock.Random;

const min = 100;
const max = 99999;
const mocks = {
  Int: () => Random.natural(min, max),
  Float: () => Random.float(min, max),
  String: () => Random.ctitle(10, 5),
  Date: () => Random.time(),
  Query: () => ({
    people: () => new MockList([5, 12])
  }),
  Person: () => ({
    name: () => Random.cname(),
    age: () => Random.integer(20, 40)
  })
};

module.exports = mocks;
```

- 新建 `mock/resolvers`目录用于存放模型解析文件

> `resolvers`目录中的解析器将覆盖`gqlmock`目录中的模拟数据，用于处理真实的 GraphQL 服务器环境的数据逻辑。

```js
// project-demo/mock/resolvers/demo.js

module.exports = {
  Query: {
    resolved: () => "resolved"
  }
};
```

## 更多配置

在项目根目录新建`jetmock.config.js`支持模拟服务器的更多配置

```js
module.exports = {
  port: 3030, //服务器默认端口号
  path: {
    restApi: "mock/restapi", //用于存放RestApi模块化数据
    restApiConfig: "restapi.config.js", //RestApi配置文件
    schema: "mock/schema", //GraphQL模型描述文件存放目录
    resolvers: "mock/resolvers", //GraphQL解析器文件存放目录
    gqlmock: "mock/gqlmock" //GraphQL模拟数据解析器文件存放目录
  },
  /**
   * cookie-parser配置
   */
  cookie: {
    secret: "jetmock",
    options: {}
  },
  /**
   * express-session配置
   */
  session: {
    secret: "jetmock", // 对session id相关的cookie进行签名
    resave: false, //是否每次都重新保存会话，建议false
    saveUninitialized: true // 是否自动保存未初始化的会话，建议false
    // cookie: {
    //   maxAge: 10 * 1000 // 有效期，单位是毫秒
    // }
  }
};
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, [chanjet-fe](https://github.com/chanjet-fe).
