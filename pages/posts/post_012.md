---
title: A headless combobox for Vue 3
description: How the Vue combobox keeps its state in one machine, wires ARIA with prop bags, handles keys in one place, and positions the popup with CSS anchors instead of floating-ui.
date: 2026-10-25
tags: [vue, javascript, typescript, a11y]
featured: true
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
</script>

<PostHeader />

I built [`@pdanpdan/headless-combobox-vue`](https://github.com/pdanpdan/headless-components/tree/main/packages/headless-combobox-vue) because I wanted to style a combobox with Tailwind or daisyUI without fighting a component library's CSS, and I didn't want a positioning library just to put a list under an input. No runtime dependencies, and both entry points share one state machine.

::: info Update
The package is now `@pdanpdan/headless-combobox-vue`. It's one of five adapters (Vue, React, Svelte, Solid, Angular) over a shared core. The rest of this post is still the Vue 3 API; the other adapters expose the same state with their framework's own primitives.
:::

The component renders only its default slot. If you don't want the wrapper, the composable gives you the same state.

## Two entry points

`HeadlessCombobox` is a thin wrapper around `useHeadlessCombobox`. Both expose the same state, ARIA prop bags, actions, and ref setters. Start with the component; move to the composable when an action has to be called from outside the markup.

```vue
<script setup>
import { ref } from 'vue';
import { HeadlessCombobox } from '@pdanpdan/headless-combobox-vue';

const users = ref([
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
]);
const selected = ref(null);
</script>

<template>
  <HeadlessCombobox
    v-slot="{
      isOpen,
      filteredOptions,
      triggerProps,
      getOptionProps,
      listboxProps,
      setContainerRef,
      setTriggerRef,
      setOptionRef,
    }"
    v-model="selected"
    :options="users"
    :option-label="(user) => user.name"
    multiple
  >
    <div :ref="setContainerRef">
      <button
        :ref="setTriggerRef"
        v-bind="triggerProps"
        type="button"
      >
        {{ selected?.length ? `${selected.length} selected` : 'Select users' }}
      </button>

      <ul v-if="isOpen" v-bind="listboxProps">
        <li v-for="(user, index) in filteredOptions" :key="user.id">
          <button
            :ref="(el) => setOptionRef(user, el)"
            v-bind="getOptionProps(user, index)"
            type="button"
          >
            {{ user.name }}
          </button>
        </li>
      </ul>
    </div>
  </HeadlessCombobox>
</template>
```

`triggerProps` already has `onClick` and `onKeydown`; `getOptionProps()` has `onClick`, `onMousedown`, `onMousemove`, `onFocus`, and `onKeydown`. Adding `@click="toggle"` next to `v-bind="triggerProps"` runs both handlers and toggles the popup twice. Use the bag as it is.

Ref setters are optional too: bind the ones for elements you actually render. `alignSelected` and scroll-into-view need `setOptionRef()`, otherwise they have nothing to measure.

## How it is split

The implementation is seven composables:

| Composable | Responsibility |
|---|---|
| `useSelection` | model to options resolution, select/clear, `maxLength` limits, emit |
| `useFiltering` | search query, `filteredOptions`, default and custom matching |
| `useValidation` | `valid`, `errors`, `validationMessage` |
| `useAccessibility` | ids, `aria-*` attributes, and the prop bags above |
| `usePositioning` | `popupStyle`, `alignSelected` offset, scroll to highlight |
| `useNavigation` | highlight stepping, paging, the keydown handler |
| `usePopover` | open/close, Popover API calls, focus management, click outside |

Inside `useHeadlessCombobox` they form a cycle: selection has to close the popover, the popover needs selection state, and navigation needs both. Passing callbacks through every constructor got ugly fast, so each composable starts with no-op hooks that get replaced by the real functions afterwards. A `watch` on the search query resets the highlight to the first selectable option, so filtering doesn't leave it on a row that just disappeared.

## Keyboard

One handler sees every key. Events that bubble from elements the component didn't wire are ignored, except `Tab`, so buttons in your markup keep their own key behavior. `defaultPrevented` and disabled/readonly are checked first.

Closed:

- `Enter`, `Space`, `ArrowDown`, `ArrowUp` open the popup.
- `Backspace` and `Delete` remove the last selected value only when the event target has no text. In a typeahead input, editing the text wins.

Open:

- `ArrowDown` / `ArrowUp` move the highlight with wrap-around and skip disabled options.
- `Enter` selects the highlighted option.
- `Space` is suppressed only on the trigger. Text inputs and option buttons keep native behavior.
- `PageDown` / `PageUp` move by the number of options that fit in the listbox, and fall back to 10 when the list height can't be measured.
- `Home` / `End` go to the first or last selectable option. In an input or textarea they keep their native caret behavior.
- `Tab` doesn't walk into the options. It moves to the next focusable element outside the widget and closes the popup. With `selectOnTab`, the highlighted option is selected first.
- `Escape` closes and puts focus back on the trigger.

Options are not tab stops. Focus stays on the trigger or input, and `aria-activedescendant` points at the highlighted option. `Tab` leaves the widget instead of walking through 200 `<li>` elements.

## ARIA

The component only sets roles and relationships. Labels are not its job:

- Trigger: `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-haspopup="listbox"`, and `aria-activedescendant` only while open with a valid highlight.
- Popup input: `role="searchbox"`, `aria-autocomplete="list"`.
- Typeahead input: `role="combobox"`, `aria-autocomplete="list"`.
- Listbox: `role="listbox"` plus `aria-multiselectable` in multiple mode.
- Option: `role="option"`, `aria-selected`, `aria-disabled` when `maxLength` blocks it, and `data-highlighted`.

That's on you: `aria-label` or `aria-labelledby`. The component can't know what the field means.

## Positioning without floating-ui

The popup style is built from CSS anchor positioning:

```js
{
  positionAnchor: cssAnchorName,
  left: 'anchor(left)',
  width: 'anchor-size(width)',
  top: alignSelected ? 'anchor(top)' : 'anchor(bottom)',
}
```

There's no `position` in that object. With the `popover` attribute the browser makes it `position: fixed`; a plain element toggled with `v-if` keeps whatever positioning you gave it. `showPopover()` and `hidePopover()` are called only when both the attribute and the method exist, so the same markup works with or without the Popover API.

It needs CSS anchor positioning support. I didn't add a second positioning engine as a fallback. Flipping and repositioning on viewport changes are CSS work (`position-try`, `inset`, transitions), not a resize listener. Alignment is calculated once per open: `alignSelected` measures the dropdown and the selected option after scrolling, then divides by the CSS scale of the open animation so the offset comes out in unscaled pixels.

## Selection and filtering

Filtering is a case-insensitive substring match on `optionLabel(option)` by default. `optionFilter(option, query)` replaces it; it gets the raw query. The query type is the generic `Q`, so it doesn't have to be a string.

Values are compared by identity after `toRaw()`, so two reactive proxies of the same object are the same value. `optionValue` lets the model hold primitives while `options` holds objects. In multiple mode, options that would go over `maxLength` are disabled: the keyboard skips them and hover or click can't select them.

There's no async or remote mode. `options` is a synchronous array; `filteredOptions` is a computed. Loading, debouncing, and fetching stay in your code. There's no hidden input and no `ElementInternals` either. `required`, `minLength`, and `maxLength` are derived state; submitting the value is up to you.

## What it does not do

No styles, no virtualization, no async options, no form association, no generated labels. I left those out on purpose; most would add a dependency or an opinion about your markup. The Vue adapter is around 1,500 lines of TypeScript and Vue plus tests, and Vue 3 is its only peer dependency.

- [Code](https://github.com/pdanpdan/headless-components)
- [Documentation and examples](https://pdanpdan.github.io/headless-components/combobox/)
- [Vue package](https://www.npmjs.com/package/@pdanpdan/headless-combobox-vue)
- [React](https://www.npmjs.com/package/@pdanpdan/headless-combobox-react), [Svelte](https://www.npmjs.com/package/@pdanpdan/headless-combobox-svelte), [Solid](https://www.npmjs.com/package/@pdanpdan/headless-combobox-solid), and [Angular](https://www.npmjs.com/package/@pdanpdan/headless-combobox-angular) adapters
