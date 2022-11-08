<template>
  <ul>
    <li v-for="item in comments[parentId]" :key="item.id">
      <article class="comment">
        <header class="comment-meta">
          <UsernameComponent class="username" :username="item.author" />
          <span>•</span>
          <span class="comment-date">{{ relativeDate(item.dateModified) }}
            <span v-if="item.dateCreated !== item.dateModified" class="italic"> (edited) </span>
          </span>
        </header>
        <div class="comment-content" v-if="!editing[item.id]">
          {{ item.content }}
        </div>
        <textarea v-else v-model="editingContent[item.id]" class="content"></textarea>
        <div class="comment-actions">
          <Vote :model="'comment'" :item="item" />
          <button v-if="item.author !== '[comment deleted]'" @click="() => {if ($store.state.username) $set(showReply, item.id, true); else $toast.error('You must be logged in to reply');}">Reply</button>
          <button v-if="item.author === $store.state.username && !editing[item.id]" @click="deleteComment(item.id)">Delete</button>
          <button v-if="item.author === $store.state.username" @click="edit(item.id, item.content)">{{editing[item.id] ? 'Save' : 'Edit'}}</button>
        </div>
      </article>
      <div v-if="showReply[item.id]" class="comment-reply">
        <ul><li>
          <CreateCommentBlock 
            :submitCallback="replyToCommentFunction(item.id)"
            :cancelCallback="() => $set(showReply, item.id, false)"
            :legend="`Reply to ${item.author}`"
            :submitName="'Reply'"
          />
        </li></ul>
      </div>
      <CommentsComponent @refresh="$emit('refresh')" v-if="item.id in comments" :parentId="item.id" :comments="comments" />
    </li>
  </ul>
</template>

<script>
import UsernameComponent from "@/components/common/UsernameComponent.vue";
import Vote from "@/components/Vote/Vote.vue";
import CreateCommentBlock from "@/components/Comment/CreateCommentBlock.vue";
import moment from "moment";

export default {
  name: 'CommentsComponent',
  components: {
    UsernameComponent, Vote, CreateCommentBlock
  },
  props: {
    comments: {
      type: Object,
      required: true,
    },
    parentId: {
      required: true,
    }
  },
  data() {
    return {
      showReply: {},
      reply: {},
      editing: {},
      editingContent: {}
    }
  },
  methods: {
    replyToCommentFunction(id) {
      return content => this.replyToComment(id, content);
    },
    replyToComment(id, content) {
      this.request({
        url: `/api/comments/oncomment/${id}`,
        method: 'POST',
        body: {content}
      }).then((res) => {
        if (res.error) {
          this.$toast.error(res.error);
          return;
        }
        this.$set(this.showReply, id, false);
        this.$set(this.reply, id, '');
        this.$emit('refresh');
        this.$toast.success('Reply added to successfully!');
      }).catch((e) => {
        this.$toast.error(e);
      });
    },
    deleteComment(id) {
      this.request({
        url: `/api/comments/${id}`,
        method: 'DELETE',
      }).then((res) => {
        if (res.error) {
          this.$toast.error(res.error);
          return;
        }
        this.$emit('refresh');
        this.$toast.success('Comment deleted successfully!');
      }).catch((e) => {
        this.$toast.error(e);
      });
    },
    edit(id, content) {
      const cur = this.editing[id];
      if (content === this.editingContent[id]) {
        this.$set(this.editing, id, !cur);
        this.$toast.warning("Nothing changed, so edit didn't go through");
        return;
      }
      if (cur) {
        this.request({
          url: `/api/comments/${id}`,
          method: 'PUT',
          body: {content: this.editingContent[id]}
        }).then((res) => {
          if (res.error) {
            this.$toast.error(res.error);
            return;
          }
          this.$set(this.editing, id, false);
          this.$emit('refresh');
          this.$toast.success('Comment edited successfully!');
        }).catch((e) => {
          this.$toast.error(e);
        });
      } else {
        this.$set(this.editingContent, id, content);
        this.$set(this.editing, id, true);
      }
    },
    async request(params) {
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = JSON.stringify(params.body);
      }
      return fetch(params.url, options).then(res => res.json()).then(res => {
        return res;
      }).catch(e => {
        this.$toast.error(e);
      });
    },
    relativeDate(date) {
      return moment(date).fromNow();
    }
  }
}
</script>

<style scoped>
.comments > ul {
  padding: 1em;
}
li {
  list-style: none;
  /* background-color: var(--comment-background-color); */
  border-radius: 1em;
}
.comment {
  background-color: var(--comment-background-color);
  padding: 1em;
  border-radius: var(--border-radius-large);
  margin-bottom: 0.5em;
}
.comment-meta, .comment-actions {
  display: flex;
  gap: 0.5em;
  align-items: center;
}
.comment-content {
  padding-top: 0.5em;
  padding-left: 0.5em;
  margin-bottom: 0.5em;
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

</style>