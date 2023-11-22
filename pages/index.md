---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: Home Page

hero:
  name: PDanPDan Blog
  text: About Web develoment
  tagline: Tricks and trips to solve frequent problems
  image:
    src: /logo3.jpg
    alt: Photo of PDan
  actions:
    - theme: brand
      text: My Projects
      link: /my-projects/
    - theme: brand
      text: Blog Posts
      link: /posts/
    - theme: alt
      text: About
      link: /about/

features:
  - title: Quasar
    details: Hint and examples for using Quasar Framework. Get the best results with minimal effort.

  - title: Vue / [JT]S / HTML / CSS
    details: How to get what you want with Vue / [JT]S / HTML / CSS. There is nothing to be scared of.
  - title: Backend
    details: Backend / API related information. Don't mix frontend and backend to have an easy life.
---

<script setup>
import PostsList from 'components/PostsList.vue';
</script>

<PostsList featured />
