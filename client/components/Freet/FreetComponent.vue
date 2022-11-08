<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet" v-if="loaded">
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
    </header>
    <div v-if="editing">
      <textarea
        aria-label="freet content"
        class="edit-content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <div class="visibility">
        <span>Visibility: </span>
        <span><label><input v-model="visibility" type="radio" :value="'public'" />Public</label></span>
        <span><label><input v-model="visibility" type="radio" :value="'friends'" />Friends</label></span>
        <span><label><input v-model="visibility" type="radio" :value="'only me'" />Only me</label></span>
      </div>
      <div class="edit-actions">
        <button @click="submitEdit">✅ Save</button>
        <button @click="() => {draft = freet.content; editing = false;}">🚫 Discard</button>
      </div>
    </div>
    <div v-else>
      <p class="content">
        {{ freet.content }}
      </p>
    </div>
    <div class="freet-actions" v-if="!editing">
      <Vote class="freet-votes" :item="freet" :model="'freet'" />
      <router-link class="freet-comments" :to="`/freet/${freet.id}`">
        <span>{{ freet.numComments }}</span>
        <svg class="comment-logo" v-html="commentSvg" />
      </router-link> 
      <span class="freet-options" @click="showActions ^= 1" v-my-click-outside="disableActions">
        <div class="freet-options-actions" :class="{show: showActions}">
          <button v-if="freet.author === $store.state.username" @click="deleteFreet">🗑️ Delete</button>
          <button v-if="freet.author === $store.state.username" @click="editing = true">✏️ Edit</button>
          <button @click="copyLink">🔗 Copy link</button>
        </div>
        <span>
          <img alt="options" src="https://www.svgrepo.com/show/327453/options.svg" />
        </span>
      </span>
    </div>
  </article>
  <div class="loader" v-else>
    <div class="lsd-dual-ring"></div>
  </div>
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
    loaded: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      visibility: this.freet.visibility,
      showActions: false,
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
      const val = confirm("Are you sure you want to delete this freet?");
      if (!val) return;
      const params = {
        method: "DELETE",
        callback: () => {
          this.$toast.success("Freet deleted!");
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft && this.freet.visibility === this.visibility) {
        this.$toast.warning("Nothing changed, edit did not go through.");
        this.editing = false;
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft, visibility: this.visibility }),
        callback: () => {
          this.$toast.success("Freet edited!");
        },
      };
      this.request(params);
      this.showActions = false;
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

        params.callback();
        this.$emit("refresh");
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    relativeDate(date) {
      return moment(date).fromNow();
    },
    disableActions() {
      this.showActions = false;
    },
    copyLink() {
      const url = window.location.origin + '/#/freet/' + this.freet.id;
      navigator.clipboard.writeText(url).then(() => {
        this.$toast.success("Copied link to clipboard!");
      }, () => {
        this.$toast.error("Failed to copy link to clipboard!");
      });
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

.freet-options-actions {
  display: none;
  flex-direction: column;
  gap: 0.4em;
  position: absolute;
  bottom: 4.5em;
}
.freet-options-actions.show {
  display: flex;
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

.edit-content {
  width: 100%;
  border: 1px solid black;
  border-radius: var(--border-radius-small);
  font: inherit;
  padding: 0.5em;
  margin-bottom: 1em;
  min-height: 5em;
  resize: none;
}

.edit-actions {
  padding-top: 1em;
  display: flex;
  gap: 1em;
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

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
