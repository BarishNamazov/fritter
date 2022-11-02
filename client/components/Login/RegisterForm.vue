<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        { id: 'username', label: 'Username', value: '' },
        { id: 'password', label: 'Password', value: '' }
      ],
      title: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({ name: 'Home' });
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        fetch('/api/quickaccess', {
          credentials: 'same-origin' // Sends express-session credentials with request
        }).then(res => res.json()).then(res => {
          console.log(res);
          const quickaccess = res.quickAccess.entries;
          this.$store.commit('setQuickAccess', quickaccess ? quickaccess : []);
        });
      }
    };
  }
};
</script>
