<template>
  <section v-if="$store.state.username">
    <UsernameComponent class="username" :username="$store.state.username" />
    <router-link class="account" to="/account">
      <span>
        <img src="https://www.svgrepo.com/show/281677/settings-gear.svg" />
        <span>Account</span>
      </span>
    </router-link>
    <router-link class="requests" to="/requests">
      <span>
        <img src="https://img.icons8.com/color/512/invite.png" />
        <span>Requests</span>
      </span>
    </router-link>
    <hr />
    <form class="search" @submit.prevent="handleSearch">
      <input v-model="search" type="text" placeholder="🔍 Search User" required />
      <button><img src="https://www.svgrepo.com/show/125898/search.svg" /><span>Search</span></button>
    </form>
  </section>
  <section v-else>
    <router-link class="account" to="/login">
      <span>
        <img src="https://www.svgrepo.com/show/219383/login.svg" />
        <span>Login</span>
      </span>
    </router-link>
    <hr />
    <form class="search" @submit.prevent="handleSearch">
      <input v-model="search" type="text" placeholder="🔍 Search User" required />
      <button><img src="https://www.svgrepo.com/show/125898/search.svg" /><span>Search</span></button>
    </form>
  </section>
</template>

<script>


import UsernameComponent from "@/components/common/UsernameComponent.vue";
export default {
  name: "RightSidebar",
  components: {
    UsernameComponent,
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    handleSearch() {
      this.$router.push(`/user/${this.search}`);
      this.search = "";
    },
  },
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
  border-left: var(--sidebar-border) solid black;
  height: 100vh;
}
.username, .account, .requests {
  width: 70%;
  font-size: 1.5em;
  font-weight: bold;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-large);
}

.account, .requests {
  padding: 0.2em;
  text-decoration: none;
  color: inherit;
}

.account:hover, .requests:hover {
  background-color: var(--hover-color);
}

.account > span, .requests > span {
  display: flex;
  gap: 0.4em;
  justify-content: center;
  align-items: center;
}

.search {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  justify-content: center;
  align-items: center;
}

.search {
  font-weight: bold;
  font-size: 1.5em;
}
.search input {
  width: 70%;
  height: 2em;
  font: inherit;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-small);
  padding: 0.2em;
}

.search input::placeholder {
  opacity: 50%;
}

.search button {
  font: inherit;
  appearance: none;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  cursor: pointer;
}

.search img {
  width: 1.5em;
}

img {
  width: 2em;
  user-select: none;
}

hr {
  width: 70%;
  border: 1px solid var(--username-border-color);
}

</style>