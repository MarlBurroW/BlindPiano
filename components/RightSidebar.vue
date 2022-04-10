<template>
  <v-navigation-drawer :value="rightDrawer" width="350" app right clipped>
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