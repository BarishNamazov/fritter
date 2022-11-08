import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const getDefaultState = () => {
  return {
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    votes: {freet: {}, comment: {}}, // Upvotes/downvotes for freets and comments
  }
};

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
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
