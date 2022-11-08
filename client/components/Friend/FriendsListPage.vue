<template>
  <main>
    <h1>Friends</h1>
    <h2>Your friends can see your freets with "friends" visibility</h2>
    <ul v-if="this.friends.length">
      <li v-for="{friend, since} in this.friends" :key="friend">
        <UsernameComponent :username="friend" />
        <span>since {{since}}</span>
        <button @click="unfriend(friend)">Unfriend</button>
      </li>
    </ul>
    <p v-else>You are not friends with anyone on Fritter, invite others here!</p>
  </main>
</template>

<script>
import UsernameComponent from "../common/UsernameComponent.vue";
import moment from "moment";

export default {
  name: "FriendsListPage",
  components: {
    UsernameComponent,
  },
  data() {
    return {
      friends: []
    };
  },
  watch: {
    "$store.state.username": function() {
      this.refresh();
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      fetch(`/api/friends/list`)
        .then(res => res.json())
        .then(friends => {
          this.friends = friends.map(friend => {
            return {
              friend: friend.friendship[0] === this.$store.state.username ? friend.friendship[1] : friend.friendship[0],
              since: moment(friend.dateFriends).format('MMMM Do YYYY, h:mm:ss a')
            };
          });
        }).catch(err => {
          this.$toast.error(err);
        });
    },
    unfriend(username) {
      fetch(`/api/friends/list/${username}`, {
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
        });
    }
  }
}
</script>

<style scoped>
main {
  padding-top: 1em;
}

li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-large);
  padding: 1em;
}
</style>