import { combineReducers } from 'redux'
import ingredients from './ingredients'
import ingredient from './ingredient'
import salad from './salad'
import salads from './salads'

export default combineReducers({
  ingredients,
  ingredient,
  salad,
  salads,
})
