<template>
  <CreateFreetBlock :content="content" :visibility="visibility" :submitCallback="submit" />
</template>

<!-- Form for creating freets (block style) -->

<script>
import CreateFreetBlock from "@/components/Freet/CreateFreetBlock.vue";

export default {
  name: "CreateFreetForm",
  components: {
    CreateFreetBlock
  },
  data() {
    return {
      content: '',
      visibility: 'public'
    };
  },
  methods: {
    async submit(_content, _visibility) {
      this.content = _content;
      this.visibility = _visibility;

      const content = this.content.trim();
      if (content === '') {
        this.$toast.error("Freet content cannot be empty.");
        return;
      }
      fetch('/api/freets', {
        method: 'POST',
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
          this.$toast.success(data.message);
          this.content = '';
          this.$emit('refresh');
        }
      }).catch(err => {
        this.$toast.error("Unexpected error has happened. Please try refreshing the page.");
      });
    }
  }
};
</script>