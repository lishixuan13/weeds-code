# weeds-webpack-plugin

> 查找 `webpack` 项目中未被使用的代码和 `node` 三方库

![weeds](https://qiniu-image.qtshe.com/1635927453838_780.png)

### Installing

```bash
npm i weeds-webpack-plugins -D
```

### Usage

```javascript
// webpack.config.js
const weedsWebpackPlugin = require("weeds-webpack-plugins");

module.exports = {
  plugins: [
    new weedsWebpackPlugin(), // default src/**
    new weedsWebpackPlugin("lib/**"),
    new weedsWebpackPlugin({
      writeType: "json", // default cli log, value: json or ''
    }),

    // params refer to fast-glob
    new weedsWebpackPlugin(["src/**", "lib/**"], {
      ignore: [],
      context: "", // package.json
      cwd: "",
      writeType: "json", // default cli log, value: json or ''
    }),
  ],
};

// or chain-webpack
const weedsWebpackPlugin = require("weeds-webpack-plugins");

config.plugin("weeds-webpack-plugin").use(WeedsWebpackPlugin).end();
```

默认查找 `src` 目录下代码，可以根据 `glob` 语法自定义配置需要对比的目录，比如要看看`src/components`下的文件有没有被用到`src/components/**`

参数参考 `fast-glob`库，使用`fast-glob`获取文件然后对比`webpack`中实际使用的依赖文件

`node`库查找`package.json`下`dependencies`里的依赖，不会去找`devDependencies`下依赖

可设置 `writeType` 导出为 `json` 文件，或者默认不设置`writeType`输出在命令行 log，json 文件会被保存到当前项目的`weedsFiles.json`

设置了 `webpack dll` 的依赖不会被记录，所以 `dll` 依赖被划分为未使用状态
