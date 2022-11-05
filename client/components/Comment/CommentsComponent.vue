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
        </div>
      </article>
      <CommentsComponent v-if="item.id in comments" :parentId="item.id" :comments="comments" />
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
.comment-meta {
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