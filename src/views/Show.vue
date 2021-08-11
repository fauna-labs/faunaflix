<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
<style scoped>
.overlay {
  height: 100%;
  color: white;
  opacity: 0.75;
  background-color: grey;
}
</style>
<template>
  <v-card class="mx-auto" max-width="100%">
    <v-alert
      v-model="showAlert"
      :color="inMyWatchlist ? 'success' : 'warning'"
      class="mb-n1"
      dismissible
    >
      <div class="d-flex justify-center">{{ alertMessage }}</div>
    </v-alert>
    <v-navigation-drawer v-if="hasEpisodes" absolute permanent dark>
      <v-list dense rounded>
        <v-list-item v-for="e in show.episodes" :key="e.ref.value.id">
          <router-link :to="route(e.ref.value.id)">
            <v-list-item-content>
              <v-list-item-title class="text-h6 my-2 secondary--text">{{
                e.title
              }}</v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-hover>
      <v-img v-if="!playVid" slot-scope="{ hover }" :src="show.image">
        <v-expand-transition>
          <div
            v-if="hover"
            class="
              d-flex
              flex-column
              transition-fast-in-fast-out
              v-card--reveal
              display-3
              align-center
              justify-center
              overlay
            "
          >
            <div v-if="!waiting">
              <v-card-title
                v-text="show.title"
                class="white--text text-h1"
              ></v-card-title>
              <div class="d-flex mt-n4 pt-0">
                <v-card-subtitle class="white--text text-h6 pb-0 mb-0">
                  <v-icon color="white">mdi-heart</v-icon>Likes:
                  {{ numberWithCommas(show.likes) }}
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="!hasEpisodes"
                  class="white--text text-h6 pb-0 mb-0"
                >
                  <v-icon color="white">mdi-eye</v-icon>Watched:
                  {{ numberWithCommas(show.viewed) }}
                </v-card-subtitle>
              </div>
              <v-card-subtitle
                v-if="!hasEpisodes"
                class="white--text text-h6 mt-0 pt-0"
              >
                You watched this: {{ lastWatched }}
              </v-card-subtitle>
            </div>
            <div class="justify-center">
              <v-progress-circular
                v-if="waiting"
                indeterminate
                color="white"
                size="180"
                width="20"
              ></v-progress-circular>
            </div>
            <v-card-actions>
              <v-btn x-large class="mx-1" @click="play" v-if="!hasEpisodes">
                <v-icon class="mr-1">mdi-play</v-icon>Play
              </v-btn>
              <v-btn x-large class="mx-1" @click="like">
                <div v-if="liked">
                  <v-icon class="mr-1">mdi-heart-broken</v-icon>Unlike
                </div>
                <div v-else><v-icon class="mr-1">mdi-heart</v-icon>Like</div>
              </v-btn>
              <v-btn x-large class="mx-1" @click="addToWatchlist">
                <div v-if="inMyWatchlist">
                  <v-icon class="mr-1">mdi-minus</v-icon>Remove from Watchlist
                </div>
                <div v-else>
                  <v-icon class="mr-1">mdi-plus</v-icon>Add to Watchlist
                </div>
              </v-btn>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-img>
      <VideoPlayer v-else :video="show.link" :height="900"></VideoPlayer>
    </v-hover>
  </v-card>
</template>

<script>
import faunadb from "faunadb";
import VideoPlayer from "@/components/VideoPlayer";

export default {
  name: "show",
  data: function () {
    return {
      show: {},
      waiting: false,
      playVid: false,
      client: null,
      lastWatched: "",
      showAlert: false,
      inMyWatchlist: false,
      liked: false,
    };
  },
  computed: {
    clickToWatch() {
      return this.waiting ? "" : "Click To Watch";
    },
    hasEpisodes() {
      return this.show && this.show.episodes && this.show.episodes.length > 0;
    },
    alertMessage() {
      return this.inMyWatchlist
        ? "Added to your watchlist"
        : "Removed from watchlist";
    },
  },
  components: {
    VideoPlayer,
  },
  mounted() {
    this.loadEpisodes();
  },
  watch: {
    $route: "loadEpisodes",
  },
  methods: {
    async loadEpisodes() {
      this.playVid = false;
      this.waiting = false;
      const id = this.$route.params.id;
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: this.$store.state.faunaSecret,
        domain: process.env.VUE_APP_FAUNA_DOMAIN || 'db.fauna.com' 
      });
      if (!this.client) {
        this.client = client;
      }
      const q = faunadb.query;
      const res = await this.client.query(
        q.Call(q.Function("GetEpisodesByShowId"), id)
      );
      this.show = res;

      this.lastWatched = await this.history();
      this.inMyWatchlist = await this.callInMyWatchlist();
      this.liked = await this.hasLiked();
    },
    route(route) {
      return "/episode/" + route;
    },
    play() {
      this.waiting = true;

      const now = Math.floor(Date.now() / 1000);
      console.log(now);
      const id = this.$route.params.id;
      const q = faunadb.query;
      this.client
        .query(q.Call(q.Function("AddToHistory"), id, now))
        .then((res) => {
          this.waiting = false;
          this.playVid = true;
        })
        .catch(() => {
          this.waiting = false;
        });
    },
    async history() {
      if (this.hasEpisodes) return "";

      const id = this.$route.params.id;
      const q = faunadb.query;
      const res = await this.client.query(
        q.Call(q.Function("GetShowHistory"), id, 1)
      );
      if (res.data.length > 0) {
        var d = new Date(0);
        d.setUTCSeconds(res.data[0].startTime);
        return d;
      }
      return "";
    },
    addToWatchlist() {
      const id = this.$route.params.id;
      const q = faunadb.query;
      this.client
        .query(q.Call(q.Function("AddToWatchlist"), id))
        .then((res) => {
          try {
            if (res.ref.value.id) {
              this.showAlert = true;
              this.inMyWatchlist = !this.inMyWatchlist;
            }
          } catch {
            // do nothing
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async callInMyWatchlist() {
      const id = this.$route.params.id;
      const q = faunadb.query;
      try {
        const res = await this.client.query(
          q.Call(q.Function("InMyWatchlist"), id)
        );
        return res;
      } catch {
        return false;
      }
    },
    like() {
      const id = this.$route.params.id;
      const q = faunadb.query;
      this.client
        .query(q.Call(q.Function("Like"), id))
        .then((res) => {
          this.liked = !this.liked;
          this.loadEpisodes();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async hasLiked() {
      const id = this.$route.params.id;
      const q = faunadb.query;
      try {
        const res = await this.client.query(q.Call(q.Function("Liked"), id));
        return res;
      } catch {
        return false;
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>