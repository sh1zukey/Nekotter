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
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    tweetText: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dataImageUrl: this.imageUrl,
    }
  },
  methods: {
    replace(url) {
      this.imageUrl = 'https://placehold.jp/3d4070/ffffff/800x500.png?text=404'

      this.dataImageUrl = this.imageUrl
      this.$parent.tweet.for_lbox_media_urls[this.id].thumb = this.imageUrl
      this.$parent.tweet.for_lbox_media_urls[this.id].src = this.imageUrl
    },
  },
}
</script>
