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
          });
      }
    },
    sendRequest() {
      fetch(`/api/friends/requests/${this.username}`, {
        method: 'PUT'
      })
        .then(res => res.json())
        .then(res => {
          this.status = 'request sent';
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
        });
    },
    unfriend() {
      fetch(`/api/friends/list/${this.username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          this.status = 'not friends';
        });
    },
    cancelRequest() {
      fetch(`/api/friends/requests/${this.username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          this.status = 'not friends';
        });
    }
  }
}

</script>