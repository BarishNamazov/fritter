<template>
  <section class="comments">
    <h3>Comments</h3>
    <CreateCommentBlock
      :content="commentContent"
      :submitName="'Comment'"
      :submitCallback="commentOnFreet"
    />
    <CommentsComponent v-if="commentsCount" :comments="comments" :parentId="freetId" @refresh="refreshComments"/>
    <p v-else>No comments, you could be the first!</p>
  </section>
</template>


<script>
import CommentsComponent from "@/components/Comment/CommentsComponent.vue";
import CreateCommentBlock from "@/components/Comment/CreateCommentBlock.vue";

export default {
  name: "AllComments",
  components: {
    CommentsComponent,
    CreateCommentBlock
  },
  props: {
    freetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      comments: {},
      commentsCount: 0,
      commentContent: ""
    };
  },
  mounted() {
    this.refreshComments();
  },
  methods: {
    refreshComments() {
      console.log("yay, refreshing!!!");
      fetch(`/api/comments?freetId=${this.freetId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log("Error:", data.error);
            return;
          }
          const comments = {};
          for (const comment of data) {
            const par = comment.replyToId;
            if (par in comments) {
              comments[par].push(comment);
            } else {
              comments[par] = [comment];
            }
          }
          this.commentsCount = data.length;
          this.comments = comments;
        });
    },
    commentOnFreet(_content) {
      this.commentContent = _content;

      this.request({
        url: `/api/comments/onfreet/${this.freetId}`,
        method: 'POST',
        body: {content: this.commentContent}
      }).then(() => {
        this.commentContent = "";
        this.refreshComments();
      }).catch((e) => {
        alert("Error: " + e);
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
      return fetch(params.url, options).then(res => res.json()).then(res => {
        if (res.error) {
          alert(res.error);
        }
        return res;
      }).catch(e => {
        alert(e);
      });
    }
  },
};
</script>