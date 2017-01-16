 var baseWebpackConfig = require('./webpack.base.config');
 var merge = require('webpack-merge');


 module.exports = merge(baseWebpackConfig,{
     output : {
         publicPath : '/',
         pathinfo : true
     },
     devtool : 'source-map',
     debug : true,
     devServer : {
         https: true,
         noInfo: true,
         historyApiFallback: true
     }
 });
