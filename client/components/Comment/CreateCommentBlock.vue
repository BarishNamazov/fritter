<template>
  <form @submit.prevent="submitCallback(thisContent)">
    <h3 v-if="legend">{{ legend }}</h3>
    <textarea ref="textarea" v-model="thisContent" class="content" @input="resize" @focus="resize" @keyup="resize" />
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
  padding: 5px;
  margin-bottom: 1em;
  min-height: 5em;
  resize: none;
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