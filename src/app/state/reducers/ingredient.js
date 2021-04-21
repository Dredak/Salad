import {
  INGREDIENT_CREATION_STARTED,
  INGREDIENT_CREATION_SUCCEEDED,
  INGREDIENT_CREATION_FAILED,
} from '../actions/types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

export default (state = initialState, { type, payload }) => {
  if (type === INGREDIENT_CREATION_STARTED) {
    return { ...state, loading: true, error: null }
  }

  if (type === INGREDIENT_CREATION_SUCCEEDED) {
    return { ...state, data: payload, loading: false }
  }

  if (type === INGREDIENT_CREATION_FAILED) {
    return { ...state, loading: false, error: payload }
  }

  return state
}
