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
        <div>
          <b-button class="mb-1" block variant="info" @click="lightbox_event(0)"
            >連続して閲覧する</b-button
          >
        </div>
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
    return /^[1-9]\d*$/.test(params.id)
  },
  components: {
    Tweets,
  },
  async asyncData({ app }) {
    const baseUrl = '/api/v1/thread/'
    const id = app.context.params.id
    const getUrl = encodeURI(baseUrl + id)
    const response = await app.$axios.$get(getUrl)
    const temp = []
    response.results.forEach(function (result, index, array) {
      result.for_lbox_media_urls.forEach(function (mediaUrl) {
        temp.push(mediaUrl)
      })
    })
    return {
      results: response.results,
      displayResults: response.results.slice(0, 24),
      tempMediaUrls: temp,
      title:
        'status id：' +
        app.context.params.id +
        'のスレッド検索結果 -' +
        response.results.length +
        '件-',
    }
  },
  data() {
    return {
      title: 'スレッド検索',
      results: [],
      displayResults: [],
      pageIndex: 0,
      perData: 24,
      tempMediaUrls: [],
      lightBoxData: {
        mediaUrls: [],
        index: null,
      },
    }
  },
  methods: {
    lightbox_event(index) {
      this.lightBoxData.index = 0
      this.lightBoxData.mediaUrls = this.tempMediaUrls
      this.$nuxt.$emit('LIGHT_BOX_EVENT', this.lightBoxData)
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
