<template>
  <div class="h-100">
    <CoolLightBox
      :items="tweet.for_lbox_media_urls"
      :index="index"
      :loop="false"
      :closeOnClickOutsideMobile="true"
      @close="index = null"
    >
    </CoolLightBox>
    <div class="card">
      <div class="detection">
        <div class="card-links">
          <b-button-group vertical>
            <b-button
              variant="primary"
              :href="'https://twitter.com/i/status/' + tweet.status_id"
              target="_blank"
              ><font-awesome-icon :icon="['fab', 'twitter']"
            /></b-button>
            <b-button variant="secondary" :to="'../userid/' + tweet.user_id"
              ><font-awesome-icon :icon="['fas', 'user']"
            /></b-button>
            <b-button variant="info" @click="index = 0"
              ><font-awesome-icon :icon="['fas', 'expand']"
            /></b-button>
          </b-button-group>
        </div>
        <div class="card-author text-light">
          <span>{{ tweet.user_name }}</span>
        </div>
        <div class="card-body">
          <span
            class="tweet-text text-light"
            v-html="toLink(nl2br(removeStatusUrl(tweet.tweet_text)))"
          ></span>
        </div>
      </div>
      <!--      1枚-->
      <div v-if="tweet.for_lbox_media_urls.length === 1" class="tweet-images">
        <div class="col tweet-image">
          <ImgTag
            :id="0"
            :image-url="tweet.for_lbox_media_urls[0].thumb"
            :tweet-text="tweet.tweet_text"
            :date="tweet.date"
          ></ImgTag>
        </div>
      </div>
      <!--      2枚-->
      <div
        v-else-if="tweet.for_lbox_media_urls.length === 2"
        class="tweet-images"
      >
        <div class="col tweet-image tweet-image-two-1">
          <ImgTag
            :id="0"
            :image-url="tweet.for_lbox_media_urls[0].thumb"
            :tweet-text="tweet.tweet_text"
            :date="tweet.date"
          ></ImgTag>
        </div>
        <div class="col tweet-image tweet-image-two-2">
          <ImgTag
            :id="1"
            :image-url="tweet.for_lbox_media_urls[1].thumb"
            :tweet-text="tweet.tweet_text"
            :date="tweet.date"
          ></ImgTag>
        </div>
      </div>
      <!--      3枚-->
      <div
        v-else-if="tweet.for_lbox_media_urls.length === 3"
        class="tweet-images"
      >
        <div class="col tweet-image tweet-image-three-1">
          <ImgTag
            :id="0"
            :image-url="tweet.for_lbox_media_urls[0].thumb"
            :tweet-text="tweet.tweet_text"
            :date="tweet.date"
          ></ImgTag>
        </div>
        <div class="col tweet-image tweet-image-three-outer">
          <div class="col tweet-image tweet-image-three-2">
            <ImgTag
              :id="1"
              :image-url="tweet.for_lbox_media_urls[1].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
          <div class="col tweet-image tweet-image-three-3">
            <ImgTag
              :id="2"
              :image-url="tweet.for_lbox_media_urls[2].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
        </div>
      </div>
      <!--      4枚-->
      <div
        v-else-if="tweet.for_lbox_media_urls.length === 4"
        class="tweet-images"
      >
        <div class="tweet-image-four-outer">
          <div class="col-6 tweet-image tweet-image-four-1">
            <ImgTag
              :id="0"
              :image-url="tweet.for_lbox_media_urls[0].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
          <div class="col-6 tweet-image tweet-image-four-2">
            <ImgTag
              :id="1"
              :image-url="tweet.for_lbox_media_urls[1].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
          <div class="col-6 tweet-image tweet-image-four-3">
            <ImgTag
              :id="2"
              :image-url="tweet.for_lbox_media_urls[2].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
          <div class="col-6 tweet-image tweet-image-four-4">
            <ImgTag
              :id="3"
              :image-url="tweet.for_lbox_media_urls[3].thumb"
              :tweet-text="tweet.tweet_text"
              :date="tweet.date"
            ></ImgTag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import ImgTag from '~/components/ImgTag.vue'

