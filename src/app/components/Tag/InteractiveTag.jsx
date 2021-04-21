import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const classes = {
  tag: 'tag interactive-tag',
  tagSelected: 'interactive-tag-selected',
}

const KEY_CODE = {
  ENTER: 13,
  SPACE: 32,
}

const InteractiveTag = ({ text, selected, onClick }) => {
  const handleKeyDown = () => {
    if (event.keyCode === KEY_CODE.ENTER || event.keyCode === KEY_CODE.SPACE) {
      onClick()
    }
  }
  return (
    <span
      className={`${classes.tag} ${selected ? classes.tagSelected : ''}`}
      tabIndex="0"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
    >
      {text}
    </span>
  )
}

InteractiveTag.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
}

export default InteractiveTag
