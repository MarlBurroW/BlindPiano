<template>
  <v-card class="keyboard" color="darken-4">
    <div class="d-flex keyboard-control align-center">
      <div class="control">
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
      </div>
      <div class="control">
        <MidiDeviceSelection></MidiDeviceSelection>
      </div>
      <div class="control">
        <InstrumentSelection
          :preset.sync="preset"
          :instrument.sync="instrument"
        ></InstrumentSelection>
      </div>

      <div>
        <v-menu min-width="800" top offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon><v-icon>mdi-tune</v-icon></v-btn>
          </template>
          <v-list class="pa-0">
            <v-list-item
              :style="{ borderLeft: `solid 10px ${player.color}` }"
              v-for="player in players"
              :key="player.id"
            >
              <v-list-item-avatar>
                <Avataaars
                  :avatar-options="player.avatar"
                  :height="50"
                  :width="50"
                ></Avataaars>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ player.nickname }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>Midi Device</v-list-item-title>

                <v-list-item-subtitle>
                  <span>
                    <v-icon color="subtitle" size="15">{{
                      player.deviceName ? "mdi-piano" : "mdi-keyboard-outline"
                    }}</v-icon>
                    {{
                      player.deviceName ? player.deviceName : "Mouse & Keyboard"
                    }}</span
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>Instrument</v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    getInstrumentAndPresetNameById(
                      player.instrument,
                      player.preset
                    )
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="d-flex flex-row flex-grow-1">
                <v-slider
                  class="mr-5 flex-grow-1"
                  :value="getLocalPlayerSetting(player.id, 'volume')"
                  @input="setLocalPlayerSetting(player.id, 'volume', $event)"
                  max="10"
                  min="-80"
                ></v-slider>

                <v-btn
                  icon
                  class="mr-3"
                  @click="
                    setLocalPlayerSetting(
                      player.id,
                      'visibility',
                      !getLocalPlayerSetting(player.id, 'visibility')
                    )
                  "
                  ><v-icon>{{
                    getLocalPlayerSetting(player.id, "visibility")
                      ? "mdi-eye"
                      : "mdi-eye-off"
                  }}</v-icon></v-btn
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

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
        <v-slider
          vertical
          max="10"
          min="-60"
          :value="getLocalPlayerSetting(me.id, 'volume')"
          @input="setLocalPlayerSetting(me.id, 'volume', $event)"
        ></v-slider>
      </div>
    </div>
  </v-card>
</template>

<script>
// import { Piano } from "@tonejs/piano";
import events from "../events";
import contextMixin from "../mixins/context-mixin";
import { getInstrumentAndPresetNameById } from "../instruments/list";

export default {
  mixins: [contextMixin],

  props: {
    eventBus: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    if (this.midiDevice) {
      this.bindDeviceEvents(this.midiDevice);
    }

    this.eventBus.on("key-pressed", (payload) => {
      console.log(payload.from);
      const visibility = this.getLocalPlayerSetting(payload.from, "visibility");
      if (visibility) {
        this.$refs.piano.pressKey(payload.key.midi, payload.color);
      }
    });

    this.eventBus.on("key-released", (payload) => {
      const visibility = this.getLocalPlayerSetting(payload.from, "visibility");
      if (visibility) {
        this.$refs.piano.releaseKey(payload.key.midi);
      }
    });
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
    getInstrumentAndPresetNameById,
    bindDeviceEvents(midiDevice) {
      midiDevice.addListener("controlchange", (e) => {
        if (e.controller.name == "holdpedal") {
          this.eventBus.emit("hold-pedal", {
            hold: e.value > 0.5 ? true : false,
            from: this.me.id,
          });
        }
      });

      midiDevice.addListener("noteon", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.pressKey(e.note.number);

          const key = this.$refs.piano.getKeyFromMidi(e.note.number);
          key.velocity = e.note.attack;
          this.keyPressed(key);
        }
      });

      midiDevice.addListener("noteoff", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.releaseKey(e.note.number);
          const key = this.$refs.piano.getKeyFromMidi(e.note.number);
          this.keyReleased(key);
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
      const payload = { key, from: this.me.id, color: this.me.color };

      this.eventBus.emit("key-pressed", payload);
    },
    keyReleased(key) {
      const payload = { key, from: this.me.id, color: this.me.color };

      this.eventBus.emit("key-released", payload);
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
.keyboard-control {
  padding: 20px 40px;
  .control {
    width: 100%;
    margin-right: 10px;
  }
}
</style>