<template>
  <main>
    <div class="freets-view">
      <section v-if="$store.state.username">
        <CreateFreetForm />
      </section>
      <section v-else>
        <header>
          <h2>Welcome to Fritter!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login"> Sign in </router-link>
            to create, edit, and delete freets.
          </h3>
        </article>
      </section>
      <section>
        <header>
          <div class="left">
            <h2>
              Viewing all freets
              <span v-if="$store.state.filter">
                by @{{ $store.state.filter }}
              </span>
            </h2>
          </div>
        </header>
        <section v-if="$store.state.freets.length">
          <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article v-else>
          <h3>No freets found.</h3>
        </article>
      </section>
    </div>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";

export default {
  name: "FreetPage",
  components: { FreetComponent, CreateFreetForm, RightSidebar },
  watch: {
    "$route": function() {
      console.log(this.$route.params.username);
      this.$store.commit("updateFilter", this.$route.params.username);
    },
    "$store.state.filter": function() {
      this.$store.commit("refreshFreets");
    }
  },
  mounted() {
    this.$store.commit("refreshFreets");
    this.$store.commit("initVotes");
  },
  updated() {
    console.log("got updatedd");
    this.$store.commit("updateFilter", this.$route.params.username);
  }
};
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

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
