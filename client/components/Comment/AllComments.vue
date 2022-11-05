<template>
  <section class="comments">
    <CommentsComponent :comments="comments" :parentId="freetId" @refresh="refreshComments"/>
  </section>
</template>


<script>
import CommentsComponent from "@/components/Comment/CommentsComponent.vue";

export default {
  name: "AllComments",
  components: {
    CommentsComponent,
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
      commentsCount: null,
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
  },
};
</script>