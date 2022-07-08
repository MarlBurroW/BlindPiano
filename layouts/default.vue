<template>
  <v-app class="app">
    <Nuxt></Nuxt>
  </v-app>
</template>

<script>
export default {};
</script>

<style lang="scss">
* {
  user-select: none;
}

@import url("https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:wght@400;700&display=swap");

.v-application {
  font-family: "Montserrat Alternates" !important;

  background: -webkit-linear-gradient(
    to top right,
    #8a2387,
    #e94057,
    #f27121
  ) !important; /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top right,
    #8a2387,
    #e94057,
    #f27121
  ) !important; /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.app {
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.transparent-background-0 {
  background-color: rgba(0, 0, 0, 0) !important;
}
.transparent-background-1 {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.transparent-background-2 {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.transparent-background-3 {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
.transparent-background-4 {
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.transparent-background-5 {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.transparent-background-6 {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
.transparent-background-7 {
  background-color: rgba(0, 0, 0, 0.7) !important;
}
.transparent-background-8 {
  background-color: rgba(0, 0, 0, 0.8) !important;
}
</style>