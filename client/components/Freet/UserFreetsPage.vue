<template>
  <FreetsPage />
</template>

<script>
import FreetsPage from "@/components/Freet/FreetsPage.vue";

export default {
  name: "UserFreetsPage",
  components: { FreetsPage },
  watch: {
    "$route.params.username": function() {
      console.log("hey man", this.$route.params.username);
      this.$store.commit("updateFilter", this.$route.params.username);
    }
  }
}

</script>
