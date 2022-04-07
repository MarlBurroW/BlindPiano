import { Notyf } from "notyf";
import urljoin from "url-join";

import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import Avataaars from "vue-avataaars";
import VueChatScroll from "vue-chat-scroll";
import VueDragscroll from "vue-dragscroll";
export default async (app, inject) => {
  Vue.component(Avataaars);
  Vue.use(VueChatScroll);
  Vue.use(VueDragscroll);
  const notyf = new Notyf({
    duration: 5000,
    ripple: true,
    dismissible: true,
    position: {
      x: "center",
      y: "top",
    },
    types: [
      {
        type: "info",
        background: "#0d8ce9",
        icon: {
          className:
            "v-icon notranslate mdi mdi-information-outline theme--light",
          tagName: "i",
          color: "white",
        },
      },
    ],
  });

  inject("notyf", notyf);

  const config = await app.$axios
    .get("/api/config")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      notyf.error(err);
    });

  inject("config", config);

  inject("gameLink", (game) => {
    return game ? urljoin(config.app_url, "games", game.id) : null;
  });
  VueClipboard.config.autoSetContainer = true;
  Vue.use(VueClipboard);
};
