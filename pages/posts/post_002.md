---
title: Grouping form elements in Quasar
description: Explain styling needed to group form elements in Quasar in order to make them look like a single element.
date: 2023-10-31
tags: [quasar, css]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
</script>

<PostHeader />

## Problem description

You need to group two Quasar form components together (most frequently a QInput and a QSelect).

## Solution

First you combine the components.

::: warning
Take care not to mix `dense` and not `dense` components.
:::

```html
<q-input class="grouped-outline grouped-outline--before" v-model="text" outlined dense>
  <template #before>
    <q-select
      v-model="select"
      outlined
      dense
      :options="options"
    ></q-select>
  </template>

  <template #append>
    <q-icon name='search'></q-icon>
  </template>
</q-input>

<q-input class="grouped-outline grouped-outline--before" v-model="text" outlined>
  <template #after>
    <q-select
      v-model="select"
      outlined
      :options="options"
    ></q-select>
  </template>

  <template #prepend>
    <q-icon name='search'></q-icon>
  </template>
</q-input>
```

Then you need some CSS to make it look good. It works both for LTR and RTL languages.

```sass
.q-field.grouped-outline
  &--before
    > .q-field__before
      padding-inline-end: 0

      > .q-field--outlined
        margin-inline-end: -1px

        .q-field__inner > .q-field__control
          border-start-end-radius: 0
          border-end-end-radius: 0

    > .q-field__inner > .q-field__control
      border-start-start-radius: 0
      border-end-start-radius: 0
      margin-inline-start: -1px

      &:not(:hover):before
        border-inline-start-color: transparent

  &--after
    > .q-field__after
      padding-inline-start: 0

      > .q-field--outlined
        margin-inline-start: -1px

        .q-field__inner > .q-field__control
          border-start-start-radius: 0
          border-end-start-radius: 0

    > .q-field__inner > .q-field__control
      border-start-end-radius: 0
      border-end-end-radius: 0
      margin-inline-end: -1px

      &:not(:hover):before
        border-inline-end-color: transparent
```

## Demo

The Vue REPL does not support processing SASS syntax yet, so the styles are converted to CSS.

<iframe class="vp-quasar-repl" src="https://pdanpdan.github.io/quasar-play/preview#eNq9WG1v2zYQ/iuEO9Q2YMkp+k2Ng61Ft2Lo3toB+1AVLiPRFmuKVEjKdpDmv+/hixzZiNO6WPYlpu6Od8+Rd8e73AyMLqaXStnUmkE24HWjtCX2umHkhvzUNOSWLLSqyXDdsuGLXEaBG/JXSw3VO/aV/3QSuWRbL1OyBW2FJYtWFpYrSUbYRp3KLCwyZ+AFVIzJTS6JI6WtYaOoexKohDSiXXJpsCt8306cFbcqlFzw5Y5BSEn1KiND2lo1hFQnjb9kDGy3uRxMvMuwnMIluHxuWd0IatmFkzsv+ZoUghozyweFEjAh2loSqZKNpk0+8FIHcldJQ5O67GSvkmVrLdPJNYj5gBh7LRjEarpNNry0VUaen501250yqLtKuGxau1O51KptWJmo1gouGTn4TpJLtlCaQfs6qVXJBPZYtrUgRJESFyBN8Coa6TwlT8LuHs9DMEywwpI+lfT0B3Y+2Od35vap3vY+KVONCwPnXVztq7o4n3YQ+qCnvfu51xeEDZPloS8csUEkrdlsaBjVRTX0+h35mPaOFO+iZ+/066ELBMBDt3P/vfhtj3gtj3UHjWaPdgnhG/kWEjSuDjCd+yTD0oUDuSAuPX1VqLlMKsaXlc3Is7Ozcl2hDiA+ucHm64wsBNt6ilskJddwHeeSxWS+Y7n0z1AH3G8oJblMr5IFZ6JMj6QngHQi83kkeVQNLUsul/DRi+PoMnIWtH6PzjtS0omX0X2qUTv37CTPGufxf2nqTopLyfTePty11SikHs6l0iUKo7FUW4cm0bTkLUq7c37HdoxD5qlwTwES/h6Fch97/1y9xHef7FGomVR2lFVqzfQ464dPBNe3niBelc6I1VSahmom7deg+GKzZzdQ7ovQ6OFXb+KYzm+N0BNO8iRT/1NgnAj40bLluxP/BIzfGJ0O2rHYPJ92ZdtV8ELzxhLDbNsQQeXSPZp4n8DddZ2aLQ470lwCj0HPiveVzJzEaDh0zV4gx8czMn5RailYjx1fQfA/kI47IcOfacHQFa+G5CNEAdNjAxK0jwFMUtMm/WyURAvpvc4jA4hjQwoHQ8NpTWhUD+QLVTdcMP1H9xLvGtl8QIVQm189zeqWxV4WeypWrO6hfzZoJzMs8BIbptfoDHc8hM+SoUFw7Nfvf/d9yI6JLqIVkH6A+Y4ZvIUOYxB72coSsPsWMC94TB+6BxxNsW/i8VobO/X8KZcl26YlJo2u6fjoj8mryQe4z1cPnMidF8/T5/19bFuItvQuRPP5QKI3mgf00RhM3XX/NeVyb+C5IYVm6CUwFkxIdWToeYkxKTJSPzP1eG5U6lhxtuhxw0DznlmLkmp2gvvkbk+OY0KfiWxaCnVJYy3gEom5QFiSf3COagPIKHhNM59npJUr9CUSo1TsS0Jsv2ONQGD77a4Jw2DkSGEw8mk2ipMXQXbYVmNEG5PZBalGZIgGConwwa0P0I9xQiPv8Jh89GNVuIvbXjLWqpUu6ai5lkXU6i0FtuvRZpgHN96VNDoC0u4WRgH92OvvhsOYRUxrpd9QH4ReDYMcDDjdSrDA99Ru74bycH27EXRPr0cLn13vOAyDoudKtiF/4q64YedrxcuLEYwhv5RYswkWn11lOfSNl8A0nM9D/M99gZvP3cV2Eko4kVIVbY1KmF61TF+/92XKwf705Icbp+T2E1RTQ978/dvbt1yuXgvmxMkXIlsheuoqVxRhsrK2Mdl02spmtcRZ1dMA4UfXJCMJfSYGUqqtSButyrQwJsQcImwB7xy2p0/dTxr0zmbBQC9SvP+jcPFd5IQoCIoCLBT/FWA5hV++3Hkbbjg6gzN3YuHM3Vb3lT50gl5AMxfXQ88wFWM+ESMvnob76etUUijq9IZY3HciSvi48S+Fu9i4ewe8YrRM8W8Ipu1L/9iN/L7JgcSCa2NfVRxu+0Ai49RWTI5iSjja4PZfHozPAw=="></iframe>
