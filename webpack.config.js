const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const SRC_DIR = path.resolve(__dirname, 'public/src');
const BUILD_DIR = path.resolve(__dirname, 'public/prod');

const extractAdminCss = new ExtractTextPlugin({
    filename:  '../stylesheets/adminStyle.css',
    allChunks: true
});
const extractMainCss = new ExtractTextPlugin({
    filename:  '../stylesheets/mainStyle.css',
    allChunks: true
});

const config = {
    entry: {
        testResults: [SRC_DIR + '/javascripts/testResultsWidget.js', SRC_DIR + '/stylesheets/_mainBundle.sass'],
        admin: [SRC_DIR + '/javascripts/admin.js', SRC_DIR + '/stylesheets/_adminBundle.sass'],
        search: SRC_DIR + '/javascripts/search.js'
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
                test: /_adminBundle\.sass/,
                loader: extractAdminCss.extract(['css-loader', 'sass-loader']),
            },
            {
                test: /_mainBundle\.sass/,
                loader: extractMainCss.extract(['css-loader', 'sass-loader']),
            }
        ]
    },
    plugins: [
        extractAdminCss,
        extractMainCss
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