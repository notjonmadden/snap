import resolveNodeModules from "rollup-plugin-node-resolve";
import buildTypeScript from "rollup-plugin-typescript2";

export default {
    entry: "./src/index.ts",
    dest: "./index.js",
    format: "es",
    plugins: [
        resolveNodeModules(),
        buildTypeScript({
            //verbosity: 4,
            clean: true,
            check: true
        })
    ]
}