export default {
  components: {
    CoolLightBox,
    ImgTag
  },
  props: {
    tweet: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      index: null
    }
  },
  methods: {
    nl2br(str) {
      str = str.replace(/\r\n/g, '<br />')
      str = str.replace(/(\n|\r)/g, '<br />')
      return str
    },
    removeStatusUrl(str) {
      str = str.substring(0, str.lastIndexOf('http'))
      return str
    },
    toLink(str) {
      const regexpUrl = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g
      const regexpMakeLink = function(all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a>'
      }

      return str.replace(regexpUrl, regexpMakeLink)
    }
  }
}
</script>
<style scoped>
.card {
  position: relative;
  max-height: 80vh;
  min-height: 60vh;
  height: 100%;
  border: none;
  border-radius: calc(0.25rem - 1px);
  overflow: hidden;
}

.detection {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: ' ';

  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;

  height: 90%;
  width: 70%;

  z-index: 2;
}

.card-links {
  position: absolute;
  padding: 1rem;
  top: -5.5%;
  left: 0;
  opacity: 0;
  transition: all 300ms ease;
  transform: rotateY(90deg);
  transform-origin: left center 0;
  z-index: 4;
}

.detection:hover .card-links {
  transform: rotateY(0deg);
  opacity: 1;
}

.card-author {
  position: absolute;
  padding: 1rem;
  top: -5.4%;
  right: -41.5%;
  opacity: 0;
  transition: all 300ms ease;
  z-index: 3;

  display: flex;

  max-width: 116%;
  overflow: hidden;
}

.detection:hover .card-author {
  opacity: 1;
}

.card-author span {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.3rem 0.3rem 0.4rem;
  border: 1px solid #343a40;
  border-radius: 0.25rem;
  font-weight: bolder;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.card-body {
  position: absolute;
  width: 143%;
  bottom: 0;
  opacity: 0;
  transition: all 300ms ease;
  padding-bottom: 0;
  padding-top: 0;
  z-index: 3;
}

.detection:hover .card-body {
  opacity: 1;
}

.tweet-text {
  margin: 0;
}

.tweet-text >>> a {
  color: #80bdff;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.7);
}

.tweet-text >>> a:hover {
  color: #3396ff;
}

.tweet-images {
  display: flex;
  position: relative;
  height: 100%;
}

.tweet-images::before {
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: ' ';
  transition: all 300ms ease;
  z-index: 1;
}

.detection:hover ~ .tweet-images::before {
  background-color: rgba(0, 0, 0, 0.4);
}

.tweet-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.tweet-image {
  padding: 0;
}

/*2枚の場合*/
.tweet-image.tweet-image-two-1 {
  border-right: 1px solid #10171e;
}

.tweet-image.tweet-image-two-2 {
  border-left: 1px solid #10171e;
}

/*3枚の場合*/
.tweet-image.tweet-image-three-1 {
  border-right: 1px solid #10171e;
}

.tweet-image.tweet-image-three-outer {
  flex-wrap: wrap;
}

.tweet-image.tweet-image-three-2 {
  height: 50%;
  border-left: 1px solid #10171e;
  border-bottom: 1px solid #10171e;
}

.tweet-image.tweet-image-three-3 {
  height: 50%;
  border-left: 1px solid #10171e;
  border-top: 1px solid #10171e;
}

/*4枚の場合*/
.tweet-image-four-outer {
  display: flex;
  flex-wrap: wrap;
}

.tweet-image.tweet-image-four-1 {
  height: 50%;
  border-right: 1px solid #10171e;
  border-bottom: 1px solid #10171e;
}

.tweet-image.tweet-image-four-2 {
  height: 50%;
  border-left: 1px solid #10171e;
  border-bottom: 1px solid #10171e;
}

.tweet-image.tweet-image-four-3 {
  height: 50%;
  border-right: 1px solid #10171e;
  border-top: 1px solid #10171e;
}

.tweet-image.tweet-image-four-4 {
  height: 50%;
  border-left: 1px solid #10171e;
  border-top: 1px solid #10171e;
}
</style>
