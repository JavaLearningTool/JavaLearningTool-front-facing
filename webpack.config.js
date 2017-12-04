var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var SRC_DIR = path.resolve(__dirname, 'public/src');
var BUILD_DIR = path.resolve(__dirname, 'public/prod');

var config = {
    entry: [
        SRC_DIR + '/javascripts/testResultsWidget.js',
        SRC_DIR + '/stylesheets/style.sass'
    ],
    output: {
        path: BUILD_DIR + '/javascripts',
        filename: 'testResultsBundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react']
                        }
                    }
                ]
            },
            {
                test: /\.sass/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename:  '../stylesheets/style.css',
            allChunks: true
        })
        /*new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin()*/
    ]
};

module.exports = config;