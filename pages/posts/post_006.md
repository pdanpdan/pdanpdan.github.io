---
title: Mini drawer in Quasar that expands when focused and on mouse over
description: Create slim drawers that expand on focus and on mouse over and stays open while you navigate its menus.
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

You want to free screen estate and use amini/slim drawer, but you want it to expand when it is focused and on mouse over.

## Solution

Nothing very complex, you just need:

- a flag variable for the mini state of the drawer
- a flag variable for when a menu from the drawer is opened.
- only display the mini menu when it should be mini and there is no menu open

::: code-group
```vue [MyLayout.vue]
<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" container style="height: 400px" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat autofocus label="Focus helper - tab from here to get in the drawer" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState === true && miniMenuOpen !== true"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        @focusin="miniState = false"
      	@focusout="miniState = true"

        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <q-item class="q-pr-xs" clickable dense v-ripple>
              <q-item-section avatar>
                <q-icon class="q-py-sm" name="inbox" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  Menu1
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="more_vert" color="grey" dense flat round @click.stop>
                  <q-menu
                          anchor="top left"
                          self="top left"
                          auto-close
                          @before-show="miniMenuOpen = true"
                          @hide="miniMenuOpen = false"
                  >
                    <q-list dense>
                      <q-item clickable>
                        <q-item-section>Open in a new Tab</q-item-section>
                        <q-item-section avatar>
                          <q-icon name="star" color="yellow" />
                        </q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Add to Favorite</q-item-section>
                        <q-item-section avatar>
                          <q-icon name="open_in_new" color="primary" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
          </p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);
const miniState = ref(true);
const miniMenuOpen = ref(false);
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#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"
/>
