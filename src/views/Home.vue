<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
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
    }
  }
</script>
