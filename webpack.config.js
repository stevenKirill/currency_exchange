const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './index.js',
    },
    output: {
        path: path.resolve(__dirname,'dist'),
    },
    resolve: {
        extensions: ['.js','.json'],
        alias: {
            '@models': path.resolve(__dirname,'src/models'),
            '@': path.resolve(__dirname,'src')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'src/assets'),
                    to: path.resolve(__dirname,'dist/assets')
                },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, 
                        options: {
                            publicPath: ''
                        }
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(jpg|png|jpeg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                }
              }
            ]
        },
    }