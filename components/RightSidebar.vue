<template>
  <v-navigation-drawer
    class="transparent-background-3"
    v-model="rightDrawer"
    width="350"
    app
    right
    clipped
  >
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
.v-navigation-drawer__content {
  overflow-y: hidden;
}
</style>