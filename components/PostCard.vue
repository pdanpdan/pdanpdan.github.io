<template>
  <component
    :is="header ? 'section' : 'a'"
    class="card"
    :class="{ featured: featured && !header }"
    :href="href"
  >
    <script-tag :meta="meta" />

    <article :class="{ active: !header }">
      <img
        v-if="imageSrc"
        class="thumbnail"
        :src="imageSrc"
        :alt="title"
      />

      <div class="main">
        <section class="card__content">
          <component :is="header ? 'h1' : 'h2'" class="title" :id="titleId">{{ title }}</component>
          <p v-if="excerpt" class="excerpt">{{ excerpt }}</p>
        </section>

        <section class="info">
          <div class="tags">
            <span v-for="tag in tags" :key="tag" v-text="tag" />
          </div>

          <div class="meta">
            <div v-if="author">
              by
              <address v-text="author" />
            </div>
            <div v-if="date && date.iso">
              <time pubdate :datetime="date.iso" v-text="date.pretty" />
            </div>
          </div>
        </section>
      </div>
    </article>
  </component>
</template>

<script>
import { withBase } from 'vitepress';

import ScriptTag from 'components/ScriptTag.vue';

const images = import.meta.glob('pages/posts/*.{jpg,png}', { eager: true, as: 'url' });

export default {
  props: {
    title: {
      type: String,
      default: 'MISSING TITLE',
    },
    excerpt: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    date: {
      type: Object,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    tags: {
      type: Array,
      default: null,
    },
    header: Boolean,
    featured: Boolean,
  },

  components: {
    ScriptTag,
  },

  computed: {
    meta() {
      return JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Article',
        headline: this.title,
        description: this.excerpt,
        thumbnailUrl: this.image,
        author: {
          '@type': 'Person',
          name: this.author,
        },
        datePublished: this.date ? this.date.iso : null,
      });
    },

    imageSrc() {
      if (images[`${ this.image }.jpg`]) {
        return withBase(images[`${ this.image }.jpg`]);
      }
      if (images[`${ this.image }.png`]) {
        return withBase(images[`${ this.image }.png`]);
      }
      return null;
    },

    titleId() {
      return `d_${ this.href.split('.')[0].split('/').join('-') }`;
    },
  },
};
</script>

<style lang="sass" scoped>
.card
  display: block
  width: 100%

  + .card
    margin-top: 2rem

  &.featured
    transform: scale(1.04, 1.04)

    article
      border: 2px solid var(--vp-c-brand-3)
      box-shadow: var(--vp-shadow-3), var(--vp-shadow-2)

article
  display: flex
  overflow: hidden
  border-radius: 0.5em
  border: 1px solid var(--vp-c-border)
  background-color: var(--vp-c-bg-alt)
  box-shadow: var(--vp-shadow-1)
  transition: box-shadow 0.25s, background-color 0.25s

  &.active:hover
    background-color: var(--vp-c-bg-elv)
    box-shadow: var(--vp-shadow-2)

  @media (max-width: 960px)
    flex-direction: column

.thumbnail
  max-width: 45%
  max-height: 200px
  aspect-ratio: 16/9
  object-fit: cover
  order: 1

  @media (max-width: 960px)
    max-width: 100%
    border-radius: 0.5em 0.5em 0 0

  @media (min-width: 961px)
    margin-inline: 0 1em
    border-radius: 0.5em 0 0 0.5em

    .card:nth-of-type(2n) &
      order: 2
      margin-inline: 1em 0
      border-radius: 0 0.5em 0.5em 0

.main
  padding: 1em
  flex-grow: 1
  order: 1
  display: flex
  flex-direction: column

  @media (max-width: 960px)
    padding: 2em 1em 1em 1em

.card__content
  flex-grow: 1
  padding-inline: 8px

  .title
    color: var(--vp-c-brand)
    font-size: 1.2em
    font-weight: bold

    margin: 8px 0 24px 0
    padding: 0
    border: none
    letter-spacing: 0
    line-height: 1.3

  p
    margin-block: 3px
    line-height: 1.4

.info
  display: flex
  align-items: flex-end
  flex-wrap: nowrap
  padding-block-start: 1.5em

.tags
  flex-grow: 1
  display: flex
  flex-wrap: wrap
  gap: 0.4em
  padding-inline-end: 1em

  span
    font-size: 0.9em
    border-radius: 0.8em
    padding: 0.1em 0.8em
    font-family: var(--vp-font-family-mono)
    color: var(--vp-badge-info-text)
    background-color: var(--vp-badge-info-bg)

.meta
  font-size: 0.7em
  color: var(--vp-c-text-3)
  text-align: end
  line-height: 1.5

address
  display: inline
  font-weight: bold

time
  font-weight: bold
</style>
