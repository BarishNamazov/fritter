<template>
  <ul>
    <li v-for="item in comments[parentId]" :key="item.id">
      <article class="comment">
        <div class="comment-meta">
          <Username class="username" :username="item.author" />
          <span>•</span>
          <span class="comment-date">{{ item.dateModified }}</span>
        </div>
        <div class="comment-content">
          {{ item.content }}
        </div>
        <div class="comment-actions">
          <Vote :model="'comment'" :item="item" />
          <button @click="$set(showReply, item.id, true)">Reply</button>
          <button @click="deleteComment(item.id)">Delete</button>
        </div>
      </article>
      <div v-if="showReply[item.id]" class="comment-reply">
        <ul><li>
          <textarea v-model="reply[item.id]" spellcheck="false"></textarea>
          <button @click="replyToComment(item.id, reply[item.id])">Submit</button>
          <button @click="$set(showReply, item.id, false)">Cancel</button>
        </li></ul>
      </div>
      <CommentsComponent @refresh="$emit('refresh')" v-if="item.id in comments" :parentId="item.id" :comments="comments" />
    </li>
  </ul>
</template>

<script>
import Username from "@/components/Account/Username.vue";
import Vote from "@/components/Vote/Vote.vue";

export default {
  name: 'CommentsComponent',
  components: {
    Username, Vote
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
    }
  },
  methods: {
    replyToComment(id, content) {
      this.request({
        url: `/api/comments/oncomment/${id}`,
        method: 'POST',
        body: {content}
      }).then(() => {
        this.$set(this.showReply, id, false);
        this.$set(this.reply, id, '');
        this.$emit('refresh');
      });
    },
    deleteComment(id) {
      this.request({
        url: `/api/comments/${id}`,
        method: 'DELETE',
      }).then(() => {
        this.$emit('refresh');
      });
    },
    async request(params) {
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = JSON.stringify(params.body);
      }
      return fetch(params.url, options);
    }
  }
}
</script>

<style scoped>
.comments > ul {
  padding: 1em;
}
.username {
  border: 1px solid black;
  border-radius: var(--border-radius-large);
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

</style>