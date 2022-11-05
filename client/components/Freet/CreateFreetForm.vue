<template>
  <form @submit.prevent="submit">
    <h3>Create a freet</h3>
    <textarea v-model="content" class="content" />
    <div class="visibility">
      <span>Visibility: </span>
      <span><input v-model="visibility" type="radio" name="public" :value="'public'" /><label for="public">Public</label></span>
      <span><input v-model="visibility" type="radio" name="friends" :value="'friends'" /><label for="friends">Friends</label></span>
      <span><input v-model="visibility" type="radio" name="only me" :value="'only me'" /><label for="only me">Only me</label></span>
    </div>
    <input class="submit" type="submit" value="Freet">
  </form>
</template>

<!-- Form for creating freets (block style) -->

<script>
export default {
  name: "CreateFreetForm",
  data() {
    return {
      content: '',
      visibility: 'public'
    };
  },
  methods: {
    async submit() {
      const content = this.content.trim();
      if (content === '') {
        alert("Freet content cannot be empty.");
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
          alert(data.error);
        } else {
          alert('Freet created successfully.');
          this.$store.commit("refreshFreets");
        }
      });
    }
  }
};
</script>

<style scoped>
form {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: var(--border-radius-large);
  padding: 10px;
  margin: 10px 0;
}

.content {
  width: 100%;
  height: 100px;
  border: 1px solid black;
  border-radius: var(--border-radius-small);
  font: inherit;
  outline: none;
  padding: 5px;
  margin-bottom: 1em;
}

.visibility {
  display: flex;
  gap: 1em;
  margin-bottom: 1em;
}

.submit {
  width: 100%;
  height: 30px;
  border: 1px solid black;
  border-radius: var(--border-radius-large);
  font: inherit;
  outline: none;
  padding: 5px;
  cursor: pointer;
}
</style>