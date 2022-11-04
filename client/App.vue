<template>
  <div id="app">
    <div class="view-container">
      <section class="left-view">
        <QuickAccess />
      </section>
      <router-view class="rest-view" />
    </div>
  </div>
</template>

<script>
import QuickAccess from "@/components/QuickAccess/QuickAccess.vue";

export default {
  name: "App",
  components: { QuickAccess },
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
};
</script>

<style>
* {
  box-sizing: border-box;
  --upvote-color: #00b300;
  --downvote-color: #ff0000;
  --hover-color: #dee2e6;
  --username-border-color: #1864ab;
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
.rest-view {
  flex: 3;
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
</style>
