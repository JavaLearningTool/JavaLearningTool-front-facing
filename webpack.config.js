const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const SRC_DIR = path.resolve(__dirname, 'public/src');
const BUILD_DIR = path.resolve(__dirname, 'public/prod');

const config = {
    entry: {
        testResults: [SRC_DIR + '/javascripts/testResultsWidget.js', SRC_DIR + '/stylesheets/style.sass'],
        admin: SRC_DIR + '/javascripts/admin.js'
    },
    output: {
        path: BUILD_DIR + '/javascripts',
        filename: '[name]Bundle.js'
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
        }),
        /*new WebpackCleanupPlugin({
            exclude: ['stylesheets/codemirror.css', 'stylesheets/eclipse.css', 'stylesheets/codemirror.css', 'stylesheets/monokai.css',
                      'javascripts/clike.js', 'javascripts/codemirror.js'
                     ],
        })*/
        /*new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin()*/
    ]
};

module.exports = config;