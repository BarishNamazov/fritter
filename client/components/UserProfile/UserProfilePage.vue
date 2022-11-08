<template>
  <main v-if="loaded && !notFound">
    <ProfileComponent :username="$route.params.username" />
    <CreateFreetForm v-if="$route.params.username === $store.state.username" @refresh="refreshFreets" />
    <h3>Freets by {{ $route.params.username }}</h3>
    <FreetsListComponent :freets="freets" />
  </main>
  <main v-else-if="!notFound" class="loader">
    <div class="lds-dual-ring"></div>
  </main>
  <main v-else>
    <h1>User not found</h1>
    <h3>
      <router-link to="/"> Return to the home page </router-link>
    </h3>
  </main>
</template>

<script>
import FreetsListComponent from "@/components/Freet/FreetsListComponent.vue";
import ProfileComponent from "@/components/UserProfile/ProfileComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";

export default {
  name: "UserProfilePage",
  components: { FreetsListComponent, ProfileComponent, CreateFreetForm },
  data() {
    return {
      freets: [],
      loaded: false,
      notFound: false
    };
  },
  watch: {
    "$route.params.username": async function() {
      this.loaded = this.notFound = false;
      this.notFound = !(await this.userExists());
      if (!this.notFound) {
        this.refreshFreets();
      }
    }
  },
  async mounted() {
    this.notFound = !(await this.userExists());
    if (!this.notFound) {
      this.refreshFreets();
    }
  },
  methods: {
    async userExists() {
      const response = await fetch(`/api/users/exists/${this.$route.params.username}`);
      return response.status === 200;
    },
    async refreshFreets() {
      fetch(`/api/freets?author=${this.$route.params.username}`)
        .then(res => res.json())
        .then(freets => {
          this.freets = freets;
          this.loaded = true;
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
    }
  }
}

</script>

<style scoped>
main {
  padding-top: 1em;
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>