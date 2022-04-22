<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="(player, rank) in players" :key="player.id">
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
            <span>{{ getPlayerScore(player.id) }}</span>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";

export default {
  mixins: [contextMixin],
  props: {
    players: {
      type: Array,
      required: true,
    },
  },
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