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
    votes: {freet: new Set(), comment: new Set()}, // Upvotes/downvotes for freets and comments
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
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
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
        console.log(res);
        state.quickAccess = res.quickAccess.entries;
      });
    },
    setVotes(state, upvotes) {
      state.votes = {
        freet: new Set(upvotes.freets),
        comment: new Set(upvotes.comments),
      };
      console.log(state.votes);
    },
    upvoteModel(state, payload) {
      const {model, id} = payload;
      state.votes[model].delete([id, 'downvote']);
      state.votes[model].add([id, 'upvote']);
    },
    downvoteModel(state, payload) {
      const {model, id} = payload;
      state.votes[model].delete([id, 'upvote']);
      state.votes[model].add([id, 'downvote']);
    },
    unvoteModel(state, payload) {
      const {model, id} = payload;
      state.votes[model].delete([id, 'upvote']);
      state.votes[model].delete([id, 'downvote']);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
