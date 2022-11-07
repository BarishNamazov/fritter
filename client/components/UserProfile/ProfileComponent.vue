<template>
  <section>
    <article class="profile-box">
      <UsernameComponent class="username-component" :username="username" />
      <FollowerCountComponent :username="username" />
      <div
        v-if="this.username !== $store.state.username"
        class="profile-actions"
      >
        <FollowButtonComponent :username="username" />
        <FriendStatusComponent :username="username" />
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

.username-component {
  font-size: 1.5em;
  width: 100%;
}

.profile-box {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5em;
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
  justify-content: space-around;
}
</style>