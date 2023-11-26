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
  const sign = Math.sign(-offset.y);
  const dist = Math.max(0, Math.abs(offset.y) - 5);
  const newPanValue = sign * Math.ceil(dist / 20);

  if (onPanTimer !== null) {
    clearInterval(onPanTimer);
  }

  if (isFinal !== true && newPanValue !== 0) {
    if (newPanValue !== onPanValue) {
      onPanValue = newPanValue;
      model.value += onPanValue;
    }
    onPanTimer = setInterval(() => {
      model.value += onPanValue;
    }, Math.max(20, 1000 / dist));
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
