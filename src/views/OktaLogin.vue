<style scoped>
@import '../assets/styles/okta-theme-override.css';

.login-bg {
  background-image: url('https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/viacom-NICK_SPONGEBOB_SEASON_006-Full-Image_GalleryBackground-en-US-1611213234278._RI_.jpg');
  background-repeat: no-repeat;
  background-size: 100%;
  height: 1200px;
}
</style>

<template>
  <div class='d-flex justify-center login-bg'>
    <div id='okta-signin-container' class='d-flex align-start'></div>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

export default {
  name: 'OktaLogin',
  data: () => {
    return {
    }
  },
  mounted: function () {
    console.log('host:', window.location.host);

    this.$nextTick(async function () {
      const scopes = ['openid', 'profile', 'email'];
      const config = {
        baseUrl: process.env.VUE_APP_ISSUER.split('/oauth2')[0],
        clientId: process.env.VUE_APP_CLIENT_ID,
        redirectUri: window.location.protocol + '//' + window.location.host + process.env.VUE_APP_REDIRECT_URI,
        authParams: {
          responseType: ['code'],
          pkce: true,
          issuer: process.env.VUE_APP_ISSUER,
          scopes: scopes,
          display: 'page',
        },
        i18n: {
          en: {
            'primaryauth.title': 'Start Learning',
            'primaryauth.username.placeholder': 'email',
            'primaryauth.username.tooltip': 'email',
            'primaryauth.submit': 'Signin',
            'socialauth.divider.text': 'Or Signin With',
            'socialauth.facebook.label': 'Facebook',
          },
        }
      };

      this.widget = new OktaSignIn(config);
      this.widget
        .showSignInToGetTokens({
          el: '#okta-signin-container',
          scopes,
        })
        .then((tokens) => {
          this.$store.commit('setSecret', tokens.accessToken.accessToken);
          this.$auth.handleLoginRedirect(tokens);
        })
        .catch((err) => {
          throw err;
        });
    });
  },
  destroyed() {
    // Remove the widget from the DOM on path change
    this.widget.remove();
  },
};
</script>
