<template>
  <div class="container">
    <div v-if="featured !== true && tags.names.length > 0" class="tags">
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
  padding: 32px 24px 96px
  max-width: 976px
  margin-inline: auto

.tags
  display: none
  position: sticky
  top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px))
  margin-block-start: -32px
  margin-inline: -24px
  padding-inline: 8px
  padding-block: 8px
  margin-block-end: 16px
  border-block-end: 1px solid var(--vp-c-divider)
  display: flex
  flex-wrap: wrap
  gap: 0.4em
  background-color: var(--vp-local-nav-bg-color)
  z-index: var(--vp-z-index-local-nav)

  @media (min-width: 960px)
    padding-inline: 32px

  .VPLocalNav.reached-top ~ .VPContent &
    @media (max-width: 959px)
      top: calc(49px + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px))

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

const props = defineProps({
  featured: Boolean,
});

const { posts, featured: featuredPosts, tags } = data;
const tagsStatus = toReactive(useLocalStorage(
  'post-tags-status',
  tags.status,
  { mergeDefaults: true },
));
const filteredPosts = computed(() => {
  if (props.featured === true) {
    return featuredPosts;
  }

  const needles = tags.names.filter((t) => tagsStatus[t]);

  return posts.filter((post) => post.tags.some((t) => needles.includes(t)));
});
</script>
