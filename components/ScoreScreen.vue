<template>
  <div class="fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title>
        <h1>Game finished !</h1>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider class="mb-5"></v-divider>

      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr
                v-for="(player, rank) in scoreOrderedPlayers"
                :key="player.id"
              >
                <td
                  width="50"
                  class="rank"
                  :style="{ borderLeft: `solid 10px ${player.color}` }"
                >
                  {{ rank + 1 }}
                </td>

                <td width="50">
                  <Avataaars
                    :avatar-options="player.avatar"
                    :height="40"
                    :width="40"
                  ></Avataaars>
                </td>
                <td width="100%" class="nickname">
                  {{ player.nickname }}
                </td>

                <td class="score">
                  <span>{{ player.score }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";
export default {
  mixins: [contextMixin],
  props: {},
  beforeUnmount() {},
  mounted() {},
  methods: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.rank {
  font-size: 35px !important;
  font-weight: bold;
}

.nickname {
  font-size: 30px !important;
}

.score {
  span {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>