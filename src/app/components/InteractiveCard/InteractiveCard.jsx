import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, LinearProgress, Button } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import {
  fetchIngredients,
  editIngredient,
  deleteIngredient,
} from '../../state/actions'
import CustomModal from 'components/CustomModal'
import { Tag } from 'components/Tag'
import Error from 'components/Error'

import './style.scss'

const classes = {
  card: 'interactive-card',
  imgWrapper: 'image-wrapper',
  img: 'ingredient-image',
  contentWrapper: 'card-content-wrapper',
  calories: 'calories',
  tagsWrapper: 'tags-wrapper',
  buttonsWrapper: 'buttons-wrapper',
  editBtn: 'edit-button',
  deleteBtn: 'delete-button',
  form: 'edit-form',
  info: 'resource-info',
  infoWrapper: 'info-wrapper',
  infoIcon: 'info-icon',
  infoDetails: 'info-details',
  infoData: 'info-data',
}

const shouldDisableButton = (formState, loading) => {
  if (loading) return true
  return !Object.keys(formState).every(fieldName => {
    if (Array.isArray(formState[fieldName])) return formState[fieldName].length
    return formState[fieldName] || formState[fieldName] === 0
  })
}

const KEY_CODE = {
  ENTER: 13,
  SPACE: 32,
}

const InteractiveCard = ({
  id,
  name: ingredientName,
  url,
  calories: ingredientCalories,
  tags: ingredientTags,
  fetchIngredients,
  editIngredient,
  deleteIngredient,
  controls,
}) => {
  const [formState, setFormState] = useState({
    name: null,
    img_url: null,
    calories: null,
    tags: null,
  })
  const [editError, setEditError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [editInProgress, setEditInProgress] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const modalRef = useRef()
  const formRef = useRef()

  const name = formState.name ?? ingredientName
  const img_url = formState.img_url ?? url
  const calories = formState.calories ?? ingredientCalories
  const tags = formState.tags ?? ingredientTags

  const fallbackUrl = url.includes('http')
    ? url
    : ' https://via.placeholder.com/80'

  const tagList = tags.length
    ? ingredientTags.map((tag, index) => <Tag key={index} text={tag} />)
    : []

  const errorElement = deleteError ? (
    <Error text={deleteError} style={{ padding: '0px' }} />
  ) : null
  const editErrorElement = editError ? <Error text={editError} /> : null

  const infoElement = showInfo ? (
    <div className={classes.info}>
      <div className={classes.infoWrapper}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <small className={classes.infoDetails}>DETAILS</small>
      </div>
      <div className={classes.infoData}>Name: {name}</div>
      <div className={classes.infoData}>Calories: {calories}</div>
    </div>
  ) : null

  const handleChange = (event, fieldName) => {
    if (fieldName === 'calories') {
      setFormState({ ...formState, [fieldName]: Number(event.target.value) })
    } else {
      setFormState({ ...formState, [fieldName]: event.target.value })
    }
  }

  const openModal = event => {
    event.stopPropagation()
    modalRef.current && modalRef.current.open()
  }
  const closeModal = () => modalRef.current && modalRef.current.close()

  const onEditSuccess = () => {
    setEditInProgress(false)
    fetchIngredients().then(() => closeModal())
  }
  const onEditFail = error => {
    setEditInProgress(false)
    setEditError(error)
  }
  const handleEdit = () => {
    setEditError('')
    if (formRef.current.checkValidity()) {
      setEditInProgress(true)
      editIngredient(
        { id, name, img_url, calories, tags },
        onEditSuccess,
        onEditFail
      )
    } else {
      formRef.current.reportValidity()
    }
  }

  const handleCancel = () => {
    setFormState({
      name: null,
      img_url: null,
      calories: null,
      tags: null,
    })
    setEditError('')
    setDeleteError('')
    closeModal()
  }

  const onDeleteSuccess = () => fetchIngredients()
  const onDeleteFail = error => setDeleteError(error.message)
  const handleDelete = event => {
    event.stopPropagation()
    setDeleteError('')
    deleteIngredient(id, onDeleteSuccess, onDeleteFail)
  }

  const handleAddChip = chip =>
    setFormState({ ...formState, tags: [...tags, chip] })
  const handleDeleteChip = (chip, index) =>
    setFormState({
      ...formState,
      tags: tags.filter((tag, i) => index !== i),
    })

  const toggleDetailInfo = () => setShowInfo(!showInfo)
  const handleInfoKeydown = event => {
    if (event.keyCode === KEY_CODE.ENTER || event.keyCode === KEY_CODE.SPACE) {
      event.preventDefault()
      toggleDetailInfo()
    }
  }

  const showControls = controls ? (
    <div className={classes.buttonsWrapper}>
      {errorElement}
      <Button
        className={classes.editBtn}
        onClick={openModal}
        variant="contained"
        color="primary"
      >
        Edit
      </Button>
      <Button
        className={classes.deleteBtn}
        onClick={handleDelete}
        variant="contained"
        color="secondary"
      >
        Delete
      </Button>
    </div>
  ) : null

  return (
    <>
      <div
        className={classes.card}
        onClick={toggleDetailInfo}
        onKeyDown={handleInfoKeydown}
        role="button"
        tabIndex="0"
      >
        <div className={classes.imgWrapper}>
          <img className={classes.img} src={fallbackUrl} alt="ingredient" />
        </div>
        <div className={classes.contentWrapper}>
          <div>
            {ingredientName}
            <span className={classes.calories}>{ingredientCalories}kcal</span>
          </div>
          <div className={classes.tagsWrapper}>{tagList}</div>
          {showControls}
        </div>
      </div>
      {infoElement}
      <CustomModal
        ref={modalRef}
        title="Edit ingredient"
        okText="Save"
        onOk={handleEdit}
        onCancel={handleCancel}
        disabled={shouldDisableButton(
          { name, img_url, calories, tags },
          editInProgress
        )}
      >
        <form ref={formRef} className={classes.form}>
          {editInProgress && <LinearProgress />}
          <TextField
            label="Name"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={event => handleChange(event, 'name')}
            value={name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image url"
            onChange={event => handleChange(event, 'img_url')}
            value={img_url}
            fullWidth
            margin="normal"
            type="url"
          />
          <TextField
            label="Calories"
            onChange={event => handleChange(event, 'calories')}
            value={calories}
            fullWidth
            type="number"
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <ChipInput
            value={tags}
            onAdd={handleAddChip}
            label="Add tags"
            fullWidth
            onDelete={handleDeleteChip}
          />
          {editErrorElement}
        </form>
      </CustomModal>
    </>
  )
}

InteractiveCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  calories: PropTypes.number,
  tags: PropTypes.array,
  fetchIngredients: PropTypes.func,
  editIngredient: PropTypes.func,
  deleteIngredient: PropTypes.func,
  controls: PropTypes.bool,
}

export default connect(null, {
  fetchIngredients,
  editIngredient,
  deleteIngredient,
})(InteractiveCard)
