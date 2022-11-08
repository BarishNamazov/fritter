<template>
  <main>
    <ProfileComponent :username="$route.params.username" />
    <CreateFreetForm v-if="$route.params.username === $store.state.username" @refresh="refreshFreets" />
    <h3>Freets by {{ $route.params.username }}</h3>
    <FreetsListComponent :freets="freets" />
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
      freets: []
    };
  },
  watch: {
    "$route.params.username": async function() {
      this.refreshFreets();
    }
  },
  mounted() {
    this.refreshFreets();
  },
  methods: {
    async refreshFreets() {
      await fetch(`/api/freets?author=${this.$route.params.username}`)
        .then(res => res.json())
        .then(freets => {
          this.freets = freets;
        });
    }
  }
}

</script>