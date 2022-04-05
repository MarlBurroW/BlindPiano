<template>
  <v-card flat class="d-flex flex-column fill-height">
    <v-card-text class="flex-grow-1 overflow-y-auto pa-3">
      <div
        class="message"
        v-for="chatMessage in chatMessages"
        :key="chatMessage.id"
      >
        <span class="nickname">{{ chatMessage.nickname }}: </span>
        <span class="message">{{ chatMessage.message }}</span>
      </div>
    </v-card-text>
    <v-card-text class="flex-shrink-1 pa-0">
      <v-text-field
        append-icon="mdi-send"
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

  data() {
    return {
      message: null,
    };
  },
  methods: {
    sendMessage(message) {
      this.socket.emit(events.CHAT_MESSAGE, message);
    },
  },
};
</script>

<style lang="scss" scoped>
.nickname {
  font-weight: bold;
}
</style>