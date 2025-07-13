import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import terser from "@rollup/plugin-terser";
import { sveltePreprocess } from "svelte-preprocess";
import replace from "rollup-plugin-replace";

const production = !process.env.ROLLUP_WATCH;

function createConfig(filename, useSvelte = false) {
    return {
        input: `src/${filename}.ts`,
        output: {
            format: "iife",
            file: `public/build/${filename}.js`,
        },
        plugins: [
            useSvelte &&
            svelte({
                emitCss: false,
                compilerOptions: {
                    dev: !production
                },
                preprocess: sveltePreprocess(),
                onwarn: (warning, handler) => {
                    if (warning.code === 'a11y_click_events_have_key_events') return;
                    if (warning.code === 'a11y_no_static_element_interactions') return;
                    if (warning.code === 'a11y_no_noninteractive_tabindex') return;
                    if (warning.code === 'a11y_no_noninteractive_element_interactions') return;
                    if (warning.code === 'a11y-click-events-have-key-events') return;
                    if (warning.code === 'a11y-no-static-element-interactions') return;
                    handler(warning);
                }
            }),

            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration -
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            resolve({
                browser: true,
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript(),
            replace({
                "process.env.NODE_ENV": JSON.stringify('production')
            }),
            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser(),
        ],
        watch: {
            clearScreen: false,
        },
    };
}

export default [
    // createConfig("options", true),
    createConfig("popup", true),
    // createConfig("background"),
    createConfig("content_script"),
];
