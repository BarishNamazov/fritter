<template>
  <main>
    <FreetComponent v-if="freet" :freet="freet"/>
    <section v-if="freet" class="comments">
      <AllComments :freetId="freet.id" />
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import AllComments from "@/components/Comment/AllComments.vue";

export default {
  name: "SingleFreetPage",
  components: {
    FreetComponent, AllComments
  },
  data() {
    return {
      freet: null,
    };
  },
  watch: {
    $route: function() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const freetId = this.$route.params.id;
      fetch(`/api/freets/${freetId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.$toast.error(data.error);
            return;
          }
          this.freet = data[0];
        }).catch(err => {
          this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
        });
      this.$store.commit("initVotes");
    }
  }
};

</script>

<style scoped>
main {
  padding-top: 1em;
}
</style>