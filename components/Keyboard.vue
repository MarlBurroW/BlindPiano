<template>
  <v-card class="keyboard transparent-background-5" flat>
    <div class="d-flex keyboard-control align-center">
      <div class="control d-flex align-center">
        <v-switch
          class="mr-5"
          label="Show keyboard keys"
          v-model="showKeyboardCaption"
        ></v-switch>
        <v-btn
          rounded
          color="primary"
          class="mr-5"
          :disabled="keyboardOctave <= 0"
          @click="octaveDown"
          >Octave -</v-btn
        >

        <v-btn
          rounded
          color="primary"
          class="mr-5"
          :disabled="keyboardOctave >= 6"
          @click="octaveUp"
          >Octave +</v-btn
        >
      </div>

      <div class="control">
        <MidiDeviceSelection></MidiDeviceSelection>
      </div>
      <div class="control">
        <InstrumentSelection
          :loading="getLocalPlayerSetting(me.id, 'loadingInstrument')"
          :preset.sync="preset"
          :instrument.sync="instrument"
        ></InstrumentSelection>
      </div>

      <div>
        <v-menu min-width="800" top offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon><v-icon>mdi-tune</v-icon></v-btn>
          </template>

          <v-toolbar flat>
            <v-toolbar-title class="mr-5">Master Volume</v-toolbar-title>

            <v-icon class="mr-5">mdi-volume-low</v-icon>
            <v-slider
              hide-details
              v-model="masterVolume"
              max="10"
              min="-80"
            ></v-slider>
            <v-icon class="ml-5">mdi-volume-high</v-icon>
          </v-toolbar>
          <v-list class="pa-0">
            <v-list-item
              :style="{ borderLeft: `solid 10px ${player.color}` }"
              v-for="player in game.players"
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
      <vue-scroll ref="pianoScroller" :ops="scrollOptions">
        <div class="piano-scroller">
          <Piano
            ref="piano"
            :show-keyboard-caption="showKeyboardCaption"
            :keyboard-octave="keyboardOctave"
            @key-pressed="keyPressed"
            @key-released="keyReleased"
          ></Piano>
        </div>
      </vue-scroll>
      <div class="px-5">
        <v-slider vertical max="10" min="-60" v-model="masterVolume"></v-slider>
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
      const visibility = this.getLocalPlayerSetting(payload.from, "visibility");
      if (visibility && this.$refs.piano) {
        this.$refs.piano.pressKey(payload.key.midi, payload.color);
      }
    });

    this.eventBus.on("key-released", (payload) => {
      const visibility = this.getLocalPlayerSetting(payload.from, "visibility");
      if (visibility && this.$refs.piano) {
        this.$refs.piano.releaseKey(payload.key.midi);
      }
    });

    this.eventBus.on("reset", () => {
      if (this.$refs.piano) {
        this.$refs.piano.resetKeys();
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
    octaveDown() {
      if (this.keyboardOctave >= 1) {
        this.$refs.piano.resetKeys();
        this.keyboardOctave -= 1;
      }
    },
    octaveUp() {
      if (this.keyboardOctave <= 5) {
        this.$refs.piano.resetKeys();
        this.keyboardOctave += 1;
      }
    },
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
          if (key) {
            key.velocity = e.note.attack;
            this.keyPressed(key);
          }
        }
      });

      midiDevice.addListener("noteoff", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.releaseKey(e.note.number);
          const key = this.$refs.piano.getKeyFromMidi(e.note.number);
          if (key) {
            this.keyReleased(key);
          }
        }
      });
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
      showKeyboardCaption: false,
      keyboardOctave: 3,
      volume: 0,
      piano: null,
      scrollBarSize: null,
      scrollProgress: null,
      scrollOptions: {
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#2196F3",
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: 0,
          size: "20px",
          disable: false,
        },
        rail: {
          background: "#363636",
          opacity: 1,
          size: "30px",
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: "5px",
          keepShow: false,
        },
        scrollButton: {
          enable: true,
          background: "#2196F3",
          opacity: 1,
          step: 180,
          mousedownStep: 30,
        },
        vuescroll: {
          mode: "native",
          sizeStrategy: "number",
          detectResize: true,
          zooming: false,
          wheelDirectionReverse: true,
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

.piano-scroller {
  padding-bottom: 40px;
}
</style>