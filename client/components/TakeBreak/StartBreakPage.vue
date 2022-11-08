<template>
  <main>
    <h1>Take a Break</h1>
    <p>Need a break from Fritter? We get it, times can be busy sometimes. If you would like, you can disable your account temporarily, it's as easy as freeting. If you want, you can also share it with friends or everyone to let them know!</p>

    <CreateFreetBlock 
      :content="content" 
      :visibility="visibility" 
      :legend="'Start your break'" 
      :submitCallback="submit"
      :submitName="'Start break'"
    />
  </main>
</template>

<script>
import { getDefaultState } from "@/store";
import CreateFreetBlock from "@/components/Freet/CreateFreetBlock.vue";

export default {
  name: "StartBreakPage",
  components: {
    CreateFreetBlock
  },
  data() {
    return {
      content: 'I am taking a break, will be back soon!',
      visibility: 'only me'
    };
  },
  methods: {
    async submit(_content, _visibility) {
      this.content = _content;
      this.visibility = _visibility;

      const content = this.content.trim();
      if (content === '') {
        alert("Freet content cannot be empty.");
        return;
      }
      fetch('/api/takebreaks/start', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          visibility: this.visibility
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.$toast.error(data.error);
        } else {
          this.$store.replaceState(getDefaultState());
          this.$toast.success(data.message);
          this.$router.push({ name: "Home" });
        }
      }).catch(err => {
        this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
      });
    }
  }
};
</script>

<style scoped>
main {
  padding-top: 1em;
}
p {
  font-size: 1.2em;
}
</style>