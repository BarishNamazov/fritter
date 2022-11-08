<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <header>
      <div class="freet-meta">
        <UsernameComponent class="author" :username="freet.author" />
        <span>•</span>
        <span class="freet-date">{{ relativeDate(freet.dateModified) }} 
          <span v-if="freet.dateCreated !== freet.dateModified" class="italic"> (edited) </span>
        </span>
        <span>•</span>
        <span class="freet-visibility">{{ freet.visibility }}</span>
      </div>
      
      <!-- TODO Deal with this in options later -->
      <!-- <div v-if="$store.state.username === freet.author" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteFreet">🗑️ Delete</button>
      </div> -->
    </header>
    <div v-if="editing">
      <textarea
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <input v-model="visibility" type="radio" name="public" :value="'public'" /><label for="public">Public</label>
      <input v-model="visibility" type="radio" name="friends" :value="'friends'" /><label for="friends">Friends</label>
      <input v-model="visibility" type="radio" name="only me" :value="'only me'" /><label for="only me">Only me</label>
    </div>
    <div v-else>
      <p class="content">
        {{ freet.content }}
      </p>
    </div>
    <div class="freet-actions">
      <Vote class="freet-votes" :item="freet" :model="'freet'" />
      <router-link class="freet-comments" title="comments" :to="`/freet/${freet.id}`">
        <span>{{ freet.numComments }}</span>
        <svg class="comment-logo" v-html="commentSvg" />
      </router-link>
      <span title="options" class="freet-options"><img alt="options" src="https://www.svgrepo.com/show/327453/options.svg" /></span>
    </div>
  </article>
</template>

<script>
import Vote from "@/components/Vote/Vote.vue";
import UsernameComponent from "@/components/common/UsernameComponent.vue";
import moment from "moment";

const commentSvg = `<title>comments</title><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 11h10M7 14h4m3.828 4H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812v0c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18z"/>`;

export default {
  name: "FreetComponent",
  components: {
    Vote, UsernameComponent
  },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      visibility: this.freet.visibility,
      alerts: {}, // Displays success/error messages encountered during freet modification
      commentSvg,
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft && this.freet.visibility === this.visibility) {
        const error =
          "Error: Edited freet content or visibility should be different than current freet content or visibility.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft, visibility: this.visibility }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshFreets");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    relativeDate(date) {
      return moment(date).fromNow();
    }
  },
};
</script>

<style scoped>
.freet {
  background-color: white;
  border: 1px solid #111;
  padding: 20px;
  border-radius: var(--border-radius-large);
  position: relative;
}

.freet-meta, .freet-comments, .freet-actions {
  display: flex;
  align-items: center;
}
.freet-actions {
  justify-content: space-between;
}

.freet-meta {
  gap: 0.5em;
}

.freet-comments {
  text-decoration: none;
  gap: 0.3em;
  padding: 0.5em;
  color: inherit;
}

.freet-comments svg {
  color: white;
}

.freet-options {
  padding: 0.5em;
}

.freet-comments:hover, .freet-options:hover {
  background-color: var(--hover-color);
  border-radius: var(--border-radius-large);
  cursor: pointer;
}

.freet-actions {
  align-items: center;
  gap: 2em;
}

img, svg {
  width: 1.5em;
  height: 1.5em;
}

.freet-votes, .freet-comments, .freet-options {
  flex: 1;
  display: flex;
  justify-content: center;
}

.italic {
  font-style: italic;
}
</style>
