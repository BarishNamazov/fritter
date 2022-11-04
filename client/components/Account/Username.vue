<template>
  <router-link class="container" :to="`/user/${username}`">
    <img :src="`https://robohash.org/${username}?set=set4`" />
    <span>{{ username }}</span>
  </router-link>
</template>

<script>
export default {
  name: "Username",
  props: {
    username: {
      type: String,
      required: true,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 0.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

img {
  border: 1px solid black;
  border-radius: 50%;
  height: 2em;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  background-color: var(--hover-color);
  border-radius: 5px;
}
</style>