---
title: Show QSelect options as a popup menu on bottom of the screen
description: Show QSelect options as a popup menu on bottom of the screen, like the native select on iPhone.
date: 2023-11-25
tags: [vue, quasar]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

You don't like the way options are displayed on the mobile and you want them to show as a popup menu on the bottom of the screen.

## Solution

::: code-group

```vue [Demo.vue]
<template>
  <div class="q-pa-md q-gutter-y-md" style="max-width: 300px">
    <q-select
      v-model="model"
      :options="options"
      label="Select"
      popup-content-class="q-select__dialog--on-bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
      behavior="dialog"
    />

    <q-select
      v-model="model"
      :options="options"
      label="Select with input"
      use-input
      popup-content-class="q-select__dialog--on-bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
      behavior="dialog"
    />
  </div>
</template>

<style lang="sass">
.q-select__dialog:has(.q-select__dialog--on-bottom)
  min-width: 600px
  width: fit-content !important
  max-width: 100% !important
  border-radius: 4px 4px 0 0 !important

  @media (max-width: 600px)
    width: 100% !important

  label:not(.q-select--with-input)
    height: 0

.q-dialog__inner:has(.q-select__dialog--on-bottom)
  top: auto
  bottom: 0
  padding-bottom: 0
</style>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
const options = [ 'Option1', 'Option2', 'Option3', 'Option4', 'Option5' ]
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#eNrVV21v2zYQ/iucscEOYElu0+2DlnTpumDogKZb3GEfqsGgJcpmS5EMXxwHQf77jqQoyy9p42L7sBZJyLsj74V3z53uB7SRQpmkwTL9qAUf5IP7giNUtAxdDHLkKY52Y7HGypGKwdIYqfMss1x+WqSlaLLAvXiePnuRTrKKatOSUqKbVCpRgYpiMI63XQRuRtZGYZ0pMRdGJLXgpr9OS+2NOKTxmBseU9tgQxTFLKGl4LvbI5Q/4R5nwUPBHwbjwVwIkxoN4Q5xRuZOEnSPXkmJHlCtRIOGK0uGPxa8FbhHf3h9HTuodxIFJ2svU5EaW2ZQbXlpqOBodI+wuxHe0C3ycP9JeFEgpFaTUbh3HJ9ZMrugXHfPjlCWoSthaH3XxtBTfgHnxKKlPMDfsAJva7roHa6w+pSjIbZGDHvS8PsETIdwQDTAqhS8hWicGdJIBrF76UTOKrpCJcNan0PyJRInTYVukoU1ENzkDnbFAGlzxwjwG7xObmllljk6nUzkuhj4O+CWm0QTRkoTTVoljagIc2fc3/Aw7l8upAub09auNjyG5/7INFzV0aWQVibgtiHcJBtjg8rZrPJxShLBE8hII5rNUcgbrqnTk+iluIVjmtGKJFYelFkCr5OpxC3fSM3JEq+oUMAO+iIrgxj8d1FAt9QsEeXS9gICKZUE0v8mQhAdwKsVrM6yXgLC1icXLNNdc/Ml1qM9as+JtsgaymNW/uCyEnIeQdg8oaYQjhAW9E0oc8yNl+gl87PJ5Ltd9lyoCipA4YpaqNQXcu1/JvB/SxLKy9serJvNKOdEPdV0IwAwXN22Kh0rRxO/k7iqKF+0BwIVlAG+8ouGwI1o1HPBe97e+tWR7MJ2KCAOVltfj77d53TOhdnIJWC5WYY0btUvCV0sTefpWRZTw2VJqag0SBNjJVzHF5BlrnUCt0NvRepdZC+46w0G+fpD505kxC1jDhgDp60/4H1Aw3d+82w4jsvnm+XpZvlis/x+iP72pnr7XgLSGh0AeqfZQz+TlBEVjm03fcyYuP3N04yypOuj5ZKUnw7QP2qAXtcypSKaqBXp9V6D1YIAVjj25fQKWmePCWGwDKQ/w7wmWjDrbAxiP1tegdl9DdBHvU0f4rgSJhFPzyivyDqtoPMWA4hMbEXFAF7k9WdisLH7ND3tnyPrktnKGw0KOTzkLFgaFIT21mDKD/e3uAMwpjUkzdW72fTy/fs3V79O0fn5uQ/spo8dkv5z+vvl1fRyXxrknd7E9f9WXvDp9Bp900m22OfQbwv1PElbLQnXThlhOth77K3xjhZid5T0/emp8E3/iR6GF4aiNQbQSH/RpL75sRGVAnrfE5wJDeJL0QlSYfNVBn69iRsjvxT9vS4X8GsbuXZmSl8LHDcEhrlrItlfCiwkys10D4BXHcgcA4hjBFX12ioFHfAN4B3mJRkjwd8KC12xemQSfgvhcXNs4KVZOz32JMJEO41Bj4Lb5HimZ1Kv/MZ+E3MvGpJmbnDvY3e5bT0g9b5Lox6g+8cLUO+ez3FojUa717jn9a0gxL0LyWh0gs5fRmDyt6UrzKxTXGPIxNAN29G69ygAQ/vu7wPSTTKHT4zcDe3wZN/epG6VUv0KvicckvdrNGanAaROtJ0bahh53ivP9oMlJv/BQoKOKzE4vDWozk27hu+Jblxs1n7ej4wajO6+MVyax4374IIDEGHoP8vNgYuS0dJ5Jfg1YQJ3d/17qvNW927c0E9o6AiuN5AhggpibpgI2wMWxvMQudHeXbHyT46wnx1tvyvaVBkYS1p1zodaKPiunbkHr6iCOQka5UzNjJgx79VBPnN89YibXo1z8x6ladoSxggU56hvRXQaUnt3cPcp+zioHcKg7vs4pgJUlS8pJkrsGKlqyft19PAP6+qlow=="
/>
