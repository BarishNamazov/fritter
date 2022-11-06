<template>
  <main>
    <section class="freets-view">
      <h3>All Freets</h3>
      <FreetsListComponent :freets="freets" />
    </section>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import FreetsListComponent from "@/components/Freet/FreetsListComponent.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";

export default {
  name: "AllFreetsPage",
  components: { FreetsListComponent, RightSidebar },
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

<style scoped>
main {
  display: flex;
}
.freets-view {
  flex: 2;
}
.right-sidebar {
  flex: 1;
}
</style>