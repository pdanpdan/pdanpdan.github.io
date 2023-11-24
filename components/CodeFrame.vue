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
        :areaLabel="`Demo${ this.title.trim().length > 0 ? `: ${ this.title }` : '' }`"
        :title="`Demo${ this.title.trim().length > 0 ? `: ${ this.title }` : '' }`"
        :src="src"
      />

      <button
        type="button"
        class="vp-quasar-repl__zoom"
        :class="{ 'vp-quasar-repl__zoom--active': zoomed }"
        aria-label="Zoom"
        @click="zoomed = zoomed !== true"
      >
        <div />
      </button>
    </div>
  </div>
</template>

<style lang="sass">
:root
  --vp-icon-zoom: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yODggOTI4aC05NmMtNTIuOCAwLTk2LTQzLjItOTYtOTZ2LTk2YzAtMTcuNiAxNC40LTMyIDMyLTMyczMyIDE0LjQgMzIgMzJ2OTZjMCAxNy42IDE0LjQgMzIgMzIgMzJoOTZjMTcuNiAwIDMyIDE0LjQgMzIgMzJzLTE0LjQgMzItMzIgMzJ6IG01NDQgMGgtOTZjLTE3LjYgMC0zMi0xNC40LTMyLTMyczE0LjQtMzIgMzItMzJoOTZjMTcuNiAwIDMyLTE0LjQgMzItMzJ2LTk2YzAtMTcuNiAxNC40LTMyIDMyLTMyczMyIDE0LjQgMzIgMzJ2OTZjMCA1Mi44LTQzLjIgOTYtOTYgOTZ6IG02NC02MDhjLTE3LjYgMC0zMi0xNC40LTMyLTMydi05NmMwLTE3LjYtMTQuNC0zMi0zMi0zMmgtOTZjLTE3LjYgMC0zMi0xNC40LTMyLTMyczE0LjQtMzIgMzItMzJoOTZjNTIuOCAwIDk2IDQzLjIgOTYgOTZ2OTZjMCAxNy42LTE0LjQgMzItMzIgMzJ6IG0tNzY4IDBjLTE3LjYgMC0zMi0xNC40LTMyLTMydi05NmMwLTUyLjggNDMuMi05NiA5Ni05Nmg5NmMxNy42IDAgMzIgMTQuNCAzMiAzMnMtMTQuNCAzMi0zMiAzMmgtOTZjLTE3LjYgMC0zMiAxNC40LTMyIDMydjk2YzAgMTcuNi0xNC40IDMyLTMyIDMyeiBtNTQ0IDQ0OEgzNTJjLTUyLjggMC05Ni00My4yLTk2LTk2VjM1MmMwLTUyLjggNDMuMi05NiA5Ni05NmgzMjBjNTIuOCAwIDk2IDQzLjIgOTYgOTZ2MzIwYzAgNTIuOC00My4yIDk2LTk2IDk2ek0zNTIgMzIwYy0xNy42IDAtMzIgMTQuNC0zMiAzMnYzMjBjMCAxNy42IDE0LjQgMzIgMzIgMzJoMzIwYzE3LjYgMCAzMi0xNC40IDMyLTMyVjM1MmMwLTE3LjYtMTQuNC0zMi0zMi0zMkgzNTJ6Ii8+Cjwvc3ZnPgo=')
</style>

<style lang="sass" scoped>
.vp-quasar-repl
  display: flex
  flex-direction: column
  aspect-ratio: 5/4.5
  max-height: 110dvh
  width: 100%
  margin-block-start: 24px

  @media (orientation: portrait)
    aspect-ratio: 9/18
    max-height: 90dvh

  > .vp-quasar-repl__container
    position: relative
    flex: 1 1 auto
    margin-inline: -24px

    iframe
      overflow: auto
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
      max-height: 98dvh

    > .vp-quasar-repl__container
      @media (min-width: 1280px)
        margin-inline: -128px -384px
        z-index: var(--vp-z-index-sidebar)

      @media (min-width: 1600px)
        margin-inline: -256px -512px

.vp-quasar-repl__zoom
  position: absolute
  padding: 0
  width: 32px
  height: 32px
  inset: auto 4px 4px auto
  border-radius: 4px
  border: 1px solif var(--vp-button-alt-border)
  background-color: var(--vp-button-alt-bg)
  z-index: var(--vp-z-index-sidebar)

  > div
    position: absolute
    inset: 2px
    mask: var(--vp-icon-zoom) no-repeat 100% 100%
    mask-size: cover
    background-color: var(--vp-button-alt-text)

  &:hover
    border: 1px solif var(--vp-button-alt-hover-border)
    background-color: var(--vp-button-alt-hover-bg)
    > div
      background-color: var(--vp-button-alt-hover-text)

  &:active
    border: 1px solif var(--vp-button-alt-active-border)
    background-color: var(--vp-button-alt-active-bg)
    > div
      background-color: var(--vp-button-alt-active-text)

  &--active
    background-color: var(--vp-button-brand-bg)
    > div
      background-color: var(--vp-button-brand-text)

    &:hover
      background-color: var(--vp-button-brand-hover-bg)
      > div
        background-color: var(--vp-button-brand-hover-text)

    &:active
      background-color: var(--vp-button-brand-active-bg)
      > div
      background-color: var(--vp-button-brand-active-text)
</style>
