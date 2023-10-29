<template>
  <a class="card" :href="href">
    <script-tag :meta="meta" />

    <article class="content">
      <img
        v-if="image"
        class="media"
        :src="imageSrc"
        :alt="title"
      />

      <div class="details">
        <div class="article">
          <h2 class="title">{{ title }}</h2>
          <p v-if="excerpt" class="excerpt">{{ excerpt }}</p>
        </div>

        <div class="author">
          <template v-if="author">
            by
            <address v-text="author" />
          </template>
          <template v-if="date.iso">
            @
            <time pubdate :datetime="date.iso" v-text="date.pretty" />
          </template>
        </div>
      </div>
    </article>
  </a>
</template>

<script>
import { withBase } from 'vitepress';

import ScriptTag from 'components/ScriptTag.vue';

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

    images: {
      type: Object,
      default: null,
    },
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
        description: this.date.excerpt,
        thumbnailUrl: this.image,
        author: {
          '@type': 'Person',
          name: this.author,
        },
        datePublished: this.date.iso,
      });
    },

    imageSrc() {
      const key = `./${this.image.split('/').slice(-1)[0]}`;

      return withBase(this.images[key] || this.image);
    },
  },
};
</script>

<style lang="sass" scoped>
.card
  display: block
  width: 100%

  + .card
    margin-top: 1.5rem

.content
  display: flex
  border-radius: 0.5em
  overflow: hidden
  background: var(--vp-c-bg-soft)
  box-shadow: var(--vp-shadow-1)
  transition: 0.25s box-shadow

  &:hover
    box-shadow: var(--vp-shadow-2)

  @media (max-width: 960px)
    flex-direction: column

.media
  max-width: 45%
  max-height: 200px
  aspect-ratio: 16/9
  object-fit: cover

  @media (max-width: 960px)
    max-width: 100%

.details
  padding: 1em 2em
  flex-grow: 1
  display: flex
  flex-direction: column

  @media (max-width: 960px)
    padding: 2em 2em 1em 2em

.article
  flex-grow: 1

.title
  color: var(--vp-c-brand)
  font-size: 1.2em
  font-weight: bold

.author
  text-align: end
  font-size: 0.7em
  color: var(--vp-c-text-3)

address
  display: inline
  font-weight: bold

time
  font-weight: bold
</style>
