<template>
  <p>{{followers}} followers</p>
</template>

<script>
export default {
  name: "FollowerCountComponent",
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      followers: '...'
    };
  },
  watch: {
    username: function() {
      this.refresh();
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      fetch(`/api/follows/count/${this.username}`)
        .then(res => res.json())
        .then(follows => {
          this.followers = follows.followerCount;
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    }
  }
};
</script>