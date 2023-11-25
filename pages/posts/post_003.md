---
title: Generic composable function for Quasar QSelect with filtering
description: A Vue composable for simplifying the usage of QSelect with filtering in Quasar.
date: 2023-11-21
tags: [quasar, javascript, typescript]
outline: deep
featured: true
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

In order to make a Quasar QSelect filterable you need a `@filter` function that updates a destination variable that is used for `:options`.

Most of the time this requires an original (complete) list of options, a filtering function and a filtered list of options.

Also you may want to keep the options list opened while filtering (when you are using async filtering).

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
  - a `loading` key with the loading state of the filter (see below)

::: info Keeping the list of options open while filtering
If you want to keep the list of options open while filtering then pass `loading: true` in the `props`.

In that case the returned reactive object will also include a `loading` key that will control the loading indicator on QSelect.
:::

::: warning
The filtered `options` and `loading` status are shared by all QSelects using the same returned reactive object.
:::

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
import { shallowRef, ref, unref, reactive, type MaybeRef, type ShallowRef, type Ref } from 'vue';
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
  const loading = ref(false);
  const keepOpen = props && props['loading'] === true;

  const useProps: Pick<QSelectProps, K> & { options: ShallowRef<QSelectProps[ 'options' ]>, onFilter: QSelectProps[ 'onFilter' ], loading?: Ref<boolean>; } = {
    ...props,
    options: filteredOpts,
    onFilter(
      search: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
      abortFn: () => void,
    ) {
      if (keepOpen === true) {
        doneFn(() => {});
      }
      loading.value = true;

      Promise.resolve(getOptions(search))
        .then((options) => {
          const newOpts = filterFn(search, unref(options));
          doneFn(() => {
            filteredOpts.value = newOpts;
            loading.value = false;
          }, afterFn);
        })
        .catch(() => {
          abortFn();
          loading.value = false;
        });
    },
  };

  if (keepOpen === true) {
    useProps.loading = loading;
  }

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
        <template #no-option>
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
        <template #no-option>
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
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model4"
        label="String filter - async get full list"
        hint="Keep the list open on filtering"
        v-bind="filteredSelectProps4"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="model5"
        label="String filter - async get filtered list"
        v-bind="filteredSelectProps5"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script lang="ts">
const stringOptions = [
  'Google',
  'Facebook',
  'Twitter',
  'Apple',
  'Oracle',
].reduce((acc, name) => {
  for (let i = 100; i <= 300; i += 1) {
    acc.push(`${name} - ${i}`);
  }
  return acc;
}, []);

const objOptions = [
  { label: 'Google', value: 1 },
  { label: 'Facebook', value: 2 },
  { label: 'Twitter', value: 3 },
  { label: 'Apple', value: 4 },
  { label: 'Oracle', value: 5 },
].reduce((acc, { label, value }) => {
  for (let i = 100; i <= 300; i += 1) {
    acc.push({ label: `${label} - ${i}`, value: `${value}#${i}` });
  }
  return acc;
}, []);
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
  { outlined: true, useInput: true, inputDebounce: 0, behavior: 'menu' },
);
const filteredSelectProps2 = useFilteredSelect(
  objOptions,
  createMappedFilterFn({ key: 'label', compareType: 'startsWith' }),
  {
    filled: true,
    useInput: true,
    inputDebounce: 0,
    color: 'red',
    behavior: 'menu',
  },
);
const filteredSelectProps3 = useFilteredSelect(
  objOptions,
  createMappedFilterFn({ key: 'label' }),
  {
    useInput: true,
    mapOptions: true,
    emitValue: true,
    inputDebounce: 0,
    behavior: 'menu',
  },
);
const filteredSelectProps4 = useFilteredSelect(
  () =>
    new Promise<Array<string>>((resolve) => {
      setTimeout(() => {
        resolve(stringOptions);
      }, 500);
    }),
  stringFilterFn /* same as undefined */,
  {
    outlined: true,
    useInput: true,
    inputDebounce: 0,
    loading: true,
    behavior: 'menu',
  },
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
  { outlined: true, useInput: true, inputDebounce: 0, behavior: 'menu' },
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
