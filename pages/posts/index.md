---
title: Posts
layout: page
---

<script setup>
import PostCard from 'components/PostCard.vue';

import { data as posts } from 'theme/index.data.js';

const images = import.meta.glob("./*.png", { eager: true, as: 'url' });
</script>

<div class="container">
  <PostCard v-for="(post, index) in posts" :key="index" v-bind="post" :images="images" />
</div>

<style lang="sass" scoped>
.container
  padding: 1rem
  max-width: 60rem
  margin-inline: auto
</style>
