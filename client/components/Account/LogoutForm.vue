<!-- Form for signing out (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";
import {getDefaultState} from "@/store";

export default {
  name: "LogoutForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users/session",
      method: "DELETE",
      setUsername: true,
      title: "Sign out",
      fields: [],
      content: "Need to leave? See you later.",
      callback: () => {
        this.$router.push({ name: "Home" }); // Goes to Home page after signing out
        this.$store.replaceState(getDefaultState()); // Resets store to default state
        this.$toast.info("You are now signed out!");
      },
    };
  },
};
</script>
