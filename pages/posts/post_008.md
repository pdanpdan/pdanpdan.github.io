---
title: Wrapper Vue2/3 directives to allow dynamic add/remove
description: A composable that converts a Vue2/3 directive in a directive that can be dynamically adder/removed.
date: 2023-11-24
tags: [vue, directive, composable]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

When using directives in render functions in Vue3 components the `beforeUnmount` and `unmounted` lifecycle hook are not called when the directive is no longer applied.

This can lead to some unwanted leftovers that were cleaned in `beforeUnmount` and `unmounted` lifecycle hook.

## Solution

The `useRemovableDirective` composable receives a directive definition (Vue2 or Vue3) and returns a list with two directives:

- the first one is a patched version of the original directive
- the second one is a cleanup directive that only calls the cleanup functions from the original directive

Then, in your render function, instead of not applying your directive in `withDirectives` when it is not needed you replace it with the `removed` verion.

::: code-group

```vue [Demo.vue]
<script land="ts">
import {
  defineComponent,
  h,
  ref,
  withDirectives,
} from 'vue';

import useRemovableDirective from './useRemovableDirective.ts';

const logs = ref([]);

const [vColor, vColorRemoved] = useRemovableDirective({
  // called before bound element's attributes
  // or event listeners are applied
  created(el /* , binding, vnode, prevVnode */) {
    logs.value.push({ event: 'created', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
  },

  // called right before the element is inserted into the DOM.
  beforeMount(el /* , binding, vnode, prevVnode */) {
    logs.value.push({ event: 'beforeMount', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
  },

  // called when the bound element's parent component
  // and all its children are mounted.
  mounted(el, binding /* , vnode, prevVnode */) {
    logs.value.push({ event: 'mounted', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
    if (el.ctx === undefined) {
      el.ctx = { color: el.style.color };
    }
    el.style.color = binding.value;
  },

  // called before the parent component is updated
  beforeUpdate(el /* , binding, vnode, prevVnode */) {
    logs.value.push({ event: 'beforeUpdate', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
  },

  // called after the parent component and
  // all of its children have updated
  updated(el, binding /* , vnode, prevVnode */) {
    logs.value.push({ event: 'updated', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
    if (el.ctx === undefined) {
      el.ctx = { color: el.style.color };
    }
    el.style.color = binding.value;
  },

  // called before the parent component is unmounted
  beforeUnmount(el /* , binding, vnode, prevVnode */) {
    logs.value.push({ event: 'beforeUnmount', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
  },

  // called when the parent component is unmounted
  unmounted(el /* , binding, vnode, prevVnode */) {
    logs.value.push({ event: 'unmounted', el: el.className, ts: (new Date()).toISOString().slice(11, 23) });
    if (el.ctx !== undefined) {
      Object.assign(el.style, el.ctx);
    }
  },
});

const testBlock = defineComponent({
  props: {
    text: String,
    active: Boolean,
  },

  setup(props) {
    const active = ref(props.active === true);

    return () => withDirectives(
      h('div', { class: props.active === true ? 'start-applied' : 'start-not-applied' }, [
        h('label', [
          h('input', { type: 'checkbox', checked: active.value, onInput(ev) { active.value = ev.target.checked; } }),
          `Apply directive (initially ${ props.active === true ? '' : 'not ' }applied)`,
        ]),
        ` / ${ props.text.length % 2 === 0 ? 'red' : 'green' } / ${ props.text }`,
      ]),
      active.value === true
        ? [[vColor, props.text.length % 2 === 0 ? 'red' : 'green']]
        : [[vColorRemoved]],
    );
  },
});

const eventColor = (event) => {
  if (['created', 'beforeMount', 'mounted'].includes(event)) {
    return 'blue';
  }
  return ['beforeUpdate', 'updated'].includes(event)
    ? 'grey'
    : 'orangered';
};

const logsBlock = defineComponent({
  setup() {
    return () => h(
      'ol',
      logs.value.slice().reverse().map((row) => h(
        'li',
        { style: { display: 'flex' } },
        [
          h('div', { style: { width: '20ch' } }, row.ts),
          h('div', { style: { width: '20ch', color: row.el.indexOf('-not-') > -1 ? 'orangered' : 'green' } }, row.el),
          h('div', { style: { color: eventColor(row.event) } }, row.event),
        ],
      )),
    );
  },
});

export default defineComponent({
  setup() {
    const msg = ref('');

    return () => h('div', { style: 'padding: 16px' }, [
      h(testBlock, { text: msg.value, active: true }),
      h(testBlock, { text: msg.value, active: false }),

      h('input', { value: msg.value, onInput(ev) { msg.value = ev.target.value; } }),
      h(logsBlock),
    ]);
  },
});
</script>
```

```ts [useRemovableDirective.js]
function getSSRProps() { }

export default function useRemovableDirective(dirDef) {
  const dirDefId = Symbol('id');
  const dirDefAdded = typeof dirDef === 'function'
    ? { getSSRProps, mounted: dirDef, updated: dirDef }
    : { getSSRProps, ...dirDef };
  const dirDefRemoved = { getSSRProps };

  const {
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    beforeUnmount,
    unmounted,
  } = dirDefAdded;

  dirDefAdded.created = typeof created === 'function'
    ? (el, binding, vnode, prevVnode) => {
      el[dirDefId] = true;
      created(el, binding, vnode, prevVnode);
    }
    : (el) => {
      el[dirDefId] = true;
    };

  if (
    typeof created === 'function'
    || typeof beforeMount === 'function'
    || typeof mounted === 'function'
  ) {
    const calls = [];
    if (typeof created === 'function') { calls.push(created); }
    if (typeof beforeMount === 'function') { calls.push(beforeMount); }
    if (typeof mounted === 'function') { calls.push(mounted); }

    dirDefAdded.beforeUpdate = typeof beforeUpdate === 'function'
      ? (el, binding, vnode, prevVnode) => {
        if (el[dirDefId] !== true) {
          el[dirDefId] = true;
          calls.forEach((call) => { call(el, binding, vnode, prevVnode); });
        }

        beforeUpdate(el, binding, vnode, prevVnode);
      }
      : (el, binding, vnode, prevVnode) => {
        if (el[dirDefId] !== true) {
          el[dirDefId] = true;
          calls.forEach((call) => { call(el, binding, vnode, prevVnode); });
        }
      };
  }

  if (typeof beforeUnmount === 'function') {
    dirDefRemoved.beforeUpdate = (el, binding, vnode, prevVnode) => {
      if (el[dirDefId] === true) {
        beforeUnmount(el, binding, vnode, prevVnode);
      }
    };
  }

  dirDefRemoved.updated = typeof unmounted === 'function'
    ? (el, binding, vnode, prevVnode) => {
      if (el[dirDefId] === true) {
        unmounted(el, binding, vnode, prevVnode);
        el[dirDefId] = false;
      }
    }
    : (el) => {
      if (el[dirDefId] === true) {
        el[dirDefId] = false;
      }
    };

  return [dirDefAdded, dirDefRemoved];
}
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#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"
/>
