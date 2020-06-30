<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-twheader">
      <a class="navbar-brand" href="#">TwIAggregator</a>
      <div class="form-inline">
        <b-button variant="secondary" @click="$router.go(-1)"
          >前のページへ</b-button
        >
      </div>
    </nav>
    <transition name="page">
      <div class="container">
        <h1 class="text-light">
          {{ title }}
        </h1>
        <Tweets :params="$route.params" :results="results"></Tweets>
      </div>
    </transition>
  </div>
</template>

<script>
import Tweets from '~/components/Tweets.vue'

export default {
  validate({ params }) {
    return /^[1-9]\d*$/.test(params.id)
  },
  components: {
    Tweets
  },
  async asyncData({ app }) {
    const baseUrl = '/api/v1/userid/'
    const id = app.context.params.id
    const getUrl = encodeURI(baseUrl + id)
    const response = await app.$axios.$get(getUrl)
    return {
      results: response.results,
      title:
        'ユーザーID：' +
        app.context.params.id +
        'の検索結果 -' +
        response.results.length +
        '件-'
    }
  },
  data() {
    return {
      results: [],
      title: 'ユーザー検索'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>
.bg-twheader {
  background-color: #1c2938 !important;
}
</style>
