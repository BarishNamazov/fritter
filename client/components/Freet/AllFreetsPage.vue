<template>
  <main>
    <h1>All Freets</h1>
    <h2>Let everyone know what's going on!</h2>
    <CreateFreetForm @refresh="refreshFreets" />
    <FreetsListComponent :freets="freets" :loaded="loaded" />
  </main>
</template>

<script>
import FreetsListComponent from "@/components/Freet/FreetsListComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";

export default {
  name: "AllFreetsPage",
  components: { FreetsListComponent , CreateFreetForm},
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
      await fetch(`/api/freets`)
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