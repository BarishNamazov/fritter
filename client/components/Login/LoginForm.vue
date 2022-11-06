<template>
  <section class="login">
    <form @submit.prevent="submit">
      <h3>Log in</h3>
      <label for="username">Username</label>
      <input v-model="username" type="text" name="username" required />
      <label for="password">Password</label>
      <input v-model="password" type="password" name="password" required />
      <input type="submit" value="Log in" />
    </form>
    <section v-if="takingBreak" class="end-break">
      <EndBreakComponent 
        :username="username" 
        :password="password" 
        @keepbreak="takingBreak = false" 
      />
    </section>
  </section>
</template>

<script>
import EndBreakComponent from "@/components/TakeBreak/EndBreakComponent.vue";

export default {
  name: "LoginForm",
  components: {
    EndBreakComponent
  },
  data() {
    return {
      username: "",
      password: "",
      takingBreak: false,
    };
  },
  methods: {
    async submit() {
      this.takingBreak = false;
      const username = this.username.trim();
      const password = this.password.trim();
      if (username === "" || password === "") {
        alert("Username and password cannot be empty.");
        return;
      }
      fetch("/api/users/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.takingbreak) {
            this.takingBreak = true;
            return;
          }
          if (data.error) {
            alert(data.error);
            return;
          }
          this.$router.push({ name: "Home" });
          this.$store.commit("alert", {
            message: "You are now signed in!",
            status: "success",
          });
          this.$store.commit("setUsername", this.username);
        }).catch(err => {
          alert(err);
        });
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>
