<template>
  <span class="container">
    <button title="upvote" class="vote upvote" @click="() => handleVote('upvote')">
      <svg :class="{active: vote === 'upvote'}" v-html="vote === 'upvote' ? filledUpvoteSvg : upvoteSvg" />
    </button>
    <span>{{ votes }}</span>
    <button title="downvote" class="vote downvote" @click="() => handleVote('downvote')">
      <svg :class="{active: vote === 'downvote'}" v-html="vote === 'downvote' ? filledUpvoteSvg : upvoteSvg" />
    </button>
  </span>  
</template>

<script>

const upvoteSvg = `<title>upvote</title><path fill="currentColor" d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"/>`;
const filledUpvoteSvg = `<title>downvote</title><path fill="currentColor" d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"/>`;

export default {
  name: "Vote",
  props: {
    model: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      upvoteSvg,
      filledUpvoteSvg,
      // vote: null,
      id: this.item.id,
      upvotes: this.item.numUpvotes,
      downvotes: this.item.numDownvotes,
      toggle: false,
    };
  },
  computed: {
    vote() {
      this.toggle;
      return this.$store.state.votes[this.model][this.id];
    },
    votes: function() {
      return this.item.numUpvotes - this.item.numDownvotes;
    }
  },
  methods: {
    resetVote() {
      if (!this.vote) return;
      if (this.vote === 'upvote') this.item.numUpvotes -= 1;
      else this.item.numDownvotes -= 1;
    },
    handleVote(vote) {
      if (this.vote === vote) {
        this.handleUnvote();
        return;
      }
      fetch(`/api/votes/${this.model}/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          this.$store.commit("initVotes");
          return;
        }
        this.resetVote();
        // this.vote = vote;
        this.$store.commit("voteModel", { model: this.model, id: this.id, vote });
        if (vote === 'upvote') this.item.numUpvotes += 1;
        else this.item.numDownvotes += 1;
        this.toggle = !this.toggle;
      });
    },
    handleUnvote() {
      fetch(`/api/votes/${this.model}/${this.id}`, {
        method: "DELETE",
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          this.$store.commit("initVotes");
          return;
        }
        if (this.vote === 'upvote') this.item.numUpvotes -= 1;
        else this.item.numDownvotes -= 1;
        this.$store.commit("unvoteModel", { model: this.model, id: this.id });
        this.toggle = !this.toggle;
      });
    }
  },
}

</script>

<style scoped>

.container {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.vote {
  padding: 0.5em;
  display: flex;
}

.vote:hover {
  background-color: var(--hover-color);
  cursor: pointer;
  border-radius: 50%;
}

.vote.upvote:hover, .upvote svg.active {
  color: var(--upvote-color);
}
.vote.downvote:hover, .downvote svg.active {
  color: var(--downvote-color);
}

.vote.downvote:active {
  position: relative;
  top: 1px;
}
.vote.upvote:active {
  position: relative;
  top: -1px;
}

.downvote {
  transform: rotate(180deg);
}

button {
  border: none;
  background-color: transparent;
  font-size: inherit;
}

svg {
  width: 1.5em;
  height: 1.5em;
}

</style>