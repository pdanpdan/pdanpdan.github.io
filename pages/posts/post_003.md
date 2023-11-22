---
title: Generic composable function for Quasar QSelect with filtering
description: A Vue composable for simplifying the usage of QSelect with filtering in Quasar.
date: 2023-11-21
tags: [quasar, javascript, typescript]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

In order to make a Quasar QSelect filterable you need a `@filter` function that updates a destination variable that is used for `:options`.

Most of the time this requires an original (complete) list of options, a filtering function and a filtered list of options.

## Solution

You can create a composable `useFilteredSelect` that encapsulates and hides all the complexity.

This composable:
- receives as parameters:
  - a list (or ref or computed of a list) of options OR a function returning a list (or ref or computed of a list) of options or a promise of a list
  - an optional filtering function (you can skip this if you want to search the list options as string)
  - an optional object of QSelect `props` (so that you don't need to repeat them for multiple QSelects)
  - a callback function to be called after the QSelect list is updated (it is called with a ref to QSelect)

- returns a reactive object that can be directly use with `v-bind` on QSelect - the returned object has:
  - the optional `props`
  - an `options` key with the filtered list of options
  - an `onFilter` event handler for QSelect

This composable will be combined with a filtering function. There are three pre-defined functions:
- one that filters the options as string, case insensitive, match anywhere
- one that receives a configuration object with the name of a key to search and the compare method and returns a function that filters the list by the content of that key as string, case insensitive, using compare methods (starts width, anywhere, ends with)
- one that returns the whole list (for server side filtering)

::: code-group
```ts [useFilteredSelect.ts]
import { ref, unref, reactive, type MaybeRefOrGetter } from 'vue';

type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

export function createMappedFilterFn(config?: {
  key?: string | null,
  compareType?: 'includes' | 'startsWith' | 'endsWith',
  filter?: <T>(needle: string) => (item: T) => boolean,
}) {
  const compareType = config?.compareType || 'includes';
  const filter = config?.filter || (
    [null, undefined, ''].includes(config?.key)
      ? (needle) => (item) => String(item).toLocaleLowerCase()[compareType](needle)
      : (needle) => (item) => String(item[config.key]).toLocaleLowerCase()[compareType](needle)
  );

  return function <T>(search: string, list: Array<T>) {
    if ([null, undefined, ''].includes(search)) {
      return list;
    }

    const needle = String(search).toLocaleLowerCase();
    return list.filter(filter(needle));
  };
}

export const stringFilterFn = createMappedFilterFn();
export const noFilterFn = <T,>(_, items: Array<T>) => items;

export function useFilteredSelect<O, P extends Record<string, unknown>, QSelRef>(
  optionsOrFn:
    | MaybeRefOrGetter<Array<O>>
    | ((search: string) => MaybePromise<MaybeRefOrGetter<Array<O>>>),
  filterFn: (search: string, list: Array<O>) => Array<O> = stringFilterFn,
  props: P = {} as P,
  afterFn?: (ref: QSelRef) => void,
) {
  const getOptions =
    typeof optionsOrFn === 'function' ? optionsOrFn : () => optionsOrFn;
  const filteredOpts = ref(
    typeof optionsOrFn === 'function' ? [] : optionsOrFn,
  );
  return reactive({
    ...props,
    options: filteredOpts,
    onFilter(
      search: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelRef) => void) => void,
      abortFn: () => void,
    ) {
      Promise.resolve(getOptions(search))
        .then((options: Array<O>) => {
          const newOpts = filterFn(search, unref(options));
          doneFn(() => {
            filteredOpts.value = newOpts;
          }, afterFn);
        })
        .catch(() => {
          abortFn();
        });
    },
  });
}
```

```vue [MyComponent.vue]
<template>
  <div class="col column no-wrap">
    <div class="q-pa-md column q-gutter-y-md" style="max-width: 400px">
      <q-select
        v-model="model1"
        label="String filter"
        v-bind="filteredSelectProps1"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model2"
        label="Obj filter - starts with"
        v-bind="filteredSelectProps2"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model3"
        label="Obj filter - mapped"
        v-bind="filteredSelectProps3"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model4"
        label="String filter - async full list"
        v-bind="filteredSelectProps4"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model5"
        label="String filter - async filtered list"
        v-bind="filteredSelectProps5"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script lang="ts">
const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];

const objOptions = [
  { label: 'Google', value: 1 },
  { label: 'Facebook', value: 2 },
  { label: 'Twitter', value: 3 },
  { label: 'Apple', value: 4 },
  { label: 'Oracle', value: 5 },
];
</script>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useFilteredSelect,
  createMappedFilterFn,
  stringFilterFn,
  noFilterFn,
} from './useFilteredSelect';

const filteredSelectProps1 = useFilteredSelect(
  stringOptions,
  undefined /* same as stringFunctionFn */,
  { outlined: true, useInput: true, inputDebounce: 0 },
);
const filteredSelectProps2 = useFilteredSelect(
  objOptions,
  createMappedFilterFn({ key: 'label', compareType: 'startsWith' }),
  { filled: true, useInput: true, inputDebounce: 0, color: 'red' },
);
const filteredSelectProps3 = useFilteredSelect(
  objOptions,
  createMappedFilterFn({ key: 'label' }),
  { useInput: true, mapOptions: true, emitValue: true, inputDebounce: 0 },
);
const filteredSelectProps4 = useFilteredSelect(
  () =>
    new Promise<Array<string>>((resolve) => {
      setTimeout(() => {
        resolve(stringOptions);
      }, 500);
    }),
  stringFilterFn /* same as undefined */,
  { outlined: true, useInput: true, inputDebounce: 0 },
);
const filteredSelectProps5 = useFilteredSelect(
  (search) =>
    new Promise<Array<string>>((resolve) => {
      setTimeout(() => {
        if ([null, undefined, ''].includes(search)) {
          return resolve(stringOptions);
        }

        const needle = String(search).toLocaleLowerCase();
        resolve(
          stringOptions.filter((item) =>
            String(item).toLocaleLowerCase().includes(needle),
          ),
        );
      }, 500);
    }),
  noFilterFn,
  { outlined: true, useInput: true, inputDebounce: 0 },
);

const model1 = ref(null);
const model2 = ref(null);
const model3 = ref(null);
const model4 = ref(null);
const model5 = ref(null);
</script>
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview&previewMode=preview&editor=codemirror#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"
/>
