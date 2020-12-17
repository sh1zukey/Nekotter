<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-twheader">
      <a class="navbar-brand">Nekotter</a>
      <div class="form-inline">
        <b-button variant="secondary" @click="$router.go(-1)"
          >前のページへ</b-button
        >
      </div>
    </nav>
    <transition name="page">
      <div class="container-fluid">
        <h1 class="text-light text-break">
          {{ title }}
        </h1>
        <Tweets :results="results"></Tweets>
      </div>
    </transition>
  </div>
</template>

<script>
import Tweets from '@/components/Tweets.vue'
export default {
  components: {
    Tweets,
  },
  async asyncData({ app }) {
    const baseUrl = '/api/v1/random/'
    const getUrl = encodeURI(baseUrl)
    const response = await app.$axios.$get(getUrl)
    return {
      results: response.results,
      title: 'ランダム',
    }
  },
  data() {
    return {
      results: [],
      title: 'ランダム',
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.title },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Nekotter - ' + this.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.title,
        },
      ],
    }
  },
}
</script>

<style scoped>
.bg-twheader {
  background-color: #1c2938 !important;
}
</style>
