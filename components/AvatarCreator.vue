<template>
  <v-row>
    <v-col cols="6" class="py-10">
      <v-layout align-center justify-center>
        <Avataaars
          :avatar-options="avatarOptions"
          :height="300"
          :width="300"
          class="mb-5"
        ></Avataaars>
      </v-layout>
      <v-layout align-center justify-center>
        <v-btn color="primary" rounded @click="randomize"> Randomize</v-btn>
      </v-layout>
    </v-col>
    <v-col cols="6">
      <v-tabs
        background-color="primary"
        active-class=""
        v-model="avatarTabIndex"
        dark
      >
        <v-tab :key="index" v-for="(tab, index) in options.tabs">
          {{ tab.title }}
        </v-tab>
        <v-tabs-items v-model="avatarTabIndex" class="py-5">
          <v-tab-item :key="index" v-for="(tab, index) in options.tabs">
            <v-select
              v-for="(select, index) in tab.labels"
              :key="index"
              :label="select.name"
              :items="select.options"
              v-model="avatarOptions[select.id]"
              filled
            ></v-select>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import _ from "lodash";

export default {
  props: {},

  created() {
    this.randomize();
  },

  methods: {
    randomize() {
      for (let i = 0; i < this.options.tabs.length; i++) {
        const tab = this.options.tabs[i];
        for (let j = 0; j < tab.labels.length; j++) {
          const select = tab.labels[j];
          this.avatarOptions[select.id] = _.sample(select.options);
        }
      }
    },
  },
  watch: {
    avatarOptions: {
      deep: true,
      handler(value) {
        this.$emit("update:avatar", value);
      },
    },
  },
  data() {
    return {
      avatarOptions: {
        backgroundType: "circle",
        backgroundColor: "pink",
        skinColor: "light",
        clothesType: "hoodie",
        clothesColor: "pink",
        clothesGraphicsType: "none",
        eyesType: "squint",
        eyebrowType: "raisedExcited",
        mouthType: "smile",
        facialHairType: "beardLight",
        facialHairColor: "brownDark",
        accessoriesType: "round",
        topType: "none",
        topColor: "brownDark",
      },
      avatarTabIndex: 0,
      options: {
        tabs: [
          {
            title: "Body & Background",
            labels: [
              {
                id: "backgroundType",
                name: "Background Type",
                options: ["circle", "transparent"],
                default: "circle",
              },
              {
                id: "backgroundColor",
                name: "Background Color",
                options: [
                  "black",
                  "blue01",
                  "blue02",
                  "blue03",
                  "gray01",
                  "gray02",
                  "heather",
                  "pastelBlue",
                  "pastelGreen",
                  "pastelOrange",
                  "pastelRed",
                  "pastelYellow",
                  "pink",
                  "red",
                  "white",
                ],
                default: "pink",
              },
              {
                id: "skinColor",
                name: "🎨 Skin Color",
                options: [
                  "tanned",
                  "yellow",
                  "pale",
                  "light",
                  "brown",
                  "darkBrown",
                  "dark",
                ],
                default: "light",
              },
            ],
          },

          {
            title: "Face",
            labels: [
              {
                id: "eyebrowType",
                name: "✏️ Eyebrow Type",
                options: [
                  "angry",
                  "angryNatural",
                  "default",
                  "defaultNatural",
                  "flatNatural",
                  "frownNatural",
                  "raisedExcited",
                  "raisedExcitedNatural",
                  "sadConcerned",
                  "sadConcernedNatural",
                  "unibrowNatural",
                  "updown",
                  "updownNatural",
                ],
                default: "raisedExcited",
              },
              {
                id: "eyesType",
                name: "👁 Eyes Type",
                options: [
                  "close",
                  "cry",
                  "default",
                  "dizzy",
                  "eyeroll",
                  "happy",
                  "hearts",
                  "side",
                  "squint",
                  "surprised",
                  "wink",
                  "winkWacky",
                ],
                default: "squint",
              },
              {
                id: "mouthType",
                name: "👄 Mouth Type",
                options: [
                  "concerned",
                  "default",
                  "disbelief",
                  "eating",
                  "grimace",
                  "sad",
                  "screamOpen",
                  "serious",
                  "smile",
                  "tongue",
                  "twinkle",
                  "vomit",
                ],
                default: "smile",
              },
              {
                id: "facialHairType",
                name: "Facial Hair Type",
                options: [
                  "none",
                  "beardMedium",
                  "beardLight",
                  "beardMajestic",
                  "moustacheFancy",
                  "moustacheMagnum",
                ],
                default: "beardLight",
              },
              {
                id: "facialHairColor",
                name: "✂️ Facial Hair Color",
                options: [
                  "auburn",
                  "black",
                  "blonde",
                  "blondeGolden",
                  "brown",
                  "brownDark",
                  "platinum",
                  "red",
                ],
                default: "brownDark",
              },
            ],
          },
          {
            title: "👓 Accessories",
            labels: [
              {
                id: "accessoriesType",
                name: "👓 Accessories",
                options: [
                  "none",
                  "eyepatch",
                  "kurt",
                  "prescription01",
                  "prescription02",
                  "round",
                ],
                default: "round",
              },
            ],
          },
          {
            title: "💈 Hair Color",
            labels: [
              {
                id: "topType",
                name: "Top Type",
                options: [
                  "none",
                  "hat",
                  "hijab",
                  "turban",
                  "winterHat1",
                  "winterHat2",
                  "winterHat3",
                  "winterHat4",
                  "longHairBigHair",
                  "longHairBob",
                  "longHairBun",
                  "longHairCurly",
                  "longHairCurvy",
                  "longHairDreads",
                  "longHairFro",
                  "longHairFroBand",
                  "longHairNotTooLong",
                  "longHairShavedSides",
                  "longHairMiaWallace",
                  "longHairStraight",
                  "longHairStraight2",
                  "longHairStraightStrand",
                  "shortHairDreads01",
                  "shortHairDreads02",
                  "shortHairFrizzle",
                  "shortHairShaggyMullet",
                  "shortHairShortCurly",
                  "shortHairShortFlat",
                  "shortHairShortRound",
                  "shortHairShortWaved",
                  "shortHairSides",
                  "shortHairTheCaesar",
                  "shortHairTheCaesarSidePart",
                ],
                default: "none",
              },
              {
                id: "topColor",
                name: "Top Color",
                options: [
                  "auburn",
                  "black",
                  "blonde",
                  "blondeGolden",
                  "brown",
                  "brownDark",
                  "platinum",
                  "red",
                  "blue01",
                  "blue02",
                  "blue03",
                  "gray01",
                  "gray02",
                  "heather",
                  "pastelBlue",
                  "pastelGreen",
                  "pastelOrange",
                  "pastelRed",
                  "pastelYellow",
                  "pink",
                  "red01",
                  "white",
                ],
                default: "brownDark",
              },
            ],
          },
          {
            title: "👔 Clothes",
            labels: [
              {
                id: "clothesType",
                name: "Clothes Type",
                options: [
                  "blazerShirt",
                  "blazerSweater",
                  "collarSweater",
                  "graphicShirt",
                  "hoodie",
                  "overall",
                  "shirtCrewNeck",
                  "shirtScoopNeck",
                  "shirtVNeck",
                ],
                default: "hoodie",
              },
              {
                id: "clothesColor",
                name: "Clothes Color",
                options: [
                  "black",
                  "blue01",
                  "blue02",
                  "blue03",
                  "gray01",
                  "gray02",
                  "heather",
                  "pastelBlue",
                  "pastelGreen",
                  "pastelOrange",
                  "pastelRed",
                  "pastelYellow",
                  "pink",
                  "red",
                  "white",
                ],
                default: "pink",
              },
              {
                id: "clothesGraphicsType",
                name: "Clothes Graphics Type",
                options: [
                  "none",
                  "bat",
                  "cumbia",
                  "diamond",
                  "pizza",
                  "resist",
                  "selena",
                  "bear",
                  "skullOutline",
                  "skull",
                ],
                default: "none",
              },
            ],
          },
        ],
      },
    };
  },
};
</script>

<style>
</style>