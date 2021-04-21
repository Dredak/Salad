import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const classes = {
  btn: 'sort-button',
}

const SortButton = ({ text, onClick }) => {
  return (
    <button className={classes.btn} onClick={onClick}>
      {text}
    </button>
  )
}

SortButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
}

export default SortButton
