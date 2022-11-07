<template>
  <div id="app">
    <div class="view-container">
      <section class="left-view">
        <QuickAccess />
      </section>
      <router-view class="center-view" />
      <RightSidebar class="right-view" />
    </div>
  </div>
</template>

<script>
import QuickAccess from "@/components/QuickAccess/QuickAccess.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";

export default {
  name: "App",
  components: { QuickAccess, RightSidebar },
  watch: {
    "$store.state.username": function(newValue, oldValue) {
      if (oldValue === null) {
        this.initStore();
      }
    }
  },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
    .then((res) => res.json())
    .then((res) => {
      const user = res.user;
      this.$store.commit("setUsername", user ? user.username : null);
    });
    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },
  created() {
    if (this.$store.state.username) {
      this.initStore();
    }
  },
  methods: {
    initStore() {
      this.$store.commit("initVotes");
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  --border-radius-small: 0.5em;
  --border-radius-medium: 1em;
  --border-radius-large: 1.5em;

  --upvote-color: #00b300;
  --downvote-color: #ff0000;
  --hover-color: #dee2e6;
  --username-border-color: #1864ab;
  --comment-background-color: #96f2d7;

  --sidebar-border: 2px;
}

@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
body {
  background-color: #e7f5ff;
  width: 80vw;
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0 auto;
  font-family: Lato, sans-serif;
}

.view-container {
  display: flex;
}

.left-view {
  flex: 1;
  position: sticky;
  top: 0;
  height: max-content;
}
.center-view {
  flex: 2;
}
.right-view {
  flex: 1;
  position: sticky;
  top: 0;
  height: max-content;
}

img, svg {
  user-select: none;
}

main {
  padding: 0 5em 5em;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}

button {
  font: inherit;
  appearance: none;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  cursor: pointer;
  height: 2em;
}
</style>
