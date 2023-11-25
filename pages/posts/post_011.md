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
    min-width: 100% !important
    width: 100% !important

  label:not(.q-select--with-input)
    height: 0

.q-dialog__inner:has(.q-select__dialog--on-bottom)
  top: auto
  bottom: 0
  padding: 0
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
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#eNrVV21v2zYQ/iucscEOYElu0+2DlnTpumDogKZb3GEfqsGgJcpmS5EMSTkOgvz33ZGSLL+kjYvtw1okIe+OvLuH96b7Aa+0Mi6qqI4/WiUH6eA+k4RkDcNmg5R4CtJuamqpQVI2WDqnbZoktdSfFnGuqiRwL57Hz17Ek6Tg1jWkmNkq1kYVoCIbjNvbLgI3YWtnqE2MmiunolJJ11/HufVGHNJ4zA2Pqa2oY4ZTEfFcyd3tEcqfcA9a8JDJh8F4MFfKxc4C3AFn4u40I/fkldbkgZRGVWS4qtnwx0w2AvfkD6+vYwf1KJFJtvYyBStpLRwpa5k7riQZ3ROKN8Ib4iIN95+EFwVCXFs2CveO22fWol5wabtnJyRJyJVyvLxrMPSUX8A5tWgoD/A3rMDbki96hwtqPqVkSGunhj1p+H0CpgMcgAZYFYO3gMaZY5UWgN1LFDkr+Irkglp7DsEXaRpVBbmJFrUDcKM72GUDYt2dYMCv6Dq65YVbpuR0MtHrbODvgFtuIssEy11r0iqqVMEEnsG/4WHwX6o0wobamtWGJ+jcH5mGqzq6VrrWEbjtmHTRxtigcjYrPE5RpGQEEelUtTkKcSMtRz2RXapbOGYFL1hU64MyS+B1MoW6lRupOVvSFVcG2EFfy0oAg/8OBXLL3ZJwqeseIBBSUSD9bxACdKBerWB1lvQCELY+uGAZ75qbLqkd7VF7TjRJVnHZRuUPGJUQ8wRg84SSAxwBFvJNSHMqnZfoBfOzyeS7XfZcmQIywNCC15CpL/Ta/0zg/5YkpJe3PVg3m3EpmXmq6U5BwcC8bVQiKyUTv9O0KLiEPMctaIHCKi8qBleRUc9273Jz3VdDuAXiITQ6QA8xseA2KByt3kd7KpXbyEVgiFuGAG/sWzK+WLoOirOkDRqMn9xw7YhlrtZwnVxA/GFTBW5X1w0rd2t+JrFrOOIzk5yjyEjWQmDJDJwmM4H3gQzf+c2z4bhdPt8sTzfLF5vl90PytzfV2/cSarCzoXTvjAHQ6TQXzIRj2+MAFULd/uZpztSs67D5kuWfDtA/WijK2Ey1YZaZFet1ZUfNgkEVQfbl9Aqaao8JMNQCpD/DvGZWiRptDGI/17IAs/saoMN6mz60g0yYUTw94bJg67iAnpwNAJm2SWUDeJHXn8FgY/dpfNo/x9a5qAtvNCiU8JCzYGlQEBpfRbk83PnaHZRpXkLQXL2bTS/fv39z9euUnJ+fe2A3He6Q9J/T3y+vppf70iCPeiOcDBp5JafTa/JNJ9lURayLW/XQk2xtNZMWlTFhg73H3tre0RTfHSV9f3oq/DjwRA/DC0PSOgd1yn7RpL75bYvKFXTFJzgTWseX0AlSYfNVBn69iRsjv4T+Xv8L9Wu7cu1Mmz4XJK0YjHnXTIu/DFjIDE57D1CvuiJzTEEcE8iq17Ux0BvfQL2jMmdjouRbVUO/LB6Zkd8CPDjhBl6cNHNlTyLMutMW9FZwm9ye6ZnUS7+x37Sx1xoSJzjS92t3vm09VOp9l0a9gu4fL5R6fD7k8JKMdq/B5/WtIODeQTIanZDzl21h8rfFKypqVFxSiMTQDZuhu/coUIb23d8vSDfRHD4+Uhzn4cm+vYlxFXP7Cr40sJL3c7SNTgeVOrL13HEn2PNeejafMm3wH0wk6LiagsNbI+zcNWv40ugGyWrtvwRaRglGd18fGObtBj/F4AAgDP1nuTlwkQueo1dKXjOhaHfXv6c6bXTv4kZ+IkMkYG9gQwIZJHCYCNsDFrbnAbnR3l1t5p8cYb842n5M2tg4GEsadehDqQx88c7wwQtuYE6CRjkzM6dmwnt1kC+Qbx5x06tBN+9JHMcNYUxAcUr6VrROQ2jvjvQ+ZB8vaodqUPfl3IYCZJVPKaFyiozYNOT9PHr4B3R4rSY="
/>
