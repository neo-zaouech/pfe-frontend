import listeActions from './actions'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')), // ==> string --> JSON
  bureau: {},
  service: {},
  statusService: null,
  statusUser: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case listeActions.login: {
      return { ...state, user: action.user }
    }
    case listeActions.statusService: {
      return { ...state, statusService: action.statusService }
    }
    case listeActions.statusUser: {
      return { ...state, statusUser: action.statusUser }
    }
    case listeActions.statusActualite: {
      return { ...state, statusActualite: action.statusActualite }
    }
    case listeActions.addEmploye: {
      return { ...state, user: { ...state.user, bureau: action.bureau } }
    }

    default:
      return state
  }
}

export default reducer
