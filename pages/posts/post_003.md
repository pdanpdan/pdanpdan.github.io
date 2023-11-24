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

The search function generator `createMappedFilterFn` gets a configuration object and returns a generic filtering function. You can specify (object and all configs are optional):
- `key`: what key in the items to use (leave empty to search in the whole item as string)
- `compareType`: one of 'includes', 'startsWith', or 'endsWith' (defaults to 'includes')
- `getMatchFn`: a function that takes what you are searching for (needle) and returns a function that takes an item and returns a truthy value (if it matches or not) - you can use this to customize for special cases


::: code-group
```ts [useFilteredSelect.ts]
import { shallowRef, unref, reactive, type MaybeRef, type ShallowRef } from 'vue';
import type { QSelect, QSelectProps } from 'quasar';

type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

export function createMappedFilterFn(config?: {
  key?: string | null;
  compareType?: 'includes' | 'startsWith' | 'endsWith';
  getMatchFn?: (needle: string) => <T>(item: T, index: number, list: T[]) => boolean;
}) {
  const compareType = config?.compareType || 'includes';
  const key = config?.key || '';
  const getMatchFn = config?.getMatchFn || (
    key !== ''
      ? (needle: string) => <T extends Record<string, unknown>>(item: T) => String(item[ key ]).toLocaleLowerCase()[ compareType ](needle)
      : (needle: string) => <T>(item: T) => String(item).toLocaleLowerCase()[ compareType ](needle)
  );

  return function <T>(search: string, list: T[]) {
    if ([ null, undefined, '' ].includes(search)) {
      return list;
    }

    const needle = String(search).toLocaleLowerCase();

    return list.filter(getMatchFn(needle) as (item: T) => boolean);
  };
}

export const stringFilterFn = createMappedFilterFn();
export const noFilterFn = <T>(_: unknown, items: T[]) => items;

export function useFilteredSelect<T, K extends keyof QSelectProps>(
  optionsOrFn:
    | MaybeRef<T[]>
    | ((search: string) => MaybePromise<MaybeRef<T[]>>),
  filterFn: (search: string, list: T[]) => T[] = stringFilterFn,
  props?: Pick<QSelectProps, K>,
  afterFn?: (ref: QSelect) => void,
) {
  const getOptions = typeof optionsOrFn === 'function' ? optionsOrFn : () => optionsOrFn;
  const filteredOpts = shallowRef(typeof optionsOrFn === 'function' ? [] : optionsOrFn);

  const useProps: Pick<QSelectProps, K> | { options: ShallowRef<QSelectProps[ 'options' ]>, onFilter: QSelectProps[ 'onFilter' ]; } = {
    ...props,
    options: filteredOpts,
    onFilter(
      search: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
      abortFn: () => void,
    ) {
      Promise.resolve(getOptions(search))
        .then((options) => {
          const newOpts = filterFn(search, unref(options));
          doneFn(() => {
            filteredOpts.value = newOpts;
          }, afterFn);
        })
        .catch(() => {
          abortFn();
        });
    },
  };

  return reactive(useProps);
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
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FuseFilteredSelect.ts&preview=t&previewMode=preview&editor=codemirror#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"
/>
