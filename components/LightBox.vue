<template>
  <div>
    <CoolLightBox
      :items="lightBoxData.mediaUrls"
      :index="lightBoxData.index"
      :loop="false"
      :close-on-click-outside-mobile="true"
      @close="lightBoxData.index = null"
    >
    </CoolLightBox>
  </div>
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  components: {
    CoolLightBox,
  },
  data() {
    return {
      lightBoxData: {
        mediaUrls: [],
        index: null,
      },
    }
  },
  created() {
    this.$nuxt.$on('LIGHT_BOX_EVENT', (lightBoxData) => {
      this.lightBoxData = lightBoxData
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('LIGHT_BOX_EVENT')
  },
}
</script>
