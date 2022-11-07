<template>
  <main>
    <h1>Feed</h1>
    <h2>Freets by people you follow</h2>
    <FreetsListComponent :freets="freets" />
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
      freets: []
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
          this.freets = freets;
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