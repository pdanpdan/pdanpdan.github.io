---
title: Resizable drawer in Quasar
description: Create a drawer width resizable width.
date: 2023-11-24
tags: [quasar]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

You need a resizable drawer - change width with you mouse or keys.

## Solution

Use a div and vTouchPan to resize.

::: code-group
```vue [MyLayout.vue]
<template>
  <div class="q-pa-md">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 300px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="drawerWidth"
        :breakpoint="0"
        bordered
      >
        <q-list>
          <q-item v-for="i in 5" :key="i" clickable v-ripple>
            <q-item-section> Menu item {{ i }} </q-item-section>
          </q-item>
        </q-list>
        <!-- NEXT LINE -->
        <div
          autofocus
          tabindex="0"
          v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer"
          @keydown="resizeDrawer"
          class="q-drawer__resizer"
        />
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style>
.q-drawer__resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  width: 4px;
  background-color: #999;
  cursor: ew-resize;
}

.q-drawer__resizer:after {
  content: '';
  position: absolute;
  top: 50%;
  height: 30px;
  left: -5px;
  right: -5px;
  transform: translateY(-50%);
  background-color: inherit;
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

let initialDrawerWidth;
const drawerWidth = ref(300);
const drawer = ref(true);

function resizeDrawer(ev) {
  if (ev.type === 'keydown') {
    if (ev.code === 'ArrowLeft') {
      drawerWidth.value -= 1;
    } else if (ev.code === 'ArrowRight') {
      drawerWidth.value += 1;
    }
  } else {
    if (ev.isFirst === true) {
      initialDrawerWidth = drawerWidth.value;
    }
    drawerWidth.value = initialDrawerWidth + ev.offset.x;
  }
  drawerWidth.value = initialDrawerWidth + ev.offset.x
}
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#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"
/>
