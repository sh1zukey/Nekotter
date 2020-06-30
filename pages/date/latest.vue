<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const baseUrl = '/api/v1/date/latestdate'
    const getUrl = encodeURI(baseUrl)
    const response = await app.$axios.$get(getUrl)

    const dateObj = new Date(response.results.date)

    const y = dateObj.getFullYear()
    const m = ('00' + (dateObj.getMonth() + 1)).slice(-2)
    const d = ('00' + dateObj.getDate()).slice(-2)

    const date = y + '-' + m + '-' + d

    app.context.redirect(302, '/date/' + date)
  },
  data() {
    return {
      latestDate: '',
      title: '日付検索 最新の日付'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
