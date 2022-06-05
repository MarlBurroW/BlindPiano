<template>
  <v-card max-width="500" color="grey darken-3" class="mx-auto">
    <v-card-title class="d-flex justify-center">{{ song.title }}</v-card-title>

    <v-card-subtitle class="d-flex justify-center">{{
      song.artist
    }}</v-card-subtitle>

    <slot></slot>

    <vue-plyr :options="{ autoplay, ratio: '16:9' }">
      <div
        class="player"
        data-plyr-provider="youtube"
        :data-plyr-embed-id="song.id"
      ></div>
    </vue-plyr>
  </v-card>
</template>

<script>
export default {
  props: {
    autoplay: {
      type: Boolean,
      required: false,
    },
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.player {
  height: 400px;
}
</style>