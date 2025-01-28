import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: "./lib-dist",
        lib: {
            entry: {
                'lib': 'src/libindex.ts'
            },
            name: 'timeclicker_server',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            // external: ['typeorm'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                // globals: {
                //     vue: 'Vue',
                // },
            },
        },
    },
})