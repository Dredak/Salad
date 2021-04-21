import {
  SALAD_CREATION_STARTED,
  SALAD_CREATION_SUCCEEDED,
  SALAD_CREATION_FAILED,
} from '../actions/types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

export default (state = initialState, { type, payload }) => {
  if (type === SALAD_CREATION_STARTED) {
    return { ...state, loading: true, error: null }
  }

  if (type === SALAD_CREATION_SUCCEEDED) {
    return { ...state, data: payload, loading: false }
  }

  if (type === SALAD_CREATION_FAILED) {
    return { ...state, loading: false, error: payload }
  }

  return state
}
