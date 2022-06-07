<template>
  <v-app-bar app clipped-left clipped-right class="transparent-background-5">
    <v-btn icon @click="leftDrawer = !leftDrawer"
      ><v-icon>mdi-dock-left</v-icon></v-btn
    >
    <v-toolbar-title>Blind Piano by MarlburroW</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="rightDrawer = !rightDrawer"
      ><v-icon>mdi-dock-right</v-icon></v-btn
    >
  </v-app-bar>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
  methods: {},
};
</script>

<style>
</style>