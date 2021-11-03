# weeds-webpack-plugin

> 查找 `webpack` 项目中未被使用的代码和 `node` 三方库

![weeds](https://qiniu-image.qtshe.com/1635910463309_658.png)

### Installing

```bash
npm i weeds-webpack-plugins -D
```

### Usage

```javascript
const weedsWebpackPlugin = require("weeds-webpack-plugins");

module.exports = {
  plugins: [
    new weedsWebpackPlugin(), // default src/**
    new weedsWebpackPlugin("src/**"),
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
```

默认查找 `src` 目录下代码，可以根据 `glob` 语法配置需要对比的目录

参数参考 `fast-glob`库，使用`fast-glob`获取文件然后对比`webpack`中实际使用的依赖文件

可设置 `writeType` 导出为 `json` 文件，或者默认输出在命令行，json 文件会被保存到当前项目的`weedsFiles.json`

设置了 `webpack dll` 的依赖不会被记录，所以 `dll` 依赖被划分为未使用状态
