<style scoped>
.login-bg {
  background-image: url("https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/viacom-NICK_SPONGEBOB_SEASON_006-Full-Image_GalleryBackground-en-US-1611213234278._RI_.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 1200px;
}
.login-container {
  height: 800px;
}
.login-form {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 11px;
}
</style>

<template>
  <div class="d-flex justify-center align-center login-bg">
    <div class="login-container">
      <v-card class="pa-4 login-form" width="450px" height="220px">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            class="px-2 pb-0"
            dark
            v-model="username"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            class="px-2"
            dark
            v-model="password"
            label="Password"
            type="Password"
            required
          ></v-text-field>
          <v-btn class="mt-2 ml-2" color="primary" @click="login">
            Login
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import faunadb from "faunadb";

export default {
  name: "Login",
  data: () => {
    return {
      valid: true,
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      const headers = { "X-Fauna-Source": "faunaflix" };
      const client = new faunadb.Client({
        headers: headers,
        secret: process.env.VUE_APP_FAUNA_KEY_ANONYMOUS,
        domain: process.env.VUE_APP_FAUNA_DOMAIN || 'db.fauna.com' 
      });
      const q = faunadb.query;
      client
        .query(q.Call(q.Function("Login"), this.username, this.password))
        .then((res) => {
          this.$store.commit("setSecret", res.secret);
          this.$router.push("/");
        })
        .catch(() => {
          this.$router.push("/login");
        });
    },
  },
};
</script>
