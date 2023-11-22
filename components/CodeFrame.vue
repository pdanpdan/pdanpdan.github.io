<script>
import { h } from 'vue';

export default {
  props: {
    src: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: '',
    },
  },

  render() {
    return h('div', { class: 'vp-quasar-repl' }, [
      h('iframe', {
        loading: 'lazy',
        allow: 'fullscreen; camera; geolocation; gyroscope; microphone; web-share; storage-access; clipboard-write',
        areaLabel: `Demo${ this.title.trim().length > 0 ? `: ${ this.title }` : '' }`,
        src: this.src,
      }),
    ]);
  },
};
</script>
