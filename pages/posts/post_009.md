---
title: Draggable summary-details bottom drawer
description: A draggable bottom drawer/card with two open positions - half and full (summary and details).
date: 2023-11-24
tags: [vue, quasar, css]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

You need a drawer/card on bottom that has two states:

- half open, to show main settings or preview - summary
- full open, to show all settings of details - details

## Solution

This is an example of how to build a custom component bottom drawer.

You can expand it by dragging or by clicking on the pill.

On clicking on the pill the drawer will cycle between `half open`, `full open`, `closed`;

When dragging, on release the drawer will snap to the closest position.

The component exposes three slots:

- `#pill`
- `#summary`
- `#details`

All three slots have access in `slotProps` to:

- `cycleMode` method
- `setMode` method to directly change the `mode`
- `mode` value - current mode, one of `half`, `full`, `handler`

::: code-group

```vue [Demo.vue]
<template>
  <div class="q-pa-md">
    <div v-for="i in 5" class="text-subtitle1 q-py-xl text-center">
      Play with the drawer on bottom
    </div>

    <bottom-drawer>
      <template #pill="{ cycleMode, mode }">
        <span class="text-caption">[{{ mode }}] Drag drawer</span>
        <div class="cursor-pointer" @click="cycleMode"></div>
        <span class="text-caption">or click pill</span>
      </template>

      <template #summary>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
        <div>{{ lorem }}</div>
      </template>

      <template #details>
        <div class="text-h6">Our Changing Planet - only shown when drawer is open</div>
        <div class="text-subtitle2">by John Doe</div>
        <div>{{ lorem }}</div>
      </template>
    </bottom-drawer>
  </div>
</template>

<style lang="sass">
.slide-drawer
  &--bottom
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    background-color: #333
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)
    bottom: unset
    top: 100%
    transition: background-color 0.3s ease-in-out

    > div:last-child,
    > img:last-child
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0

    &.slide-drawer--open-half
      background-color: #014a88

    &.slide-drawer--open-full
      background-color: #01884a

  &__handler
    &--horizontal
      cursor: grab

      > div
        width: 60px
        height: 8px
        border-radius: 4px
        background-color: rgba(200, 200, 200, 0.7)

</style>

<script setup lang="ts">
import BottomDrawer from './BottomDrawer.vue';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
</script>
```

```vue [BottomDrawer.vue]
<template>
  <q-card
    class="slide-drawer slide-drawer--bottom text-white fixed-bottom column no-wrap"
    :class="`slide-drawer--open-${drawerMode}`"
    :style="drawerStyle"
  >
    <q-card-section class="slide-drawer__handler--horizontal row flex-center q-pa-sm q-gutter-x-md" v-touch-pan.mouse.vertical.prevent="slideDrawer">
      <slot name="pill" :cycle-mode="cycleDrawer" :mode="drawerMode" :set-mode="setMode"></slot>
    </q-card-section>

    <q-card-section class="col">
      <slot name="summary" :cycle-mode="cycleDrawer" :mode="drawerMode" :set-mode="setMode"></slot>
    </q-card-section>

    <q-card-section v-if="drawerMode !== 'handler'" class="col">
      <slot name="details" :cycle-mode="cycleDrawer" :mode="drawerMode" :set-mode="setMode"></slot>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  drawerMinHeight: {
    type: Number,
    default: 36,
  },
  drawerTopOffset: {
    type: Number,
    default: 100,
  },
  drawerOpenRatioHalf: {
    type: Number,
    default: 50,
  },
});

let animateTimeout = null;

const $q = useQuasar();

const drawerPos = ref(props.drawerMinHeight);

const drawerMaxHeight = computed(() => Math.max(0, $q.screen.height - props.drawerTopOffset));

const drawerOpenRatio = computed(() => Math.round((Math.max(0, drawerPos.value - props.drawerMinHeight) * 100) / Math.max(1, drawerMaxHeight.value - props.drawerMinHeight)));

const drawerStyle = computed(() => ({
  height: `${ drawerMaxHeight.value }px`,
  transform: `translateY(${ -drawerPos.value }px)`,
}));

const drawerMode = computed(() => {
  if (drawerOpenRatio.value > props.drawerOpenRatioHalf) {
    return 'full';
  }

  return drawerOpenRatio.value > 0
    ? 'half'
    : 'handler';
});

function animateDrawerTo (height) {
  if (animateTimeout !== null) {
    clearTimeout(animateTimeout);
  }
  animateTimeout = null;

  const diff = height - drawerPos.value;

  if (diff !== 0) {
    drawerPos.value += Math.abs(diff) < 2 ? diff : Math.round(diff / 2);

    animateTimeout = setTimeout(() => {
      animateDrawerTo(height);
    }, 30);
  }
}

function slideDrawer (ev) {
  const { direction, delta, isFinal } = ev;

  drawerPos.value = Math.max(props.drawerMinHeight, Math.min(drawerMaxHeight.value, drawerPos.value - delta.y));

  if (isFinal === true) {
    nextTick(() => {
      const aboveHalf = drawerOpenRatio.value > props.drawerOpenRatioHalf;
      // eslint-disable-next-line no-nested-ternary
      const targetHeight = direction === 'up'
        ? (aboveHalf ? drawerMaxHeight.value : Math.round(drawerMaxHeight.value / 2))
        : (aboveHalf ? Math.round(drawerMaxHeight.value / 2) : props.drawerMinHeight);

      animateDrawerTo(targetHeight);
    });
  }
}

function cycleDrawer () {
  // eslint-disable-next-line no-nested-ternary
  const targetHeight = drawerMode.value === 'handler'
    ? Math.round(drawerMaxHeight.value / 2)
    : (drawerMode.value === 'half' ? drawerMaxHeight.value : props.drawerMinHeight);

  animateDrawerTo(targetHeight);
}

function setMode(mode: 'half' | 'full' | 'handler') {
  if (['half', 'full', 'handler'].includes(mode)) {
    // eslint-disable-next-line no-nested-ternary
    const targetHeight = mode === 'half'
      ? Math.round(drawerMaxHeight.value / 2)
      : (drawerMode.value === 'full' ? drawerMaxHeight.value : props.drawerMinHeight);

    animateDrawerTo(targetHeight);
  }
}

onBeforeUnmount(() => {
  if (animateTimeout !== null) {
    clearTimeout(animateTimeout);
  }
});
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FBottomDrawer.vue&preview=t&previewMode=preview&editor=codemirror#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"
/>
