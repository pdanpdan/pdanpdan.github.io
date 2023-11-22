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
- one that filters the options as string, case insensitive,  match anywhere
- one that receives the name of a key and returns a function that filters the list by the content of that key as string, case insensitive,  match anywhere
- one that returns the whole list (for server side filtering)

```ts
import { ref, unref, reactive, type Ref, type MaybeRefOrGetter } from 'vue';

type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

export function createMappedFilterFn(prop?: string | null) {
  return function <T>(search: string, list: Array<T>) {
    if ([null, undefined, ''].includes(search)) {
      return list;
    }

    const needle = String(search).toLocaleLowerCase();
    return [null, undefined, ''].includes(prop)
      ? list.filter((item) => String(item).toLocaleLowerCase().includes(needle))
      : list.filter((item) =>
          String(item[prop]).toLocaleLowerCase().includes(needle),
        );
  };
}

export const stringFilterFn = createMappedFilterFn();
export const noFilterFn = <T,>(_, items: Array<T>) => items;

export function useFilteredSelect<O, P extends Record<string, unknown>, Af>(
  optionsOrFn:
    | MaybeRefOrGetter<Array<O>>
    | ((search: string) => MaybePromise<MaybeRefOrGetter<Array<O>>>),
  filterFn: (search: string, list: Array<O>) => Array<O> = stringFilterFn,
  props: P = {} as P,
  afterFn?: Af,
) {
  const getOptions =
    typeof optionsOrFn === 'function' ? optionsOrFn : () => optionsOrFn;
  const filteredOpts = ref(
    typeof optionsOrFn === 'function' ? [] : optionsOrFn,
  );
  return reactive({
    ...props,
    options: filteredOpts,
    async onFilter(
      search: string,
      doneFn: (callbackFn: () => void, afterFn: Af) => void,
      abortFn: () => void,
    ) {
      try {
        const options = (await getOptions(search)) as Array<O>;
        const newOpts = filterFn(search, unref(options));
        doneFn(() => {
          filteredOpts.value = newOpts;
        }, afterFn);
      } catch (e) {
        abortFn();
      }
    },
  });
}
```

Usage:

```ts
const filteredSelectProps1 = useFilteredSelect(
  ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  undefined /* same as stringFunctionFn */,
  { outlined: true, useInput: true, inputDebounce: 0 },
);
```


```html
<q-select
  style="width: 250px"
  v-model="model1"
  label="String filter"
  v-bind="filteredSelectProps"
>
  <template v-slot:no-option>
    <q-item>
      <q-item-section class="text-grey"> No results </q-item-section>
    </q-item>
  </template>
</q-select>

```

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&prod=&preview=t&previewMode=preview&editor=mirror#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"
/>
