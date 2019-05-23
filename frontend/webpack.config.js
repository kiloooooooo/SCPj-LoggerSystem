const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, './public/'),
        filename: 'script.bundle.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts?/,
                use: ['ts-loader']
            }
        ]
    }
}
