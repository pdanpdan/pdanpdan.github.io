import { defineConfig } from 'vitepress'

import VitePluginVitepressDemo from 'vite-plugin-vitepress-demo'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  titleTemplate: ':title | PDanPDan',
  description: "PDanPDan code and examples for web",

  srcDir: 'pages',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {},
          searchOptions: {}
        }
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples/' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples/' },
          { text: 'Runtime API Examples', link: '/api-examples/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pdanpdan' }
    ]
  },

  sitemap: {
    hostname: 'https://pdanpdan.github.io/'
  },

  lastUpdated: true,

  markdown: {
    lineNumbers: true
  },

  vite: {
    plugins: [
      VitePluginVitepressDemo( {
        glob: [
          '**/*.demo.vue'
        ]
      }),
    ]
  }
})
