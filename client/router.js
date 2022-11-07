import Vue from 'vue';
import VueRouter from 'vue-router';
import AllFreetsPage from './components/Freet/AllFreetsPage.vue';
import FeedPage from './components/Freet/FeedPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';
import SingleFreetPage from './components/Freet/SingleFreetPage.vue';
import StartBreakPage from './components/TakeBreak/StartBreakPage.vue';
import UserProfilePage from './components/UserProfile/UserProfilePage.vue';
import FollowsListPage from './components/Follow/FollowsListPage.vue';
import FriendRequestsListPage from './components/Friend/FriendRequestsListPage.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: AllFreetsPage},
  {path: '/feed', name: 'Feed', component: FeedPage},
  {path: '/follows', name: 'Follows', component: FollowsListPage},
  {path: '/requests', name: 'FriendRequests', component: FriendRequestsListPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/freet/:id', name: 'Freet', component: SingleFreetPage},
  {path: '/user/:username', name: 'User', component: UserProfilePage},
  {path: '/takebreak', name: 'TakeBreak', component: StartBreakPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
