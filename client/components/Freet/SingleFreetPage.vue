<template>
  <main>
    <section class="center-view">
      <FreetComponent v-if="freet" :freet="freet"/>
      <div v-if="freet" class="comments">
        <AllComments :freetId="freet.id" />
      </div>
    </section>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";
import AllComments from "@/components/Comment/AllComments.vue";

export default {
  name: "SingleFreetPage",
  components: {
    FreetComponent, RightSidebar, AllComments
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
      this.$store.commit("initVotes");
  }
};

</script>

<style scoped>
main {
  display: flex;
}
.center-view {
  flex: 2;
}
.right-sidebar {
  flex: 1;
}

.center-view {
  padding: 1em;
}
</style>