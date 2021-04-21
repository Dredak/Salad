import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchSalads } from '../../state/actions'

import { Link } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'

import Error from 'components/Error'
import SortButton from 'components/SortButton'
import InteractiveCard from 'components/InteractiveCard'

import './style.scss'

const classes = {
  pageWrapper: 'salads-page-wrapper',
  loader: 'salads-page-loader',
  placeholderText: 'placeholder-text',
  sorterOuterWrapper: 'sorter-outer-wrapper',
  sortInnerWrapper: 'sort-inner-wrapper',
  cardsWrapper: 'cards-wrapper',
}

const textSorter = (arrayToSort, order) => {
  if (order === 'a-z')
    return arrayToSort
      .map(el => el)
      .sort((a, b) =>
        a.name.localeCompare(b.name, 'en', {
          ignorePunctuation: true,
          numeric: true,
        })
      )
  if (order === 'z-a')
    return arrayToSort
      .map(el => el)
      .sort((a, b) =>
        b.name.localeCompare(a.name, 'en', {
          ignorePunctuation: true,
          numeric: true,
        })
      )
}

const numberSorter = (arrayToSort, order) => {
  if (order === 'ascending')
    return arrayToSort.map(el => el).sort((a, b) => a.calories - b.calories)
  if (order === 'descending')
    return arrayToSort.map(el => el).sort((a, b) => b.calories - a.calories)
}

const SaladsPage = ({ fetchSalads, salads, loading, error }) => {
  const [sortCaloriesBy, setSortCaloriesBy] = useState({
    order: '',
    active: false,
  })
  const [sortTextBy, setSortTextBy] = useState({ order: '', active: false })

  const sortedByCalories =
    salads && sortCaloriesBy.active
      ? numberSorter(salads, sortCaloriesBy.order)
      : salads || []
  const sortedByText =
    sortedByCalories.length && sortTextBy.active
      ? textSorter(sortedByCalories, sortTextBy.order)
      : sortedByCalories

  const sortAscending = () => {
    setSortTextBy({ ...sortTextBy, active: false })
    setSortCaloriesBy({ order: 'ascending', active: true })
  }

  const sortDescending = () => {
    setSortTextBy({ ...sortTextBy, active: false })
    setSortCaloriesBy({ order: 'descending', active: true })
  }

  const sortAtoZ = () => {
    setSortCaloriesBy({ ...sortCaloriesBy, active: false })
    setSortTextBy({ order: 'a-z', active: true })
  }

  const sortZtoA = () => {
    setSortCaloriesBy({ ...sortCaloriesBy, active: false })
    setSortTextBy({ order: 'z-a', active: true })
  }

  const caloriesSortingButtons =
    sortCaloriesBy.order === '' || sortCaloriesBy.order === 'ascending' ? (
      <SortButton text="Descending" onClick={sortDescending} />
    ) : (
      <SortButton text="Ascending" onClick={sortAscending} />
    )

  const textSortingButtons =
    sortTextBy.order === '' || sortTextBy.order === 'z-a' ? (
      <SortButton text="A - Z" onClick={sortAtoZ} />
    ) : (
      <SortButton text="Z - A" onClick={sortZtoA} />
    )

  useEffect(() => fetchSalads(), [])

  if (loading) return <CircularProgress className={classes.loader} />
  if (error) return <Error text={error.message} />
  if (!salads || !salads.length)
    return (
      <div className={classes.placeholderText}>
        Please <Link to="/create-salad">create</Link> some salad.
      </div>
    )
  return (
    <div className={classes.pageWrapper}>
      <div className={classes.sorterOuterWrapper}>
        <div className={classes.sortInnerWrapper}>
          Sort by calories:
          {caloriesSortingButtons}
        </div>
        <div className={classes.sortInnerWrapper}>
          Sort by name:
          {textSortingButtons}
        </div>
      </div>
      <div className={classes.cardsWrapper}>
        {sortedByText.map(salad => (
          <InteractiveCard
            key={salad.id}
            id={salad.id}
            name={salad.name}
            url={
              'https://www.chelseasmessyapron.com/wp-content/uploads/2014/04/FRUIT-SALAD-3.jpg'
            }
            calories={salad.calories}
            tags={salad.tags}
            constrols={false}
          />
        ))}
      </div>
    </div>
  )
}

const select = state => {
  return {
    salads: state.salads.data,
    loading: state.salads.loading,
    error: state.salads.error,
  }
}

SaladsPage.propTypes = {
  fetchSalads: PropTypes.func,
  salads: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
}

export default connect(select, { fetchSalads })(SaladsPage)
