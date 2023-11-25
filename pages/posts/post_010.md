---
title: Customize QSelect selected options display
description: Customize the way selected options are displayed in QSelect.
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

You need to display selected options in a QSelect, but using a limited space.

## Solution

You can customize the `#selected-item` slot to show as many selected options as you want, and using different formatting for them.

::: code-group

```vue [Demo.vue]
<template>
  <div class="q-pa-md column q-gutter-y-md" style="max-width: 500px">
    <q-select
      v-model="model"
      :options="options"
      label="Select up to 3, 4-6 or more than 6"
      filled
      multiple
      color="deep-orange-6"
    >
      <template v-slot:selected-item="scope">
        <template v-if="model.length <= 6">
          <q-chip
            v-if="scope.index < 3"
            style="margin-bottom: -2px"
            dense
            square
            color="grey-4"
            text-color="dark"
            removable
            :tabindex="scope.tabindex"
            @remove="scope.removeAtIndex(scope.index)"
          >
            <q-avatar color="grey-8" text-color="grey-1" font-size="14px">{{ scope.index + 1 }}</q-avatar>
            {{ scope.opt.label }}
          </q-chip>

          <span v-else-if="scope.index === 3" class="q-ml-sm q-pt-xs">
            ... {{ model.length - 2 }} more
          </span>
        </template>

        <span v-else-if="scope.index === 0" class="q-pt-xs">
          {{ model.length }} out of {{ options.length }} selected
        </span>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
const options = Array(10)
  .fill(null)
  .map((_, i) => ({ label: `Options ${i + 1}`, value: i + 1 }));
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#eNqtV21v2zYQ/iucUSAOZsl5WzF4dpesC4YOaLrFHfZhHlxaom22FKmQlOvM8H/fHSnJlOw0SdF8iKXj8e6599Omw7NcaRtlNI8/GiU7g85mIgmZlAdm0hkQR0HaXUEN1UiadJbW5mbQ7xcy/7SIE5X1/enlWXx6EZ/0U25sSYqZyeJcqxRUTDq9StqlP+2ztdXU9LWaKauiuZI2fI4T40Ac0vgcCQ+pzahlmlMR8UTJ9uszlD9BDiLYTuS20+vMlLKxNeBu72di73NGNuQqz8mWzLXKyNGqYEc/TWTJsCF/On31sVePHBPJ1o4nZXNaCEvmhUwsV5J0N4SiRIghPgy8/GMfUSDEhWFdL7dXhTkXxYJLU4edkH6f3CjL5/elDx3lVzBOLUrKFn79E1g754vgckr1pwE5ooVVRwE3/D8G6OAO8AagisFa8MbQsiwX4LtXyDJM+YokghozguSLchplKWgQRSbJXbQoLPg4ugfipEOMvRcM2DK6jj7z1C4H5IeTk3w96ThRIOwuMkywxFbIVlGmUibwDv76+ODfQOXoPVRaPu3OBJ25K2MnihQ5sYqc98hF9JIoTTKlGbFLKsnL3Z05F4Kl1VsGEeK5YNU72KM0SEwZyyOlqVywqL5cYgf0lWMAthHKDrwtLI04nMB1k6ic1ca2r/B5ZWYsmFzYJRmOEGLA7jyULHkektBL7q4TH3OZsjUZkvOdcf5v530NyRNB7VmVDUh0hgFosqZMmtr48jbksm7RKrcsNLuPLtpCLFRdVHsOUqzNoFmmVnS2c3MZWktnzojapIrQFnDpJKBNns+/Xtk3yNwN3HHcvNnwqPMpXVELddsw6EfI2IYNjnoKVOxYkeH/oebTC5e/mw0J3f89OSXb7bBfSW5prLkhd2OXrsDdCDPcxDjDvQbZ5JC2q4gJw/ZjPhqNMOpBNWYiMhmUYW6jNRRIC0Ucx4ikkXIROQMorkaaeFBzmLj9oAsE5EcBnjQAHgLWhgRwVGGJmuNJWezBWVVkIbYG2AbUyrn+lu9gMAdX8NQyaWgSzXML8i10EAE1D4hx2MJp3e81m7dnwUTiNLHeBjJClq4shMBW6k9KG+DsSmt63z09OUYcMfYgz+peYd53u9Me4cdk9ArHhEuUAfnwrrz/YsMx0bYfemRFRcEGxL1D10Zd4AVnAMCF9m0hDtj1WxsEDMmcC6ZLkY1NggqhPv/uaFYXrB7OyZIlnw7QPxooBJzDuWaG6RV0uvoMSmDBrD++Ht9AVQWH4KkCmsCXDm+ZgZGCGD3bL4VMAXaoAYazw/RPtQP59cbR+y7/4hTG+aTzr5ts7uKkA0F7/QUf7HCfx+fhPbZORJE60KBQQqynHqlX4GdmRrk8PDTbbf/m3XR8/f79m5vfxq5K0LG7qXiI+6/xH9c34+t9buBHvREuFSW/kuPxLfmu5iT9uhL2qnhoCpNj+y+r+KukVjLK+mopCe0JVLhN4okW+ghDFVvL5cI8CimEX3UfaOvA8bgxvjs85h3PtRspzwb49RB3IB/z/gMtrtncWouqqwVJM2gvR7csF39rQMg0LorbZpt5es/sEaiq14XWTMKwNpbKhPWIkm9VIaGVP7BevwX34HLsz+J+uZIGHH5NHldOrxib5OpOACkov557qXKvAhL38WsgbO9JEz00832TukHPd8Hz0wDDhyd8TrptMRheNwK832uXdLtuCpSNyUmLXdMHmXMKmQjydvt6s/fvm7/fkO6iGew/A1zTIGQv7mJ8irm5go8U7ORhjVbZ6ZYjU8wst4KdBeVZfgVVyX+wkGAE5xQMxiSuSTNb7xLBErN2Xw/1pg6g6w+XcE/Frzi4AB6G+bPcXbhMBE/QKiVvmVC0lvXtVA9K3W2/kZ/JERJwNrAjAhUk+GJp/esBhNV98Fx3T1ZV+fUy+wT84tn4sWhjbWFzKdWhDXOl4WN5igFPuYbFCQblVE+tmgpn1cFzgef6ATOdGjRzg2toSegRUDwgIYrKaEjt0Gy/xEHKPm9vqz+6q1SAqnIlJVRC8QA+ITx5v462/wM7rpEp"
/>
