<template>
  <section class="comments">
    <h3>Comments</h3>
    <CreateCommentBlock
      :content="commentContent"
      :submitName="'Comment'"
      :submitCallback="commentOnFreet"
    />
    <CommentsComponent v-if="commentsCount && loaded" :comments="comments" :parentId="freetId" @refresh="refreshComments"/>
    <p v-else-if="loaded">No comments, you could be the first!</p>
    <div class="loader" v-else>
      <div class="lds-dual-ring"></div>
    </div>
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
      commentContent: "",
      loaded: false,
    };
  },
  mounted() {
    this.refreshComments();
  },
  methods: {
    refreshComments() {
      fetch(`/api/comments?freetId=${this.freetId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.$toast.error(data.error);
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
          this.loaded = true;
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
      }).then((res) => {
        if (res.error) {
          this.$toast.error(res.error);
          return;
        }
        this.commentContent = "";
        this.refreshComments();
        this.$toast.success("Commented successfully.");
      }).catch((e) => {
        this.$toast.error(e);
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
        return res;
      }).catch(e => {
        this.$toast.error(e);
      });
    }
  },
};
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>