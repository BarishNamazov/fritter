<template>
  <span class="container">
    <svg class="upvote" :class="{active: vote === 'upvote'}" v-html="vote === 'upvote' ? filledUpvoteSvg : upvoteSvg" @click="() => handleVote('upvote')"></svg>
    <span>{{ votes }}</span>
    <svg class="downvote" :class="{active: vote === 'downvote'}" v-html="vote === 'downvote' ? filledUpvoteSvg : upvoteSvg" @click="() => handleVote('downvote')"></svg>
  </span>  
</template>

<script>
const upvoteSvg = `<path fill="currentColor" d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"/>`;
const filledUpvoteSvg = `<path fill="currentColor" d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"/>`;

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
      vote: null,
    };
  },
  computed: {
    id: function() {
      return this.item.id;
    },
    upvotes: function() {
      return this.item.numUpvotes;
    },
    downvotes: function() {
      return this.item.numDownvotes;
    },
    votes: function() {
      return this.upvotes - this.downvotes;
    }
  },
  watch: {
    "$store.state.votes": function() {
      this.vote = this.$store.state.votes[this.model][this.id];
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
        this.vote = vote;
        this.$store.commit("voteModel", { model: this.model, id: this.id, vote });
        if (vote === 'upvote') this.item.numUpvotes += 1;
        else this.item.numDownvotes += 1;
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
        this.vote = undefined;
        this.$store.commit("unvoteModel", { model: this.model, id: this.id });
      });
    }
  },
}

</script>

<style scoped>

.container {
  display: flex;
  align-items: center;
  gap: 0.2em;
}

svg {
  width: 24px;
  height: 24px;
}

svg:hover {
  background-color: #dee2e6;
  cursor: pointer;
  border-radius: 40%;
}

svg.upvote:hover, svg.upvote.active {
  color: var(--upvote-color);
}
svg.downvote:hover, svg.downvote.active {
  color: var(--downvote-color);
}

svg.downvote:active {
  position: relative;
  top: 1px;
}
svg.upvote:active {
  position: relative;
  top: -1px;
}

.downvote {
  transform: rotate(180deg);
}

</style>