<script setup>
import { ref } from 'vue';

defineProps({
  src: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    default: '',
  },
});

const zoomed = ref(false);
</script>

<template>
  <div class="vp-quasar-repl" :class="{ 'vp-quasar-repl--zoomed': zoomed }">
    <div class="vp-quasar-repl__container">
      <iframe
        loading="lazy"
        allow="fullscreen; camera; geolocation; gyroscope; microphone; web-share; storage-access; clipboard-write"
        :areaLabel="`Demo${ title.trim().length > 0 ? `: ${ title }` : '' }`"
        :title="`Demo${ title.trim().length > 0 ? `: ${ title }` : '' }`"
        :src="src"
      />

      <button
        type="button"
        class="vp-quasar-repl__zoom"
        :class="{ 'vp-quasar-repl__zoom--active': zoomed }"
        aria-label="Zoom"
        @click="zoomed = zoomed !== true"
      >
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M288 928h-96c-52.8 0-96-43.2-96-96v-96c0-17.6 14.4-32 32-32s32 14.4 32 32v96c0 17.6 14.4 32 32 32h96c17.6 0 32 14.4 32 32s-14.4 32-32 32z m544 0h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96c17.6 0 32-14.4 32-32v-96c0-17.6 14.4-32 32-32s32 14.4 32 32v96c0 52.8-43.2 96-96 96z m64-608c-17.6 0-32-14.4-32-32v-96c0-17.6-14.4-32-32-32h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96c52.8 0 96 43.2 96 96v96c0 17.6-14.4 32-32 32z m-768 0c-17.6 0-32-14.4-32-32v-96c0-52.8 43.2-96 96-96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32h-96c-17.6 0-32 14.4-32 32v96c0 17.6-14.4 32-32 32z m544 448H352c-52.8 0-96-43.2-96-96V352c0-52.8 43.2-96 96-96h320c52.8 0 96 43.2 96 96v320c0 52.8-43.2 96-96 96zM352 320c-17.6 0-32 14.4-32 32v320c0 17.6 14.4 32 32 32h320c17.6 0 32-14.4 32-32V352c0-17.6-14.4-32-32-32H352z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.vp-quasar-repl
  display: flex
  flex-direction: column
  aspect-ratio: 5/4.5
  max-height: 110svh
  width: 100%
  margin-block-start: 24px

  @media (orientation: portrait)
    aspect-ratio: 9/18
    max-height: 90svh

  > .vp-quasar-repl__container
    position: relative
    flex: 1 1 auto
    margin-inline: -24px
    overflow: auto
    overscroll-behavior: contain

    iframe
      width: 100%
      height: 100%
      outline: none
      border: none

    @media (min-width: 640px)
      margin-inline: 0
      box-shadow: var(--vp-shadow-2)

  &--zoomed
    @media (min-width: 1280px)
      aspect-ratio: 9/18
      max-height: calc(98svh - var(--vp-nav-height) - var(--vp-layout-top-height, 0px) - var(--vp-doc-top-height, 0px))

    > .vp-quasar-repl__container
      @media (min-width: 1280px)
        margin-inline: -128px -384px
        z-index: 1

      @media (min-width: 1600px)
        margin-inline: -256px -512px

.vp-quasar-repl__zoom
  display: none
  position: absolute
  padding: 0
  width: 32px
  height: 32px
  inset: auto 24px 24px auto
  border-radius: 4px
  border: 1px solif var(--vp-button-alt-border)
  background-color: var(--vp-c-bg)
  z-index: 1

  @media (min-width: 1280px)
    display: block

  > svg
    position: absolute
    border-radius: 4px
    inset: 0
    pointer-events: none
    background-color: var(--vp-button-alt-bg)
    color: var(--vp-button-alt-text)

    &:hover
      border: 1px solif var(--vp-button-alt-hover-border)
      color: var(--vp-button-alt-hover-text)
      background-color: var(--vp-button-alt-hover-bg)

    &:active
      border: 1px solif var(--vp-button-alt-active-border)
      color: var(--vp-button-alt-active-text)
      background-color: var(--vp-button-alt-active-bg)

  &--active > svg
    color: var(--vp-button-brand-text)
    background-color: var(--vp-button-brand-bg)

    &:hover
      color: var(--vp-button-brand-hover-text)
      background-color: var(--vp-button-brand-hover-bg)

    &:active
      color: var(--vp-button-brand-active-text)
      background-color: var(--vp-button-brand-active-bg)
</style>
