const mix = require('laravel-mix');

mix.webpackConfig({ target: 'node' }).ts('src/cli/data-story.ts', 'dist')