// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import Theme from 'vitepress/theme-without-fonts';
import './style.sass';

import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';

export default {
  extends: Theme,
  Layout: () => h(Theme.Layout, null, {
    // https://vitepress.dev/guide/extending-default-theme#layout-slots
  }),
  enhanceApp({ app /* , router, siteData */ }) {
    app.component('DemoBlock', AntdTheme);
  },
};
