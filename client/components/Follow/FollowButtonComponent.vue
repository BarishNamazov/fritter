<template>
  <button v-if="username !== $store.state.username">{{ isFollowing ? 'Unfollow' : 'Follow' }}</button>
  <p v-else>You can't follow yourself</p>
</template>

<script>
export default {
  name: "FollowButtonComponent",
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isFollowing: false,
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
      if (this.username !== this.$store.state.username) {
        fetch(`/api/follows/${this.username}`)
          .then(res => res.json())
          .then(follows => {
            this.isFollowing = follows.following;
          });
      }
    }
  }
};
</script>