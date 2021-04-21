import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const classes = {
  tag: 'tag',
}

const Tag = ({ text }) => {
  return <span className={classes.tag}>{text}</span>
}

Tag.propTypes = {
  text: PropTypes.string,
}

export default Tag
