<template>
  <main>
    <h1>Friend Requests</h1>
    <button @click="type = 'incoming'">Incoming ({{ countIncoming }})</button>
    <button @click="type = 'outgoing'">Outgoing ({{ countOutgoing }})</button>
    <input type="checkbox" v-model="showAll" id="showAll" />
    <label for="showAll">Show completed requests</label>
    <article>
      <h2 v-if="type === 'incoming'">Incoming requests</h2>
      <h2 v-else>Outgoing requests</h2>
      <ul>
        <div v-for="request in requests" :key="request.id">
          <li v-if="request.type === type && request.status === 'pending'">
            <UsernameComponent :username="request.username" />
            <button v-if="type === 'incoming'" @click="respondRequest(request.username, 'accept')">Accept</button>
            <button v-if="type === 'incoming'" @click="respondRequest(request.username, 'reject')">Reject</button>
            <button v-if="type === 'outgoing'" @click="cancelRequest(request.username)">Cancel</button>
          </li>
          <li v-else-if="request.type === type && showAll">
            <UsernameComponent :username="request.username" />
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
          console.log(this.requests);
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
          this.refresh();
        });
    },
    cancelRequest(username) {
      fetch(`/api/friends/requests/${username}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          this.refresh();
        });
    }
  }
};

</script>