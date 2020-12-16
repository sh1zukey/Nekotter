<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-twheader">
      <a class="navbar-brand">Nekotter</a>
      <div class="form-inline">
        <b-button class="mr-2" variant="info" :to="'../random/'"
          ><font-awesome-icon :icon="['fas', 'random']"
        /></b-button>
        <b-button-group>
          <b-button variant="secondary" :to="subDate($route.params.id)"
            >昨日</b-button
          >
          <b-button variant="primary" :to="addDate($route.params.id)"
            >翌日</b-button
          >
        </b-button-group>
      </div>
    </nav>
    <transition name="page">
      <div class="container-fluid">
        <h1 class="text-light text-break">
          {{ title }}
        </h1>
        <Tweets :params="$route.params" :results="displayResults"></Tweets>
        <client-only>
          <infinite-loading
            ref="infiniteLoading"
            spinner="waveDots"
            @infinite="infiniteHandler"
          >
          </infinite-loading>
        </client-only>
      </div>
    </transition>
  </div>
</template>

<script>
import Tweets from '~/components/Tweets.vue'
export default {
  validate({ params }) {
    return /^([1-9][0-9]{3})-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})$/.test(
      params.id
    )
  },
  components: {
    Tweets,
  },
  async asyncData({ app }) {
    const baseUrl = '/api/v1/date/'
    const date = app.context.params.id
    const getUrl = encodeURI(baseUrl + date)
    const response = await app.$axios.$get(getUrl)
    return {
      results: response.results,
      displayResults: response.results.slice(0, 24),
      title:
        app.context.params.id +
        'の検索結果 -' +
        response.results.length +
        '件-',
    }
  },
  data() {
    return {
      title: '日付検索',
      results: [],
      displayResults: [],
      pageIndex: 0,
      perData: 24,
    }
  },
  methods: {
    addDate(oldDate) {
      const date = new Date(oldDate)
      date.setDate(date.getDate() + 1)
      const y = date.getFullYear()
      const m = ('00' + (date.getMonth() + 1)).slice(-2)
      const d = ('00' + date.getDate()).slice(-2)
      return y + '-' + m + '-' + d
    },
    subDate(oldDate) {
      const date = new Date(oldDate)
      date.setDate(date.getDate() - 1)
      const y = date.getFullYear()
      const m = ('00' + (date.getMonth() + 1)).slice(-2)
      const d = ('00' + date.getDate()).slice(-2)
      return y + '-' + m + '-' + d
    },
    infiniteHandler($state) {
      if (this.displayResults.length >= this.results.length) {
        $state.complete()
        return
      }
      this.pageIndex++
      const temp = this.pageIndex * this.perData
      this.displayResults = this.displayResults.concat(
        this.results.slice(temp, temp + this.perData)
      )
      $state.loaded()
    },
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
