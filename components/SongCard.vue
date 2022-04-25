<template>
  <v-card class="mx-auto">
    <v-card-title class="d-flex justify-center">{{ song.title }}</v-card-title>

    <v-card-subtitle class="d-flex justify-center">{{
      song.artist
    }}</v-card-subtitle>

    <slot></slot>

    <vue-plyr :options="{ autoplay }">
      <div data-plyr-provider="youtube" :data-plyr-embed-id="song.id"></div>
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

<style>
</style>