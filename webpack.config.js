const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const loaders = () => {
    return {module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }};
}

const serverConfig = {
    target: "node",
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        server: './app/server.ts',
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "server.js"
    },
    ...loaders()
};

const clientConfig = {
    target: "web",
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        server: './app/client.ts',
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "client.js"
    },
    ...loaders(),
    plugins: [
        new FileManagerPlugin({
            onEnd: [
                {
                    mkdir: [
                        path.resolve(__dirname, 'target')
                    ]
                },
                {
                    copy: [
                        { source: path.resolve(__dirname, 'dist', 'client.js'), destination: path.resolve(__dirname, 'target', 'client.js')},
                    ]
                }
            ]
        })
    ]
}

module.exports = [clientConfig, serverConfig];