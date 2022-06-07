<template>
  <v-card flat class="d-flex flex-column fill-height chat-card">
    <!-- <v-toolbar dense class="shrink">
      <v-spacer></v-spacer>

      <v-switch
        class="mt-6"
        label="Auto scroll"
        v-model="autoScroll"
      ></v-switch>
    </v-toolbar> -->

    <v-card-text class="flex-grow-1 overflow-y-auto pa-3">
      <vue-scroll ref="scroller" :ops="scrollOptions">
        <div
          class="message"
          v-for="chatMessage in chatMessages"
          :key="chatMessage.id"
        >
          <div v-if="chatMessage.type == 'player-message'">
            <span :style="{ color: chatMessage.color }" class="nickname"
              >{{ chatMessage.nickname }}:
            </span>
            <span class="message">{{ chatMessage.message }}</span>
          </div>
          <div v-if="chatMessage.type == 'log-message'">
            <span :style="{ color: chatMessage.color }">
              {{ chatMessage.message }}</span
            >
          </div>
        </div>
      </vue-scroll>
    </v-card-text>
    <v-card-text class="flex-shrink-1 pa-0">
      <v-text-field
        append-icon="mdi-send"
        @click:append="
          sendMessage(message);
          message = null;
        "
        filled
        class="mb-0"
        v-model="message"
        placeholder="Your message"
        v-on:keyup.enter="
          sendMessage(message);
          message = null;
        "
        hide-details=""
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";
export default {
  mixins: [contextMixin],
  watch: {
    chatMessages() {
      if (this.autoScroll) {
        this.$nextTick(() => {
          this.$refs.scroller.scrollTo(
            {
              y: `100%`,
            },
            0
          );
        });
      }
    },
  },
  data() {
    return {
      message: null,
      autoScroll: true,
      scrollOptions: {
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: true,
          keepShow: false,
          background: "#121212",
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: 0,
          size: "6px",
          disable: false,
        },
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true,
          zooming: false,

          scroller: {
            bouncing: {
              left: 0,
              right: 0,
            },
          },
        },
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
      },
    };
  },
  methods: {
    sendMessage(message) {
      if (message) {
        this.socket.emit(events.CHAT_MESSAGE, message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  margin-bottom: 5px;
  .nickname {
    font-weight: bold;
  }
}

.chat-card {
  background-color: transparent;
}
</style>