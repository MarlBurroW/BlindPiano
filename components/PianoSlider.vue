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

          const limitRight = 650 - this.pixelBarSize;
          const limitLeft = 0;

          if (nextPosition >= limitLeft && nextPosition <= limitRight) {
            this.sliderPosition = nextPosition;
          } else {
            if (nextPosition < limitLeft) {
              this.sliderPosition = limitLeft;
            } else {
              this.sliderPosition = limitRight;
            }
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
  padding: 20px 0px;
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

    .area {
      width: 100px;
      transition: width ease 0.3s;

      height: 100%;

      outline: 5px solid #2196f3;
    }
  }
}
</style>