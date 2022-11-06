<template>
  <section v-if="freets.length">
    <FreetComponent
      v-for="freet in freets"
      :key="freet.id"
      :freet="freet"
    />
  </section>
  <article v-else>
    <h3>No freets found.</h3>
  </article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "FreetsListComponent",
  components: { FreetComponent },
  props: {
    freets: {
      type: Array,
      required: true
    }
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>