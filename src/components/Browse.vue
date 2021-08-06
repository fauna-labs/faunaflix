<style scoped>
.waiting {
  height: 900px;
}
</style>
<template>
  <v-container fluid>
    <div v-if="loading"
      class="d-flex white--text justify-center align-center waiting"
    >
      <v-progress-circular
        indeterminate
        size="80"
      ></v-progress-circular>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="12">
          <h2 class="primary--text text--lighten-2">My List</h2>
          <Shows myList></Shows>
        </v-col>
      </v-row>
      <v-row v-for="c in categories" :key="c.data.name">
        <v-col cols="12">
          <h2 class="primary--text text--lighten-2">{{ c.data.name }}</h2>
          <Shows :category="c"> </Shows>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import faunadb from "faunadb";
import Shows from "@/components/Shows";

export default {
  name: "browse",
  data: function () {
    return {
      categories: [],
      loading: true,
    };
  },
  computed: {
    faunaUserToken() {
      return this.$store.state.faunaSecret;
    },
  },
  components: {
    Shows,
  },
  mounted() {
    this.loadCategories();
  },
  watch: {
    faunaUserToken: "loadCategories",
  },
  methods: {
    loadCategories() {
      if (!this.faunaUserToken || this.faunaUserToken.length == 0) return;

      this.loading = true;
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: this.faunaUserToken,
      });
      const q = faunadb.query;
      client
        .query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("Categories"))),
            q.Lambda("ref", q.Get(q.Var("ref")))
          )
        )
        .then((res) => {
          this.categories = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>