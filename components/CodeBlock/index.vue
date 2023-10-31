<script lang="ts" setup>
import { computed, onMounted, shallowRef } from 'vue';

import siteDemos from '@siteDemo';

import { useSiteDemos } from './hooks/site-demo.js';
import { useClipboard } from './hooks/clip-board.js';

import ExpandIcon from './icons/ExpandIcon.vue';
import UnExpandIcon from './icons/UnExpandIcon.vue';
import FileCopyIcon from './icons/FileCopyIcon.vue';
import FileSuccessIcon from './icons/FileSuccessIcon.vue';
import PlaygroundIcon from './icons/PlaygroundIcon.vue';

const props = defineProps<{
  src: string;
  title?: string;
  desc?: string;
  raw?: boolean;
  importMap?: Record<string, string>;
}>();

const siteDemoData = shallowRef( siteDemos );

// @ts-expect-error this is hot
if (import.meta.hot) {
  // @ts-expect-error this is hot
  import.meta.hot.accept( '/@siteDemo', ( m: any ) => {
    siteDemoData.value = m.default;
  } );
}

const { demo, render, content, code, playground } = useSiteDemos( props, siteDemoData );

const titleId = computed(() => `d_${ props.src.split( '.' )[ 0 ].split( '/' ).join( '-' ) }`);

const hash = shallowRef();

onMounted(() => {
  hash.value = location.hash.slice( 1 );
  window.addEventListener( 'hashchange', () => {
    hash.value = location.hash.slice( 1 );
  } );
} );

const { copied, copy } = useClipboard();
const handleCopy = () => {
  copy( code );
};

const expand = shallowRef( false );
const handleExpand = () => {
  expand.value = !expand.value;
};

const sfcBaseUrl = 'https://sfc.vuejs.org/';
const sfcPlaygroundUrl = computed(() => {
  const sfcJson = {
    'App.vue': playground.value,
  } as Record<string, string>;

  if (props.importMap) {
    try {
      sfcJson['import-map.json'] = JSON.stringify({
        imports: props.importMap,
      });
    } catch {}
  }

  return `${sfcBaseUrl}#${btoa(unescape(encodeURIComponent(JSON.stringify(sfcJson))))}`;
});
</script>

<template>
  <article v-if="!raw" class="demo-block" :class="{ 'demo-block--active': hash === titleId }">
    <section v-if="content?.title || title" class="demo-block__title">
      <h6 :id="titleId">
        {{ content?.title ?? title }}
        <a
          class="header-anchor"
          :href="`#${titleId}`"
          :aria-label="`Permalink to &quot;${ encodeURIComponent(content?.title ?? title) }&quot;`"
        />
      </h6>
      <a >
      </a>
    </section>

    <section v-if="content?.content || desc" class="demo-block__description" v-html="content?.content ?? desc" />

    <section v-if="demo" class="demo-block__demo">
      <component :is="demo" />
    </section>

    <section class="demo-block__actions">
      <a
        v-if="playground"
        class="demo-block__action"
        :href="sfcPlaygroundUrl"
        target="_blank"
      >
        <PlaygroundIcon />
      </a>

      <button v-if="code" class="demo-block__action">
        <FileCopyIcon v-if="!copied" @click="handleCopy" />
        <FileSuccessIcon v-else style="color: var(--vp-c-brand)" />
      </button>

      <button v-if="code" class="demo-block__action">
        <UnExpandIcon :class="`demo-block__action-expand demo-block__action-expand--${expand ? 'show' : 'hide'}`" @click="handleExpand" />
        <ExpandIcon :class="`demo-block__action-expand demo-block__action-expand--${!expand ? 'show' : 'hide'}`" @click="handleExpand" />
      </button>
    </section>

    <section v-if="render" v-show="expand" class="demo-block__code" v-html="render" />
  </article>

  <div v-else-if="render" v-html="render" />
</template>

<style lang="sass" scoped>
section
  padding: 8px 24px
  color: var(--vp-c-text-1)
  font-size: 14px
  line-height: 2
  border-radius: 0

  @media (max-width: 960px)
    padding-inline: 16px

  & + section
    border-block-start: 1px solid var(--vp-c-divider)

  &:first-of-type
    border-radius: var(--demo-block-border-radius) var(--demo-block-border-radius) 0 0

  &:last-of-type
    border-radius: 0 0 var(--demo-block-border-radius) var(--demo-block-border-radius)

.demo-block
  --demo-block-border-radius: 4px

  margin: 0 0 16px 0
  overflow: hidden
  color: var(--vp-c-text-1)
  border: 1px solid var(--vp-c-border)
  border-radius: var(--demo-block-border-radius)
  transition: border-color 0.25s

  &--active
    border-color: var(--vp-c-brand)

  &__title
    padding-block-start: 10px
    color: var(--vp-custom-block-tip-text)
    background-color: var(--vp-custom-block-tip-bg)

  &__description
    color: var(--vp-custom-block-info-text)
    background-color: var(--vp-custom-block-info-bg)

    :deep(p)
      margin-block: 2px

  &__demo
    // background-color: var(--vp-c-bg-alt)

    :deep(p)
      margin-block: 0

  &__code
    padding: 0

    :deep(div[class*='language-'])
      margin: 0
      border-radius: inherit

  &__actions
    display: flex
    justify-content: center
    align-items: center
    gap: 16px
    color: var(--vp-custom-block-info-text)
    background-color: var(--vp-custom-block-info-bg)

  &__action
    position: relative
    opacity: 0.55
    transition: color .25s, opacity .25s
    color: inherit

    &:hover
      color: inherit
      opacity: 1

    svg
      width: 24px
      height: 24px

  &__action-expand
    user-select: none
    pointer-events: none

    + .demo-block__action-expand
      position: absolute
      inset: 0

    &--show
      pointer-events: auto

    &--hide
      opacity: 0
</style>
