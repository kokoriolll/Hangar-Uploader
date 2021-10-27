const path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: './',
  runtimeCompiler: true,
  pages: {
    index: {
      // 页面入口
      entry: 'examples/main.js',
      // 模板来源
      template: 'pubilc/index.html',
      // 输出文件名
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('examples'));
  }
};
