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

export function createMappedFilterFn(config: { key?: string | null, compareType?: 'includes' | 'startsWidth' | 'endsWidth' } = { compareType: 'includes' }) {
  return function <T>(search: string, list: Array<T>) {
    if ([null, undefined, ''].includes(search)) {
      return list;
    }

    const needle = String(search).toLocaleLowerCase();
    return [null, undefined, ''].includes(config.key)
      ? list.filter((item) => String(item).toLocaleLowerCase()[config.compareType](needle))
      : list.filter((item) => String(item[config.key]).toLocaleLowerCase()[config.compareType](needle));
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
    <div class="q-pa-md column q-gutter-y-md" style="max-width: 300px">
      <q-select
        style="width: 250px"
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
        style="width: 250px"
        v-model="model2"
        label="Obj filter"
        v-bind="filteredSelectProps2"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        style="width: 250px"
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
        style="width: 250px"
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
        style="width: 250px"
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
  createMappedFilterFn({ key: 'label', compareType: 'startsWidth' }),
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
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FuseFilteredSelect.ts&prod=&preview=t&previewMode=preview&editor=mirror#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"
/>
