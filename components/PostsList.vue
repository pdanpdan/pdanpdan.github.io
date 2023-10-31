<template>
  <div class="container">
    <div v-if="tags.names.length > 0" class="tags">
      <button
        v-for="tag in tags.names"
        :key="tag"
        type="button"
        :class="{ selected: tagsStatus[tag] }"
        @click="tagsStatus[tag] = tagsStatus[tag] !== true"
      >
        {{ tag }}
        <span>{{ tags.stats[tag] }}</span>
      </button>
    </div>

    <PostCard
      v-for="(post, index) in filteredPosts"
      :key="index"
      v-bind="post"
    />
  </div>
</template>

<style lang="sass" scoped>
.container
  padding: 1rem
  max-width: 1104px
  margin-inline: auto

.tags
  margin-block-end: 1em
  display: flex
  gap: 0.4em

  button
    font-size: 0.9em
    border-radius: 0.8em
    padding-inline-start: 0.8em
    white-space: nowrap
    overflow: hidden
    font-family: var(--vp-font-family-mono)
    color: var(--vp-button-alt-text)
    background-color: var(--vp-button-alt-bg)
    border: var(--vp-button-alt-border)
    transition: color 0.25s, background-color 0.25s, border 0.25s

    &:hover
      color: var(--vp-button-alt-hover-text)
      background-color: var(--vp-button-alt-hover-bg)
      border: var(--vp-button-alt-hover-border)

    &:active
      color: var(--vp-button-alt-active-text)
      background-color: var(--vp-button-alt-active-bg)
      border: var(--vp-button-alt-active-border)

    &.selected
      color: var(--vp-button-brand-text)
      background-color: var(--vp-button-brand-bg)

      &:hover
        color: var(--vp-button-brand-hover-text)
        background-color: var(--vp-button-brand-hover-bg)
        border: var(--vp-button-brand-hover-border)

      &:active
        color: var(--vp-button-brand-active-text)
        background-color: var(--vp-button-brand-active-bg)
        border: var(--vp-button-brand-active-border)

  span
    display: inline-block
    padding: 0.1em 0.7em 0.1em 0.6em
    background-color: var(--vp-c-red-soft)
</style>

<script setup>
import { computed } from 'vue';
import { toReactive, useLocalStorage } from '@vueuse/core';

import PostCard from 'components/PostCard.vue';

import { data } from 'theme/posts.data.js';

const { posts, tags } = data;
const tagsStatus = toReactive(useLocalStorage(
  'post-tags-status',
  tags.status,
  { mergeDefaults: true },
));
const filteredPosts = computed(() => {
  const needles = tags.names.filter((t) => tagsStatus[t]);

  return posts.filter((post) => post.tags.some((t) => needles.includes(t)));
});
</script>
