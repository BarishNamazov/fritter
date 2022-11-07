<template>
  <section>
    <header class="fritter">
      <img src="../../public/logo.svg" />
      <h1 class="title">Fritter</h1>
    </header>
    <div class="qa" v-if="$store.state.username">
      <div class="actions">
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button v-if="editing" @click="saveEdits">✔️ Save</button>
        <button v-if="editing" @click="addEntry">➕ Add</button>
      </div>
      <ul>
        <li v-for="{ name, url } in fixed" :key="name" class="quick-access-entry">
          <a :href="url"><span>{{ name }}</span></a>
        </li>
      </ul>
      <ul v-if="!editing">
        <li v-for="{ name, url } in form" :key="name" class="quick-access-entry">
          <a :href="url"><span>{{ name }}</span></a>
        </li>
      </ul>
      <ul v-else>
        <draggable v-bind="dragOptions" handle=".handle" @start="drag=true" @end="drag=false">
          <li v-for="({name, url}, index) in form" v-if="editing" :key="name + '-' + index" class="quick-access-entry-input">
            <img src="https://www.svgrepo.com/show/357669/draggabledots.svg" class="handle" />
            <div class="input-container">
              <input :value="name" class="name" />
              <input :value="url" class="url" />
            </div>
            <button v-if="editing" @click="deleteEntry">🗑️ Delete</button>
          </li>
        </draggable>
      </ul>
      
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
      form: [],
      fixed: [
        {
          name: "Home",
          url: "/#/",
        },
        {
          name: "Feed",
          url: "/#/feed",
        }
      ],
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
    "$store.state.username": function (username) {
      if (username) {
        this.refresh();
      }
    },
    drag: function (newVal) {
      if (!newVal) {
        this.updateForm();
      }
    }
  },
  mounted() {
    this.form = [];
    this.refresh();
  },
  methods: {
    refresh() {
      fetch("/api/quickaccess")
        .then((res) => res.json())
        .then((res) => {
          this.form = res.entries;
        });
    },
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
            alert(data.error);
          } else {
            this.editing = false;
          }
        })
        .catch((err) => alert(err));
    },
    addEntry() {
      this.updateForm();
      this.form.push({ name: "", url: "/#/" });
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
  border-right: var(--sidebar-border) solid black;
  height: 100vh;
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

ul {
  padding-left: 0;
  margin-bottom: 1.5em;
}
li {
  list-style: none;
  margin-bottom: 1em;
}

.quick-access-entry-input {
  margin-left: -1em;
  display: flex;
  align-items: center;
  gap: 0.2em;
}
.input-container {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.input-container input {
  font: inherit;
  padding: 0.2em;
  width: 100%;
}

button {
  font: inherit;
  appearance: none;
  border: 1px solid var(--username-border-color);
  border-radius: var(--border-radius-small);
  gap: 0.5em;
  padding: 0.5em;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 0.5em;
}

</style>