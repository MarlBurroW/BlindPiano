<template>
  <v-navigation-drawer width="400" app right clipped permanent>
    <chat></chat>
  </v-navigation-drawer>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
};
</script>

<style>
</style>