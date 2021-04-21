import {
  SALADS_FETCH_STARTED,
  SALADS_FETCH_SUCCEEDED,
  SALADS_FETCH_FAILED,
} from '../actions/types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

export default (state = initialState, { type, payload }) => {
  if (type === SALADS_FETCH_STARTED) {
    return { data: null, loading: true, error: null }
  }

  if (type === SALADS_FETCH_SUCCEEDED) {
    return {
      ...state,
      data: payload,
      loading: false,
    }
  }

  if (type === SALADS_FETCH_FAILED) {
    return { ...state, loading: false, error: payload }
  }

  return state
}
