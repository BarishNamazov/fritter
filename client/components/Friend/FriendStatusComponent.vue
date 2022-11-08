<template>
  <section v-if="username !== $store.state.username">
    <article v-if="status === 'friends'">
      <p>Friends</p>
      <button @click="unfriend">Unfriend</button>
    </article>
    <article v-else-if="status === 'request sent'">
      <p>Friend request sent</p>
      <button @click="cancelRequest">Cancel request</button>
    </article>
    <article v-else-if="status === 'request received'">
      <p>Friend request received</p>
      <button @click="respondRequest('accept')">Accept request</button>
      <button @click="respondRequest('reject')">Reject request</button>
    </article>
    <article v-else>
      <p>Not friends</p>
      <button @click="sendRequest">Send friend request</button>
    </article>
  </section>
  <p v-else>You can't friend yourself</p>
</template>

<script>

export default {
  name: "FriendStatusComponent",
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      status: null,
    };
  },
  watch: {
    username: function() {
      this.refresh();
    },
    status: function() {
      this.$emit('statusUpdate');
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.username !== this.$store.state.username) {
        fetch(`/api/friends/status/${this.username}`)
          .then(res => res.json())
          .then(status => {
            this.status = status.status;
          }).catch(err => {
            this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
          });
      }
    },
    sendRequest() {
      fetch(`/api/friends/requests/${this.username}`, {
        method: 'PUT'
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$toast.error(res.error);
            return;
          }
          this.$toast.success(res.message);
          this.status = 'request sent';
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    },
    respondRequest(response) {
      fetch(`/api/friends/requests/respond/${this.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          response: response
        })
      })
        .then(res => res.json())
        .then(res => {
          this.status = response === 'accept' ? 'friends' : 'not friends';
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    },
    unfriend() {
      fetch(`/api/friends/list/${this.username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$toast.error(res.error);
            return;
          }
          this.$toast.success(res.message);
          this.status = 'not friends';
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    },
    cancelRequest() {
      fetch(`/api/friends/requests/${this.username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$toast.error(res.error);
            return;
          }
          this.$toast.success(res.message);
          this.status = 'not friends';
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    }
  }
}

</script>

<style scoped>
article {
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
}
p {
  font-size: 1.5em;
  margin: 0;
}

</style>