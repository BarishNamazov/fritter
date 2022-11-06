import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const getDefaultState = () => {
  return {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    quickAccess: [], // Quick access list for the logged in user
    votes: {freet: {}, comment: {}}, // Upvotes/downvotes for freets and comments
  }
};

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      let url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      if (state.filter == `#feed`) {
        url = `/api/follows/freets`;
      }
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    setQuickAccess(state, quickAccess) {
      /**
       * Update the stored quick access to the provided quick access.
       * @param quickAccess - Quick access to store
       */
      state.quickAccess = quickAccess;
    },
    refreshQuickAccess(state) {
      fetch("/api/quickaccess", {
        credentials: "same-origin", // Sends express-session credentials with request
      })
      .then((res) => res.json())
      .then((res) => {
        state.quickAccess = res.quickAccess.entries;
      });
    },
    async initVotes(state) {
      state.votes = {
        freet: {},
        comment: {},
      };
      await fetch('/api/votes/my', {
        credentials: "same-origin",
      })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          return;
        }
        const votes = {freet: {}, comment: {}};
        res.forEach(vote => {
          votes[vote.model.toLowerCase()][vote.id] = vote.vote;
        });
        state.votes = votes;
      });
    },
    voteModel(state, payload) {
      const {model, id, vote} = payload;
      state.votes[model][id] = vote;
    },
    unvoteModel(state, payload) {
      const {model, id} = payload;
      delete state.votes[model][id];
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
