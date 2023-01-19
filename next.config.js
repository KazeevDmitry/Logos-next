/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // env:{
  //   REACT_APP_API: process.env.REACT_APP_API
  //   }
 
}


const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  // optional: you can modify antd less variables directly here
  modifyVars: {  },
  // Or better still you can specify a path to a file 
  lessVarsFilePath: './styles/antdVariables.less',
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},
 
    i18n: {
      locales: ['ru'],
      defaultLocale: 'ru',
    },
 
  
  // Other Config Here...

  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
    return config;
  },

});