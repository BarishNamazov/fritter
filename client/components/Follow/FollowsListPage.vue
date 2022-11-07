<template>
  <main>
    <h1>Follows</h1>
    <h2>People you follow</h2>
    <ul v-if="this.follows.length">
      <li v-for="{followee, since} in this.follows" :key="followee">
        <UsernameComponent :username="followee" />
        <span>since {{since}}</span>
        <FollowButtonComponent @followUpdate="refresh" :username="followee" />
      </li>
    </ul>
    <p v-else>You are not following anyone. Explore more!</p>
  </main>
</template>

<script>
import UsernameComponent from "../common/UsernameComponent.vue";
import FollowButtonComponent from "@/components/Follow/FollowButtonComponent.vue";
import moment from "moment";

export default {
  name: "FollowsListPage",
  components: {
    UsernameComponent,
    FollowButtonComponent
  },
  data() {
    return {
      follows: []
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
      fetch(`/api/follows/`)
        .then(res => res.json())
        .then(follows => {
          this.follows = follows.map(follow => {
            return {
              followee: follow.followeeUsername,
              since: moment(follow.dateFollowing).format('MMMM Do YYYY, h:mm:ss a')
            };
          });
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