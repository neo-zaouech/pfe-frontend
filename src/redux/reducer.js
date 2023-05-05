import listeActions from './actions'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')), // ==> string --> JSON
  bureau: {},
  service: {},
  statusService: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case listeActions.login: {
      return { ...state, user: action.user }
    }
    case listeActions.statusService: {
      return { ...state, statusService: action.statusService }
    }
    default:
      return state
  }
}

export default reducer
