<template>
  <main>
    <h1>Feed</h1>
    <h2>Freets by people you follow</h2>
    <FreetsListComponent :freets="freets" :loaded="loaded" />
  </main>
</template>

<script>
import FreetsListComponent from "@/components/Freet/FreetsListComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";

export default {
  name: "FeedPage",
  components: { FreetsListComponent, CreateFreetForm },
  data() {
    return {
      freets: [],
      loaded: false
    };
  },
  mounted() {
    this.refreshFreets();
  },
  methods: {
    async refreshFreets() {
      await fetch(`/api/follows/freets`)
        .then(res => res.json())
        .then(freets => {
          this.loaded = true;
          this.freets = freets;
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
</style>