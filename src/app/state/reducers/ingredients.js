import {
  INGREDIENTS_FETCH_STARTED,
  INGREDIENTS_FETCH_SUCCEEDED,
  INGREDIENTS_FETCH_FAILED,
} from '../actions/types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

export default (state = initialState, { type, payload }) => {
  if (type === INGREDIENTS_FETCH_STARTED) {
    return { data: null, loading: true, error: null }
  }

  if (type === INGREDIENTS_FETCH_SUCCEEDED) {
    return {
      ...state,
      data: payload,
      loading: false,
    }
  }

  if (type === INGREDIENTS_FETCH_FAILED) {
    return { ...state, loading: false, error: payload }
  }

  return state
}
