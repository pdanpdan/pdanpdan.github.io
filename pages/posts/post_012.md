---
title: A headless combobox for Vue 3
description: Notes from building a renderless combobox with one state machine, ARIA prop bags, keyboard handling, and native popover positioning.
date: 2026-10-25
tags: [vue, javascript, typescript, a11y]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
</script>

<PostHeader />

I built [`@pdanpdan/headless-combobox`](https://github.com/pdanpdan/headless-components/tree/main/packages/headless-combobox) because I wanted a combobox I could style with Tailwind or daisyUI without fighting a component library's CSS, and I didn't want to pull in a positioning library just to put a list under an input. It has no runtime dependencies, and both APIs share one state machine.

The component renders nothing except its default slot. The composable gives you the same state without the slot.

## Two entry points

`HeadlessCombobox` is a thin wrapper around `useHeadlessCombobox`. Both expose the same state, ARIA prop bags, actions, and ref setters, so you can start with the component and switch to the composable when you need to call actions from somewhere else.

```vue
<script setup>
import { ref } from 'vue';
import { HeadlessCombobox } from '@pdanpdan/headless-combobox';

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

The prop bags already contain the handlers. `triggerProps` has `onClick` and `onKeydown`; `getOptionProps()` has `onClick`, `onMousedown`, `onMousemove`, `onFocus`, and `onKeydown`. If you add `@click="toggle"` next to `v-bind="triggerProps"`, both handlers run and the popup toggles twice. Just use the bag.

Ref setters are optional too. Bind the ones for elements you actually render. `setOptionRef()` is what makes `alignSelected` and scroll-into-view work.

## How it is split

The scope is split into seven composables:

| Composable | Responsibility |
|---|---|
| `useSelection` | model to options resolution, select/clear, `maxLength` limits, emit |
| `useFiltering` | search query, `filteredOptions`, default and custom matching |
| `useValidation` | `valid`, `errors`, `validationMessage` |
| `useAccessibility` | ids, `aria-*` attributes, and the prop bags above |
| `usePositioning` | `popupStyle`, `alignSelected` offset, scroll to highlight |
| `useNavigation` | highlight stepping, paging, the keydown handler |
| `usePopover` | open/close, Popover API calls, focus management, click outside |

Inside `useHeadlessCombobox` they form a cycle. Selection needs to close the popover, the popover needs selection state, navigation needs both. Passing callbacks through every constructor gets ugly fast, so each composable starts with small no-op hooks that are replaced by the real functions afterwards. A `watch` on the search query resets the highlight to the first option that can be selected, so filtering doesn't leave the highlight on a row that just disappeared.

## Keyboard

Every key goes through one handler. Events that bubble from elements the component didn't wire are ignored, except `Tab`, so buttons in your markup keep their own key behavior. `defaultPrevented` and disabled/readonly are checked first.

Closed:

- `Enter`, `Space`, `ArrowDown`, `ArrowUp` open the popup.
- `Backspace` and `Delete` remove the last selected value only when the event target has no text. In a typeahead input, editing the text wins.

Open:

- `ArrowDown` / `ArrowUp` move the highlight with wrap-around and skip disabled options.
- `Enter` selects the highlighted option.
- `Space` is suppressed only on the trigger. Text inputs and option buttons keep native behavior.
- `PageDown` / `PageUp` move by the number of options that fit in the listbox, with a fallback of 10 if the list height can't be measured.
- `Home` / `End` go to the first or last selectable option. In an input or textarea they keep their native caret behavior.
- `Tab` doesn't walk into the options. It moves to the next focusable element outside the widget and closes the popup. With `selectOnTab`, the highlighted option is selected first.
- `Escape` closes and puts focus back on the trigger.

The options are not tab stops. Focus stays on the trigger or input and `aria-activedescendant` points at the highlighted option. `Tab` leaves the widget instead of stepping through 200 `<li>` elements.

## ARIA

The component sets roles and relationships, not labels:

- Trigger: `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-haspopup="listbox"`, and `aria-activedescendant` only while open with a valid highlight.
- Popup input: `role="searchbox"`, `aria-autocomplete="list"`.
- Typeahead input: `role="combobox"`, `aria-autocomplete="list"`.
- Listbox: `role="listbox"` plus `aria-multiselectable` in multiple mode.
- Option: `role="option"`, `aria-selected`, `aria-disabled` when `maxLength` blocks it, and `data-highlighted`.

You provide `aria-label` or `aria-labelledby`. The component has no way to know what the field means.

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

There is no `position` in that object. If the dropdown has the `popover` attribute, the browser gives it `position: fixed`. If it's a plain element toggled with `v-if`, it keeps whatever positioning you gave it. `showPopover()` and `hidePopover()` are called only when the attribute and the method are both there, so the same markup works with or without the Popover API.

This relies on browser support for CSS anchor positioning. I didn't add a second positioning engine as a fallback. Flipping and repositioning on viewport changes are left to CSS (`position-try`, `inset`, transitions), not a resize listener. Alignment is calculated once per open. `alignSelected` measures the dropdown and the selected option after scrolling, then divides by the CSS scale of the open animation so the offset is in unscaled pixels.

## Selection and filtering

Filtering is a case-insensitive substring match on `optionLabel(option)` by default. `optionFilter(option, query)` replaces it and gets the raw query. The query type is the generic `Q`, so it doesn't have to be a string.

Values are compared by identity after `toRaw()`, so two reactive proxies of the same object count as the same value. `optionValue` lets the model hold primitives while `options` holds objects. In multiple mode, options that would go over `maxLength` are marked disabled. The keyboard skips them, and hover or click can't select them either.

There is no async or remote mode. `options` is a synchronous array and `filteredOptions` is a computed. Loading state, debouncing, and fetching stay in your code. There is also no hidden input or `ElementInternals` integration. `required`, `minLength`, and `maxLength` are derived state, and submitting the value is up to you.

## What it does not do

No styles, no virtualization, no async options, no form association, no generated labels. I left those out on purpose. Most would add either a dependency or an opinion about how your markup should look. The package is about 1,500 lines of TypeScript and Vue, plus tests, and the only peer dependency is Vue 3.

- [Code](https://github.com/pdanpdan/headless-components)
- [Documentation and examples](https://pdanpdan.github.io/headless-components/)
- [Package](https://www.npmjs.com/package/@pdanpdan/headless-combobox)
