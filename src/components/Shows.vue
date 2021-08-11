<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
<style scoped>
.overflow-auto {
  overflow: auto;
}
</style>
<template>
  <div class="d-flex overflow-auto">
    <v-card
      v-for="show in shows"
      min-width="350px"
      class="ma-2"
      tile
      dark
      :key="show.ref.value.id"
      cols="2"
      hover
      @click="route(show.ref.value.id)"
    >
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title v-text="show.data.name"> </v-card-title>
        </div>
        <v-avatar class="ma-3" size="125" tile>
          <v-img :src="show.data.asset.image"></v-img>
        </v-avatar>
      </div>
    </v-card>
  </div>
</template>

<script>
import faunadb from "faunadb";

export default {
  name: "shows",
  data: function () {
    return {
      shows: [],
    };
  },
  props: {
    category: Object,
    myList: Boolean,
  },
  mounted() {
    this.loadCategoryShows();
  },
  watch: {
    category: "loadCategoryShows",
  },
  methods: {
    loadCategoryShows() {
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: this.$store.state.faunaSecret,
        domain: process.env.VUE_APP_FAUNA_DOMAIN || 'db.fauna.com' 
      });
      const q = faunadb.query;
      if (this.myList) {
        client
          .query(q.Call(q.Function("GetWatchlist")))
          .then((res) => {
            this.shows = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        client
          .query(
            q.Call(
              q.Function("GetShowsByCategory"),
              this.category.data.name,
              true
            )
          )
          .then((res) => {
            this.shows = res.data;
          })
          .catch(() => {
            this.shows = []
          });
      }
    },
    route(route) {
      this.$router.push("/show/" + route);
    },
  },
};
</script>