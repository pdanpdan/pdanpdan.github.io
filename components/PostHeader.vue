<script setup>
import { useData, withBase } from 'vitepress';
import { data } from 'theme/posts.data.js';
import PostCard from 'components/PostCard.vue';

const { posts } = data;
const { page } = useData();
const needle = `/${ withBase(page.value.relativePath.split('.').slice(0, -1).join('.')) }.html`;
const postCardData = posts.find((p) => p.href === needle);
</script>

<template>
  <PostCard v-if="postCardData" v-bind="postCardData" header />
</template>
