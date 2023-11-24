---
title: Horizontal separators with QSeparator
description: Create separators using content inside.
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

You need to show a horizontal separator with some content inside it.

## Solution

Use a `div` with `class="row no-wrap items-center"` and inside it place two QSeparator width the content between them.

::: code-group
```vue [MySeparators.vue]
<template>
  <div class="q-pa-md col column no-wrap q-gutter-y-md" style="max-width: 400px">
    <div>
      <div class="q-pa-sm bg-yellow-1 text-dark text-center">Above</div>

      <div class="row no-wrap items-center">
        <q-separator class="col" />
        <div class="col-auto q-px-md">Label</div>
        <q-separator class="col" />
      </div>

      <div class="q-pa-sm bg-yellow-1 text-dark text-center">Below</div>
    </div>

    <q-card>
    	<q-card-section>
        <div class="text-h5">Card title on top</div>
      </q-card-section>

      <div class="row no-wrap items-center">
        <q-separator class="col bg-warning" />
        <div class="col-auto q-px-md text-h5 text-accent">&#9753; &#9753; &#9753;</div>
        <q-separator class="col bg-warning" />
      </div>

      <q-card-section>
      	<div>Some content here</div>
      </q-card-section>

      <div class="row no-wrap items-center q-px-md q-py-md">
        <q-separator class="col bg-info" style="max-width: 2ch" />
        <div class="col-auto q-px-md text-h5" style="max-width: 12ch">Spaced and asymetric</div>
        <q-separator class="col bg-info" />
      </div>

      <q-card-section>
      	<div>Some content here</div>
      </q-card-section>

      <div class="row no-wrap items-center">
        <q-separator class="col" />
        <div class="col-auto q-px-md text-h4 rotate-90">&#10149;</div>
        <q-separator class="col" style="max-width: 1ch" />
      </div>

      <q-card-actions align="right">
      	<q-btn flat color="primary" label="Action" />
      </q-card-actions>
    </q-card>
  </div>
</template>
```
:::

## Demo

<code-frame
  :title="$frontmatter.title"
  src="https://pdanpdan.github.io/quasar-play/?file=src%2FApp.vue&preview=t&previewMode=preview&editor=codemirror#eNrVV19T4zYQ/yq6tNOEGWzDAdMhl1D+tA/t9K5TeOhD3WEUW050yJKQZEiGyXfvrmQbJySUdHi5B4i9Wu2f365WPz/1eKmVcVFJdfzVKtkb9p5SSUhaL9i0NyRegrL7ilpqUJT2Zs5pO0ySSuq7aZypMgmr5x/jw+P4IMm5dbUoZraMtVE5uEh7+42187CasLkz1CZGTZRTUaGk6z7HmfVBbPK4i4VtbkvqmOFURDxTcv11B+dvsIMRLFO57O33Jkq52FmAO+BM3EIz8kQutCZLUhhVkv5DxfqfUlkrPJE/vb92ObhHjVSyudfJWUEr4UhRycxxJcngiVC0CDXEh2GwvxcqCoK4smwQ7O43ZdaimnJp27ITkiTki3K8WNQYesnPkJya1pIl/IYnyLbg087mnJq7IenTyql+Rxv+70HoAAegAVHFkC2gMXKs1AKwO0OVUc4fSCaotWNovkjTqMzBg8C/qpREqujRUE3uo2nlAO9oAQppj1i3EAy2lHQePfLczYbk+OBAz9OeNxsM14+bvNiSTKbRggmhHqND4qDEEeYRnjImwRfYupioBzaCTkdbG60Z9dgGySE1+7y50Ycd95FlmhrqlGl3QoaQSNJV6xqG5QghhdT13Cd99judMNFEs5PtV1PYBZBLBuvdELrPteQ+yqjJG5mr3yFK37Hb8vV+Zifg4wq0ieNOMAIN7pReTXmUbDH4/vVBSB6pkVxOdylVwGx2En5phh7B3w/fnf54cvSJrP2+taDbglnd30q3geT8ybhRJcOT7CA0MmOmbfL3xLjFA37DuX1jmlwWavMh/5jN/k8lNhs79NbObjTNWE6ohD+7KJkzPNulKHW030JF3n0q1QAfE6MczPTo9MA3+uHB4fHpmzt7S3XWSv06qtSjYgkVfCoRAT6d4aHroHwfTZwkBdw9eLsoA1ra8JKaBfgROFtBcuHtrDle9dFOvs6ga4IbJe31Brees+GyXCNewC00F8z8ob29FQJGcQD/5mXOVKzlNNmMZXcb5F8t3HlIX7RhlpkH1uFBjpopAxBw+ZebL1CpzmKp8kqA9iuL18zCLRzwQLXLSuYQdtcDcBof098tzjWFDOzQrydc5mwe58CGAkMi5B9PD7yZtAe84OoVRJ6zOIqPuvvYPBNV7lOo3ac9qXJ2G6KvnYErpGMl5XIzA7GV1Uza8LZOHEIy0LbOwdy15CHiBXSJkjc31+TDeOyLsdot6ClCTrba4f+187m9R0knpE5D4fU9spnh2kG7yilempAkyNfIoYdO0pIBK7tmWvwFY0Azg+RsCYwM7HsjKwYhw0qvmW15qWHFPoEiXFXGwBz5VVpHZcb24X7+rCoYLPkWSvsZsEBCGtbipKaBHY1ATW8afBvFVXGzp92F5LrVxZd6tSCDD/ha818k5kqwmBmjzKB/6XdBn8FsxBngey7v1yw1lagO8tUkyXhD5gPcE9RDQceI0QBLiisYx7oZLLmshKhDa5EbDPbI+Kxpd28tfqCiQscFFZaBvWcq3akdNPVLlF62N0w9+KQYIpeDyn5/H+NTzC0OOpwWnbZf5WK2mngS9rEzResPlOY4rHZuS/8sXqi+sVsRTN7GxjPtLAOvbRZwMrffFNj+zQt+YOFIZwXMOLgUGvl5JniGWSl5DbyUtrbez/Ww9r2OG/mJ9FGAs4b1CRw0uHdmLrxuiLDZD8gNXthqpsHeDvGLnePHsx0bJ8i4doc5FMrAd+wtFjznJlCLW3Pr1K3wWW1cF7hutqTp3WCaTySO41qwT8DxkHSjaJKG1u6mHe5VaNnts2/TqGq/h5tWgFPlj5RQGcWF2NTil+do+S/tK4KB"
/>
