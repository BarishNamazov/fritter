<template>
  <main>
    <FreetComponent v-if="freet" :freet="freet" :loaded="loaded" @refresh="init"/>
    <section v-if="freet" class="comments">
      <AllComments @refresh="init" :freetId="freet.id" />
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
      loaded: false
    };
  },
  watch: {
    $route: function() {
      this.loaded = false;
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
          this.loaded = true;
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