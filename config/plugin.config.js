// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';

export default config => {
  // pro 和 开发环境再添加这个插件
  if (process.env.APP_TYPE === 'site' || process.env.NODE_ENV !== 'production') {
    // 将所有 less 合并为一个供 themePlugin使用
    const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
    const stylesDir = path.join(__dirname, '../src/');

    config.plugin('merge-less').use(MergeLessPlugin, [
      {
        stylesDir,
        outFile,
      },
    ]);

    config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
      {
        antDir: path.join(__dirname, '../node_modules/antd'),
        stylesDir,
        varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
        mainLessFile: outFile, //     themeVariables: ['@primary-color'],
        indexFileName: 'index.html',
        generateOne: true,
        lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
      },
    ]);
  }
};
