import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, Button, LinearProgress } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'

import { createIngredient } from '../../state/actions'

import Error from 'components/Error'

import './style.scss'

const classes = {
  form: 'add-ingredient-form',
  btn: 'button',
}

const shouldDisableButton = (formState, loading) => {
  if (loading) return true
  return !Object.keys(formState).every(fieldName => {
    if (Array.isArray(formState[fieldName])) return formState[fieldName].length
    return formState[fieldName] || formState[fieldName] === 0
  })
}

const AddIngredientPage = ({ createIngredient, loading, error }) => {
  const [formState, setFormState] = useState({
    name: '',
    img_url: '',
    calories: 0,
    tags: [],
  })

  const formRef = useRef()

  const errorElement = error ? <Error text={error.message} /> : null
  const linearProgress = loading && <LinearProgress />

  const handleChange = (event, fieldName) => {
    if (fieldName === 'calories') {
      setFormState({ ...formState, [fieldName]: Number(event.target.value) })
    } else {
      setFormState({ ...formState, [fieldName]: event.target.value })
    }
  }

  const handleClick = () => {
    if (formRef.current.checkValidity()) {
      createIngredient(formState, () =>
        setFormState({
          name: '',
          img_url: '',
          calories: 0,
          tags: [],
        })
      )
    } else {
      formRef.current.reportValidity()
    }
  }

  const handleAddChip = chip =>
    setFormState({ ...formState, tags: [...formState.tags, chip] })
  const handleDeleteChip = (chip, index) =>
    setFormState({
      ...formState,
      tags: formState.tags.filter((tag, i) => index !== i),
    })

  return (
    <form ref={formRef} className={classes.form}>
      {linearProgress}
      <TextField
        label="Name"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChange={event => handleChange(event, 'name')}
        value={formState.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Image url"
        onChange={event => handleChange(event, 'img_url')}
        value={formState.img_url}
        fullWidth
        margin="normal"
        type="url"
      />
      <TextField
        label="Calories"
        onChange={event => handleChange(event, 'calories')}
        value={formState.calories}
        fullWidth
        type="number"
        margin="normal"
        inputProps={{ min: 0 }}
      />
      <ChipInput
        value={formState.tags}
        onAdd={handleAddChip}
        label="Add tags"
        fullWidth
        onDelete={handleDeleteChip}
      />
      <div style={{ height: '39px' }}>{errorElement}</div>
      <Button
        className={classes.btn}
        role="button"
        color="primary"
        variant="contained"
        disableElevation
        onClick={handleClick}
        disabled={shouldDisableButton(formState, loading)}
      >
        Add ingredient
      </Button>
    </form>
  )
}

const select = state => {
  return {
    loading: state.ingredient.loading,
    error: state.ingredient.error,
  }
}

AddIngredientPage.propTypes = {
  createIngredient: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.object,
}

export default connect(select, {
  createIngredient,
})(AddIngredientPage)
