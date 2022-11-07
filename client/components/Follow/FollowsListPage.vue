<template>
  <main>
    <ul>
      <li v-for="followee in this.follows" :key="followee">
        <UsernameComponent :username="followee" />
        <FollowButtonComponent @followUpdate="refresh" :username="followee" />
      </li>
    </ul>
  </main>
</template>

<script>
import UsernameComponent from "../common/UsernameComponent.vue";
import FollowButtonComponent from "@/components/Follow/FollowButtonComponent.vue";

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
          this.follows = follows.map(follow => follow.followeeUsername);
        });
    }
  }
}
</script>