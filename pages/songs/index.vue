<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>Add song</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-card-text class="d-flex">
        <v-text-field
          outlined
          v-model="youtubeUrl"
          label="Youtube Video URL"
          :error-messages="
            errors && errors.youtube_url
              ? `${errors.youtube_url.param} ${errors.youtube_url.msg}`
              : null
          "
        ></v-text-field>

        <v-btn
          @click="sendYoutubeUrl"
          :loading="loading"
          :disabled="loading"
          x-large
          color="primary"
          >Fetch Video Info</v-btn
        >
      </v-card-text>

      <v-toolbar>
        <v-toolbar-title>Songs</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn @click="fetchSongs" icon><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="song">
        <v-text-field
          outlined
          v-model="song.id"
          disabled
          label="Youtube ID"
          :error-messages="
            errors && errors.id ? `${errors.id.param} ${errors.id.msg}` : null
          "
        ></v-text-field>
        <v-text-field
          outlined
          v-model="song.title"
          label="Title"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="song.artist"
          label="Artist"
          :error-messages="
            errors && errors.artist
              ? `${errors.artist.param} ${errors.artist.msg}`
              : null
          "
        ></v-text-field>

        <v-text-field
          outlined
          disabled
          v-model="song.thumbnail_url"
          label="Thumbnail URL"
          :error-messages="
            errors && errors.thumbnail_url
              ? `${errors.thumbnail_url.param} ${errors.thumbnail_url.msg}`
              : null
          "
        ></v-text-field>

        <v-text-field
          outlined
          disabled
          v-model="song.length_seconds"
          label="Duration (seconds)"
          :error-messages="
            errors && errors.length_seconds
              ? `${errors.length_seconds.param} ${errors.length_seconds.msg}`
              : null
          "
        ></v-text-field>

        <v-btn
          @click="addSong"
          :loading="loading"
          :disabled="loading"
          x-large
          color="primary"
          >Add Song</v-btn
        >
      </v-card-text>
    </v-card>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="songs"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.thumbnail_url="{ item }">
          <a :href="`https://www.youtube.com/watch?v=${item.id}`">
            <v-img :width="100" :src="item.thumbnail_url"></v-img
          ></a>
        </template>
        <template v-slot:item.link="{ item }">
          <a :href="`https://www.youtube.com/watch?v=${item.id}`">{{
            `https://www.youtube.com/watch?v=${item.id}`
          }}</a>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="deleteSong(item)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.fetchSongs();
  },
  methods: {
    fetchSongs() {
      this.$axios.get("/api/songs").then((res) => {
        this.songs = res.data;
      });
    },
    deleteSong(song) {
      this.loading = true;
      this.error = null;
      this.errors = null;

      this.$axios
        .delete(`/api/songs/${song.id}`)
        .then((res) => {
          this.$notyf.success("Song removed");
          this.fetchSongs();
        })
        .catch(() => {
          this.error = err.message;
          this.notyf.error(err.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addSong() {
      if (!this.song) {
        this.$notyf.error("No song selected");
      }

      this.loading = true;
      this.error = null;
      this.errors = null;

      this.$axios
        .post("/api/songs", this.song)
        .then((res) => {
          this.$notyf.success("Song added");
          this.fetchSongs();

          this.song = null;
          this.songInfo = null;
        })
        .catch((err) => {
          console.error(err);
          this.error = err.message;

          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
            this.$notyf.error("Validation error");
          } else {
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              this.$notyf.error(err.response.data.message);
            } else {
              this.$notyf.error(err.message);
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    sendYoutubeUrl() {
      this.loading = true;
      this.error = null;
      this.errors = null;
      this.songInfo = null;
      this.$axios
        .post("/api/songs/info", {
          youtube_url: this.youtubeUrl,
        })
        .then((res) => {
          this.youtubeUrl = "";
          this.songInfo = res.data;

          const parseResult = this.songInfo.title
            .split("–")
            .map((p) => p.trim());

          this.song = {
            id: this.songInfo.id,
            title: parseResult ? parseResult[0] : "",
            artist: parseResult ? parseResult[1] : "",
            thumbnail_url: this.songInfo.thumbnail.url,
            length_seconds: this.songInfo.metadata.length_seconds,
            likes_count: this.songInfo.metadata.likes.count,
          };
        })
        .catch((err) => {
          console.error(err);
          this.error = err.message;

          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
            this.$notyf.error("Validation error");
          } else {
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              this.$notyf.error(err.response.data.message);
            } else {
              this.$notyf.error(err.message);
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  data() {
    return {
      youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
      loading: false,
      errors: null,
      error: null,
      songInfo: null,
      songs: [],
      song: null,
      headers: [
        { text: "Image", value: "thumbnail_url" },

        { text: "ID", value: "id" },
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" },
        { text: "Link", value: "link" },
        { text: "Actions", value: "actions", align: "right" },
      ],
    };
  },
};
</script>

<style>
</style>