<template>
  <section>
    <button v-if="!editing" @click="startEditing">✏️ Edit</button>
    <button v-if="editing" @click="saveEdits">Save</button>
    <button v-if="editing" @click="addEntry">Add</button>
    <draggable
      v-if="form.length"
      group="people"
      v-bind="dragOptions"
      handle=".handle"
      @start="drag = true"
      @end="drag = false"
    >
      <div v-if="!editing">
        <article
          v-for="{ name, url } in form"
          :key="name"
          class="quick-access-entry"
        >
          <a :href="url">{{ name }}</a>
        </article>
      </div>
      <div v-else>
        <article
          v-for="(entry, index) in form"
          :key="entry.name + '-' + index"
          class="quick-access-entry-input"
        >
          <span class="handle">X</span>
          <input :value="entry.name" class="name" />
          <input :value="entry.url" class="url" />

          <button v-if="editing" @click="deleteEntry">Delete</button>
        </article>
      </div>
    </draggable>
    <article v-else>
      <p>No quick access found.</p>
    </article>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "QuickAccess",
  components: {
    draggable,
  },
  data() {
    return {
      editing: false,
      form: Array.from(this.$store.state.quickAccess),
    };
  },
  computed: {
    dragOptions() {
      return {
        disabled: !this.editing,
      };
    },
  },
  watch: {
    "$store.state.quickAccess": function (newVal) {
      this.form = newVal;
    },
  },
  methods: {
    startEditing() {
      this.editing = true;
    },
    saveEdits() {
      const newForm = [];
      const inputContainers = document.getElementsByClassName(
        "quick-access-entry-input"
      );
      for (const inputContainer of inputContainers) {
        const name = inputContainer.querySelector(".name").value;
        const url = inputContainer.querySelector(".url").value;
        newForm.push({ name, url });
      }
      fetch("/api/quickaccess", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries: newForm }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            this.$store.commit("alert", {
              status: "error",
              message: data.error,
            });
          } else {
            this.$store.commit("setQuickAccess", newForm);
            this.editing = false;
            this.form = newForm;
          }
        })
        .catch((err) => console.error(err));
    },
    addEntry() {
      this.form.push({ name: "", url: "" });
    },
    deleteEntry(event) {
      const name = event.target.parentNode.querySelector(".name").value;
      const url = event.target.parentNode.querySelector(".url").value;
      const index = this.form.findIndex(
        (entry) => entry.name === name && entry.url === url
      );
      this.form.splice(index, 1);
    },
  }
};
</script>

<style scoped>
section {
  margin: 1em 0;
}

button {
  width: max-content;
  margin-bottom: 0.5em;
}

.quick-access-entry {
  border: 1px solid #ccc;
  padding: 0.3em;
  border-radius: 3px;
}

.quick-access-entry:not(:last-child) {
  margin-bottom: 0.5em;
}

.quick-access-entry > a {
  color: #000;
  text-decoration: underline;
}

.handle {
  cursor: move;
  margin-right: 0.5em;
}
</style>