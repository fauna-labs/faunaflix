<template>
  <div>
    <v-hover>
      <v-img
        slot-scope="{ hover }"
        :src="show.image"
        >
        <v-card-title 
          v-text="show.title" 
          class="primary--text text-h1"
        ></v-card-title>
        <v-expand-transition>
          <div v-if="hover" 
            class="d-flex flex-row justify-center transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--text">
            <div>
              {{ clickToWatch }}
              <v-progress-circular
                v-if="waiting"
                indeterminate
                color="white"
                size="80"
              ></v-progress-circular>
            </div>
          </div>
        </v-expand-transition>
      </v-img>
    </v-hover>    
  </div>  
</template>
<script>
export default {
  name: 'episode',
  data: function() {
    return {
      waiting: false
    }
  },
  computed: {
    clickToWatch() {
      return this.waiting ? "" : "Click To Watch";
    },
  },
  props: {
    show: Object
  },
  methods: {

  }
}
</script>