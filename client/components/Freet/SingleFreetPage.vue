<template>
  <main>
    <section class="center-view">
      <FreetComponent v-if="freet" :freet="freet" :commentsCount="commentsCount" />
      <div v-if="freet" class="comments">
        <CommentsComponent :comments="comments" :parentId="freet.id" />
      </div>
    </section>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";
import CommentsComponent from "@/components/Comment/CommentsComponent.vue";

export default {
  name: "SingleFreetPage",
  components: {
    FreetComponent, RightSidebar, CommentsComponent
  },
  data() {
    return {
      freet: null,
      commentsCount: null,
      comments: {},
    };
  },
  mounted() {
    // Get the freet ID from the URL
    const freetId = this.$route.params.id;
    fetch(`/api/freets/${freetId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log('Error:', data.error);
          return;
        }
        this.freet = data[0];
      });
    fetch(`/api/comments?freetId=${freetId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log('Error:', data.error);
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
        console.log("yoooo", this.commentsCount)
        this.comments = comments;

        // this.comments = {
        //   "6363542d52a574dde4578233" : [{content: "top comment", id: 1, author: "barish"}],
        //   "1" : [{content: "reply to top comment", id: 2, author: "ur mom"}, {content: "another reply to top comment", id: 10, "author": "ur dad"}],
        //   "2" : [{content: "reply to reply to top comment", id: 3, author: "adhami smol"}, {content: "another reply to reply to top comment", id: 40, author: "adhami big"}],
        //   "3" : [{content: "reply to reply to reply to top comment", id: 4, author: "jajajajajajajjajajajajajajajja"}],
        // }
      });
      this.$store.commit("initVotes");
  }
};

</script>

<style scoped>
main {
  display: flex;
}
.center-view {
  flex: 2;
}
.right-sidebar {
  flex: 1;
}

.center-view {
  padding: 1em;
}
</style>