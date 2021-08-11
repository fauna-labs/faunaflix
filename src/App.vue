<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
<style scoped>
.faunaflix {
  color: white;
  text-decoration: none;
}
.app {
  background-color: black;
}
</style>
<template>
  <v-app>
    <div class="app">
      <v-app-bar
        app
        color="primary"
        dark
      >
        <div class="d-flex align-center">
          <router-link class="faunaflix" to="/"><h1>Faunaflix-kids</h1></router-link>
        </div>

        <v-spacer></v-spacer>

        <div v-if="!authenticated">
          <v-btn v-if="$auth.auth0Client" text @click="auth0Login">
            Login
            <v-icon class="ml-1">mdi-account-arrow-left</v-icon>
          </v-btn>  
          <v-btn v-else text>
            <router-link class="white--text" to="/login">Login</router-link>
            <v-icon class="ml-1">mdi-account-arrow-left</v-icon>
          </v-btn>
        </div>
        <v-btn text v-else @click="logout">
          Logout
          <v-icon class="ml-1">mdi-account-arrow-right</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import faunadb, { Update } from 'faunadb';

export default {
  name: 'App',
  data: function() {
    return {
    }
  },
  computed: {
    authenticated() {
      return this.$auth.auth0Client
        ? this.$auth.isAuthenticated
        : this.$store.state.faunaSecret && this.$store.state.faunaSecret.length > 0;
    }
  },
  methods: {
    auth0Login() {
      this.$auth.loginWithRedirect();
    },
    async logout() {
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: this.$store.state.faunaSecret,
        domain: process.env.VUE_APP_FAUNA_DOMAIN || 'db.fauna.com' 
      });
      const q = faunadb.query;
      const res = await client.query(q.Logout(true));
      this.$store.commit("logout");

      if (this.$auth.auth0Client) {
        this.$auth.logout({
          returnTo: window.location.origin,
        });
      }
    }
  }
};
</script>