<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
<template>
  <div class="video-container">
    <iframe
      width="100%"
      :height="height"
      :src="src"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  data() {
    return {};
  },
  props: {
    video: String,
    height: Number
  },
  computed: {
    src() {
      return this.video ? this.video + ((this.video.indexOf('?') > 1 ? '&' : '?') + 'autoplay=1&mute=1') : null;
    },
    activeVideo() {
      let activeVideo = null;
      if (this.videoId) {
        let index = this.videos.findIndex((vid) => {
          return vid.id == this.videoId;
        });
        if (index > -1) activeVideo = this.videos[index];
      }
      return activeVideo;
    },
  },
};
</script>