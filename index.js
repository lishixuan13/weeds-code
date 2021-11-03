const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

class WeedsPlugin {
  constructor(patterns, options) {
    if (
      arguments.length === 1 &&
      !Array.isArray(patterns) &&
      typeof patterns === "object"
    ) {
      this.patterns = "src/**";
      this.options = Object.assign(
        { onlyFiles: true, absolute: true },
        patterns
      );
    } else {
      this.patterns = patterns || "src/**";
      this.options = Object.assign(
        { onlyFiles: true, absolute: true },
        options
      );
    }
  }

  async diff(sourceSet, nodeLibSet) {
    const files = await fg(this.patterns, this.options);
    const weedsFiles = files.filter((file) => {
      return !sourceSet.has(file);
    });
    const dependencies = this.getPackageDependencies();
    const weedsNodeFiles = dependencies.filter((file) => {
      return !nodeLibSet.has(file);
    });
    if (this.options.writeType === "json") {
      this.writeFile({
        weedsFiles,
        weedsNodeFiles,
      });
    } else {
      process.nextTick(() => {
        this.writeLog({
          weedsFiles,
          weedsNodeFiles,
        });
      })
    }
  }

  getPackageDependencies() {
    if (!this.requirePackagePath) return [];
    const packageJson = require(this.requirePackagePath);
    const dependencies = packageJson.dependencies
      ? Object.keys(packageJson.dependencies)
      : [];
    return dependencies;
  }

  writeFile(weedsFiles) {
    fs.writeFileSync(
      path.resolve(this.options.context, "./weedsFiles.json"),
      JSON.stringify(weedsFiles)
    );
  }

  writeLog({ weedsFiles, weedsNodeFiles }) {
    console.log("--- weeds-webpack-plugin：");
    console.log("----------- 未被使用文件 -----------");
    console.log(weedsFiles);

    console.log("----------- 未被使用node模块 -----------");
    console.log(weedsNodeFiles);
  }

  formatFiles(fileSet) {
    let sourceSet = new Set();
    let nodeLibSet = new Set();
    const reg = /node_modules\/(@[^/]+\/[^/]+|[^/]+)/;
    fileSet.forEach((file) => {
      const formatFile = file.split(path.sep).join("/");
      if (reg.test(formatFile)) {
        const nodeLib = formatFile.match(reg)[1];
        if (nodeLib) {
          nodeLibSet.add(nodeLib);
        }
      } else {
        sourceSet.add(file);
      }
    });
    return {
      sourceSet,
      nodeLibSet,
    };
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap("WeedsPlugin", (context) => {
      if (!this.options.cwd) {
        this.options.cwd = context;
      }
      if (!this.options.context) {
        this.options.context = context;
      }
      const packagePath = path.resolve(this.options.context, "package.json");
      try {
        this.requirePackagePath = require.resolve(packagePath);
      } catch (e) {
        throw new Error(
          `加载package.json失败（${packagePath}），请设置正确的context字段，new weedsPlugin({context: 'project dir'})`
        );
      }
    });

    compiler.hooks.done.tapAsync("WeedsPlugin", async (stats, callback) => {
      const fileSet = new Set(stats.compilation.fileDependencies);
      const { sourceSet, nodeLibSet } = this.formatFiles(fileSet);
      await this.diff(sourceSet, nodeLibSet);
      callback();
    });
  }
}

module.exports = WeedsPlugin;
