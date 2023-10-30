<docs>
---
title: Test Title 1
codepen: true
---

Hello World This is Test Docs block code in `docs.vue`.

This is the second line.
</docs>

<template>
  <div>
    <p>{{ msg }}</p>
    <button type="button" @click="msg += '.'">Add something</button>
  </div>
</template>

<style lang="sass" scoped>
p
  color: red
  font-size: 18px
  font-weight: 800
</style>

<script lang="ts" setup>
import { ref } from 'vue';

const msg = ref('Hello World');
</script>
