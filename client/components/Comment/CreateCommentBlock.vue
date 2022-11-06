<template>
  <form @submit.prevent="submitCallback(thisContent)">
    <h3 v-if="legend">{{ legend }}</h3>
    <textarea v-model="thisContent" class="content" />
    <button class="submit" type="submit">{{ submitName }}</button>
    <button v-if="cancelCallback" @click="cancelCallback">Cancel</button>
  </form>
</template>

<script>
export default {
  name: "CreateCommentBlock",
  props: {
    legend: {
      type: String,
      default: "Make a comment"
    },
    content: {
      type: String,
      default: ""
    },
    submitCallback: {
      type: Function,
      required: true
    },
    submitName: {
      type: String,
      default: "Comment"
    },
    cancelCallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      thisContent: this.content,
    };
  },
  watch: {
    content: function(newContent) {
      this.thisContent = newContent;
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

.button {
  height: 30px;
  border: 1px solid black;
  border-radius: var(--border-radius-large);
  font: inherit;
  outline: none;
  padding: 5px;
  cursor: pointer;
}
</style>