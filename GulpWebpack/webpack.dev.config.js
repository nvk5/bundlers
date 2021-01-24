module.exports = {
    mode: 'development',
    output: {
        filename: 'app.js',
        chunkFilename: 'vendors.js'
    },
    watch: false,
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    // name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { corejs: 3, useBuiltIns: "usage" }]
                            ]
                        }
                    }
                ]
            }
        ]
    }
}