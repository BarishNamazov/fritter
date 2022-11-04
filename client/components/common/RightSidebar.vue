<template>
  <section v-if="$store.state.username">
    <Username class="username" :username="$store.state.username" />
    <router-link class="account" to="/account">
      <span>
        <img src="https://www.svgrepo.com/show/281677/settings-gear.svg" />
        <span>Account</span>
      </span>
    </router-link>
  </section>
  <section v-else>
    <router-link class="account" to="/login">
      <span>
        <img src="https://www.svgrepo.com/show/219383/login.svg" />
        <span>Login</span>
      </span>
    </router-link>
  </section>
</template>

<script>


import Username from "@/components/Account/Username.vue";
export default {
  name: "RightSidebar",
  components: {
    Username,
  }
}

</script>

<style scoped>
section {
  padding-top: 1em;
  position: sticky;
  top: 0;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}
.username, .account {
  width: 70%;
  font-size: 1.5em;
  font-weight: bold;
  border: 1px solid var(--username-border-color);
  border-radius: 5px;
}

.account {
  padding: 0.2em;
  text-decoration: none;
  color: inherit;
}

.account:hover {
  background-color: var(--hover-color);
}

.account > span {
  display: flex;
  gap: 0.4em;
  justify-content: center;
  align-items: center;
}

img {
  width: 2em;
}
</style>