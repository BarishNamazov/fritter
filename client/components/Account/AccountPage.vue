<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <div class="center-view">
      <section>
        <header>
          <h2>Account settings for @{{ $store.state.username }}</h2>
        </header>
        <ChangeUsernameForm />
        <ChangePasswordForm />
      </section>
      <section>
        <header>
          <h2>Account management</h2>
        </header>
        <LogoutForm />
        <DeleteAccountForm />
        <router-link to="/takebreak">Take a break</router-link>
      </section>
    </div>
    <RightSidebar class="right-sidebar" />
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";
import RightSidebar from "@/components/common/RightSidebar.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
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
