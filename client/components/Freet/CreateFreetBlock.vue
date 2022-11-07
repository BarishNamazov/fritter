<template>
  <form @submit.prevent="submitCallback(thisContent, thisVisibility)">
    <h3>{{ legend }}</h3>
    <textarea ref="textarea" v-model="thisContent" class="content" @input="resize" @focus="resize" @keyup="resize" />
    <div class="visibility">
      <span>Visibility: </span>
      <span><label><input v-model="thisVisibility" type="radio" :value="'public'" />Public</label></span>
      <span><label><input v-model="thisVisibility" type="radio" :value="'friends'" />Friends</label></span>
      <span><label><input v-model="thisVisibility" type="radio" :value="'only me'" />Only me</label></span>
    </div>
    <input class="submit" type="submit" value="Freet">
  </form>
</template>

<script>
export default {
  name: "CreateFreetBlock",
  props: {
    legend: {
      type: String,
      default: "Create a freet"
    },
    content: {
      type: String,
      default: ""
    },
    visibility: {
      type: String,
      default: "public"
    },
    submitCallback: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      thisContent: this.content,
      thisVisibility: this.visibility
    };
  },
  watch: {
    content: function(newContent) {
      this.thisContent = newContent;
      this.$nextTick(() => this.resize());
    },
    visibility: function(newVisibility) {
      this.thisVisibility = newVisibility;
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
  border: 1px solid black;
  border-radius: var(--border-radius-large);
  padding: 1em;
  margin: 1em 0;
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
  padding: 5px;
  cursor: pointer;
}
</style>