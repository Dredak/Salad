import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'

import { fetchIngredients, createSalad } from '../../state/actions'
import Card from 'components/Card'
import Error from 'components/Error'
import SortButton from 'components/SortButton'
import { InteractiveTag } from 'components/Tag'

import './style.scss'

const classes = {
  pageWrapper: 'create-salad-page',
  loader: 'create-salad-page-loader',
  placeholderText: 'placeholder-text',
  leftSide: 'left-side-wrapper',
  chosenIngredients: 'chosen-ingredients-wrapper',
  buttonWrapper: 'button-wrapper',
  circularProgress: 'circular-progress',
  rightSide: 'right-side-wrapper',
  rightInner: 'inner-wrapper',
  filtersWrapper: 'filters-wrapper',
  sorterWrapper: 'sorter-wrapper',
  ingredientsWrapper: 'ingredients-wrapper',
  tagsWrapper: 'interactive-tags-wrapper',
  tagsInnerWrapper: 'tags-inner-wrapper',
}

const CreateSaladPage = ({
  fetchIngredients,
  createSalad,
  ingredients,
  loading,
  error,
  saladLoading,
  saladError,
}) => {
  const [tags, setTags] = useState([])
  const [sortOrder, setSortOrder] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [formState, setFormState] = useState({
    name: '',
    tags: [],
  })
  const [selectedIngredients, setSelectedIngredients] = useState([])

  const ingredientsFilteredByTags =
    ingredients && tags.length
      ? ingredients.filter(ingredient =>
          tags.every(tag => ingredient.tags.some(t => t === tag))
        )
      : ingredients || []

  const ingredientsFilteredBySearchQuery =
    searchQuery && ingredientsFilteredByTags.length
      ? ingredientsFilteredByTags.filter(ingredient =>
          ingredient.name.includes(searchQuery)
        )
      : ingredientsFilteredByTags

  const unselectedIngredients = ingredientsFilteredBySearchQuery.length
    ? ingredientsFilteredBySearchQuery.filter(
        ingredient => !selectedIngredients.some(ing => ing.id === ingredient.id)
      )
    : ingredientsFilteredBySearchQuery

  const ingredientsSorted =
    (!sortOrder && unselectedIngredients) ||
    (sortOrder === 'ascending' &&
      unselectedIngredients.sort((a, b) => a.calories - b.calories)) ||
    unselectedIngredients.sort((a, b) => b.calories - a.calories)

  const totalCalories = selectedIngredients.reduce((acc, curr) => {
    return curr.calories + acc
  }, 0)

  const disabled = !(
    formState.name &&
    formState.tags.length &&
    selectedIngredients.length &&
    !saladLoading
  )

  const errorElement = saladError ? (
    <Error
      text={saladError.message}
      style={{ justifyContent: 'start', paddingLeft: '0px' }}
    />
  ) : null

  const loaderElement = saladLoading ? (
    <CircularProgress className={classes.circularProgress} />
  ) : null

  const sortButtons =
    sortOrder === '' || sortOrder === 'ascending' ? (
      <SortButton
        text="Descending"
        onClick={() => setSortOrder('descending')}
      />
    ) : (
      <SortButton text="Ascending" onClick={() => setSortOrder('ascending')} />
    )

  const uniqueTags = ingredients
    ? new Set(ingredients.reduce((acc, curr) => [...acc, ...curr.tags], []))
    : []

  const handleInteractiveTagClick = uniqueTag => () => {
    if (tags.some(tag => tag === uniqueTag)) {
      setTags(tags.filter(tag => tag !== uniqueTag))
    } else {
      setTags([...tags, uniqueTag])
    }
  }
  const interactiveTagList = Array.from(uniqueTags).length
    ? [...uniqueTags].map((uniqueTag, index) => (
        <InteractiveTag
          key={index}
          text={uniqueTag}
          selected={tags.some(tag => tag === uniqueTag)}
          onClick={handleInteractiveTagClick(uniqueTag)}
        />
      ))
    : null

  const handleSaladNameChange = event =>
    setFormState({ ...formState, name: event.target.value })

  const handleSearchQueryChange = event => setSearchQuery(event.target.value)

  const handleAddChip = chip =>
    setFormState({ ...formState, tags: [...formState.tags, chip] })
  const handleDeleteChip = (chip, index) =>
    setFormState({
      ...formState,
      tags: formState.tags.filter((tag, i) => index !== i),
    })

  const clearSaladData = () => {
    setFormState({
      name: '',
      tags: [],
    })
    setTags([])
    setSelectedIngredients([])
  }

  const handleSaladCreate = () =>
    createSalad(
      {
        name: formState.name,
        tags: formState.tags,
        ingredients: selectedIngredients,
        calories: totalCalories,
      },
      clearSaladData
    )

  useEffect(() => {
    !ingredients && fetchIngredients()
  }, [])

  if (loading) return <CircularProgress className={classes.loader} />
  if (error) return <Error text={error.message} />
  if (!ingredients || !ingredients.length)
    return (
      <div className={classes.placeholderText}>
        Please <Link to="/">add</Link> some ingredients in order to create a
        salad.
      </div>
    )
  return (
    <div className={classes.pageWrapper}>
      <div className={classes.leftSide}>
        <form>
          <TextField
            label="Name"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={handleSaladNameChange}
            value={formState.name}
          />
          <ChipInput
            value={formState.tags}
            onAdd={handleAddChip}
            label="Add tags"
            fullWidth
            onDelete={handleDeleteChip}
          />
        </form>
        <div>
          <div className={classes.chosenIngredients}>
            {selectedIngredients.map(ingredient => (
              <Card
                key={ingredient.id}
                text={ingredient.name}
                url={ingredient.img_url}
                calories={ingredient.calories}
                tags={ingredient.tags}
                onClick={() =>
                  setSelectedIngredients(
                    selectedIngredients.filter(ing => ing.id !== ingredient.id)
                  )
                }
              />
            ))}
          </div>
          <div>
            <p>Total number of calories: {totalCalories}</p>

            <div style={{ height: '39px' }}>{errorElement}</div>
            <span className={classes.buttonWrapper}>
              <Button
                role="button"
                color="primary"
                variant="contained"
                disabled={disabled}
                onClick={handleSaladCreate}
              >
                Create salad
              </Button>
              {loaderElement}
            </span>
          </div>
        </div>
      </div>
      <div className={classes.rightSide}>
        <div className={classes.rightInner}>
          <div className={classes.filtersWrapper}>
            <TextField
              label="Name"
              onChange={handleSearchQueryChange}
              value={searchQuery}
              fullWidth
            />
            <span className={classes.sorterWrapper}>
              Sort by calories:
              {sortButtons}
            </span>
          </div>
          <div className={classes.ingredientsWrapper}>
            {ingredientsSorted.map(ingredient => (
              <Card
                key={ingredient.id}
                text={ingredient.name}
                url={ingredient.img_url}
                calories={ingredient.calories}
                tags={ingredient.tags}
                onClick={() =>
                  setSelectedIngredients([...selectedIngredients, ingredient])
                }
              />
            ))}
          </div>
        </div>

        <div className={classes.tagsWrapper}>
          Tags:
          <div className={classes.tagsInnerWrapper}>{interactiveTagList}</div>
        </div>
      </div>
    </div>
  )
}

const select = state => {
  return {
    ingredients: state.ingredients.data,
    loading: state.ingredients.loading,
    error: state.ingredients.error,
    saladLoading: state.salad.loading,
    saladError: state.salad.error,
  }
}

CreateSaladPage.propTypes = {
  fetchIngredients: PropTypes.func,
  createSalad: PropTypes.func,
  ingredients: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  error: PropTypes.object,
  saladLoading: PropTypes.bool,
  saladError: PropTypes.object,
}

export default connect(select, { fetchIngredients, createSalad })(
  CreateSaladPage
)
