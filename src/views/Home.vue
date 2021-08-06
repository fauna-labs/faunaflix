<template>
  <div>
    <Browse v-if="$root.$children[0].authenticated"></Browse>
    <Previews v-else></Previews>
  </div>
</template>

<script>
  import Browse from '@/components/Browse'
  import Previews from '@/components/Previews'

  export default {
    name: 'Home',
    components: {
      Browse,
      Previews
    },
    computed: {
      authenticated() {
        return this.$store.state.faunaSecret && this.$store.state.faunaSecret.length > 0;
      }
    }
  }
</script>
