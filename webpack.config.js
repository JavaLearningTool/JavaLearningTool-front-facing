var webpack = require('webpack');
var path = require('path');

var SRC_DIR = path.resolve(__dirname, 'public/src');
var BUILD_DIR = path.resolve(__dirname, 'public/prod/javascripts');

var config = {
    entry: SRC_DIR + '/testResults.js',
    output: {
        path: BUILD_DIR,
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
            }
        ]
    },
    plugins: [
        /*new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin()*/
    ]
};

module.exports = config;