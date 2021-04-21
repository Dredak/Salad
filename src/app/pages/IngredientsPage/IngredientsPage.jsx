import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'

import InteractiveCard from 'components/InteractiveCard'
import Error from 'components/Error'
import SortButton from 'components/SortButton'
import { InteractiveTag } from 'components/Tag'

import { fetchIngredients } from '../../state/actions'

import './style.scss'

const classes = {
  pageWrapper: 'ingredients-page',
  loader: 'ingredients-page-loader',
  contentWrapper: 'content-wrapper',
  ingredientsList: 'ingredients-list',
  buttonsWrapper: 'sort-buttons-wrapper',
  tagsOuterWrapper: 'unique-tags-wrapper',
  tagsInnerWrapper: 'unique-tags-inner-wrapper',
  placeholderText: 'placeholder-text',
}

const IngredientsPage = ({ fetchIngredients, ingredients, loading, error }) => {
  const [tags, setTags] = useState([])
  const [sortOrder, setSortOrder] = useState('')

  const ingredientsFilteredByTags =
    ingredients && tags.length
      ? ingredients.filter(ingredient =>
          tags.every(tag => ingredient.tags.some(t => t === tag))
        )
      : ingredients || []

  const ingredientsSorted =
    (!sortOrder && ingredientsFilteredByTags) ||
    (sortOrder === 'ascending' &&
      ingredientsFilteredByTags
        .map(el => el)
        .sort((a, b) => a.calories - b.calories)) ||
    ingredientsFilteredByTags
      .map(el => el)
      .sort((a, b) => b.calories - a.calories)

  const handleDescendingClick = () => setSortOrder('descending')
  const handleAscendingClick = () => setSortOrder('ascending')
  const sortingButtons =
    sortOrder === '' || sortOrder === 'ascending' ? (
      <SortButton text="Descending" onClick={handleDescendingClick} />
    ) : (
      <SortButton text="Ascending" onClick={handleAscendingClick} />
    )

  const handleInteractiveTagClick = uniqueTag => () => {
    if (tags.some(tag => tag === uniqueTag)) {
      setTags(tags.filter(tag => tag !== uniqueTag))
    } else {
      setTags([...tags, uniqueTag])
    }
  }

  const listOfIngredients = (
    <div className={classes.ingredientsList}>
      {ingredientsSorted.map(ingredient => (
        <InteractiveCard
          key={ingredient.id}
          id={ingredient.id}
          name={ingredient.name}
          url={ingredient.img_url}
          calories={ingredient.calories}
          tags={ingredient.tags}
          controls={true}
        />
      ))}
    </div>
  )

  const uniqueTags = ingredients
    ? new Set(ingredients.reduce((acc, curr) => [...acc, ...curr.tags], []))
    : []
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

  useEffect(() => fetchIngredients(), [])

  if (loading) return <CircularProgress className={classes.loader} />
  if (error) return <Error text={error.message} />
  if (!ingredients || !ingredients.length)
    return (
      <div className={classes.placeholderText}>
        Please <Link to="/">add</Link> some ingredients.
      </div>
    )
  return (
    <div className={classes.pageWrapper}>
      <div className={classes.contentWrapper}>
        <div className={classes.buttonsWrapper}>
          Sort by calories:
          {sortingButtons}
        </div>
        {listOfIngredients}
      </div>
      <div className={classes.tagsOuterWrapper}>
        Tags:
        <div className={classes.tagsInnerWrapper}>{interactiveTagList}</div>
      </div>
    </div>
  )
}

const select = state => {
  return {
    ingredients: state.ingredients.data,
    loading: state.ingredients.loading,
    error: state.ingredients.error,
  }
}

IngredientsPage.propTypes = {
  fetchIngredients: PropTypes.func,
  ingredients: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  error: PropTypes.object,
}

export default connect(select, { fetchIngredients })(IngredientsPage)
