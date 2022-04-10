<template>
  <div class="piano-slider">
    <div class="slider">
      <div class="overlay" ref="overlay">
        <div
          :style="{
            width: `${sliderWidth}%`,
            transform: `translateX(${sliderPosition}px)`,
          }"
          ref="area"
          class="area"
        ></div>
      </div>
      <div ref="slidedPiano" class="slided-piano">
        <slot :slider-position="sliderPosition"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import interact from "interactjs";

export default {
  props: {
    scrollProgressPercent: {
      type: Number,
      required: false,
    },
    barSizePercent: {
      type: Number,
      required: false,
    },
  },
  mounted() {
    interact(this.$refs.area).draggable({
      lockAxis: "x",

      inertia: false,

      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: false,
        }),
      ],
      listeners: {
        move: (event) => {
          const nextPosition = this.sliderPosition + event.dx;

          if (nextPosition >= 0) {
            this.sliderPosition += event.dx;
          } else {
            this.sliderPosition = 0;
          }

          if (nextPosition <= 650 - this.pixelBarSize) {
            this.sliderPosition += event.dx;
          } else {
            this.sliderPosition = 650 - this.pixelBarSize;
          }

          const scrollProgress =
            (this.sliderPosition / (650 - this.pixelBarSize)) * 100;

          this.$emit("slider-progress-changed", scrollProgress);
        },

        end(event) {},
      },
    });
  },

  computed: {
    pixelBarSize() {
      return (this.barSizePercent * 650) / 100;
    },

    sliderPositionPercent() {
      return (this.sliderPosition / this.width) * 100;
    },
  },

  watch: {
    sliderPosition: {
      immediate: true,
      handler(percent) {},
    },
    barSizePercent: {
      immediate: true,
      handler(percent) {
        this.sliderWidth = percent;
      },
    },
    scrollProgressPercent: {
      immediate: true,
      handler(percent) {
        this.setSliderPosition(percent);
      },
    },
  },
  methods: {
    setSliderPosition(percent) {
      const pixelPosition = (percent * (650 - this.pixelBarSize)) / 100;

      this.sliderPosition = pixelPosition;
    },
  },
  data() {
    return {
      sliderPosition: null,
      width: null,
      sliderWidth: null,
    };
  },
};
</script>

<style  scoped lang="scss">
.piano-slider {
  position: relative;
  display: flex;
  justify-content: center;
}

.slided-piano {
  display: block;
  padding: 0px;
  margin: 0px;
  overflow-x: hidden;
  max-width: 650px;
}

.slider {
  max-width: 650px;
  min-width: 650px;
  position: relative;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  .overlay {
    position: absolute;
    z-index: 3;
    width: 100%;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    mix-blend-mode: hard-light;
    background-color: rgba(0, 0, 0, 0.5);
    .area {
      width: 100px;

      background-color: rgba(white, 0.3);
      height: 100%;
    }
  }
}
</style>