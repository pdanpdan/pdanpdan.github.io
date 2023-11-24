---
title: Numeric fields with increment / decrement buttons
description: Create numeric input fields with custom buttons using QInput and QBtn or change value by dragging.
date: 2023-11-24
tags: [quasar]
outline: deep
---

<script setup>
import PostHeader from 'components/PostHeader.vue';
import CodeFrame from 'components/CodeFrame.vue';
</script>

<PostHeader />

## Problem description

You need to create numeric form field with buttons to increase / decrease the value.

## Solution

Use a base QInput and use the `#before`, `#prepend` `#append`, or `#after` slots to place the buttons.

Use `vTouchRepeat` to change value as long as a button is pressed.

Use `vTouchPan` to change the value by dragging.


::: code-group
```vue [MyButtons.vue]
<template>
  <div class="col column no-wrap">
    <div class="q-pa-md column q-gutter-y-md" style="max-width: 400px">
      <q-input
        style="max-width: 200px"
        v-model.number="model"
        type="number"
        :step="1"
        standout
        dense
        color="primary"
        input-class="text-right q-no-input-spinner"
      >
        <template v-slot:prepend>
          <q-btn
            style="margin-left: -12px; border-top-right-radius: 0; border-bottom-right-radius: 0"
            unelevated
            color="red-6"
            icon="remove"
            padding="sm"
            v-touch-repeat:0:500:100.mouse.enter.space="decrement"
          />
        </template>

        <template v-slot:append>
          <q-btn
            style="margin-right: -12px; border-top-left-radius: 0; border-bottom-left-radius: 0"
            unelevated
            color="green-6"
            icon="add"
            padding="sm"
            v-touch-repeat:0:500:100.mouse.enter.space="increment"
          />
        </template>
      </q-input>

      <q-input
        style="max-width: 200px"
        v-model.number="model"
        type="number"
        :step="1"
        outlined
        dense
        color="primary"
        input-class="text-right q-no-input-spinner"
      >
        <template v-slot:prepend>
          <q-icon
            style="cursor: ns-resize"
            name="swap_vert"
            v-touch-pan.vertical.mouse="onPan"
          />
        </template>

        <template v-slot:append>
          <q-btn
            flat
            color="primary"
            icon="remove_circle_outline"
            padding="7px"
            v-touch-repeat:0:500:100.mouse.enter.space="decrement"
          />

          <q-btn
            style="margin-right: -11px"
            flat
            color="primary"
            icon="add_circle_outline"
            padding="7px"
            v-touch-repeat:0:500:100.mouse.enter.space="increment"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(0);
let onPanTimer = null;
let onPanValue = 0;

function increment() {
  model.value += 1;
}

function decrement() {
  model.value -= 1;
}

function onPan({ offset, isFirst, isFinal }) {
  onPanValue = Math.sign(-Math.floor(offset.y / 30));

  if (onPanTimer !== null) {
    clearInterval(onPanTimer);
  }

  if (isFinal !== true && onPanValue !== 0) {
    model.value += onPanValue;
    onPanTimer = setInterval(() => {
      model.value += onPanValue;
    }, Math.max(20, 10000 / Math.abs(offset.y)));
  } else {
    onPanTimer = null;
  }
}
</script>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=monaco#eNrNWG1v2zYQ/iusMdQOZslK2m2AmnR92QZ0QLstGbYP82AwEuWwpUiGpBxngf/77khJpl/SzkVXNB9i6e54vHvueLzT3YDXWhmX1FSnb62Sg3xwN5WETFuGnQ5y4ilIu26opQZJ08GVc9rmk0kj9bt5Wqh6ErjPTtLjx2k2Kbl1LSlltk61USVsMR2MO23PAnfCls5QOzHqUjmVVEq6+DktrDdi346HaLhv25o6ZjgVCS+U3H49YPP/oActWE3lajAeXCrlUmcB7oAzcbeakTvyXGuyIpVRNRkuGjZ8MpWtwB35ze/Xs8P2KDGVbOllSlbRRjhSNbJwXEkyuiMUNUIM8SEP+o9CRIGQNpaNgt5xF2YtmjmXtg87IZMJeaMcr25bDD3lB3BOzVvKCn7DE3hb8Xm0uKTmXU6GtHFqGEnD/yMwHeAANMCqFLwFNE4dq7UA7J6iyGnJF6QQ1Nqz6aBQArSLppZEquTGUD0deKktuetE06QuO9nrZN44iEVyC8TpgFh3KxiI1XSZ3PDSXeXkcZbpZa8M1F0nXOrGde9k36KTsGgts0hqVTKRyqa+ZAaF8TWWwBgDPQjEjNw6poFzHBOto7JUsRUlk5atX8FBhftow2tqbuO13vykQ8RBiiaGz68coAHYBa7VXMrYjt5/QKALA3hlhXK5NkwzWUYiHqZL14Z9FygDSZQIVrmcJMcnevmEXCpTQhyc0sGYxNCSN5BoWc+DM+tUvc2OPcO/RjLBFmBduUnvADGsTL7dXoTn0PNqtWDbTE3Lkss58G29zVuAxU1xlSAC1OVZ/k2W5cdZltYKTk/KJCRXajUt0O+SFbAD0Da1TGJsJ1GOvwdyOJ4fgbiHbh/kGIr7Ed/kHgr43DAm74UcsP3f8ObyMLw7UnvCe8qXdfTh1AsuY7S/vKOPwd2fiUVjrDI5kRZiaPk/O6dN0hrl7A3VswUzW7FbZ4CmMkU+L6gI0YdVSv5K5Wc7XRWs2Z/ze6DfKTOzgptCsFkbz/tPwXeb+fQpy87H1o/jXZM+Fgxw87Mh8WkKwim0r4vQgrRPW3l1agvDtSOWuUYTQb3t2C0Dt2/YDKu2m7mpxHbQEV8gyBmKjDJshARzxKf277xmBjiyESKm/0FFw4CeeS19h9f7O2q7ulCJFl766zNyHJqsaEWfK/tWJPtW+P2hlVRVBf6OCbc/cWPbB0lF31FuGPqauqvU8rkcJf6xEkqZUdCR3pIJeZQdoee4kFdkFHn/4Cz436qFPBOMmlcYaDAzksT1vqfulHQWoQZnwI6HD2OrkJz1WregWst5ra07XTzA6t4AQO7s6brF/ZCe1TiAAVfI6CQbE8jdLAMAPJFe2h6UIw8ILCBMWBgH9pjRpkUYJDAtQyI+hS7a2dB8bw1yMKtoLpj5RWMwNwc6KoS6+dnTEK1+RiquWPFuD/2thdOJ4xBcChawgIPc8xwUEAbHDtk/XryBiydiAkSNAOn3MM+ZhY4dbQxiLxpZgtnxDnCJepv+6q/tdiQN06bnT7gs2TItYbrqSsDfHi+vZjqAg/jyPYisvXiUPorXsWUhmtK70G4P1zkEfhasbzeDrXC8qymHq2vfRGMbCxeP7UoPTi7R3OGdSSAXHFRDC5WPV/7Ku7g471MaZph1NTvFnRKc8aIxCSQ+tDIucJFJ91S5zfq2NWx66PBKhynvnGnxJ0xmmhkc9laQqX2GHlI2xwSC8LIxBsrUK6iXVBZsDAfhtWrgDJb3jMivAQsccAMvnbRjZSQRRt2LDt9OcJPcrelX4bDey+JLy4V68wBf24KClV0JuJCMgUI3fOFXQZ7BuOqA6XOuHLZTb3cRQLMUOwknfNfzEa4J4iGg4d7AkCIH7dhWs1VBe+Q2S5fX1hauM1JRKDqhtrRGRrGDpN5FaTe9ocGATxQ5Dv0Q2a+uU3xKuX0ONwlWi30Du+9RbXPpuBPsJJrD2w8e3XHYzNz27RqaWbj5o1Zns8lZfxWol/4DQMeIm5mN7rrv4CqocVfrBc8KwQv0SslzJhTtdX26rfN2723cyPdkiASsNWxI4KAJbNPC6x4Lu/WA3GhHV1cNjg6wXxxsP57t1DjocbqbGHyolIHvYjMMeMkN893FzMycmgnv1V6+QL65x02/Dbp5R9I0bQljAhvnJLai7wdWG26Hzg9S9rAOL+qMQip0rZRQBUVGalry7jla/Qv3l7r5"
/>
