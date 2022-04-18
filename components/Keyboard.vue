<template>
  <v-card class="keyboard" color="red darken-4">
    <v-row>
      <v-col>
        <PianoSlider
          :scroll-progress-percent="scrollProgress"
          :bar-size-percent="scrollBarSize"
          @slider-progress-changed="scrollPiano"
        >
          <Piano
            small
            @key-pressed="keyPressed"
            @key-released="keyReleased"
          ></Piano>
        </PianoSlider>
      </v-col>
      <v-col>
        <MidiDeviceSelection></MidiDeviceSelection>
      </v-col>
    </v-row>

    <div class="d-flex">
      <div class="px-5"></div>
      <vue-scroll
        ref="pianoScroller"
        :ops="scrollOptions"
        @handle-scroll="pianoScrolled"
      >
        <Piano
          ref="piano"
          @key-pressed="keyPressed"
          @key-released="keyReleased"
        ></Piano>
      </vue-scroll>
      <div class="px-5">
        <v-slider vertical max="10" min="-50" v-model="volume"></v-slider>
      </div>
    </div>
  </v-card>
</template>

<script>
// import { Piano } from "@tonejs/piano";
import events from "../events";
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],

  props: {
    eventBus: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.socket.on(events.KEY_PRESSED, (key) => {
      this.$refs.piano.pressKey(key.midi, key.color);
    });

    this.socket.on(events.KEY_RELEASED, (key) => {
      this.$refs.piano.releaseKey(key.midi);
    });

    if (this.midiDevice) {
      this.bindDeviceEvents(this.midiDevice);
    }
  },
  computed: {},

  watch: {
    volume(val) {
      this.$emit("update:volume", val);
    },

    midiDevice(newDevice) {
      if (newDevice) {
        this.bindDeviceEvents(newDevice);
      }
    },
  },

  methods: {
    bindDeviceEvents(midiDevice) {
      midiDevice.addListener("noteon", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.pressKey(e.note.number);

          const key = this.$refs.piano.getKeyFromMidi(e.note.number);
          key.velocity = e.note.attack;
          this.eventBus.emit("key-pressed", key);
        }
      });

      midiDevice.addListener("noteoff", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.releaseKey(e.note.number);
          const key = this.$refs.piano.getKeyFromMidi(e.note.number);
          this.eventBus.emit("key-released", key);
        }
      });
    },

    scrollPiano(percent) {
      this.$refs.pianoScroller.scrollTo(
        {
          x: `${percent}%`,
        },
        0
      );
    },

    pianoScrolled(vertical, horizontal, nativeEvent) {
      this.scrollBarSize = horizontal.barSize * 100;
      this.scrollProgress = horizontal.process * 100;
    },

    keyPressed(key) {
      this.eventBus.emit("key-pressed", key);
    },
    keyReleased(key) {
      this.eventBus.emit("key-released", key);
    },
  },
  data() {
    return {
      volume: 0,
      piano: null,
      scrollBarSize: null,
      scrollProgress: null,
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
          scrollingX: true,
          scrollingY: false,
          initialScrollX: "50%",
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.keyboard {
}
</style>