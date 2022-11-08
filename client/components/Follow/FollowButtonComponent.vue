<template>
  <button v-if="username !== $store.state.username" @click="handleClick">{{ isFollowing ? 'Unfollow' : 'Follow' }}</button>
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
    },
    isFollowing: function() {
      this.$emit('followUpdate');
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.username !== this.$store.state.username) {
        fetch(`/api/follows/isFollowing/${this.username}`)
          .then(res => res.json())
          .then(follows => {
            this.isFollowing = follows.following;
          }).catch(err => {
            this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
          });
      }
    },
    handleClick() {
      if (this.isFollowing) {
        fetch(`/api/follows/${this.username}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              this.$toast.error(res.error);
              return;
            }
            this.isFollowing = false;
            this.$toast.success(res.message);
          }).catch(err => {
            this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
          });
      } else {
        fetch(`/api/follows/${this.username}`, {
          method: 'PUT'
        })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              this.$toast.error(res.error);
              return;
            }
            this.isFollowing = true;
            this.$toast.success(res.message);
          }).catch(e => {
            this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
          });
      }
    }
  }
};
</script>

<style scoped>
button {
  font: inherit;
  appearance: none;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-small);
  gap: 0.5em;
  padding: 0.5em;
  cursor: pointer;
}
</style>