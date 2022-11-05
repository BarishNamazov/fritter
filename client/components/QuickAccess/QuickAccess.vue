<template>
  <section>
    <header class="fritter">
      <img src="../../public/logo.svg" />
      <h1 class="title">Fritter</h1>
    </header>
    <div class="qa" v-if="$store.state.username">
      <button v-if="!editing" @click="startEditing">✏️ Edit</button>
      <button v-if="editing" @click="saveEdits">Save</button>
      <button v-if="editing" @click="addEntry">Add</button>
      <draggable
        v-if="form.length"
        v-bind="dragOptions"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
      >
        <!--eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <article v-for="{ name, url } in form" v-if="!editing" :key="name" class="quick-access-entry">
          <a :href="url"><span>{{ name }}</span></a>
        </article>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <article v-for="({name, url}, index) in form" v-if="editing" :key="name + '-' + index" class="quick-access-entry-input">
          <span class="handle">X</span>
          <input :value="name" class="name" />
          <input :value="url" class="url" />
          <button v-if="editing" @click="deleteEntry">Delete</button>
        </article>
      </draggable>
      <article v-else>
        <p>No quick access found.</p>
      </article>
    </div>
    <div class="qa" v-else>
      <article class="quick-access-entry">
        <a :href="'/#/'"><span>Home</span></a>
      </article>
    </div>
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
      drag: false,
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
    drag: function (newVal) {
      if (!newVal) {
        this.updateForm();
      }
    }
  },
  mounted() {
    this.$store.commit('refreshQuickAccess');
  },
  methods: {
    startEditing() {
      this.editing = true;
    },
    updateForm() {
      const newForm = [];
      const inputContainers = document.getElementsByClassName(
        "quick-access-entry-input"
      );
      for (const inputContainer of inputContainers) {
        const name = inputContainer.querySelector(".name").value;
        const url = inputContainer.querySelector(".url").value;
        newForm.push({ name, url });
      }
      this.form = newForm;
    },
    saveEdits() {
      this.updateForm();
      fetch("/api/quickaccess", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries: this.form }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            this.$store.commit("alert", {
              status: "error",
              message: data.error,
            });
          } else {
            this.$store.commit("setQuickAccess", this.form);
            this.editing = false;
          }
        })
        .catch((err) => console.error(err));
    },
    addEntry() {
      this.updateForm();
      this.form.push({ name: "", url: "" });
    },
    deleteEntry(event) {
      this.updateForm();
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
  padding: 1em;
}

.qa {
  margin-top: 1em;
}

button {
  width: max-content;
  margin-bottom: 0.5em;
}

.quick-access-entry {
  font-size: 1.5em;
  border-radius: var(--border-radius-large);
  margin-left: 1.8em;
}

a {
  color: inherit;
  display: inline-block;
  text-decoration: none;
  width: 100%;
}

a span {
  padding: 0.5em;
}

a:hover span {
  background-color: var(--hover-color);
  border-radius: var(--border-radius-large);
}

.quick-access-entry:not(:last-child) {
  margin-bottom: 1em;
}

.handle {
  cursor: move;
  margin-right: 0.5em;
}

.fritter {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

img {
  height: 2em;
  width: 2em;
}

.title {
  font-size: 2em;
  margin: 0 5px;
}
</style>