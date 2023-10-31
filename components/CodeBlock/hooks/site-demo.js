import { computed, defineAsyncComponent } from 'vue';
import { useData } from 'vitepress';
import { compileString } from 'sass';

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

const reSass = /(<style.*?)\slang\s*=["']?(sass|scss)["']?(>|[^"'][^>]*>)(.*?)<\/style>/is;

export const useSiteDemos = (props, siteDemosData) => {
  const { lang } = useData();
  const demoData = computed(() => siteDemosData.value[props.src]?.data);
  const render = computed(() => decodeURIComponent(demoData.value?.render));
  const code = computed(() => decodeURIComponent(demoData.value?.code));
  const playground = computed(() => {
    const source = code.value;
    const converted = [];

    const len = source.length;
    let posStart = 0;
    let posEnd = len;
    posEnd = source.indexOf('<style', posStart);
    while (posEnd > -1 && posEnd < len) {
      converted.push(source.slice(posStart, posEnd));
      posStart = posEnd;
      posEnd = source.indexOf('</style>', posStart);
      posEnd = posEnd > -1 ? posEnd + 8 : len;

      const style = source.slice(posStart, posEnd);
      const match = reSass.exec(style);
      if (match !== null) {
        try {
          const { css } = compileString(match[4], { syntax: match[2].toLowerCase() === 'sass' ? 'indented' : 'scss' });
          converted.push(`${ match[1] }${ match[3] }\n${ css }\n</style>`);
        } catch (e) {
          converted.push(style);
        }
      } else {
        converted.push(style);
      }
      posStart = posEnd;
      posEnd = source.indexOf('<style', posStart);
    }

    if (posStart < len) {
      converted.push(source.slice(posStart));
    }

    return converted.join('');
  });
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
    demoData, demo, render, code, block, content, playground,
  };
};
