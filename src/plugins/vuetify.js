import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#5054a4', // #E53935
        secondary: '#848cc4', // #FFCDD2
        accent: '#6cc0cc', // #3F51B5
      },
    },
  },  
});
