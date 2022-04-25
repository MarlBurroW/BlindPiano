<template>
  <div>
    <v-autocomplete
      v-model="artist"
      :items="artists"
      :loading="loading"
      @update:search-input="searchArtist"
      :search-input.sync="searchArtistInput"
      color="white"
      hide-no-data
      hide-selected
      item-text="strArtist"
      item-value="idArtist"
      label="Artist"
      placeholder="Search an artist"
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
            :src="item.strArtistThumb"
          ></v-img>

          <div class="mr-3">
            {{ item.strArtist }} - {{ item.strStyle }} -
            {{ item.intBornYear }} -
            {{ item.strCountry }}
          </div>
        </div>
      </template>
    </v-autocomplete>

    <v-autocomplete
      v-if="artist"
      v-model="song"
      :items="songs"
      :loading="loading"
      @update:search-input="searchSong"
      :search-input.sync="searchSongInput"
      color="white"
      hide-no-data
      hide-selected
      item-text="strTrack"
      item-value="idTrack"
      label="Song"
      placeholder="Search a song"
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
            :src="item.strTrackThumb"
          ></v-img>

          <div class="mr-3">
            {{ item.strTrack }} - {{ item.strAlbum }} - {{ item.strStyle }}
          </div>
        </div>
      </template>
    </v-autocomplete>
  </div>
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
    searchArtist: _.debounce(function (val) {
      this.loading = true;
      this.$axios
        .get("/api/songs/search_audiodb_artist", { params: { search: val } })
        .then((res) => {
          this.artists = res.data;
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false;
        });
    }, 300),

    searchSong: _.debounce(function (val) {
      this.loading = true;
      this.$axios
        .get("/api/songs/search_audiodb_song", {
          params: { artistSearch: this.artist.strArtist, songSearch: val },
        })
        .then((res) => {
          this.songs = res.data;
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false;
        });
    }, 300),
  },
  data() {
    return {
      artists: [],
      loading: false,
      artist: null,
      searchArtistInput: null,

      songs: [],

      song: null,
      searchSongInput: null,
    };
  },
};
</script>

<style>
</style>