<template>
  <div>
    <MidiDeviceSelection></MidiDeviceSelection>

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
  </div>
</template>

<script>
import { Piano } from "@tonejs/piano";
import events from "../events";
import contextMixin from "../mixins/context-mixin";
import PianoSlider from "./PianoSlider.vue";
export default {
  mixins: [contextMixin],
  mounted() {
    this.piano = new Piano({
      velocities: 3,
    }).toDestination();

    this.piano.load().then(() => {
      console.log("loaded!");
    });

    if (this.midiDevice) {
      this.midiDevice.addListener("noteon", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.pressKey(e.note.number);
        }
      });

      this.midiDevice.addListener("noteoff", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.releaseKey(e.note.number);
        }
      });
    }

    this.socket.on(events.KEY_PRESSED, (key) => {
      this.$refs.piano.pressKey(key.midi);
    });

    this.socket.on(events.KEY_RELEASED, (key) => {
      this.$refs.piano.releaseKey(key.midi);
    });
  },
  computed: {},
  methods: {
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
      this.piano.keyDown({ note: key.name, velocity: key.velocity });
      this.socket.emit(events.KEY_PRESSED, key);
    },
    keyReleased(key) {
      this.piano.keyUp({ note: key.name });
      this.socket.emit(events.KEY_RELEASED, key);
    },
  },
  data() {
    return {
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
          mode: "slide",
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
        },
      },
    };
  },
};
</script>

<style>
</style>