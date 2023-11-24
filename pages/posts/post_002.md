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
<q-input class="q-field--grouped-before" v-model="text" outlined dense>
  <template #before>
    <q-select
      v-model="select"
      outlined
      dense
      :options="options"
    />
  </template>

  <template #append>
    <q-icon name='search' />
  </template>
</q-input>

<q-input class="q-field--grouped-after" v-model="text" outlined>
  <template #after>
    <q-select
      v-model="select"
      outlined
      :options="options"
    />
  </template>

  <template #prepend>
    <q-icon name='search' />
  </template>
</q-input>
```

```sass [sass]
.q-field
  &.q-field--grouped-before
    > .q-field__before
      padding-inline-end: 0

      > .q-field--outlined
        margin-inline-end: -1px

      > .q-field--outlined,
      > .q-field--filled
        .q-field__inner > .q-field__control
          border-start-end-radius: 0
          border-end-end-radius: 0

      > .q-field--filled,
      > .q-field--standard
        .q-field__inner > .q-field__control:after
          transform-origin: right bottom

    > .q-field__inner > .q-field__control
      border-start-start-radius: 0
      border-end-start-radius: 0

    &.q-field--outlined > .q-field__inner > .q-field__control
      margin-inline-start: -1px

      &:not(:hover):before
        border-inline-start-color: transparent

    &.q-field--filled,
    &.q-field--standard
      > .q-field__inner > .q-field__control:after
        transform-origin: left bottom

  &.q-field--grouped-after
    > .q-field__after
      padding-inline-start: 0

      > .q-field.q-field--outlined
        margin-inline-start: -1px

      > .q-field--outlined,
      > .q-field--filled
        .q-field__inner > .q-field__control
          border-start-start-radius: 0
          border-end-start-radius: 0

      > .q-field--filled,
      > .q-field--standard
        .q-field__inner > .q-field__control:after
          transform-origin: left bottom

    > .q-field__inner > .q-field__control
      border-start-end-radius: 0
      border-end-end-radius: 0

    &.q-field--outlined > .q-field__inner > .q-field__control
      margin-inline-end: -1px

      &:not(:hover):before
        border-inline-end-color: transparent

    &.q-field--filled,
    &.q-field--standard
      > .q-field__inner > .q-field__control:after
        transform-origin: right bottom

    &.q-field--grouped-before
      > .q-field__after > .q-field.q-field--outlined
        margin-inline-start: -3px

      &.q-field--filled,
      &.q-field--standard
        > .q-field__inner > .q-field__control:after
          transform-origin: center bottom
          transition-delay: 0.26s

      &.q-field--highlighted
        &.q-field--filled,
        &.q-field--standard
          > .q-field__inner > .q-field__control:after
            transition-delay: 0s

        > .q-field__before > .q-field,
        > .q-field__after > .q-field
          &.q-field--filled,
          &.q-field--standard
            > .q-field__inner > .q-field__control:after
              transition-delay: .26s
```
:::

## Demo

The Vue REPL does not support processing SASS syntax yet, so the styles are converted to CSS.

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2Fstyles.css&preview=t&previewMode=preview&editor=codemirror#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"
/>
