<template>
  <section class="end-takebreak">
    <p>Want to end your break?</p>
    <div>
      <button @click="ending = true">Yes, I'm back to Fritter!</button>
      <button @click="ending = $emit('keepbreak') && false">No, I'll keep taking a break.</button> 
    </div>

    <CreateFreetBlock 
      v-if="ending" 
      :content="content" 
      :visibility="visibility" 
      :legend="'End your break by freeting'" 
      :submitCallback="submit"
    />
  </section>
</template>

<script>
import CreateFreetBlock from "@/components/Freet/CreateFreetBlock.vue";

export default {
  name: "EndBreakComponent",
  components: {
    CreateFreetBlock
  },
  props: {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      content: "I'm back!",
      visibility: 'only me',
      ending: false
    };
  },
  methods: {
    async submit(_content, _visibility) {
      this.content = _content;
      this.visibility = _visibility;

      const content = this.content.trim();
      console.log("content", content);
      if (content === '') {
        alert("Freet content cannot be empty.");
        return;
      }
      fetch('/api/takebreaks/end', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          visibility: this.visibility,
          username: this.username,
          password: this.password
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          this.$store.commit("setUsername", this.username);
          this.$store.commit("initVotes");
          this.$store.commit("refreshQuickAccess");
          alert('You have ended your break!');
          this.$router.push({ name: "Home" });
        }
      }).catch(err => {
        alert(err);
      });
    }
  }
};
</script>
