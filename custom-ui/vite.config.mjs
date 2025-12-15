import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    clearScreen: false,
    plugins: [
        react(),
        libInjectCss(),
    ],
    build: {
        lib: {
            entry: [
                resolve(__dirname, 'src/frontend/index.ts'),
            ],
            formats: ['cjs'],
            fileName: (format, entryName) => `${ entryName }.js`,
        },
        outDir: 'lib',
        emptyOutDir: true,
        cssCodeSplit: true,
        sourcemap: true,
        target: 'ES2022',
        rollupOptions: {
            external: (id) => {
                // Aliases is not external
                if (id.startsWith('@/')) {
                    return false;
                }

                return !id.startsWith('.') && !id.startsWith('/') && !id.includes('\\0');
            },
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                format: 'cjs',
                exports: 'named',
            },
        },
    },
    resolve: {
        alias: [{
            find: /^@\/(.*)/,
            replacement: `${ resolve(__dirname, 'src') }/$1`,
        }],
        // preserveSymlinks: true,
    },
});
