<template>
  <main>
    <h3>All Freets</h3>
    <FreetsListComponent :freets="freets" />
  </main>
</template>

<script>
import FreetsListComponent from "@/components/Freet/FreetsListComponent.vue";

export default {
  name: "AllFreetsPage",
  components: { FreetsListComponent },
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
      await fetch(`/api/freets`)
        .then(res => res.json())
        .then(freets => {
          this.freets = freets;
        });
    }
  }
}

</script>