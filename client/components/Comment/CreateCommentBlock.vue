<template>
  <form @submit.prevent="handleSubmit">
    <h3 v-if="legend">{{ legend }}</h3>
    <textarea ref="textarea" v-model="thisContent" class="content" @input="resize" @focus="resize" @keyup="resize" />
    <span class="button-container">
      <button class="submit" type="submit">{{ submitName }}</button>
      <button v-if="cancelCallback" @click="cancelCallback">🚫 Cancel</button>
    </span>
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
      this.$nextTick(() => this.resize());
    }
  },
  mounted() {
    this.resize();
  },
  methods: {
    resize() {
      this.$refs.textarea.style.height = "auto";
      this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 4 + "px";
    },
    handleSubmit() {
      this.submitCallback(this.thisContent);
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
  border: 1px solid black;
  border-radius: var(--border-radius-small);
  font: inherit;
  padding: 0.5em;
  margin-bottom: 1em;
  min-height: 5em;
  resize: none;
}

.button-container {
  display: flex;
  gap: 1em;
}
</style>