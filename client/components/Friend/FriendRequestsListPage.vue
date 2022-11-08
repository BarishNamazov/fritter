<template>
  <main>
    <h1>Friend Requests</h1>
    <span class="button-container">
      <button @click="type = 'incoming'">Incoming ({{ countIncoming }})</button>
      <button @click="type = 'outgoing'">Outgoing ({{ countOutgoing }})</button>
      <label><input type="checkbox" v-model="showAll" />Show completed requests</label>
    </span>
    <article>
      <h2 v-if="type === 'incoming'">Incoming requests</h2>
      <h2 v-else>Outgoing requests</h2>
      <ul>
        <div v-for="request in requests" :key="request.id">
          <li v-if="request.type === type && request.status === 'pending'">
            <UsernameComponent class="username" :username="request.username" />
            <button v-if="type === 'incoming'" @click="respondRequest(request.username, 'accept')">Accept</button>
            <button v-if="type === 'incoming'" @click="respondRequest(request.username, 'reject')">Reject</button>
            <button v-if="type === 'outgoing'" @click="cancelRequest(request.username)">Cancel</button>
          </li>
          <li v-else-if="request.type === type && showAll">
            <UsernameComponent class="username" :username="request.username" />
            <span v-if="request.status === 'accepted'">Accepted</span>
            <span v-else-if="request.status === 'rejected'">Rejected</span>
          </li>
        </div>
      </ul>
    </article>
  </main>
</template>

<script>
import UsernameComponent from '@/components/common/UsernameComponent.vue';

export default {
  name: "FriendRequestsComponent",
  components: {
    UsernameComponent
  },
  data() {
    return {
      requests: [],
      type: 'incoming',
      showAll: false
    };
  },
  computed: {
    countIncoming() {
      return this.requests.filter(request => request.type === 'incoming' && (request.status === 'pending' || this.showAll)).length;
    },
    countOutgoing() {
      return this.requests.filter(request => request.type === 'outgoing' && (request.status === 'pending' || this.showAll)).length;
    }
  },
  watch: {
    requests: function() {
      this.$emit('requestsUpdate');
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      fetch('/api/friends/requests')
        .then(res => res.json())
        .then(requests => {
          console.log(JSON.stringify(requests));
          this.requests = requests.map(request => {
            return {
              username: this.$store.state.username === request.requesterUsername  ? request.requesteeUsername : request.requesterUsername,
              type: this.$store.state.username === request.requesterUsername  ? 'outgoing' : 'incoming',
              status: request.status
            };
          });
        });
    },
    respondRequest(username, response) {
      fetch(`/api/friends/requests/respond/${username}`, {
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
          if (res.error) {
            this.$toast.error(res.error);
          } else {
            this.$toast.success(res.message);
            this.refresh();
          }
        }).catch(err => {
          this.$toast.error(err);
        });
    },
    cancelRequest(username) {
      fetch(`/api/friends/requests/${username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$toast.error(res.error);
          } else {
            this.$toast.success(res.message);
            this.refresh();
          }
        }).catch(err => {
          this.$toast.error(err);
        });
    }
  }
};

</script>

<style scoped>
main {
  padding-top: 1em;
}

li {
  list-style: none;
  display: flex;
  align-items: center;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-large);
  padding: 1em;
  gap: 1em;
  margin-bottom: 1em;
}

.username {
  margin-right: auto;
}

.button-container {
  display: flex;
  gap: 1em;
  margin-bottom: 1em;
  align-items: center;
}
</style>