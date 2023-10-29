<script>
import { h } from 'vue';

export default {
  props: {
    meta: {
      type: String,
      required: true,
    },
  },

  render() {
    return h('script', {
      type: 'application/ld+json',
      innerHTML: this.meta,
    });
  },
};
</script>
