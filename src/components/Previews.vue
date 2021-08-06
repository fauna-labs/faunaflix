<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-row flex-wrap">
          <v-card
            v-for="p in previews"
            :key="p.name"
            class="ma-2"
            tile
            dark
            cols="2"
            hover
            @click="preview(p)"
          >
            <VideoPlayer
              v-if="p.preview && p.url && p.url.length > 0"
              :video="p.url"
              :height="400"
            ></VideoPlayer>
            <div v-else>
              <v-card-title v-text="p.name"></v-card-title>
              <v-avatar class="ma-3" size="400" tile>
                <v-img :src="p.image"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" opacity=".7">
      <div>
        <v-progress-circular indeterminate size="80"></v-progress-circular>
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
import faunadb from "faunadb";
import VideoPlayer from "@/components/VideoPlayer";

export default {
  name: "previews",
  data: function () {
    return {
      previews: [],
      previewing: false,
      link: null,
    };
  },
  computed: {
    overlay() {
      return this.$root.$children[0].authenticated;
    },
  },
  components: {
    VideoPlayer,
  },
  async mounted() {
    this.getPreviews();
  },
  methods: {
    getPreviews() {
      const key = process.env.VUE_APP_FAUNA_KEY_ANONYMOUS;
      const q = faunadb.query;
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: key,
      });
      client
        .query(q.Call(q.Function("GetPreviews")))
        .then((res) => {
          this.previews = res.data.map((p) => {
            return Object.assign(p, { preview: false });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    preview(p) {
      if (!p.url || p.url.length <= 0) return;
      p.preview = true;
    },
  },
};
</script>