const path = require("path");

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
        app: "./app.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    devtool: "source-map",
    resolve: {
        // Tell webpack to try adding ".ts" to `import ...` statements it parses
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "/dist"),
        compress: true,
        port: 8000
    }
};
