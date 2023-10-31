<script setup>
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { data } from 'theme/posts.data.js';
import PostCard from 'components/PostCard.vue';

const { posts } = data;
const { page } = useData();
const postCardData = computed(() => {
  if (!page.value) {
    return null;
  }

  const needle = `/${ withBase(page.value.relativePath.split('.').slice(0, -1).join('.')) }.html`;
  const post = posts.find((p) => p.href === needle);

  return post ? { ...post, href: null } : post;
});
</script>

<template>
  <PostCard v-if="postCardData" v-bind="postCardData" />
</template>
