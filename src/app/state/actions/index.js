import api from '../../api'
import {
  INGREDIENT_CREATION_STARTED,
  INGREDIENT_CREATION_SUCCEEDED,
  INGREDIENT_CREATION_FAILED,
  INGREDIENTS_FETCH_STARTED,
  INGREDIENTS_FETCH_SUCCEEDED,
  INGREDIENTS_FETCH_FAILED,
  SALAD_CREATION_STARTED,
  SALAD_CREATION_SUCCEEDED,
  SALAD_CREATION_FAILED,
  SALADS_FETCH_STARTED,
  SALADS_FETCH_SUCCEEDED,
  SALADS_FETCH_FAILED,
} from './types'

export const createIngredient = (body, callback) => dispatch => {
  dispatch({ type: INGREDIENT_CREATION_STARTED })
  api(`/ingredients`, {
    method: 'POST',
    body,
  })
    .then(ingredient => {
      callback()
      dispatch({ type: INGREDIENT_CREATION_SUCCEEDED, payload: ingredient })
    })
    .catch(error => {
      dispatch({ type: INGREDIENT_CREATION_FAILED, payload: error })
    })
}

export const fetchIngredients = () => dispatch => {
  dispatch({ type: INGREDIENTS_FETCH_STARTED })
  return api(`/ingredients`)
    .then(ingredients => {
      dispatch({ type: INGREDIENTS_FETCH_SUCCEEDED, payload: ingredients })
    })
    .catch(error => {
      dispatch({ type: INGREDIENTS_FETCH_FAILED, payload: error })
    })
}

export const editIngredient = (body, onEditSuccess, onEditFail) => dispatch => {
  api(`/ingredients/${body.id}`, {
    method: 'PUT',
    body,
  })
    .then(() => {
      onEditSuccess()
    })
    .catch(error => {
      onEditFail(error.message)
    })
}

export const deleteIngredient = (
  id,
  onDeleteSucces,
  onDeleteFail
) => dispatch => {
  api(`/ingredients/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      onDeleteSucces()
    })
    .catch(error => {
      onDeleteFail(error)
    })
}

export const createSalad = (body, callback) => dispatch => {
  dispatch({ type: SALAD_CREATION_STARTED })
  api(`/salads`, {
    method: 'POST',
    body,
  })
    .then(salad => {
      callback()
      dispatch({ type: SALAD_CREATION_SUCCEEDED, payload: salad })
    })
    .catch(error => {
      dispatch({ type: SALAD_CREATION_FAILED, payload: error })
    })
}

export const fetchSalads = () => dispatch => {
  dispatch({ type: SALADS_FETCH_STARTED })
  return api(`/salads`)
    .then(salads => {
      dispatch({ type: SALADS_FETCH_SUCCEEDED, payload: salads })
    })
    .catch(error => {
      dispatch({ type: SALADS_FETCH_FAILED, payload: error })
    })
}
