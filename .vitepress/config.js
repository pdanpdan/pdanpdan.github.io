import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

import VitePluginVitepressDemo from 'vite-plugin-vitepress-demo';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  titleTemplate: ':title | PDan',

  srcDir: 'pages',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'PDan',

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {},
          searchOptions: {},
        },
      },
    },

    nav: [
      { text: 'My Projects', link: '/my-projects/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'About', link: '/about/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pdanpdan' },
    ],
  },

  sitemap: {
    hostname: 'https://pdanpdan.github.io/',
  },

  lastUpdated: true,

  markdown: {
    lineNumbers: true,
  },

  vite: {
    publicDir: './public',
    plugins: [
      VitePluginVitepressDemo({
        glob: [
          '**/*.demo.vue',
        ],
        wrapper: 'demo-block',
      }),
    ],
    resolve: {
      alias: {
        assets: resolve(__dirname, '../assets'),
        components: resolve(__dirname, '../components'),
        pages: resolve(__dirname, '../pages'),
        theme: resolve(__dirname, './theme'),
      },
    },
  },
});
