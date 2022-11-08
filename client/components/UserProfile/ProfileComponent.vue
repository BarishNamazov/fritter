<template>
  <section>
    <article class="profile-box">
      <UsernameComponent class="username" :username="username" />
      <div v-if="this.username !== $store.state.username" class="profile-actions">
        <span class="follow">
          <FollowerCountComponent ref="followCount" class="follower-count" :username="username" />
          <FollowButtonComponent @followUpdate="$refs.followCount.refresh()" class="follow-button" :username="username" />
        </span>
        <FriendStatusComponent class="friend-status" :username="username" />
      </div>
      <div v-else class="profile-actions">
        <FollowerCountComponent class="follower-count" :username="username" />
        <span class="links">
          <router-link :to="'/follows'"><button>My Follows</button></router-link>
          <router-link :to="'/friends'"><button>My Friends</button></router-link>
        </span>
      </div>
    </article>
  </section>
</template>

<script>
import UsernameComponent from "@/components/common/UsernameComponent.vue";
import FollowerCountComponent from "@/components/Follow/FollowerCountComponent.vue";
import FollowButtonComponent from "@/components/Follow/FollowButtonComponent.vue";
import FriendStatusComponent from "@/components/Friend/FriendStatusComponent.vue";

export default {
  name: "ProfileComponent",
  components: {
    UsernameComponent,
    FollowerCountComponent,
    FollowButtonComponent,
    FriendStatusComponent,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      followers: "...",
      isFollowing: false,
    };
  },
  watch: {
    username: function () {
      console.log("username changed");
      this.initProfileData();
    },
  },
  mounted() {
    this.initProfileData();
  },
  methods: {
    initProfileData() {},
  },
};
</script>

<style scoped>
section {
  padding: 1em 0;
}

.username {
  font-size: 2em;
  width: 100%;
}

.follow, .links {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2em;
  margin-bottom: -1em;
}

.follower-count {
  font-size: 1.5em;
}

.follow-button {
  width: max-content;
}

.profile-box {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-meta-cnt {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  margin-left: auto;
}

.profile-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
}
</style>