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
    return h('iframe', {
      class: 'vp-quasar-repl',
      loading: 'lazy',
      allow: 'fullscreen camera geolocation gyroscope microphone web-share',
      areaLabel: `Demo${ this.title.trim().length > 0 ? `: ${ this.title }` : '' }`,
      src: this.src,
    });
  },
};
</script>
