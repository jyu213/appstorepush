var webpack = require("webpack");
var fs = require('fs');
var path = require('path');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isDev = process.env.NODE_ENV !== 'production';

// 循环 enrty 目录，暂时未成功配置原方案
var entryList = {};
var walkEntry = (function(path){
    var dirList = fs.readdirSync(path);
    dirList.length > 0 && dirList.forEach(function(item){
        var deepPath = path + '/' + item,
            fileName;
        if( fs.statSync(deepPath).isDirectory() ){
            walkEntry(deepPath);
        }else{
            // #see: https://github.com/webpack/webpack/issues/300
            fileName = item.match('.js') ? item.split('.js')[0] : item;
            entryList[fileName] = [path + '/' + fileName];
        }
    });
})('./src/js/app/');

module.exports = {
    context: __dirname,
    entry: entryList,
    output: {
        path: path.join(__dirname, "/dist/js"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            // css style
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=es2015'],
                include: path.join(__dirname, 'src')
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.css']
    },
    plugins: [
        // 分文件
        // new ExtractTextPlugin("[name].css")

        // 合并文件
        // new ExtractTextPlugin('style.css', {allChunks: true})
        // 抽取合并共用文件输出
        // new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
};
