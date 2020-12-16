<template>
  <div>
    <div class="row">
      <div
        v-for="(result, key, index) in results"
        :key="index"
        class="col-12 col-lg-6 col-xl-4 col-wqhd-3 col-4k-2 card-outer"
      >
        <ImageCard :tweet="result"></ImageCard>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCard from '~/components/ImageCard.vue'

export default {
  components: {
    ImageCard,
  },
  props: {
    params: {
      type: Object,
      default: null,
    },
    results: {
      type: Array,
      default: null,
    },
  },
}
</script>

<style scoped>
.card-outer {
  padding: 8px;
}
</style>
