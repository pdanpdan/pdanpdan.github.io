---
title: Virtual scrolling past the browser scroll limit
description: How the library maps a 10-million-pixel scroll range onto virtual coordinates, and why wheel and pointer input need their own handling.
date: 2026-10-25
tags: [vue, performance, javascript, typescript]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
</script>

<PostHeader />

Virtualization usually means keeping the DOM small. It doesn't change the height of the scroll container. If the list is 30 million pixels tall, the container is still 30 million pixels tall, and browsers cap that. Browsers don't document the exact limit and it varies, but somewhere around 10 to 30 million pixels things break or clamp.

A 200,000-row list at 100px per row is 20 million pixels and fine. 500,000 rows at 60px is 30 million and isn't. The library I maintain, [`@pdanpdan/virtual-scroll`](https://github.com/pdanpdan/virtual-scroll), handles the second case with two coordinate systems.

## Virtual pixels and display pixels

Virtual units are real content pixels. Display units are what the scroll container sees. Below `10_000_000` they are the same. Above that, the scroll range is compressed:

```js
const MAX = 10_000_000;

displaySize = Math.min(total, MAX);
scale = (total - viewport) / (displaySize - viewport);
```

With 20 million pixels of content and a 1,000px viewport:

```js
scale = (20_000_000 - 1_000) / (10_000_000 - 1_000); // ~2.0001
```

The container is 10 million pixels tall, but scrolling to its end still scrolls the content to its end. The scale is picked so that:

```js
(displaySize - viewport) * scale === total - viewport;
```

Mapping is linear:

```js
virtual = display * scale;
display = virtual / scale;
```

Rows aren't scaled. They're absolutely positioned and translated by their virtual offset. If the internal scroll is `S` virtual pixels, the row at virtual offset `y` gets a transform that works out to:

```js
offset = y - S + S / scale;
```

The browser then subtracts its own `scrollTop`, which is `S / scale`. The two cancel and the row lands at `y - S` on screen. Every row moves the same number of pixels it would without scaling; only the scroll coordinate is compressed.

## Input has to follow

Once the scale isn't 1, native input is wrong. A 100px wheel delta on the scroll container moves 100 display pixels, about 200 virtual pixels. The content moves twice as far as the gesture.

When `scale !== 1`, the component attaches a non-passive `wheel` listener, calls `preventDefault()`, and applies the delta in virtual pixels. `scrollToOffset(current + delta)` writes `delta / scale` to the real `scrollTop`. Pointer dragging uses the same arithmetic, with `touch-action: none` on the container.

The native scrollbar is the awkward part. It represents the display range, so one pixel of thumb movement is several content pixels. That's what compression does. The optional virtual scrollbar exists because native scrollbar dragging is also throttled by the browser; an overlay bar can update on every pointer move. It still maps proportionally.

Keyboard scrolling and `scrollToIndex()` work in virtual units, so they don't need a separate path.

## Sizes and prefix sums

Rows are positioned from an index of sizes. The structure depends on how `itemSize` is supplied:

| `itemSize` | Storage | Measurement |
|---|---|---|
| number | arithmetic, `index * (size + gap)` | none |
| array | Fenwick tree | entries that are `null`/`undefined`/`<= 0` |
| function | Fenwick tree | all rendered rows; the function provides the initial estimate |
| dynamic | Fenwick tree seeded with `defaultItemSize` | `ResizeObserver` per rendered row |

The tree stores `size + gap`, so a prefix sum includes the gaps before the row. Reading a row height back subtracts the gap again. A fixed number is O(1) and allocates nothing. Use it when you know the size.

Sparse updates call `update()` on the tree. More than 1,024 changed sizes at once switch to `set()` plus one rebuild, which is cheaper than 1,024 individual updates. If a measured row above the viewport changes size, the scroll position is corrected so the content under the viewport doesn't jump. That correction is skipped while dragging.

## What else is in the component

The same engine does vertical, horizontal, and two-axis grids. In a grid an item is a row; columns are declarative (`columnCount`, `columnWidth`), not a second item array. A grid with a million columns trims each row to the visible column range, so it doesn't create a million elements.

`VirtualScrollTable` reuses the engine with real table markup. Rows can be absolutely positioned, or `flowTable` can add leading and trailing spacer `<tr>` elements so the browser's table layout sizes the columns. `flowTable` falls back to absolute rows if the table is horizontal, scaled, uses scroll padding or gaps, or has sticky indices or a column grid.

Masonry has its own engine: greedy shortest-column placement, a frontier snapshot every `segmentSize` items, and extrapolated height until the frontier reaches the end. It's vertical only, has no coordinate scaling, and doesn't pre-render on the server.

The rest is opt-in: sticky headers and footers, sticky sections, snapping on scroll end, infinite loading with velocity checks, RTL detection, keyboard navigation, ARIA roles, and virtual scrollbars.

## Limitations

- Window and `body` scroll containers get no coordinate scaling and no virtual scrollbars. The page is the limit.
- The cross axis comes from the container. Vertical rows get the container width; grid rows span the visible column slice. The host needs a definite block size.
- Fixed sizes aren't checked against the DOM. A wrong `itemSize` misplaces every row after the first. Dynamic mode measures, but pays for a `ResizeObserver` and tree updates.
- Rows are recycled and keyed by index. State has to live in the data model and rendering has to be idempotent. Lazy-loaded images are a bad fit; the element may be reused for another item before the image loads.
- Prepend restoration counts prepended items by identity, so a new array of cloned objects breaks it.
- The lean `./core` build drops scrollbars, keyboard, snapping, sticky, infinite loading, and prepend restoration. The full component is about 23.9 KB gzipped; core is 17.8 KB.

Usage looks like this:

```vue
<script setup>
import { VirtualScroll } from '@pdanpdan/virtual-scroll';

import '@pdanpdan/virtual-scroll/style.css';

const items = Array.from({ length: 500_000 }, (_, i) => ({
  id: i,
  label: `Item ${ i }`,
}));
</script>

<template>
  <VirtualScroll :items="items" :item-size="60" class="list">
    <template #item="{ item }">
      <div class="row">{{ item.label }}</div>
    </template>
  </VirtualScroll>
</template>

<style scoped>
.list { height: 500px; }
.row { height: 60px; }
</style>
```

Thirty million pixels of content, about twenty rows in the DOM, and the scrollbar still reaches the end.

- [Code](https://github.com/pdanpdan/virtual-scroll)
- [Documentation and examples](https://pdanpdan.github.io/virtual-scroll/)
- [Package](https://www.npmjs.com/package/@pdanpdan/virtual-scroll)
