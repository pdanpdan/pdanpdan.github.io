---
title: Grouping form elements in Quasar
description: Explain styling needed to group form elements in Quasar in order to make them look like a single element.
date: 2023-11-20
tags: [quasar, css]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

You need to group two Quasar form components together (most frequently a QInput and a QSelect).

## Solution

First you combine the components, and then you need some CSS to make it look good. It works both for LTR and RTL languages.

::: warning
Take care not to mix `dense` and not `dense` components.
:::

::: code-group
```html [html]
<q-input class="grouped-outline grouped-outline--before" v-model="text" outlined dense>
  <template #before>
    <q-select
      v-model="select"
      outlined
      dense
      :options="options"
    ></q-select>
  </template>

  <template #append>
    <q-icon name='search'></q-icon>
  </template>
</q-input>

<q-input class="grouped-outline grouped-outline--before" v-model="text" outlined>
  <template #after>
    <q-select
      v-model="select"
      outlined
      :options="options"
    ></q-select>
  </template>

  <template #prepend>
    <q-icon name='search'></q-icon>
  </template>
</q-input>
```

```sass [sass]
.q-field.grouped-outline
  &--before
    > .q-field__before
      padding-inline-end: 0

      > .q-field--outlined
        margin-inline-end: -1px

        .q-field__inner > .q-field__control
          border-start-end-radius: 0
          border-end-end-radius: 0

    > .q-field__inner > .q-field__control
      border-start-start-radius: 0
      border-end-start-radius: 0
      margin-inline-start: -1px

      &:not(:hover):before
        border-inline-start-color: transparent

  &--after
    > .q-field__after
      padding-inline-start: 0

      > .q-field--outlined
        margin-inline-start: -1px

        .q-field__inner > .q-field__control
          border-start-start-radius: 0
          border-end-start-radius: 0

    > .q-field__inner > .q-field__control
      border-start-end-radius: 0
      border-end-end-radius: 0
      margin-inline-end: -1px

      &:not(:hover):before
        border-inline-end-color: transparent
```
:::

## Demo

The Vue REPL does not support processing SASS syntax yet, so the styles are converted to CSS.

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=mirror#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"
/>
