import { computed, defineAsyncComponent } from 'vue';
import { useData } from 'vitepress';

const decodeBlock = (block) => {
  const obj = {};
  Object.keys(block).forEach((blockKey) => {
    const val = block[blockKey];
    if (typeof val === 'string') {
      obj[blockKey] = decodeURIComponent(val);
    } else if (typeof val === 'object') {
      obj[blockKey] = decodeBlock(val);
    }
  });
  return obj;
};

export const useSiteDemos = (props, siteDemosData) => {
  const { lang } = useData();
  const demoData = computed(() => siteDemosData.value[props.src]?.data);
  const render = computed(() => decodeURIComponent(demoData.value?.render));
  const code = computed(() => decodeURIComponent(demoData.value?.code));
  const demo = computed(() => {
    if (siteDemosData.value[props.src]?.comp) {
      return defineAsyncComponent(siteDemosData.value[props.src]?.comp);
    }
    return null;
  });
  const block = computed(() => (demoData.value?.block ? decodeBlock(demoData.value?.block) : null));
  const content = computed(() => {
    if (!block.value) { return null; }
    const first = Object.keys(block.value)[0];
    return block.value[lang.value] ?? block.value[first];
  });
  return {
    demoData, demo, render, code, block, content,
  };
};
