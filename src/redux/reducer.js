import listeActions from "./actions";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")), // ==> string --> JSON
  bureau: {},
  service: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case listeActions.login: {
      return { ...state, user: action.user };
    }
    default:
      return state;
  }
};

export default reducer;
