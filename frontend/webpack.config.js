const path = require('path');
const package = require('./package.json');
require('dotenv').config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack'); // Import webpack

module.exports = (env, options) => {
    const devMode = options.mode === 'development';

    process.env.NODE_ENV = options.mode;

    return {
        mode: options.mode,
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
            publicPath: '/', // Ensures proper routing handling
            clean: true
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            alias: {
                '@components': path.resolve(__dirname, 'src/components/'),
                '@constants': path.resolve(__dirname, 'src/constants/'),
                '@hooks': path.resolve(__dirname, 'src/hooks/'),
                '@services': path.resolve(__dirname, 'src/services/'),
                '@store': path.resolve(__dirname, 'src/store/'),
                '@styles': path.resolve(__dirname, 'src/styles/'),
                '@utils': path.resolve(__dirname, 'src/utils/'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/i,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        'postcss-loader'
                    ],
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    type: 'asset/resource',
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    type: 'asset/resource',
                },
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "public/**/*",
                        globOptions: {
                            ignore: ["**/index.html"],
                        },
                    }
                ],
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                title: package.name,
                meta: {
                    title: package.name,
                    description: package.description,
                    author: package.author,
                    keywords: Array.isArray(package.keywords)
                        ? package.keywords.join(',')
                        : undefined,
                    'og:title': package.name,
                    'og:description': package.description,
                    'og:url': package.homepage,
                },
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            }),
            // Add DefinePlugin to expose environment variables
            new webpack.DefinePlugin({
                'process.env.REACT_APP_SUPA_URL': JSON.stringify(process.env.REACT_APP_SUPA_URL),
                'process.env.REACT_APP_ANON_API_KEY': JSON.stringify(process.env.REACT_APP_ANON_API_KEY),
            }),
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        }
                    }
                }),
                new CssMinimizerPlugin()
            ]
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            historyApiFallback: true, // Handles client-side routing for React Router
            port: 3000,
            open: true,
            hot: true,
        },
    };
};