<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="loading"
    @update:search-input="search"
    @input="$emit('input', $event)"
    :search-input.sync="searchInput"
    color="white"
    hide-no-data
    hide-selected
    item-text="name"
    item-value="id"
    label="Search Song (Musicbrainz)"
    placeholder="Search a song"
    prepend-inner-icon="mdi-magnify"
    return-object
    outlined
  >
    <template v-slot:item="{ item }">
      {{ item }}
    </template>
  </v-autocomplete>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    value: {
      type: Object,
    },
  },
  mounted() {},

  methods: {
    openLink(url) {
      window.open(url, "_blank");
    },
    search: _.debounce(function (val) {
      this.loading = true;
      this.$axios
        .get("/api/songs/search_musicbrainz", { params: { search: val } })
        .then((res) => {
          this.items = res.data.result;
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false;
        });
    }, 300),
  },
  data() {
    return {
      items: [],
      loading: false,
      model: null,
      searchInput: null,
    };
  },
};
</script>

<style>
</style>