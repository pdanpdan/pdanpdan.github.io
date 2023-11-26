import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

import VitePluginVitepressDemo from 'vite-plugin-vitepress-demo';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  titleTemplate: ':title | PDan Blog',

  srcDir: 'pages',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'PDan',

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          /**
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {},
          /**
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {},
        },

        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.search === false) {
            return '';
          }

          const preMd = [];
          let text;
          if (env.frontmatter?.title) {
            const inPosts = env.relativePath.startsWith('posts/') ? '[Post] ' : '';
            text = md.render(`# ${ inPosts }${ env.frontmatter.title }`);

            if (html.includes(text) === false) {
              preMd.push(text);
            }
          }
          if (env.frontmatter?.description) {
            text = md.render(env.frontmatter.description);

            if (html.includes(text) === false) {
              preMd.push(text);
            }
          }

          return preMd.join('\n') + html;
        },
      },
    },

    nav: [
      { text: 'My Projects', link: '/my-projects/' },
      { text: 'Blog Posts', link: '/posts/' },
      { text: 'About', link: '/about/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pdanpdan' },
    ],
  },

  sitemap: {
    hostname: 'https://pdanpdan.github.io/',
    transformItems: (items) => items.map((item) => ({
      changefreq: 'daily',
      ...item,
    })),
  },

  lastUpdated: true,

  markdown: {
    lineNumbers: true,
  },

  vite: {
    publicDir: '../public',
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
