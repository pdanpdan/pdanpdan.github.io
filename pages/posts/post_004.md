---
title: Numeric fields with increment / decrement buttons
description: Create numeric input fields with custom buttons using QInput and QBtn or change value by dragging.
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

You need to create numeric form field with buttons to increase / decrease the value.

## Solution

Use a base QInput and use the `#before`, `#prepend` `#append`, or `#after` slots to place the buttons.

Use `vTouchRepeat` to change value as long as a button is pressed.

Use `vTouchPan` to change the value by dragging.


::: code-group
```vue [MyButtons.vue]
<template>
  <div class="col column no-wrap">
    <div class="q-pa-md column q-gutter-y-md" style="max-width: 400px">
      <q-input
        style="max-width: 200px"
        v-model.number="model"
        type="number"
        :step="1"
        standout
        dense
        color="primary"
        input-class="text-right q-no-input-spinner"
      >
        <template v-slot:prepend>
          <q-btn
            style="margin-left: -12px; border-top-right-radius: 0; border-bottom-right-radius: 0"
            unelevated
            color="red-6"
            icon="remove"
            padding="sm"
            v-touch-repeat:0:500:100.mouse.enter.space="decrement"
          />
        </template>

        <template v-slot:append>
          <q-btn
            style="margin-right: -12px; border-top-left-radius: 0; border-bottom-left-radius: 0"
            unelevated
            color="green-6"
            icon="add"
            padding="sm"
            v-touch-repeat:0:500:100.mouse.enter.space="increment"
          />
        </template>
      </q-input>

      <q-input
        style="max-width: 200px"
        v-model.number="model"
        type="number"
        :step="1"
        outlined
        dense
        color="primary"
        input-class="text-right q-no-input-spinner"
      >
        <template v-slot:prepend>
          <q-icon
            style="cursor: ns-resize"
            name="swap_vert"
            v-touch-pan.vertical.mouse.prevent="onPan"
          />
        </template>

        <template v-slot:append>
          <q-btn
            flat
            color="primary"
            icon="remove_circle_outline"
            padding="7px"
            v-touch-repeat:0:500:100.mouse.enter.space="decrement"
          />

          <q-btn
            style="margin-right: -11px"
            flat
            color="primary"
            icon="add_circle_outline"
            padding="7px"
            v-touch-repeat:0:500:100.mouse.enter.space="increment"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(0);
let onPanTimer = null;
let onPanValue = 0;

function increment() {
  model.value += 1;
}

function decrement() {
  model.value -= 1;
}

function onPan({ offset, isFirst, isFinal }) {
  onPanValue = Math.sign(-Math.floor(offset.y / 30));

  if (onPanTimer !== null) {
    clearInterval(onPanTimer);
  }

  if (isFinal !== true && onPanValue !== 0) {
    model.value += onPanValue;
    onPanTimer = setInterval(() => {
      model.value += onPanValue;
    }, Math.max(20, 10000 / Math.abs(offset.y)));
  } else {
    onPanTimer = null;
  }
}
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#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"
/>
