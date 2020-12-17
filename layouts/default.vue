<template>
  <div ontouchstart="" onMouseDown="return false;" onSelectStart="return false">
    <LightBox />
    <nuxt />
  </div>
</template>

<script>
import LightBox from '@/components/LightBox'
export default {
  components: {
    LightBox,
  },
}
</script>

<style>
body {
  background-color: #10171e;
  padding-top: 4.2rem;

  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
}
body::-webkit-scrollbar {
  display: none;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>
