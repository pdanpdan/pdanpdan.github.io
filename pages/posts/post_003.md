---
title: Generic composable function for Quasar QSelect with filtering
description: A Vue composable for simplifying the usage of QSelect with filtering in Quasar.
date: 2023-12-12
tags: [quasar, javascript, typescript, composable]
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
import { shallowRef, ref, unref, reactive } from 'vue';
import type { MaybeRef, ShallowRef } from 'vue';
import type { QSelect, QSelectProps } from 'quasar';

type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

interface UseProps extends Partial<Omit<QSelectProps, 'loading' | 'onFilter' | 'options'>> {
  options: ShallowRef<QSelectProps[ 'options' ]>;
  onFilter: QSelectProps[ 'onFilter' ];
  loading?: MaybeRef<boolean>;
}

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

export function useFilteredSelect<T>(
  optionsOrFn:
    | MaybeRef<T[]>
    | ((search: string) => MaybePromise<MaybeRef<T[]>>),
  filterFn: (search: string, list: T[]) => T[] = stringFilterFn,
  props?: Partial<QSelectProps>,
  afterFn?: (ref: QSelect) => void,
) {
  const getOptions = typeof optionsOrFn === 'function' ? optionsOrFn : () => optionsOrFn;
  const filteredOpts = shallowRef(typeof optionsOrFn === 'function' ? [] : unref(optionsOrFn));
  const loading = ref(false);
  const keepOpen = props && props.loading && unref(props.loading) === true;

  const useProps: UseProps = {
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

      <q-select
        v-model="model6"
        label="Ref string filter"
        v-bind="filteredSelectProps6"
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
}, [] as string[]);

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
}, [] as Array<{ label: string, value: string }>);
</script>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useFilteredSelect,
  createMappedFilterFn,
  stringFilterFn,
  noFilterFn,
} from './useFilteredSelect';

const refOptions = ref(stringOptions);

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
const filteredSelectProps6 = useFilteredSelect(
  refOptions,
  undefined /* same as stringFunctionFn */,
  { outlined: true, useInput: true, inputDebounce: 0, behavior: 'menu' },
);

const model1 = ref(null);
const model2 = ref(null);
const model3 = ref(null);
const model4 = ref(null);
const model5 = ref(null);
const model6 = ref(null);
</script>
```
:::

## Changelog

### 2023-12-12

- fix usage with options passed as ref [#16613](https://github.com/quasarframework/quasar/discussions/16613#discussioncomment-7819058)
- fix TS typing issues [#16613](https://github.com/quasarframework/quasar/discussions/16613#discussioncomment-7818424)

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FuseFilteredSelect.ts&preview=t&previewMode=preview&editor=codemirror#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"
/>
