<template>
  <main>
    <FreetComponent v-if="freet" :freet="freet" />
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "SingleFreetPage",
  components: {
    FreetComponent,
  },
  data() {
    return {
      freet: null,
    };
  },
  mounted() {
    // Get the freet ID from the URL
    const freetId = this.$route.params.id;
    fetch(`/api/freets/${freetId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log('Error:', data.error);
          return;
        }
        this.freet = data[0];
      });
  }
};

</script>