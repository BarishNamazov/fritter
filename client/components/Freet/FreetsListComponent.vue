<template>
  <section v-if="loaded && freets.length">
    <FreetComponent
      v-for="freet in freets"
      :key="freet.id"
      :freet="freet"
    />
  </section>
  <article v-else-if="loaded">
    <h3>No freets found.</h3>
  </article>
  <article class="loader" v-else>
    <div class="lds-dual-ring"></div>
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
    },
    loaded: {
      type: Boolean,
      default: true
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
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>