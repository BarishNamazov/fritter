<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <div class="center-view">
      <section>
        <header>
          <h2>New to Fritter?</h2>
        </header>
        <RegisterForm />
      </section>
      <section>
        <header>
          <h2>Have an account?</h2>
        </header>
        <LoginForm />
      </section>
    </div>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import RegisterForm from "@/components/Login/RegisterForm.vue";
import LoginForm from "@/components/Login/LoginForm.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";

export default {
  name: "LoginPage",
  components: {
    RegisterForm,
    LoginForm,
    RightSidebar
  },
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
</style>