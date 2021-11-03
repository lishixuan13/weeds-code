# weeds-webpack-plugin

> 查找 `webpack` 项目中未被使用的代码和 `node` 三方库

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
