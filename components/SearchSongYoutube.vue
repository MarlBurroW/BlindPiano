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
    item-text="title"
    item-value="id"
    label="Search Video"
    placeholder="Search a video song"
    prepend-inner-icon="mdi-magnify"
    return-object
    outlined
  >
    <template v-slot:item="{ item }">
      <div class="d-flex align-center align-content-center">
        <v-img
          height="50"
          width="50"
          class="mr-3"
          :src="item.metadata.thumbnails[0].url"
        ></v-img>

        <div class="mr-3">{{ item.title }}</div>
        <v-chip class="mr-3">{{ item.channel.name }}</v-chip>
        <div class="mr-3">
          ({{ item.metadata.short_view_count_text.simple_text }})
        </div>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click.stop="openLink(item.url)"
          ><v-icon>mdi-link-variant</v-icon></v-btn
        >
      </div>
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
        .get("/api/songs/search_youtube", { params: { search: val } })
        .then((res) => {
          this.items = res.data.videos;
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