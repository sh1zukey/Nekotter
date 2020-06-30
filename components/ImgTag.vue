<template>
  <img
    decoding="async"
    :src="dataImageUrl"
    :alt="tweetText"
    @error="replace(dataImageUrl)"
  />
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: null
    },
    imageUrl: {
      type: String,
      default: null
    },
    tweetText: {
      type: String,
      default: null
    },
    date: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dataImageUrl: this.imageUrl
    }
  },
  methods: {
    replace(url) {
      // this.imageUrl = 'https://placehold.jp/3d4070/ffffff/800x500.png?text=404'

      const name = 'format'.replace(/[[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      const format = decodeURIComponent(results[2].replace(/\+/g, ' '))

      const tempUrl = url.replace(/\?.*$/, '').split('/')

      const date = new Date(this.date)

      const y = date.getFullYear()
      const m = ('00' + (date.getMonth() + 1)).slice(-2)
      const d = ('00' + date.getDate()).slice(-2)
      const textDate = y + '-' + m + '-' + d

      const newUrl =
        'https://apa.ittekikun.com/twviewer/images/' +
        textDate +
        '/' +
        tempUrl[4] +
        '.' +
        format
      this.dataImageUrl = newUrl
      this.$parent.tweet.for_lbox_media_urls[this.id].thumb = newUrl
      this.$parent.tweet.for_lbox_media_urls[this.id].src = newUrl
    }
  }
}
</script>
