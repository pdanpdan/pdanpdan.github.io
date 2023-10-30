<script lang="ts" setup>
import { computed, onMounted, shallowRef } from 'vue';

import siteDemos from '@siteDemo';

import { useSiteDemos } from './hooks/site-demo.js';
import { useClipboard } from './hooks/clip-board.js';

import ExpandComp from './icons/ExpandIcon.vue';
import UnExpand from './icons/UnExpandIcon.vue';
import FileCopy from './icons/FileCopyIcon.vue';
import FileSuccess from './icons/FileSuccessIcon.vue';
import Codepen from './icons/CodepenIcon.vue';

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

const { demo, render, content, code } = useSiteDemos( props, siteDemoData );

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
    'App.vue': code.value,
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
  <fieldset v-if="!raw" class="demo-block" :class="{ 'demo-block--active': hash === titleId }">
    <legend v-if="content?.title || title" class="demo-block__title">
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
    </legend>

    <section v-if="content?.content || desc" class="demo-block__description" v-html="content?.content ?? desc" />

    <section v-if="demo" class="demo-block__demo">
      <component :is="demo" />
    </section>

    <section class="demo-block__actions">
      <a
        v-if="content?.codepen"
        class="demo-block__action"
        :href="sfcPlaygroundUrl"
        target="_blank"
      >
        <Codepen />
      </a>

      <button v-if="code" class="demo-block__action">
        <FileCopy v-if="!copied" @click="handleCopy" />
        <FileSuccess v-else style="color: var(--vp-c-brand)" />
      </button>

      <button v-if="code" class="demo-block__action">
        <UnExpand :class="`demo-block__action-expand demo-block__action-expand--${expand ? 'show' : 'hide'}`" @click="handleExpand" />
        <ExpandComp :class="`demo-block__action-expand demo-block__action-expand--${!expand ? 'show' : 'hide'}`" @click="handleExpand" />
      </button>
    </section>

    <section v-if="render" v-show="expand" class="demo-block__code" v-html="render" />
  </fieldset>

  <div v-else-if="render" v-html="render" />
</template>

<style lang="sass" scoped>
section
  padding-inline: 16px
  color: var(--vp-c-text-1)
  font-size: 14px
  line-height: 2
  border-radius: 0

  & + section
    border-block-start: 1px solid var(--vp-c-divider)

  &:first-of-type
    border-radius: var(--demo-block-border-radius) var(--demo-block-border-radius) 0 0

  &:last-of-type
    border-radius: 0 0 var(--demo-block-border-radius) var(--demo-block-border-radius)

.demo-block
  --demo-block-icon-color: var(--vp-button-alt-text)
  --demo-block-icon-color-hover: var(--vp-button-alt-hover-text)
  --demo-block-border-radius: 4px

  margin: 0 0 16px 0
  color: var(--vp-c-text-1)
  border: 1px solid var(--vp-c-border)
  border-radius: var(--demo-block-border-radius)
  transition: border-color 0.25s

  &--active
    border-color: var(--vp-c-brand)

  &__title
    margin-inline-start: 16px
    padding: 5px 24px 4px 24px
    border: inherit
    border-radius: inherit

  &__description
    padding-block: 8px 16px

    &::v-deep p
      margin-block: 2px

  &__demo
    padding-block: 16px
    background-color: var(--vp-c-bg-alt)

    &::v-deep p
      margin-block: 0

  &__code
    padding-inline: 0
    overflow: auto

    &::v-deep div[class*='language-']
      margin: 0
      border-radius: inherit

  &__actions
    display: flex
    justify-content: center
    align-items: center
    gap: 24px
    padding-block: 8px

  &__action
    position: relative
    color: var(--demo-block-icon-color)
    transition: color .25s

    &:hover
      color: var(--demo-block-icon-color-hover)

    svg
      width: 24px
      height: 24px

  &__action-expand
    user-select: none
    transition: opacity .25s

    + .demo-block__action-expand
      position: absolute
      inset: 0

    &--show
      opacity: 0.55
      pointer-events: auto

      &:hover
        opacity: 1

    &--hide
      opacity: 0
      pointer-events: none
</style>
